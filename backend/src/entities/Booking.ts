/**
 * Booking Entity
 * TypeORM entity for booking management
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
import { User } from './User';
import { Room } from './Room';
import { Payment } from './Payment';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // User relationship
  @Column({ name: 'user_id' })
  userId: string;

  // Room relationship
  @Column({ name: 'room_id' })
  roomId: string;

  // Property relationship
  @Column({ name: 'property_id' })
  propertyId: string;

  // Booking information
  @Column({ name: 'booking_reference' })
  bookingReference: string;

  @Column({ name: 'check_in_date', type: 'date' })
  checkInDate: Date;

  @Column({ name: 'check_out_date', type: 'date' })
  checkOutDate: Date;

  @Column({ name: 'check_in_time', type: 'time', nullable: true })
  checkInTime: string;

  @Column({ name: 'check_out_time', type: 'time', nullable: true })
  checkOutTime: string;

  // Guest information
  @Column({ name: 'guest_count' })
  guestCount: number;

  @Column({ name: 'guest_name', nullable: true })
  guestName: string;

  @Column({ name: 'guest_email', nullable: true })
  guestEmail: string;

  @Column({ name: 'guest_phone', nullable: true })
  guestPhone: string;

  @Column({ name: 'special_requests', type: 'text', nullable: true })
  specialRequests: string;

  // Pricing
  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'currency', default: 'NAD' })
  currency: string;

  // Booking status
  @Column({ name: 'status', default: 'pending' })
  status: string; // pending, confirmed, checked_in, checked_out, cancelled, no_show

  @Column({ name: 'payment_status', default: 'pending' })
  paymentStatus: string; // pending, paid, partially_paid, refunded, failed

  // Dates and times
  @Column({ name: 'confirmed_at', nullable: true })
  confirmedAt: Date;

  @Column({ name: 'checked_in_at', nullable: true })
  checkedInAt: Date;

  @Column({ name: 'checked_out_at', nullable: true })
  checkedOutAt: Date;

  @Column({ name: 'cancelled_at', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancellation_reason', nullable: true })
  cancellationReason: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
    if (!this.bookingReference) {
      this.bookingReference = this.generateBookingReference();
    }
  }

  /**
   * Generate booking reference
   */
  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `BK${timestamp}${random}`.toUpperCase();
  }

  /**
   * Convert booking to dictionary
   */
  toDict(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      roomId: this.roomId,
      propertyId: this.propertyId,
      bookingReference: this.bookingReference,
      checkInDate: this.checkInDate?.toISOString().split('T')[0],
      checkOutDate: this.checkOutDate?.toISOString().split('T')[0],
      checkInTime: this.checkInTime,
      checkOutTime: this.checkOutTime,
      guestCount: this.guestCount,
      guestName: this.guestName,
      guestEmail: this.guestEmail,
      guestPhone: this.guestPhone,
      specialRequests: this.specialRequests,
      basePrice: this.basePrice,
      totalPrice: this.totalPrice,
      taxAmount: this.taxAmount,
      discountAmount: this.discountAmount,
      currency: this.currency,
      status: this.status,
      paymentStatus: this.paymentStatus,
      confirmedAt: this.confirmedAt?.toISOString(),
      checkedInAt: this.checkedInAt?.toISOString(),
      checkedOutAt: this.checkedOutAt?.toISOString(),
      cancelledAt: this.cancelledAt?.toISOString(),
      cancellationReason: this.cancellationReason,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }

  /**
   * Get booking display name
   */
  getDisplayName(): string {
    return `Booking ${this.bookingReference}`;
  }

  /**
   * Check if booking is pending
   */
  isPending(): boolean {
    return this.status === 'pending';
  }

  /**
   * Check if booking is confirmed
   */
  isConfirmed(): boolean {
    return this.status === 'confirmed';
  }

  /**
   * Check if booking is checked in
   */
  isCheckedIn(): boolean {
    return this.status === 'checked_in';
  }

  /**
   * Check if booking is checked out
   */
  isCheckedOut(): boolean {
    return this.status === 'checked_out';
  }

  /**
   * Check if booking is cancelled
   */
  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  /**
   * Check if booking is no show
   */
  isNoShow(): boolean {
    return this.status === 'no_show';
  }

  /**
   * Confirm booking
   */
  confirm(): void {
    this.status = 'confirmed';
    this.confirmedAt = new Date();
  }

  /**
   * Check in guest
   */
  checkIn(): void {
    this.status = 'checked_in';
    this.checkedInAt = new Date();
  }

  /**
   * Check out guest
   */
  checkOut(): void {
    this.status = 'checked_out';
    this.checkedOutAt = new Date();
  }

  /**
   * Cancel booking
   */
  cancel(reason?: string): void {
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    if (reason) {
      this.cancellationReason = reason;
    }
  }

  /**
   * Mark as no show
   */
  markNoShow(): void {
    this.status = 'no_show';
  }

  /**
   * Check if payment is pending
   */
  isPaymentPending(): boolean {
    return this.paymentStatus === 'pending';
  }

  /**
   * Check if payment is paid
   */
  isPaymentPaid(): boolean {
    return this.paymentStatus === 'paid';
  }

  /**
   * Check if payment is partially paid
   */
  isPaymentPartiallyPaid(): boolean {
    return this.paymentStatus === 'partially_paid';
  }

  /**
   * Check if payment is refunded
   */
  isPaymentRefunded(): boolean {
    return this.paymentStatus === 'refunded';
  }

  /**
   * Check if payment failed
   */
  isPaymentFailed(): boolean {
    return this.paymentStatus === 'failed';
  }

  /**
   * Update payment status
   */
  updatePaymentStatus(status: string): void {
    this.paymentStatus = status;
  }

  /**
   * Calculate number of nights
   */
  getNumberOfNights(): number {
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Calculate total amount
   */
  getTotalAmount(): number {
    return this.totalPrice + this.taxAmount - this.discountAmount;
  }

  /**
   * Check if booking is active
   */
  isActive(): boolean {
    return ['confirmed', 'checked_in'].includes(this.status);
  }

  /**
   * Check if booking can be cancelled
   */
  canBeCancelled(): boolean {
    return ['pending', 'confirmed'].includes(this.status);
  }

  /**
   * Check if booking can be modified
   */
  canBeModified(): boolean {
    return ['pending', 'confirmed'].includes(this.status);
  }

  /**
   * Get booking summary
   */
  getSummary(): Record<string, any> {
    return {
      id: this.id,
      bookingReference: this.bookingReference,
      checkInDate: this.checkInDate?.toISOString().split('T')[0],
      checkOutDate: this.checkOutDate?.toISOString().split('T')[0],
      guestCount: this.guestCount,
      totalPrice: this.totalPrice,
      status: this.status,
      paymentStatus: this.paymentStatus,
      numberOfNights: this.getNumberOfNights(),
    };
  }

  /**
   * Check if booking is for today
   */
  isToday(): boolean {
    const today = new Date().toISOString().split('T')[0];
    return this.checkInDate?.toISOString().split('T')[0] === today;
  }

  /**
   * Check if booking is for tomorrow
   */
  isTomorrow(): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return this.checkInDate?.toISOString().split('T')[0] === tomorrowStr;
  }

  /**
   * Check if booking is overdue (past check-out date)
   */
  isOverdue(): boolean {
    if (!this.checkOutDate) {
      return false;
    }
    return new Date() > this.checkOutDate && this.status !== 'checked_out';
  }
}