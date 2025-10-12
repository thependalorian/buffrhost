/**
 * User Management Routes
 * Next.js API routes for user management with Buffr Host brand identity
 * Converted from Python FastAPI with emotional design principles
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { DatabaseManager } from '../database/DatabaseManager';
import { User } from '../entities/User';
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
const UserUpdateSchema = z.object({
  email: z.string().email('Please provide a valid email address').optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  role: z.enum(['guest', 'staff', 'manager', 'admin', 'super_admin']).optional(),
  tenantId: z.string().optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  avatarUrl: z.string().url('Please provide a valid avatar URL').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  preferences: z.record(z.any()).optional(),
  notificationSettings: z.record(z.any()).optional(),
});

const UserSearchSchema = z.object({
  q: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  tenantId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'lastLogin', 'fullName', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const UserCreateSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.enum(['guest', 'staff', 'manager', 'admin', 'super_admin']).default('guest'),
  tenantId: z.string().optional(),
  isActive: z.boolean().default(true),
  emailVerified: z.boolean().default(false),
  phoneVerified: z.boolean().default(false),
  avatarUrl: z.string().url('Please provide a valid avatar URL').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  timezone: z.string().default('UTC'),
  language: z.string().default('en'),
  preferences: z.record(z.any()).optional(),
  notificationSettings: z.record(z.any()).optional(),
});

/**
 * Get current user from authorization header
 */
async function getCurrentUser(req: NextApiRequest): Promise<User> {
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
function hasPermission(user: User, permission: string): boolean {
  const rolePermissions = {
    super_admin: ['*'],
    admin: ['users:read', 'users:write', 'users:delete'],
    manager: ['users:read', 'users:write'],
    staff: ['users:read'],
    guest: [],
  };

  const userPermissions = rolePermissions[user.role as keyof typeof rolePermissions] || [];
  return userPermissions.includes('*') || userPermissions.includes(permission);
}

/**
 * Create a new user with Buffr Host emotional welcome
 */
export async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'users:write')) {
      throw new AuthorizationError('Insufficient permissions to create users');
    }

    // Validate request body
    const body = UserCreateSchema.parse(req.body);
    
    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(body.password);

    // Create user with Buffr Host emotional defaults
    const user = new User();
    user.email = body.email;
    user.hashedPassword = hashedPassword;
    user.fullName = body.fullName;
    user.phone = body.phone;
    user.role = body.role;
    user.tenantId = body.tenantId || currentUser.tenantId;
    user.isActive = body.isActive;
    user.emailVerified = body.emailVerified;
    user.phoneVerified = body.phoneVerified;
    user.avatarUrl = body.avatarUrl;
    user.bio = body.bio;
    user.timezone = body.timezone;
    user.language = body.language;
    user.preferences = body.preferences || {
      theme: 'nude-warm',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      aiPersonality: 'warm-professional',
    };
    user.notificationSettings = body.notificationSettings || {
      welcome: true,
      booking: true,
      payment: true,
      marketing: false,
    };

    // Save user
    const savedUser = await userRepository.save(user);

    // Log user creation
    logger.logAuth('user_created', savedUser.id, req.connection?.remoteAddress, true);

    res.status(201).json({
      success: true,
      message: `Welcome to the team, ${savedUser.fullName}! We're delighted to have you join us.`,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        phone: savedUser.phone,
        role: savedUser.role,
        tenantId: savedUser.tenantId,
        isActive: savedUser.isActive,
        emailVerified: savedUser.emailVerified,
        phoneVerified: savedUser.phoneVerified,
        avatarUrl: savedUser.avatarUrl,
        bio: savedUser.bio,
        timezone: savedUser.timezone,
        language: savedUser.language,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        welcome: 'enthusiastic-caring',
      },
    });

  } catch (error) {
    logger.logAuth('user_creation_failed', undefined, req.connection?.remoteAddress, false);
    
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input data', error.errors);
    }
    
    throw error;
  }
}

/**
 * Get list of users with Buffr Host emotional context
 */
