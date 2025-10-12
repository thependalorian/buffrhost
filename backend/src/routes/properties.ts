/**
 * Hospitality Property Routes
 * Next.js API routes for property management with Buffr Host brand identity
 * Converted from Python FastAPI with emotional design principles
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { DatabaseManager } from '../database/DatabaseManager';
import { HospitalityProperty } from '../entities/HospitalityProperty';
import { TenantProfile } from '../entities/TenantProfile';
import { ConfigManager } from '../config/ConfigManager';
import { Logger } from '../utils/Logger';
import { ValidationError, AuthenticationError, NotFoundError, ConflictError, AuthorizationError } from '../middleware/ErrorHandler';
import { AuthService } from './auth';

// Initialize services
const config = ConfigManager.getInstance();
const logger = Logger.getInstance();
const databaseManager = DatabaseManager.getInstance();
const authService = AuthService.getInstance();

// Validation schemas with Buffr Host emotional design principles
const PropertyCreateSchema = z.object({
  propertyName: z.string().min(2, 'Property name must be at least 2 characters'),
  propertyType: z.enum(['hotel', 'resort', 'vacation_rental', 'hostel', 'boutique_hotel', 'bed_and_breakfast', 'apartment_hotel', 'motel', 'inn']),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  contactEmail: z.string().email('Please provide a valid contact email').optional(),
  contactPhone: z.string().optional(),
  website: z.string().url('Please provide a valid website URL').optional(),
  starRating: z.number().min(1).max(5).optional(),
  totalRooms: z.number().min(0).optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  }),
  amenities: z.array(z.string()).optional(),
  policies: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
});

const PropertyUpdateSchema = z.object({
  propertyName: z.string().min(2, 'Property name must be at least 2 characters').optional(),
  propertyType: z.enum(['hotel', 'resort', 'vacation_rental', 'hostel', 'boutique_hotel', 'bed_and_breakfast', 'apartment_hotel', 'motel', 'inn']).optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  contactEmail: z.string().email('Please provide a valid contact email').optional(),
  contactPhone: z.string().optional(),
  website: z.string().url('Please provide a valid website URL').optional(),
  starRating: z.number().min(1).max(5).optional(),
  totalRooms: z.number().min(0).optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  }).optional(),
  amenities: z.array(z.string()).optional(),
  policies: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
});

const PropertySearchSchema = z.object({
  q: z.string().optional(),
  propertyType: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'propertyName', 'starRating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Get current user from authorization header
 */
async function getCurrentUser(req: NextApiRequest): Promise<any> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Authorization token required');
  }

  const token = authHeader.substring(7);
  return await authService.getCurrentUser(token);
}

/**
 * Check if user has permission
 */
function hasPermission(user: any, permission: string): boolean {
  const rolePermissions = {
    super_admin: ['*'],
    admin: ['properties:read', 'properties:write', 'properties:delete'],
    manager: ['properties:read', 'properties:write'],
    staff: ['properties:read'],
    guest: [],
  };

  const userPermissions = rolePermissions[user.role as keyof typeof rolePermissions] || [];
  return userPermissions.includes('*') || userPermissions.includes(permission);
}

/**
 * Create a new property with Buffr Host emotional welcome
 */
