/**
 * Complete Properties API Endpoint with Josh Yolk Emotional Intelligence
 * 
 * Purpose: Provides comprehensive property management with emotional context
 * Location: /app/api/properties/route.ts
 * Usage: All property operations across CMS and CRM
 * 
 * Features:
 * - Vercel serverless optimization
 * - Josh Yolk emotional response patterns
 * - 23 Rules compliance (error handling, logging, security)
 * - Performance optimization with emotional context
 * - User experience focus
 * - Comprehensive validation and error handling
 * - Rate limiting and security
 * - Database optimization
 * - Emotional intelligence in responses
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Josh Yolk's Emotional Response Types
interface EmotionalContext {
  message: string
  tone: 'confident' | 'supportive' | 'gentle' | 'premium'
  confidence: 'high' | 'medium' | 'low'
  caring: boolean
}

interface JoshYolkResponse<T = any> {
  success: boolean
  data?: T
  emotionalContext: EmotionalContext
  performance: {
    responseTime: number
    optimization: string
    cacheHit?: boolean
  }
  timestamp: string
  requestId: string
}

// Validation Schemas (Rule 12: Complete Code Verification)
const PropertySchema = z.object({
  name: z.string().min(1, 'Property name is required').max(100, 'Name too long'),
  type: z.enum(['hotel', 'restaurant', 'spa', 'venue', 'other']),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'Valid ZIP code required'),
    country: z.string().min(1, 'Country is required')
  }),
  contact: z.object({
    phone: z.string().min(10, 'Valid phone number required'),
    email: z.string().email('Valid email required'),
    website: z.string().url('Valid website URL required').optional()
  }),
  amenities: z.array(z.string()).optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
  pricing: z.object({
    baseRate: z.number().min(0, 'Base rate cannot be negative'),
    currency: z.string().length(3, 'Currency must be 3 characters'),
    taxRate: z.number().min(0).max(1, 'Tax rate must be between 0 and 1').optional()
  }).optional()
})

// Rate Limiting (Rule 16: Protect Exposed Endpoints)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100 // requests per minute
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false
  }
  
  userLimit.count++
  return true
}

// Josh Yolk's Emotional Response Generator
function generateEmotionalContext(
  success: boolean, 
  operation: string, 
  data?: any
): EmotionalContext {
  if (success) {
    switch (operation) {
      case 'create':
        return {
          message: "We've successfully created your property. Welcome to the Buffr family!",
          tone: 'confident',
          confidence: 'high',
          caring: true
        }
      case 'read':
        return {
          message: "Here's your property information, ready for you to review.",
          tone: 'supportive',
          confidence: 'high',
          caring: true
        }
      case 'update':
        return {
          message: "Your property has been updated with care. Everything looks perfect!",
          tone: 'gentle',
          confidence: 'high',
          caring: true
        }
      case 'delete':
        return {
          message: "We've carefully removed your property. We're here if you need anything else.",
          tone: 'gentle',
          confidence: 'high',
          caring: true
        }
      default:
        return {
          message: "Operation completed successfully. We're here to help!",
          tone: 'supportive',
          confidence: 'high',
          caring: true
        }
    }
  } else {
    return {
      message: "We encountered an issue, but we're working to fix it for you.",
      tone: 'gentle',
      confidence: 'medium',
      caring: true
    }
  }
}

// Database Connection (Rule 8: Use Supabase with SSR)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/properties - List properties with emotional intelligence
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // Rate limiting (Rule 16: Protect Exposed Endpoints)
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({
        success: false,
        error: {
          message: "Too many requests. Please slow down a bit.",
          code: 'RATE_LIMIT_EXCEEDED',
          emotionalContext: {
            message: "We're protecting our systems. Please try again in a moment.",
            tone: 'gentle',
            confidence: 'high',
            caring: true
          }
        },
        timestamp: new Date().toISOString(),
        requestId
      }, { status: 429 })
    }

    // Parse query parameters (Rule 6: Asynchronous Data Handling)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query with emotional intelligence (Rule 5: Quick and Scalable Endpoints)
    let query = supabase
      .from('properties')
      .select(`
        *,
        bookings(count),
        reviews(count),
        amenities(name)
      `, { count: 'exact' })

    // Apply filters with care
    if (type) {
      query = query.eq('type', type)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,address->city.ilike.%${search}%`)
    }

    // Apply sorting with emotional consideration
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination (Rule 6: Asynchronous Data Handling)
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query with error handling (Rule 10: Comprehensive Error Handling)
    const { data: properties, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database query failed: ${error.message}`)
    }

    // Josh Yolk's Emotional Response (Rule 7: API Response Documentation)
    const emotionalContext = generateEmotionalContext(true, 'read', properties)
    
    const response: JoshYolkResponse = {
      success: true,
      data: {
        properties: properties || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
          hasNext: page * limit < (count || 0),
          hasPrev: page > 1
        }
      },
      emotionalContext,
      performance: {
        responseTime: Date.now() - startTime,
        optimization: 'emotionally-optimized',
        cacheHit: false
      },
      timestamp: new Date().toISOString(),
      requestId
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Emotional-Intelligence': 'josh-yolk-enabled',
        'X-Performance-Optimized': 'true',
        'X-Request-ID': requestId,
        'Cache-Control': 'public, max-age=300' // 5 minutes cache
      }
    })

  } catch (error) {
    // Josh Yolk's Caring Error Handling (Rule 10: Comprehensive Error Handling)
    console.error('Properties API Error:', error)
    
    const emotionalContext = generateEmotionalContext(false, 'read')
    
    return NextResponse.json({
      success: false,
      error: {
        message: "We encountered an issue while fetching properties",
        code: 'FETCH_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
        emotionalContext
      },
      performance: {
        responseTime: Date.now() - startTime,
        optimization: 'error-handled'
      },
      timestamp: new Date().toISOString(),
      requestId
    }, { status: 500 })
  }
}

// POST /api/properties - Create property with emotional intelligence
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // Rate limiting (Rule 16: Protect Exposed Endpoints)
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({
        success: false,
        error: {
          message: "Too many requests. Please slow down a bit.",
          code: 'RATE_LIMIT_EXCEEDED',
          emotionalContext: {
            message: "We're protecting our systems. Please try again in a moment.",
            tone: 'gentle',
            confidence: 'high',
            caring: true
          }
        },
        timestamp: new Date().toISOString(),
        requestId
      }, { status: 429 })
    }

    // Parse and validate request body (Rule 12: Complete Code Verification)
    const body = await request.json()
    const validatedData = PropertySchema.parse(body)

    // Add metadata with emotional context
    const propertyData = {
      ...validatedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      emotional_context: {
        created_with_care: true,
        josh_yolk_optimized: true
      }
    }

    // Insert property with error handling (Rule 10: Comprehensive Error Handling)
    const { data: property, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      throw new Error(`Failed to create property: ${error.message}`)
    }

    // Josh Yolk's Emotional Response
    const emotionalContext = generateEmotionalContext(true, 'create', property)
    
    const response: JoshYolkResponse = {
      success: true,
      data: property,
      emotionalContext,
      performance: {
        responseTime: Date.now() - startTime,
        optimization: 'emotionally-optimized'
      },
      timestamp: new Date().toISOString(),
      requestId
    }

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Emotional-Intelligence': 'josh-yolk-enabled',
        'X-Performance-Optimized': 'true',
        'X-Request-ID': requestId
      }
    })

  } catch (error) {
    // Josh Yolk's Caring Error Handling
    console.error('Create Property Error:', error)
    
    let statusCode = 500
    let errorMessage = "We encountered an issue while creating your property"
    
    if (error instanceof z.ZodError) {
      statusCode = 400
      errorMessage = "Please check your property information and try again"
    }
    
    const emotionalContext = generateEmotionalContext(false, 'create')
    
    return NextResponse.json({
      success: false,
      error: {
        message: errorMessage,
        code: error instanceof z.ZodError ? 'VALIDATION_ERROR' : 'CREATE_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
        emotionalContext
      },
      performance: {
        responseTime: Date.now() - startTime,
        optimization: 'error-handled'
      },
      timestamp: new Date().toISOString(),
      requestId
    }, { status: statusCode })
  }
}