export async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'users:read')) {
      throw new AuthorizationError('Insufficient permissions to view users');
    }

    // Parse query parameters
    const query = UserSearchSchema.parse(req.query);
    
    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Build query
    const queryBuilder = userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.tenant', 'tenant');

    // Apply filters
    if (query.q) {
      queryBuilder.andWhere(
        '(user.fullName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${query.q}%` }
      );
    }

    if (query.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }

    if (query.isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive: query.isActive });
    }

    if (query.tenantId) {
      queryBuilder.andWhere('user.tenantId = :tenantId', { tenantId: query.tenantId });
    }

    // Apply sorting
    queryBuilder.orderBy(`user.${query.sortBy}`, query.sortOrder);

    // Apply pagination
    const offset = (query.page - 1) * query.limit;
    queryBuilder.skip(offset).take(query.limit);

    // Execute query
    const [users, total] = await queryBuilder.getManyAndCount();

    // Format response
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenant?.companyName,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      avatarUrl: user.avatarUrl,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: 'Your team members, always ready to serve with excellence.',
      data: formattedUsers,
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
        team: 'unified-excellence',
      },
    });

  } catch (error) {
    logger.logAuth('users_fetch_failed', undefined, req.connection?.remoteAddress, false);
    
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid query parameters', error.errors);
    }
    
    throw error;
  }
}

/**
 * Get user by ID with Buffr Host emotional context
 */
export async function getUserById(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'users:read')) {
      throw new AuthorizationError('Insufficient permissions to view user details');
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('User ID is required');
    }

    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user can access this user's data
    if (user.tenantId !== currentUser.tenantId && !hasPermission(currentUser, 'users:admin')) {
      throw new AuthorizationError('Access denied to this user');
    }

    res.status(200).json({
      success: true,
      message: 'User details, carefully curated for your review.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: user.tenant?.companyName,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        timezone: user.timezone,
        language: user.language,
        preferences: user.preferences,
        notificationSettings: user.notificationSettings,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
    logger.logAuth('user_fetch_failed', undefined, req.connection?.remoteAddress, false);
    throw error;
  }
}

/**
 * Update user with Buffr Host emotional care
 */
export async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'users:write')) {
      throw new AuthorizationError('Insufficient permissions to update users');
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('User ID is required');
    }

    // Validate request body
    const body = UserUpdateSchema.parse(req.body);
    
    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user can update this user
    if (user.tenantId !== currentUser.tenantId && !hasPermission(currentUser, 'users:admin')) {
      throw new AuthorizationError('Access denied to update this user');
    }

    // Update user fields
    if (body.email !== undefined) user.email = body.email;
    if (body.fullName !== undefined) user.fullName = body.fullName;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.role !== undefined) user.role = body.role;
    if (body.tenantId !== undefined) user.tenantId = body.tenantId;
    if (body.isActive !== undefined) user.isActive = body.isActive;
    if (body.emailVerified !== undefined) user.emailVerified = body.emailVerified;
    if (body.phoneVerified !== undefined) user.phoneVerified = body.phoneVerified;
    if (body.avatarUrl !== undefined) user.avatarUrl = body.avatarUrl;
    if (body.bio !== undefined) user.bio = body.bio;
    if (body.timezone !== undefined) user.timezone = body.timezone;
    if (body.language !== undefined) user.language = body.language;
    if (body.preferences !== undefined) user.preferences = body.preferences;
    if (body.notificationSettings !== undefined) user.notificationSettings = body.notificationSettings;

    // Save updated user
    const updatedUser = await userRepository.save(user);

    // Log user update
    logger.logAuth('user_updated', updatedUser.id, req.connection?.remoteAddress, true);

    res.status(200).json({
      success: true,
      message: `${updatedUser.fullName}'s profile has been updated with care and attention to detail.`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        role: updatedUser.role,
        tenantId: updatedUser.tenantId,
        isActive: updatedUser.isActive,
        emailVerified: updatedUser.emailVerified,
        phoneVerified: updatedUser.phoneVerified,
        avatarUrl: updatedUser.avatarUrl,
        bio: updatedUser.bio,
        timezone: updatedUser.timezone,
        language: updatedUser.language,
        preferences: updatedUser.preferences,
        notificationSettings: updatedUser.notificationSettings,
        updatedAt: updatedUser.updatedAt,
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
    logger.logAuth('user_update_failed', undefined, req.connection?.remoteAddress, false);
    
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input data', error.errors);
    }
    
    throw error;
  }
}