export async function createProperty(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'properties:write')) {
      throw new AuthorizationError('Insufficient permissions to create properties');
    }

    // Validate request body
    const body = PropertyCreateSchema.parse(req.body);
    
    const dataSource = databaseManager.getDataSource();
    const propertyRepository = dataSource.getRepository(HospitalityProperty);
    const tenantRepository = dataSource.getRepository(TenantProfile);

    // Verify tenant exists
    const tenant = await tenantRepository.findOne({
      where: { id: currentUser.tenantId },
    });

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    // Create property with Buffr Host emotional defaults
    const property = new HospitalityProperty();
    property.tenantId = currentUser.tenantId;
    property.propertyName = body.propertyName;
    property.propertyType = body.propertyType;
    property.description = body.description;
    property.contactEmail = body.contactEmail;
    property.contactPhone = body.contactPhone;
    property.website = body.website;
    property.starRating = body.starRating;
    property.totalRooms = body.totalRooms;
    property.checkInTime = body.checkInTime;
    property.checkOutTime = body.checkOutTime;
    property.address = body.address;
    property.amenities = body.amenities || [];
    property.policies = body.policies || {
      cancellation: 'Free cancellation up to 24 hours before check-in',
      checkIn: 'Check-in from 3:00 PM',
      checkOut: 'Check-out by 11:00 AM',
      pets: 'Pets allowed with prior arrangement',
      smoking: 'Non-smoking property',
    };
    property.isActive = body.isActive;

    // Save property
    const savedProperty = await propertyRepository.save(property);

    // Log property creation
    logger.logBusiness('property_created', {
      propertyId: savedProperty.id,
      propertyName: savedProperty.propertyName,
      propertyType: savedProperty.propertyType,
      tenantId: savedProperty.tenantId,
    });

    res.status(201).json({
      success: true,
      message: `Welcome to your new ${savedProperty.propertyName}! We're excited to help you create exceptional guest experiences.`,
      property: {
        id: savedProperty.id,
        tenantId: savedProperty.tenantId,
        propertyName: savedProperty.propertyName,
        propertyType: savedProperty.propertyType,
        description: savedProperty.description,
        contactEmail: savedProperty.contactEmail,
        contactPhone: savedProperty.contactPhone,
        website: savedProperty.website,
        starRating: savedProperty.starRating,
        totalRooms: savedProperty.totalRooms,
        checkInTime: savedProperty.checkInTime,
        checkOutTime: savedProperty.checkOutTime,
        address: savedProperty.address,
        amenities: savedProperty.amenities,
        policies: savedProperty.policies,
        isActive: savedProperty.isActive,
        createdAt: savedProperty.createdAt,
        updatedAt: savedProperty.updatedAt,
      },
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        welcome: 'enthusiastic-supportive',
      },
    });

  } catch (error) {
    logger.logBusiness('property_creation_failed', {
      error: error.message,
      tenantId: req.body.tenantId,
    });
    
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input data', error.errors);
    }
    
    throw error;
  }
}

/**
 * Get list of properties with Buffr Host emotional context
 */
export async function getProperties(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'properties:read')) {
      throw new AuthorizationError('Insufficient permissions to view properties');
    }

    // Parse query parameters
    const query = PropertySearchSchema.parse(req.query);
    
    const dataSource = databaseManager.getDataSource();
    const propertyRepository = dataSource.getRepository(HospitalityProperty);

    // Build query
    const queryBuilder = propertyRepository.createQueryBuilder('property')
      .leftJoinAndSelect('property.tenant', 'tenant')
      .where('property.tenantId = :tenantId', { tenantId: currentUser.tenantId });

    // Apply filters
    if (query.q) {
      queryBuilder.andWhere(
        '(property.propertyName ILIKE :search OR property.description ILIKE :search)',
        { search: `%${query.q}%` }
      );
    }

    if (query.propertyType) {
      queryBuilder.andWhere('property.propertyType = :propertyType', { propertyType: query.propertyType });
    }

    if (query.isActive !== undefined) {
      queryBuilder.andWhere('property.isActive = :isActive', { isActive: query.isActive });
    }

    // Apply sorting
    queryBuilder.orderBy(`property.${query.sortBy}`, query.sortOrder);

    // Apply pagination
    const offset = (query.page - 1) * query.limit;
    queryBuilder.skip(offset).take(query.limit);

    // Execute query
    const [properties, total] = await queryBuilder.getManyAndCount();

    // Format response
    const formattedProperties = properties.map(property => ({
      id: property.id,
      tenantId: property.tenantId,
      propertyName: property.propertyName,
      propertyType: property.propertyType,
      description: property.description,
      contactEmail: property.contactEmail,
      contactPhone: property.contactPhone,
      website: property.website,
      starRating: property.starRating,
      totalRooms: property.totalRooms,
      checkInTime: property.checkInTime,
      checkOutTime: property.checkOutTime,
      address: property.address,
      amenities: property.amenities,
      policies: property.policies,
      isActive: property.isActive,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: 'Your properties, each one a canvas for creating unforgettable guest experiences.',
      data: formattedProperties,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        properties: 'unified-excellence',
      },
    });

  } catch (error) {
    logger.logBusiness('properties_fetch_failed', {
      error: error.message,
      tenantId: req.query.tenantId,
    });
    
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid query parameters', error.errors);
    }
    
    throw error;
  }
}

/**
 * Get property by ID with Buffr Host emotional context
 */
