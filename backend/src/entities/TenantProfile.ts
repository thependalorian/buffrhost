/**
 * Tenant Profile Entity
 * TypeORM entity for multi-tenant architecture
 * Converted from Python SQLAlchemy model
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User';
import { HospitalityProperty } from './HospitalityProperty';

@Entity('tenant_profiles')
export class TenantProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic information
  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'display_name', nullable: true })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Contact information
  @Column({ name: 'contact_email' })
  contactEmail: string;

  @Column({ name: 'contact_phone', nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  website: string;

  // Address information (stored as JSON)
  @Column({ type: 'json', nullable: true })
  address: Record<string, any>;

  // Business information
  @Column({ name: 'business_type', nullable: true })
  businessType: string;

  @Column({ name: 'industry', nullable: true })
  industry: string;

  @Column({ name: 'tax_id', nullable: true })
  taxId: string;

  @Column({ name: 'registration_number', nullable: true })
  registrationNumber: string;

  // Subscription and billing
  @Column({ name: 'subscription_tier', default: 'essential' })
  subscriptionTier: string;

  @Column({ name: 'subscription_status', default: 'active' })
  subscriptionStatus: string;

  @Column({ name: 'trial_ends_at', nullable: true })
  trialEndsAt: Date;

  @Column({ name: 'billing_email', nullable: true })
  billingEmail: string;

  // Settings and preferences
  @Column({ type: 'json', nullable: true })
  settings: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  preferences: Record<string, any>;

  // Status
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => HospitalityProperty, (property) => property.tenant)
  properties: HospitalityProperty[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  /**
   * Convert tenant to dictionary
   */
  toDict(): Record<string, any> {
    return {
      id: this.id,
      companyName: this.companyName,
      displayName: this.displayName,
      description: this.description,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone,
      website: this.website,
      address: this.address,
      businessType: this.businessType,
      industry: this.industry,
      taxId: this.taxId,
      registrationNumber: this.registrationNumber,
      subscriptionTier: this.subscriptionTier,
      subscriptionStatus: this.subscriptionStatus,
      trialEndsAt: this.trialEndsAt?.toISOString(),
      billingEmail: this.billingEmail,
      settings: this.settings,
      preferences: this.preferences,
      isActive: this.isActive,
      isVerified: this.isVerified,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }

  /**
   * Check if tenant is in trial period
   */
  isInTrial(): boolean {
    if (!this.trialEndsAt) {
      return false;
    }
    return new Date() < this.trialEndsAt;
  }

  /**
   * Check if tenant has active subscription
   */
  hasActiveSubscription(): boolean {
    return this.subscriptionStatus === 'active' && (this.isInTrial() || this.subscriptionTier !== 'trial');
  }

  /**
   * Check if tenant can access feature
   */
  canAccessFeature(feature: string): boolean {
    const featureAccess = {
      essential: ['basic_booking', 'basic_analytics'],
      professional: ['basic_booking', 'basic_analytics', 'advanced_booking', 'advanced_analytics', 'integrations'],
      enterprise: ['basic_booking', 'basic_analytics', 'advanced_booking', 'advanced_analytics', 'integrations', 'custom_features', 'priority_support'],
    };

    const allowedFeatures = featureAccess[this.subscriptionTier as keyof typeof featureAccess] || [];
    return allowedFeatures.includes(feature);
  }

  /**
   * Get tenant display name
   */
  getDisplayName(): string {
    return this.displayName || this.companyName;
  }

  /**
   * Activate tenant
   */
  activate(): void {
    this.isActive = true;
  }

  /**
   * Deactivate tenant
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Verify tenant
   */
  verify(): void {
    this.isVerified = true;
  }

  /**
   * Update subscription
   */
  updateSubscription(tier: string, status: string): void {
    this.subscriptionTier = tier;
    this.subscriptionStatus = status;
  }

  /**
   * Set trial period
   */
  setTrialPeriod(days: number = 14): void {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + days);
    this.trialEndsAt = trialEndsAt;
    this.subscriptionTier = 'trial';
    this.subscriptionStatus = 'active';
  }

  /**
   * Get user count
   */
  getUserCount(): number {
    return this.users?.length || 0;
  }

  /**
   * Get property count
   */
  getPropertyCount(): number {
    return this.properties?.length || 0;
  }
}