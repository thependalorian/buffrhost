/**
 * Authentication Routes
 * Next.js API routes for authentication with Buffr Host brand identity
 * Converted from Python FastAPI with emotional design principles
 */

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { DatabaseManager } from '../database/DatabaseManager';
import { User } from '../entities/User';
import { TenantProfile } from '../entities/TenantProfile';
import { ConfigManager } from '../config/ConfigManager';
import { Logger } from '../utils/Logger';
import { ValidationError, AuthenticationError, NotFoundError, ConflictError } from '../middleware/ErrorHandler';

// Initialize services
const config = ConfigManager.getInstance();
const logger = Logger.getInstance();
const databaseManager = DatabaseManager.getInstance();

// Validation schemas with Buffr Host emotional design principles
const UserCreateSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  tenantId: z.string().optional(),
});

const UserLoginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

const PasswordResetSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

const PasswordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

// JWT token utilities with Buffr Host emotional messaging
export class AuthService {
  private static instance: AuthService;
  private config: ConfigManager;

  private constructor() {
    this.config = ConfigManager.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Hash password with bcrypt
   */
  public async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hash
   */
  public async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Create JWT access token with Buffr Host emotional context
   */
  public createAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      iat: Math.floor(Date.now() / 1000),
      // Buffr Host emotional context
      brand: 'buffr-host',
      experience: 'warm-professional',
    };

    return jwt.sign(
      payload,
      this.config.get('SECRET_KEY'),
      {
        algorithm: this.config.get('ALGORITHM') as jwt.Algorithm,
        expiresIn: `${this.config.get('ACCESS_TOKEN_EXPIRE_MINUTES')}m`,
      }
    );
  }

  /**
   * Create JWT refresh token
   */
  public createRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(
      payload,
      this.config.get('SECRET_KEY'),
      {
        algorithm: this.config.get('ALGORITHM') as jwt.Algorithm,
        expiresIn: `${this.config.get('REFRESH_TOKEN_EXPIRE_DAYS')}d`,
      }
    );
  }

  /**
   * Verify JWT token
   */
  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.config.get('SECRET_KEY'), {
        algorithms: [this.config.get('ALGORITHM') as jwt.Algorithm],
      });
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  /**
   * Get current user from token
   */
  public async getCurrentUser(token: string): Promise<User> {
    const payload = this.verifyToken(token);
    const dataSource = databaseManager.getDataSource();
    
    const user = await dataSource.getRepository(User).findOne({
      where: { id: payload.sub },
      relations: ['tenant'],
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is inactive');
    }

    if (user.isLocked()) {
      throw new AuthenticationError('Account is temporarily locked');
    }

    return user;
  }
}

// Initialize auth service
const authService = AuthService.getInstance();

/**
 * Register a new user with Buffr Host emotional welcome
 */
export async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate request body
    const body = UserCreateSchema.parse(req.body);
    
    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);
    const tenantRepository = dataSource.getRepository(TenantProfile);

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
    user.role = 'guest';
    user.tenantId = body.tenantId;
    user.isActive = true;
    user.emailVerified = false;
    user.phoneVerified = false;
    user.timezone = 'UTC';
    user.language = 'en';
    user.preferences = {
      theme: 'nude-warm',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      aiPersonality: 'warm-professional',
    };
    user.notificationSettings = {
      welcome: true,
      booking: true,
      payment: true,
      marketing: false,
    };

    // Save user
    const savedUser = await userRepository.save(user);

    // Create tokens
    const accessToken = authService.createAccessToken(savedUser);
    const refreshToken = authService.createRefreshToken(savedUser);

    // Log successful registration with Buffr Host emotional context
    logger.logAuth('user_registered', savedUser.id, req.connection?.remoteAddress, true);

    // Return response with Buffr Host emotional messaging
    res.status(201).json({
      success: true,
      message: 'Welcome to Buffr Host! Your account has been created with care.',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
        isActive: savedUser.isActive,
        emailVerified: savedUser.emailVerified,
        createdAt: savedUser.createdAt,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: config.get('ACCESS_TOKEN_EXPIRE_MINUTES') * 60,
        tokenType: 'Bearer',
      },
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
      },
    });

  } catch (error) {
    logger.logAuth('user_registration_failed', undefined, req.connection?.remoteAddress, false);
    
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input data', error.errors);
    }
    
    throw error;
  }
}

/**
 * Login user with Buffr Host emotional welcome
 */
export async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate request body
    const body = UserLoginSchema.parse(req.body);
    
    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Find user
    const user = await userRepository.findOne({
      where: { email: body.email },
      relations: ['tenant'],
    });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if account is locked
    if (user.isLocked()) {
      throw new AuthenticationError('Account is temporarily locked. Please try again later.');
    }

    // Verify password
    const isValidPassword = await authService.verifyPassword(body.password, user.hashedPassword);

    if (!isValidPassword) {
      // Increment failed login attempts
      user.incrementFailedLoginAttempts();
      
      // Lock account after 5 failed attempts
      if (user.getFailedLoginAttempts() >= 5) {
        user.lockAccount(30); // Lock for 30 minutes
      }
      
      await userRepository.save(user);
      throw new AuthenticationError('Invalid email or password');
    }

    // Reset failed login attempts on successful login
    user.resetFailedLoginAttempts();
    user.updateLastLogin();
    await userRepository.save(user);

    // Create tokens
    const accessToken = authService.createAccessToken(user);
    const refreshToken = authService.createRefreshToken(user);

    // Log successful login with Buffr Host emotional context
    logger.logAuth('user_login', user.id, req.connection?.remoteAddress, true);

    // Return response with Buffr Host emotional messaging
    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.fullName}! We're delighted to see you again.`,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: config.get('ACCESS_TOKEN_EXPIRE_MINUTES') * 60,
        tokenType: 'Bearer',
      },
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        personality: 'caring-competent',
      },
    });

  } catch (error) {
    logger.logAuth('user_login_failed', undefined, req.connection?.remoteAddress, false);
    
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input data', error.errors);
    }
    
    throw error;
  }
}