export async function getPropertyById(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'properties:read')) {
      throw new AuthorizationError('Insufficient permissions to view property details');
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('Property ID is required');
    }

    const dataSource = databaseManager.getDataSource();
    const propertyRepository = dataSource.getRepository(HospitalityProperty);

    const property = await propertyRepository.findOne({
      where: { id },
      relations: ['tenant', 'rooms', 'roomTypes'],
    });

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Check if user can access this property
    if (property.tenantId !== currentUser.tenantId) {
      throw new AuthorizationError('Access denied to this property');
    }

    res.status(200).json({
      success: true,
      message: 'Property details, carefully curated to showcase your hospitality excellence.',
      property: {
        id: property.id,
        tenantId: property.tenantId,
        propertyName: property.propertyName,
        propertyType: property.propertyType,
        description: property.description,
        contactEmail: property.contactEmail,
        contactPhone: property.contactPhone,
        website: property.website,
        starRating: property.starRating,
        totalRooms: property.totalRooms,
        checkInTime: property.checkInTime,
        checkOutTime: property.checkOutTime,
        address: property.address,
        amenities: property.amenities,
        policies: property.policies,
        isActive: property.isActive,
        roomCount: property.rooms?.length || 0,
        roomTypeCount: property.roomTypes?.length || 0,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      },
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        detail: 'comprehensive-caring',
      },
    });

  } catch (error) {
    logger.logBusiness('property_fetch_failed', {
      error: error.message,
      propertyId: req.query.id,
    });
    throw error;
  }
}

/**
 * Update property with Buffr Host emotional care
 */
export async function updateProperty(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'properties:write')) {
      throw new AuthorizationError('Insufficient permissions to update properties');
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('Property ID is required');
    }

    // Validate request body
    const body = PropertyUpdateSchema.parse(req.body);
    
    const dataSource = databaseManager.getDataSource();
    const propertyRepository = dataSource.getRepository(HospitalityProperty);

    const property = await propertyRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Check if user can update this property
    if (property.tenantId !== currentUser.tenantId) {
      throw new AuthorizationError('Access denied to update this property');
    }

    // Update property fields
    if (body.propertyName !== undefined) property.propertyName = body.propertyName;
    if (body.propertyType !== undefined) property.propertyType = body.propertyType;
    if (body.description !== undefined) property.description = body.description;
    if (body.contactEmail !== undefined) property.contactEmail = body.contactEmail;
    if (body.contactPhone !== undefined) property.contactPhone = body.contactPhone;
    if (body.website !== undefined) property.website = body.website;
    if (body.starRating !== undefined) property.starRating = body.starRating;
    if (body.totalRooms !== undefined) property.totalRooms = body.totalRooms;
    if (body.checkInTime !== undefined) property.checkInTime = body.checkInTime;
    if (body.checkOutTime !== undefined) property.checkOutTime = body.checkOutTime;
    if (body.address !== undefined) property.address = body.address;
    if (body.amenities !== undefined) property.amenities = body.amenities;
    if (body.policies !== undefined) property.policies = body.policies;
    if (body.isActive !== undefined) property.isActive = body.isActive;

    // Save updated property
    const updatedProperty = await propertyRepository.save(property);

    // Log property update
    logger.logBusiness('property_updated', {
      propertyId: updatedProperty.id,
      propertyName: updatedProperty.propertyName,
      tenantId: updatedProperty.tenantId,
    });

    res.status(200).json({
      success: true,
      message: `${updatedProperty.propertyName} has been updated with care and attention to detail.`,
      property: {
        id: updatedProperty.id,
        tenantId: updatedProperty.tenantId,
        propertyName: updatedProperty.propertyName,
        propertyType: updatedProperty.propertyType,
        description: updatedProperty.description,
        contactEmail: updatedProperty.contactEmail,
        contactPhone: updatedProperty.contactPhone,
        website: updatedProperty.website,
        starRating: updatedProperty.starRating,
        totalRooms: updatedProperty.totalRooms,
        checkInTime: updatedProperty.checkInTime,
        checkOutTime: updatedProperty.checkOutTime,
        address: updatedProperty.address,
        amenities: updatedProperty.amenities,
        policies: updatedProperty.policies,
        isActive: updatedProperty.isActive,
        updatedAt: updatedProperty.updatedAt,
      },
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        update: 'thoughtful-precise',
      },
    });

  } catch (error) {
    logger.logBusiness('property_update_failed', {
      error: error.message,
      propertyId: req.query.id,
    });
    
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input data', error.errors);
    }
    
    throw error;
  }
}

/**
 * Delete property with Buffr Host emotional care
 */
export async function deleteProperty(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'properties:delete')) {
      throw new AuthorizationError('Insufficient permissions to delete properties');
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('Property ID is required');
    }

    const dataSource = databaseManager.getDataSource();
    const propertyRepository = dataSource.getRepository(HospitalityProperty);

    const property = await propertyRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Check if user can delete this property
    if (property.tenantId !== currentUser.tenantId) {
      throw new AuthorizationError('Access denied to delete this property');
    }

    // Soft delete by deactivating
    property.deactivate();
    await propertyRepository.save(property);

    // Log property deletion
    logger.logBusiness('property_deleted', {
      propertyId: property.id,
      propertyName: property.propertyName,
      tenantId: property.tenantId,
    });

    res.status(200).json({
      success: true,
      message: `${property.propertyName} has been deactivated with respect and care.`,
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        farewell: 'respectful-caring',
      },
    });

  } catch (error) {
    logger.logBusiness('property_deletion_failed', {
      error: error.message,
      propertyId: req.query.id,
    });
    throw error;
  }
}

