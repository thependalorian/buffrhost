/**
 * User Entity
 * TypeORM entity for user management with authentication and authorization
 * Converted from Python SQLAlchemy model
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantProfile } from './TenantProfile';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Authentication
  @Column({ unique: true })
  email: string;

  @Column({ name: 'hashed_password' })
  hashedPassword: string;

  // Profile information
  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  // Role and permissions
  @Column({ default: 'guest' })
  role: string;

  @Column({ name: 'tenant_id', nullable: true })
  tenantId: string;

  // Account status
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  // Additional profile fields
  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ default: 'en' })
  language: string;

  // Preferences (stored as JSON)
  @Column({ type: 'json', nullable: true })
  preferences: Record<string, any>;

  @Column({ name: 'notification_settings', type: 'json', nullable: true })
  notificationSettings: Record<string, any>;

  // Security
  @Column({ name: 'failed_login_attempts', default: '0' })
  failedLoginAttempts: string;

  @Column({ name: 'locked_until', nullable: true })
  lockedUntil: Date;

  @Column({ name: 'password_changed_at', default: () => 'CURRENT_TIMESTAMP' })
  passwordChangedAt: Date;

  // Relationships
  @ManyToOne(() => TenantProfile, (tenant) => tenant.users)
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantProfile;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  /**
   * Convert user to dictionary
   */
  toDict(): Record<string, any> {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      phone: this.phone,
      role: this.role,
      tenantId: this.tenantId,
      isActive: this.isActive,
      emailVerified: this.emailVerified,
      phoneVerified: this.phoneVerified,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      lastLogin: this.lastLogin?.toISOString(),
      avatarUrl: this.avatarUrl,
      bio: this.bio,
      timezone: this.timezone,
      language: this.language,
      preferences: this.preferences,
      notificationSettings: this.notificationSettings,
    };
  }

  /**
   * Check if user account is locked
   */
  isLocked(): boolean {
    if (!this.lockedUntil) {
      return false;
    }
    return new Date() < this.lockedUntil;
  }

  /**
   * Get number of failed login attempts
   */
  getFailedLoginAttempts(): number {
    try {
      return parseInt(this.failedLoginAttempts);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Increment failed login attempts
   */
  incrementFailedLoginAttempts(): void {
    const current = this.getFailedLoginAttempts();
    this.failedLoginAttempts = (current + 1).toString();
  }

  /**
   * Reset failed login attempts
   */
  resetFailedLoginAttempts(): void {
    this.failedLoginAttempts = '0';
    this.lockedUntil = null;
  }

  /**
   * Lock account for specified duration
   */
  lockAccount(minutes: number = 30): void {
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + minutes);
    this.lockedUntil = lockUntil;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.role === role;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.role === 'admin' || this.role === 'super_admin';
  }

  /**
   * Check if user is staff
   */
  isStaff(): boolean {
    return ['admin', 'super_admin', 'manager', 'staff'].includes(this.role);
  }

  /**
   * Check if user is guest
   */
  isGuest(): boolean {
    return this.role === 'guest';
  }

  /**
   * Update last login timestamp
   */
  updateLastLogin(): void {
    this.lastLogin = new Date();
  }

  /**
   * Update password and reset security fields
   */
  updatePassword(hashedPassword: string): void {
    this.hashedPassword = hashedPassword;
    this.passwordChangedAt = new Date();
    this.resetFailedLoginAttempts();
  }

  /**
   * Verify email
   */
  verifyEmail(): void {
    this.emailVerified = true;
  }

  /**
   * Verify phone
   */
  verifyPhone(): void {
    this.phoneVerified = true;
  }

  /**
   * Deactivate account
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Activate account
   */
  activate(): void {
    this.isActive = true;
  }

  /**
   * Get user display name
   */
  getDisplayName(): string {
    return this.fullName || this.email;
  }

  /**
   * Check if user can access tenant
   */
  canAccessTenant(tenantId: string): boolean {
    return this.tenantId === tenantId || this.isAdmin();
  }
}