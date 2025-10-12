/**
 * Room Type Entity
 * TypeORM entity for room type management
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
import { HospitalityProperty } from './HospitalityProperty';
import { Room } from './Room';

@Entity('room_types')
export class RoomType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Property relationship
  @Column({ name: 'property_id' })
  propertyId: string;

  // Room type information
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ name: 'max_occupancy' })
  maxOccupancy: number;

  @Column({ name: 'bed_type', nullable: true })
  bedType: string;

  @Column({ name: 'room_size', nullable: true })
  roomSize: number; // in square meters

  // Room type features
  @Column({ type: 'json', nullable: true })
  features: string[];

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  // Pricing rules
  @Column({ name: 'weekend_multiplier', type: 'decimal', precision: 3, scale: 2, default: 1.2 })
  weekendMultiplier: number;

  @Column({ name: 'seasonal_multiplier', type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  seasonalMultiplier: number;

  @Column({ name: 'advance_booking_discount', type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  advanceBookingDiscount: number;

  // Availability
  @Column({ name: 'total_rooms', default: 0 })
  totalRooms: number;

  @Column({ name: 'available_rooms', default: 0 })
  availableRooms: number;

  // Status
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => HospitalityProperty, (property) => property.roomTypes)
  @JoinColumn({ name: 'property_id' })
  property: HospitalityProperty;

  @OneToMany(() => Room, (room) => room.roomType)
  rooms: Room[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  /**
   * Convert room type to dictionary
   */
  toDict(): Record<string, any> {
    return {
      id: this.id,
      propertyId: this.propertyId,
      name: this.name,
      description: this.description,
      basePrice: this.basePrice,
      maxOccupancy: this.maxOccupancy,
      bedType: this.bedType,
      roomSize: this.roomSize,
      features: this.features || [],
      amenities: this.amenities || [],
      weekendMultiplier: this.weekendMultiplier,
      seasonalMultiplier: this.seasonalMultiplier,
      advanceBookingDiscount: this.advanceBookingDiscount,
      totalRooms: this.totalRooms,
      availableRooms: this.availableRooms,
      isActive: this.isActive,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }

  /**
   * Get room type display name
   */
  getDisplayName(): string {
    return this.name;
  }

  /**
   * Check if room type is active
   */
  isActiveRoomType(): boolean {
    return this.isActive;
  }

  /**
   * Activate room type
   */
  activate(): void {
    this.isActive = true;
  }

  /**
   * Deactivate room type
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Check if room type has specific feature
   */
  hasFeature(feature: string): boolean {
    return this.features?.includes(feature) || false;
  }

  /**
   * Add feature
   */
  addFeature(feature: string): void {
    if (!this.features) {
      this.features = [];
    }
    if (!this.features.includes(feature)) {
      this.features.push(feature);
    }
  }

  /**
   * Remove feature
   */
  removeFeature(feature: string): void {
    if (this.features) {
      this.features = this.features.filter(f => f !== feature);
    }
  }

  /**
   * Check if room type has specific amenity
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
   * Calculate price for specific date
   */
  calculatePrice(date: Date, isWeekend: boolean = false): number {
    let price = this.basePrice;

    // Apply weekend multiplier
    if (isWeekend) {
      price *= this.weekendMultiplier;
    }

    // Apply seasonal multiplier
    price *= this.seasonalMultiplier;

    // Apply advance booking discount
    const daysInAdvance = Math.floor(
      (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysInAdvance >= 30) {
      price *= (1 - this.advanceBookingDiscount);
    }

    return Math.round(price * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Update pricing
   */
  updatePricing(basePrice: number): void {
    this.basePrice = basePrice;
  }

  /**
   * Update multipliers
   */
  updateMultipliers(weekendMultiplier?: number, seasonalMultiplier?: number): void {
    if (weekendMultiplier !== undefined) this.weekendMultiplier = weekendMultiplier;
    if (seasonalMultiplier !== undefined) this.seasonalMultiplier = seasonalMultiplier;
  }

  /**
   * Update availability
   */
  updateAvailability(totalRooms: number, availableRooms: number): void {
    this.totalRooms = totalRooms;
    this.availableRooms = availableRooms;
  }

  /**
   * Check if room type is available
   */
  isAvailable(): boolean {
    return this.availableRooms > 0 && this.isActive;
  }

  /**
   * Get occupancy rate
   */
  getOccupancyRate(): number {
    if (this.totalRooms === 0) {
      return 0;
    }
    return ((this.totalRooms - this.availableRooms) / this.totalRooms) * 100;
  }

  /**
   * Get room count
   */
  getRoomCount(): number {
    return this.rooms?.length || 0;
  }

  /**
   * Get available room count
   */
  getAvailableRoomCount(): number {
    return this.rooms?.filter(room => room.isAvailable()).length || 0;
  }

  /**
   * Get room type summary
   */
  getSummary(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      basePrice: this.basePrice,
      maxOccupancy: this.maxOccupancy,
      totalRooms: this.totalRooms,
      availableRooms: this.availableRooms,
      occupancyRate: this.getOccupancyRate(),
      isActive: this.isActive,
    };
  }

  /**
   * Check if room type can accommodate guests
   */
  canAccommodate(guestCount: number): boolean {
    return guestCount <= this.maxOccupancy;
  }

  /**
   * Get price range
   */
  getPriceRange(): { min: number; max: number } {
    const basePrice = this.basePrice;
    const maxPrice = basePrice * Math.max(
      this.weekendMultiplier,
      this.seasonalMultiplier
    );

    return {
      min: basePrice,
      max: Math.round(maxPrice * 100) / 100,
    };
  }

  /**
   * Update room count
   */
  updateRoomCount(): void {
    this.totalRooms = this.getRoomCount();
    this.availableRooms = this.getAvailableRoomCount();
  }
}