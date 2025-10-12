/**
 * Room Entity
 * TypeORM entity for room management
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
import { RoomType } from './RoomType';
import { Booking } from './Booking';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Property relationship
  @Column({ name: 'property_id' })
  propertyId: string;

  // Room type relationship
  @Column({ name: 'room_type_id' })
  roomTypeId: string;

  // Room information
  @Column({ name: 'room_number' })
  roomNumber: string;

  @Column({ name: 'floor', nullable: true })
  floor: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Room status
  @Column({ name: 'status', default: 'available' })
  status: string; // available, occupied, maintenance, out_of_order

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Room features (stored as JSON)
  @Column({ type: 'json', nullable: true })
  features: string[];

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  // Pricing
  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  basePrice: number;

  @Column({ name: 'current_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentPrice: number;

  // Maintenance
  @Column({ name: 'last_cleaned', nullable: true })
  lastCleaned: Date;

  @Column({ name: 'last_maintenance', nullable: true })
  lastMaintenance: Date;

  @Column({ name: 'next_maintenance', nullable: true })
  nextMaintenance: Date;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => HospitalityProperty, (property) => property.rooms)
  @JoinColumn({ name: 'property_id' })
  property: HospitalityProperty;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomType;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  /**
   * Convert room to dictionary
   */
  toDict(): Record<string, any> {
    return {
      id: this.id,
      propertyId: this.propertyId,
      roomTypeId: this.roomTypeId,
      roomNumber: this.roomNumber,
      floor: this.floor,
      description: this.description,
      status: this.status,
      isActive: this.isActive,
      features: this.features || [],
      amenities: this.amenities || [],
      basePrice: this.basePrice,
      currentPrice: this.currentPrice,
      lastCleaned: this.lastCleaned?.toISOString(),
      lastMaintenance: this.lastMaintenance?.toISOString(),
      nextMaintenance: this.nextMaintenance?.toISOString(),
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }

  /**
   * Get room display name
   */
  getDisplayName(): string {
    return `Room ${this.roomNumber}`;
  }

  /**
   * Check if room is available
   */
  isAvailable(): boolean {
    return this.status === 'available' && this.isActive;
  }

  /**
   * Check if room is occupied
   */
  isOccupied(): boolean {
    return this.status === 'occupied';
  }

  /**
   * Check if room is in maintenance
   */
  isInMaintenance(): boolean {
    return this.status === 'maintenance';
  }

  /**
   * Check if room is out of order
   */
  isOutOfOrder(): boolean {
    return this.status === 'out_of_order';
  }

  /**
   * Set room status
   */
  setStatus(status: string): void {
    this.status = status;
  }

  /**
   * Mark room as available
   */
  markAvailable(): void {
    this.status = 'available';
  }

  /**
   * Mark room as occupied
   */
  markOccupied(): void {
    this.status = 'occupied';
  }

  /**
   * Mark room for maintenance
   */
  markMaintenance(): void {
    this.status = 'maintenance';
  }

  /**
   * Mark room as out of order
   */
  markOutOfOrder(): void {
    this.status = 'out_of_order';
  }

  /**
   * Activate room
   */
  activate(): void {
    this.isActive = true;
  }

  /**
   * Deactivate room
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Check if room has specific feature
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
   * Check if room has specific amenity
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
   * Update pricing
   */
  updatePricing(basePrice?: number, currentPrice?: number): void {
    if (basePrice !== undefined) this.basePrice = basePrice;
    if (currentPrice !== undefined) this.currentPrice = currentPrice;
  }

  /**
   * Get effective price
   */
  getEffectivePrice(): number {
    return this.currentPrice || this.basePrice || 0;
  }

  /**
   * Mark as cleaned
   */
  markCleaned(): void {
    this.lastCleaned = new Date();
  }

  /**
   * Mark maintenance completed
   */
  markMaintenanceCompleted(): void {
    this.lastMaintenance = new Date();
    this.status = 'available';
  }

  /**
   * Schedule maintenance
   */
  scheduleMaintenance(date: Date): void {
    this.nextMaintenance = date;
  }

  /**
   * Get room summary
   */
  getSummary(): Record<string, any> {
    return {
      id: this.id,
      roomNumber: this.roomNumber,
      floor: this.floor,
      status: this.status,
      isActive: this.isActive,
      effectivePrice: this.getEffectivePrice(),
      lastCleaned: this.lastCleaned?.toISOString(),
      lastMaintenance: this.lastMaintenance?.toISOString(),
    };
  }

  /**
   * Check if room needs cleaning
   */
  needsCleaning(): boolean {
    if (!this.lastCleaned) {
      return true;
    }
    
    const daysSinceCleaning = Math.floor(
      (Date.now() - this.lastCleaned.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceCleaning >= 1; // Clean daily
  }

  /**
   * Check if room needs maintenance
   */
  needsMaintenance(): boolean {
    if (!this.nextMaintenance) {
      return false;
    }
    
    return new Date() >= this.nextMaintenance;
  }
}