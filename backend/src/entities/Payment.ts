/**
 * Payment Entity
 * TypeORM entity for payment management
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
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Booking } from './Booking';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Booking relationship
  @Column({ name: 'booking_id' })
  bookingId: string;

  // Payment information
  @Column({ name: 'payment_reference' })
  paymentReference: string;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'currency', default: 'NAD' })
  currency: string;

  @Column({ name: 'payment_method' })
  paymentMethod: string; // stripe, adumo, realpay, buffr_pay, cash, bank_transfer

  @Column({ name: 'payment_status', default: 'pending' })
  paymentStatus: string; // pending, processing, completed, failed, refunded, partially_refunded

  // Payment gateway information
  @Column({ name: 'gateway_transaction_id', nullable: true })
  gatewayTransactionId: string;

  @Column({ name: 'gateway_response', type: 'json', nullable: true })
  gatewayResponse: Record<string, any>;

  @Column({ name: 'gateway_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  gatewayFee: number;

  // Payment details
  @Column({ name: 'payment_type', default: 'full' })
  paymentType: string; // full, partial, deposit, refund

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  // Refund information
  @Column({ name: 'refund_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount: number;

  @Column({ name: 'refund_reason', nullable: true })
  refundReason: string;

  @Column({ name: 'refunded_at', nullable: true })
  refundedAt: Date;

  // Processing information
  @Column({ name: 'processed_at', nullable: true })
  processedAt: Date;

  @Column({ name: 'failed_at', nullable: true })
  failedAt: Date;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Booking, (booking) => booking.payments)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
    if (!this.paymentReference) {
      this.paymentReference = this.generatePaymentReference();
    }
  }

  /**
   * Generate payment reference
   */
  private generatePaymentReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `PAY${timestamp}${random}`.toUpperCase();
  }

  /**
   * Convert payment to dictionary
   */
  toDict(): Record<string, any> {
    return {
      id: this.id,
      bookingId: this.bookingId,
      paymentReference: this.paymentReference,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      gatewayTransactionId: this.gatewayTransactionId,
      gatewayResponse: this.gatewayResponse,
      gatewayFee: this.gatewayFee,
      paymentType: this.paymentType,
      description: this.description,
      notes: this.notes,
      refundAmount: this.refundAmount,
      refundReason: this.refundReason,
      refundedAt: this.refundedAt?.toISOString(),
      processedAt: this.processedAt?.toISOString(),
      failedAt: this.failedAt?.toISOString(),
      failureReason: this.failureReason,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }

  /**
   * Get payment display name
   */
  getDisplayName(): string {
    return `Payment ${this.paymentReference}`;
  }

  /**
   * Check if payment is pending
   */
  isPending(): boolean {
    return this.paymentStatus === 'pending';
  }

  /**
   * Check if payment is processing
   */
  isProcessing(): boolean {
    return this.paymentStatus === 'processing';
  }

  /**
   * Check if payment is completed
   */
  isCompleted(): boolean {
    return this.paymentStatus === 'completed';
  }

  /**
   * Check if payment failed
   */
  isFailed(): boolean {
    return this.paymentStatus === 'failed';
  }

  /**
   * Check if payment is refunded
   */
  isRefunded(): boolean {
    return this.paymentStatus === 'refunded';
  }

  /**
   * Check if payment is partially refunded
   */
  isPartiallyRefunded(): boolean {
    return this.paymentStatus === 'partially_refunded';
  }

  /**
   * Mark payment as processing
   */
  markProcessing(): void {
    this.paymentStatus = 'processing';
  }

  /**
   * Mark payment as completed
   */
  markCompleted(gatewayTransactionId?: string, gatewayResponse?: Record<string, any>): void {
    this.paymentStatus = 'completed';
    this.processedAt = new Date();
    
    if (gatewayTransactionId) {
      this.gatewayTransactionId = gatewayTransactionId;
    }
    
    if (gatewayResponse) {
      this.gatewayResponse = gatewayResponse;
    }
  }

  /**
   * Mark payment as failed
   */
  markFailed(reason?: string): void {
    this.paymentStatus = 'failed';
    this.failedAt = new Date();
    
    if (reason) {
      this.failureReason = reason;
    }
  }

  /**
   * Process refund
   */
  processRefund(amount: number, reason?: string): void {
    this.refundAmount = amount;
    this.refundReason = reason || 'Customer request';
    this.refundedAt = new Date();
    
    if (amount >= this.amount) {
      this.paymentStatus = 'refunded';
    } else {
      this.paymentStatus = 'partially_refunded';
    }
  }

  /**
   * Get net amount (after gateway fees)
   */
  getNetAmount(): number {
    return this.amount - this.gatewayFee;
  }

  /**
   * Get refundable amount
   */
  getRefundableAmount(): number {
    return this.amount - this.refundAmount;
  }

  /**
   * Check if payment can be refunded
   */
  canBeRefunded(): boolean {
    return this.isCompleted() && this.getRefundableAmount() > 0;
  }

  /**
   * Check if payment is fully refunded
   */
  isFullyRefunded(): boolean {
    return this.refundAmount >= this.amount;
  }

  /**
   * Get payment summary
   */
  getSummary(): Record<string, any> {
    return {
      id: this.id,
      paymentReference: this.paymentReference,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      paymentType: this.paymentType,
      netAmount: this.getNetAmount(),
      refundAmount: this.refundAmount,
      refundableAmount: this.getRefundableAmount(),
    };
  }

  /**
   * Check if payment is for deposit
   */
  isDeposit(): boolean {
    return this.paymentType === 'deposit';
  }

  /**
   * Check if payment is for full amount
   */
  isFullPayment(): boolean {
    return this.paymentType === 'full';
  }

  /**
   * Check if payment is partial
   */
  isPartialPayment(): boolean {
    return this.paymentType === 'partial';
  }

  /**
   * Check if payment is refund
   */
  isRefund(): boolean {
    return this.paymentType === 'refund';
  }

  /**
   * Update gateway information
   */
  updateGatewayInfo(transactionId: string, response: Record<string, any>, fee: number = 0): void {
    this.gatewayTransactionId = transactionId;
    this.gatewayResponse = response;
    this.gatewayFee = fee;
  }

  /**
   * Get payment method display name
   */
  getPaymentMethodDisplayName(): string {
    const methodNames = {
      stripe: 'Credit Card (Stripe)',
      adumo: 'Credit Card (Adumo)',
      realpay: 'Credit Card (RealPay)',
      buffr_pay: 'BuffrPay',
      cash: 'Cash',
      bank_transfer: 'Bank Transfer',
    };
    
    return methodNames[this.paymentMethod as keyof typeof methodNames] || this.paymentMethod;
  }

  /**
   * Check if payment is recent (within last 24 hours)
   */
  isRecent(): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return this.createdAt > oneDayAgo;
  }
}