/**
 * Get property statistics with Buffr Host emotional insights
 */
export async function getPropertyStats(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'properties:read')) {
      throw new AuthorizationError('Insufficient permissions to view property statistics');
    }

    const dataSource = databaseManager.getDataSource();
    const propertyRepository = dataSource.getRepository(HospitalityProperty);

    // Get statistics
    const totalProperties = await propertyRepository.count({
      where: { tenantId: currentUser.tenantId },
    });

    const activeProperties = await propertyRepository.count({
      where: { tenantId: currentUser.tenantId, isActive: true },
    });

    const propertyTypeStats = await propertyRepository
      .createQueryBuilder('property')
      .select('property.propertyType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('property.tenantId = :tenantId', { tenantId: currentUser.tenantId })
      .groupBy('property.propertyType')
      .getRawMany();

    const recentProperties = await propertyRepository.find({
      where: { tenantId: currentUser.tenantId },
      order: { createdAt: 'DESC' },
      take: 5,
      select: ['id', 'propertyName', 'propertyType', 'starRating', 'createdAt'],
    });

    res.status(200).json({
      success: true,
      message: 'Your property insights, thoughtfully prepared for your review.',
      stats: {
        total: totalProperties,
        active: activeProperties,
        inactive: totalProperties - activeProperties,
        activityRate: totalProperties > 0 ? Math.round((activeProperties / totalProperties) * 100) : 0,
      },
      typeDistribution: propertyTypeStats.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count);
        return acc;
      }, {} as Record<string, number>),
      recentProperties: recentProperties.map(property => ({
        id: property.id,
        propertyName: property.propertyName,
        propertyType: property.propertyType,
        starRating: property.starRating,
        addedAt: property.createdAt,
      })),
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        insights: 'comprehensive-caring',
      },
    });

  } catch (error) {
    logger.logBusiness('property_stats_failed', {
      error: error.message,
      tenantId: req.query.tenantId,
    });
    throw error;
  }
}

/**
 * Main property management route handler
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, query } = req;
    const { action } = query;

    switch (method) {
      case 'POST':
        switch (action) {
          case 'create':
            return await createProperty(req, res);
          default:
            res.status(400).json({
              success: false,
              message: 'Invalid property action',
              availableActions: ['create'],
            });
        }
        break;

      case 'GET':
        switch (action) {
          case 'list':
            return await getProperties(req, res);
          case 'stats':
            return await getPropertyStats(req, res);
          default:
            // If no action, treat as get property by ID
            return await getPropertyById(req, res);
        }
        break;

      case 'PUT':
        return await updateProperty(req, res);

      case 'DELETE':
        return await deleteProperty(req, res);

      default:
        res.status(405).json({
          success: false,
          message: 'Method not allowed',
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        });
    }

  } catch (error) {
    logger.logError(error as Error, { endpoint: '/api/v1/properties', method: req.method });
    
    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details,
        // Buffr Host emotional context
        brand: {
          name: 'Buffr Host',
          experience: 'warm-professional',
          support: 'helpful',
        },
      });
    } else if (error instanceof AuthenticationError) {
      res.status(401).json({
        success: false,
        message: error.message,
        // Buffr Host emotional context
        brand: {
          name: 'Buffr Host',
          experience: 'warm-professional',
          support: 'understanding',
        },
      });
    } else if (error instanceof AuthorizationError) {
      res.status(403).json({
        success: false,
        message: error.message,
        // Buffr Host emotional context
        brand: {
          name: 'Buffr Host',
          experience: 'warm-professional',
          support: 'respectful',
        },
      });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        // Buffr Host emotional context
        brand: {
          name: 'Buffr Host',
          experience: 'warm-professional',
          support: 'helpful',
        },
      });
    } else if (error instanceof ConflictError) {
      res.status(409).json({
        success: false,
        message: error.message,
        // Buffr Host emotional context
        brand: {
          name: 'Buffr Host',
          experience: 'warm-professional',
          support: 'helpful',
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        // Buffr Host emotional context
        brand: {
          name: 'Buffr Host',
          experience: 'warm-professional',
          support: 'apologetic',
        },
      });
    }
  }
}