/**
 * Refresh access token with Buffr Host emotional context
 */
export async function refreshToken(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Verify refresh token
    const payload = authService.verifyToken(refreshToken);
    
    if (payload.type !== 'refresh') {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Get user
    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);
    
    const user = await userRepository.findOne({
      where: { id: payload.sub },
      relations: ['tenant'],
    });

    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    // Create new tokens
    const newAccessToken = authService.createAccessToken(user);
    const newRefreshToken = authService.createRefreshToken(user);

    // Log token refresh
    logger.logAuth('token_refreshed', user.id, req.connection?.remoteAddress, true);

    res.status(200).json({
      success: true,
      message: 'Your session has been refreshed with care.',
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: config.get('ACCESS_TOKEN_EXPIRE_MINUTES') * 60,
        tokenType: 'Bearer',
      },
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        experience: 'warm-professional',
      },
    });

  } catch (error) {
    logger.logAuth('token_refresh_failed', undefined, req.connection?.remoteAddress, false);
    throw error;
  }
}

/**
 * Change password with Buffr Host emotional security
 */
export async function changePassword(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authorization token required');
    }

    const token = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(token);

    // Validate request body
    const body = PasswordChangeSchema.parse(req.body);

    // Verify current password
    const isValidPassword = await authService.verifyPassword(body.currentPassword, currentUser.hashedPassword);

    if (!isValidPassword) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const newHashedPassword = await authService.hashPassword(body.newPassword);

    // Update password
    const dataSource = databaseManager.getDataSource();
    const userRepository = dataSource.getRepository(User);
    
    currentUser.updatePassword(newHashedPassword);
    await userRepository.save(currentUser);

    // Log password change
    logger.logAuth('password_changed', currentUser.id, req.connection?.remoteAddress, true);

    res.status(200).json({
      success: true,
      message: 'Your password has been updated securely. Your account is protected with care.',
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        experience: 'warm-professional',
        security: 'enhanced',
      },
    });

  } catch (error) {
    logger.logAuth('password_change_failed', undefined, req.connection?.remoteAddress, false);
    
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input data', error.errors);
    }
    
    throw error;
  }
}

/**
 * Get current user profile with Buffr Host emotional context
 */
export async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authorization token required');
    }

    const token = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(token);

    res.status(200).json({
      success: true,
      message: 'Your profile information, always at your service.',
      user: {
        id: currentUser.id,
        email: currentUser.email,
        fullName: currentUser.fullName,
        phone: currentUser.phone,
        role: currentUser.role,
        tenantId: currentUser.tenantId,
        isActive: currentUser.isActive,
        emailVerified: currentUser.emailVerified,
        phoneVerified: currentUser.phoneVerified,
        avatarUrl: currentUser.avatarUrl,
        bio: currentUser.bio,
        timezone: currentUser.timezone,
        language: currentUser.language,
        preferences: currentUser.preferences,
        notificationSettings: currentUser.notificationSettings,
        createdAt: currentUser.createdAt,
        updatedAt: currentUser.updatedAt,
        lastLogin: currentUser.lastLogin,
      },
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        personality: 'caring-competent',
      },
    });

  } catch (error) {
    logger.logAuth('profile_fetch_failed', undefined, req.connection?.remoteAddress, false);
    throw error;
  }
}

/**
 * Logout user with Buffr Host emotional farewell
 */
export async function logoutUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authorization token required');
    }

    const token = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(token);

    // Log logout
    logger.logAuth('user_logout', currentUser.id, req.connection?.remoteAddress, true);

    res.status(200).json({
      success: true,
      message: `Thank you for choosing Buffr Host, ${currentUser.fullName}. We look forward to welcoming you back soon.`,
      // Buffr Host emotional context
      brand: {
        name: 'Buffr Host',
        tagline: 'The Future of Hospitality, Today',
        experience: 'warm-professional',
        farewell: 'grateful-anticipating',
      },
    });

  } catch (error) {
    logger.logAuth('logout_failed', undefined, req.connection?.remoteAddress, false);
    throw error;
  }
}

/**
 * Main authentication route handler
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, query } = req;
    const { action } = query;

    switch (method) {
      case 'POST':
        switch (action) {
          case 'register':
            return await registerUser(req, res);
          case 'login':
            return await loginUser(req, res);
          case 'refresh':
            return await refreshToken(req, res);
          case 'change-password':
            return await changePassword(req, res);
          case 'logout':
            return await logoutUser(req, res);
          default:
            res.status(400).json({
              success: false,
              message: 'Invalid authentication action',
              availableActions: ['register', 'login', 'refresh', 'change-password', 'logout'],
            });
        }
        break;

      case 'GET':
        switch (action) {
          case 'me':
            return await getCurrentUser(req, res);
          default:
            res.status(400).json({
              success: false,
              message: 'Invalid authentication action',
              availableActions: ['me'],
            });
        }
        break;

      default:
        res.status(405).json({
          success: false,
          message: 'Method not allowed',
          allowedMethods: ['GET', 'POST'],
        });
    }

  } catch (error) {
    logger.logError(error as Error, { endpoint: '/api/v1/auth', method: req.method });
    
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