/**
 * Delete user with Buffr Host emotional care
 */
export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'users:delete')) {
      throw new AuthorizationError('Insufficient permissions to delete users');
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('User ID is required');
    }

    // Prevent self-deletion
    if (id === currentUser.id) {
      throw new ValidationError('You cannot delete your own account');
    }

    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user can delete this user
    if (user.tenantId !== currentUser.tenantId && !hasPermission(currentUser, 'users:admin')) {
      throw new AuthorizationError('Access denied to delete this user');
    }

    // Soft delete by deactivating
    user.deactivate();
    await userRepository.save(user);

    // Log user deletion
    logger.logAuth('user_deleted', user.id, req.connection?.remoteAddress, true);

    res.status(200).json({
      success: true,
      message: `${user.fullName}'s account has been deactivated with respect and care.`,
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        farewell: 'respectful-caring',
      },
    });

  } catch (error) {
    logger.logAuth('user_deletion_failed', undefined, req.connection?.remoteAddress, false);
    throw error;
  }
}

/**
 * Get user statistics with Buffr Host emotional insights
 */
export async function getUserStats(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user and check permissions
    const currentUser = await getCurrentUser(req);
    
    if (!hasPermission(currentUser, 'users:read')) {
      throw new AuthorizationError('Insufficient permissions to view user statistics');
    }

    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Get statistics
    const totalUsers = await userRepository.count({
      where: { tenantId: currentUser.tenantId },
    });

    const activeUsers = await userRepository.count({
      where: { tenantId: currentUser.tenantId, isActive: true },
    });

    const verifiedUsers = await userRepository.count({
      where: { tenantId: currentUser.tenantId, emailVerified: true },
    });

    const roleStats = await userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where('user.tenantId = :tenantId', { tenantId: currentUser.tenantId })
      .groupBy('user.role')
      .getRawMany();

    const recentUsers = await userRepository.find({
      where: { tenantId: currentUser.tenantId },
      order: { createdAt: 'DESC' },
      take: 5,
      select: ['id', 'fullName', 'email', 'role', 'createdAt'],
    });

    res.status(200).json({
      success: true,
      message: 'Your team insights, thoughtfully prepared for your review.',
      stats: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        inactive: totalUsers - activeUsers,
        verificationRate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
        activityRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      },
      roleDistribution: roleStats.reduce((acc, item) => {
        acc[item.role] = parseInt(item.count);
        return acc;
      }, {} as Record<string, number>),
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
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
    logger.logAuth('user_stats_failed', undefined, req.connection?.remoteAddress, false);
    throw error;
  }
}

/**
 * Main user management route handler
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, query } = req;
    const { action } = query;

    switch (method) {
      case 'POST':
        switch (action) {
          case 'create':
            return await createUser(req, res);
          default:
            res.status(400).json({
              success: false,
              message: 'Invalid user action',
              availableActions: ['create'],
            });
        }
        break;

      case 'GET':
        switch (action) {
          case 'list':
            return await getUsers(req, res);
          case 'stats':
            return await getUserStats(req, res);
          default:
            // If no action, treat as get user by ID
            return await getUserById(req, res);
        }
        break;

      case 'PUT':
        return await updateUser(req, res);

      case 'DELETE':
        return await deleteUser(req, res);

      default:
        res.status(405).json({
          success: false,
          message: 'Method not allowed',
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        });
    }

  } catch (error) {
    logger.logError(error as Error, { endpoint: '/api/v1/users', method: req.method });
    
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