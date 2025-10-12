/**
 * Hospitality Property Entity
 * TypeORM entity for hospitality property management
 * Converted from Python SQLAlchemy model
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantProfile } from './TenantProfile';
import { Room } from './Room';
import { RoomType } from './RoomType';

@Entity('hospitality_properties')
export class HospitalityProperty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Tenant relationship
  @Column({ name: 'tenant_id' })
  tenantId: string;

  // Basic information
  @Column({ name: 'property_name' })
  propertyName: string;

  @Column({ name: 'property_type' })
  propertyType: string; // hotel, resort, etc.

  @Column({ type: 'text', nullable: true })
  description: string;

  // Contact information
  @Column({ name: 'contact_email', nullable: true })
  contactEmail: string;

  @Column({ name: 'contact_phone', nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  website: string;

  // Property details
  @Column({ name: 'star_rating', nullable: true })
  starRating: number;

  @Column({ name: 'total_rooms', nullable: true })
  totalRooms: number;

  @Column({ name: 'check_in_time', type: 'time', nullable: true })
  checkInTime: string;

  @Column({ name: 'check_out_time', type: 'time', nullable: true })
  checkOutTime: string;

  // Address information (stored as JSON)
  @Column({ type: 'json', nullable: true })
  address: Record<string, any>;

  // Amenities and policies (stored as JSON arrays/objects)
  @Column({ type: 'json', nullable: true })
  amenities: string[];

  @Column({ type: 'json', nullable: true })
  policies: Record<string, any>;

  // Status
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => TenantProfile, (tenant) => tenant.properties)
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantProfile;

  @OneToMany(() => Room, (room) => room.property)
  rooms: Room[];

  @OneToMany(() => RoomType, (roomType) => roomType.property)
  roomTypes: RoomType[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  /**
   * Convert property to dictionary
   */
  toDict(): Record<string, any> {
    return {
      id: this.id,
      tenantId: this.tenantId,
      propertyName: this.propertyName,
      propertyType: this.propertyType,
      description: this.description,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone,
      website: this.website,
      starRating: this.starRating,
      totalRooms: this.totalRooms,
      checkInTime: this.checkInTime,
      checkOutTime: this.checkOutTime,
      address: this.address,
      amenities: this.amenities || [],
      policies: this.policies || {},
      isActive: this.isActive,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }

  /**
   * Get property display name
   */
  getDisplayName(): string {
    return this.propertyName;
  }

  /**
   * Check if property is active
   */
  isActiveProperty(): boolean {
    return this.isActive;
  }

  /**
   * Activate property
   */
  activate(): void {
    this.isActive = true;
  }

  /**
   * Deactivate property
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Get room count
   */
  getRoomCount(): number {
    return this.rooms?.length || 0;
  }

  /**
   * Get room type count
   */
  getRoomTypeCount(): number {
    return this.roomTypes?.length || 0;
  }

  /**
   * Check if property has specific amenity
   */
  hasAmenity(amenity: string): boolean {
    return this.amenities?.includes(amenity) || false;
  }

  /**
   * Add amenity
   */
  addAmenity(amenity: string): void {
    if (!this.amenities) {
      this.amenities = [];
    }
    if (!this.amenities.includes(amenity)) {
      this.amenities.push(amenity);
    }
  }

  /**
   * Remove amenity
   */
  removeAmenity(amenity: string): void {
    if (this.amenities) {
      this.amenities = this.amenities.filter(a => a !== amenity);
    }
  }

  /**
   * Get policy value
   */
  getPolicy(key: string): any {
    return this.policies?.[key];
  }

  /**
   * Set policy value
   */
  setPolicy(key: string, value: any): void {
    if (!this.policies) {
      this.policies = {};
    }
    this.policies[key] = value;
  }

  /**
   * Get full address as string
   */
  getFullAddress(): string {
    if (!this.address) {
      return '';
    }

    const parts = [
      this.address.street,
      this.address.city,
      this.address.state,
      this.address.country,
      this.address.postalCode,
    ].filter(Boolean);

    return parts.join(', ');
  }

  /**
   * Get contact information
   */
  getContactInfo(): Record<string, string> {
    return {
      email: this.contactEmail || '',
      phone: this.contactPhone || '',
      website: this.website || '',
    };
  }

  /**
   * Update contact information
   */
  updateContactInfo(email?: string, phone?: string, website?: string): void {
    if (email !== undefined) this.contactEmail = email;
    if (phone !== undefined) this.contactPhone = phone;
    if (website !== undefined) this.website = website;
  }

  /**
   * Get property summary
   */
  getSummary(): Record<string, any> {
    return {
      id: this.id,
      name: this.propertyName,
      type: this.propertyType,
      starRating: this.starRating,
      totalRooms: this.totalRooms,
      isActive: this.isActive,
      roomCount: this.getRoomCount(),
      roomTypeCount: this.getRoomTypeCount(),
    };
  }
}