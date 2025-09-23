-- Database Enums and Types
-- Custom data types and enums for the Buffr Host system

-- Property types enum
CREATE TYPE property_type_enum AS ENUM (
    'restaurant',
    'hotel', 
    'spa',
    'conference',
    'mixed'
);

-- User roles enum
CREATE TYPE user_role_enum AS ENUM (
    'admin',
    'manager',
    'hospitality_staff',
    'front_desk',
    'housekeeping',
    'kitchen',
    'maintenance',
    'concierge'
);

-- User types enum
CREATE TYPE user_type_enum AS ENUM (
    'individual',
    'corporate',
    'event_planner',
    'travel_agent',
    'staff',
    'admin'
);

-- Order status enum
CREATE TYPE order_status_enum AS ENUM (
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'refunded'
);

-- Payment status enum
CREATE TYPE payment_status_enum AS ENUM (
    'pending',
    'processing',
    'paid',
    'failed',
    'refunded',
    'partial'
);

-- Payment method enum
CREATE TYPE payment_method_enum AS ENUM (
    'credit_card',
    'debit_card',
    'cash',
    'bank_transfer',
    'loyalty_points',
    'gift_card',
    'mobile_payment'
);

-- Service types enum
CREATE TYPE service_type_enum AS ENUM (
    'restaurant',
    'hotel',
    'spa',
    'conference',
    'transportation',
    'recreation',
    'specialized'
);

-- Room status enum
CREATE TYPE room_status_enum AS ENUM (
    'available',
    'occupied',
    'maintenance',
    'cleaning',
    'out_of_order'
);

-- Reservation status enum
CREATE TYPE reservation_status_enum AS ENUM (
    'pending',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled',
    'no_show'
);

-- Staff employment type enum
CREATE TYPE employment_type_enum AS ENUM (
    'full_time',
    'part_time',
    'contract',
    'temporary',
    'intern'
);

-- Staff employment status enum
CREATE TYPE employment_status_enum AS ENUM (
    'active',
    'inactive',
    'terminated',
    'on_leave',
    'suspended'
);

-- Staff attendance status enum
CREATE TYPE attendance_status_enum AS ENUM (
    'present',
    'absent',
    'late',
    'early_departure',
    'sick_leave',
    'vacation'
);

-- Task priority enum
CREATE TYPE task_priority_enum AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);

-- Task status enum
CREATE TYPE task_status_enum AS ENUM (
    'assigned',
    'in_progress',
    'completed',
    'cancelled',
    'overdue'
);

-- Communication type enum
CREATE TYPE communication_type_enum AS ENUM (
    'message',
    'announcement',
    'alert',
    'reminder',
    'notification'
);

-- Communication priority enum
CREATE TYPE communication_priority_enum AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);

-- Leave type enum
CREATE TYPE leave_type_enum AS ENUM (
    'vacation',
    'sick_leave',
    'personal',
    'emergency',
    'maternity',
    'paternity',
    'bereavement'
);

-- Leave status enum
CREATE TYPE leave_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);

-- KYC/KYB status enum
CREATE TYPE kyc_status_enum AS ENUM (
    'pending',
    'verified',
    'rejected',
    'expired',
    'under_review'
);

-- Document type enum
CREATE TYPE document_type_enum AS ENUM (
    'passport',
    'drivers_license',
    'national_id',
    'business_license',
    'tax_certificate',
    'bank_statement',
    'utility_bill'
);

-- Document category enum
CREATE TYPE document_category_enum AS ENUM (
    'kyc',
    'kyb',
    'financial',
    'legal',
    'identity'
);

-- Document verification status enum
CREATE TYPE verification_status_enum AS ENUM (
    'pending',
    'verified',
    'rejected',
    'expired'
);

-- Loyalty tier enum
CREATE TYPE loyalty_tier_enum AS ENUM (
    'bronze',
    'silver',
    'gold',
    'platinum',
    'diamond'
);

-- Loyalty transaction type enum
CREATE TYPE loyalty_transaction_type_enum AS ENUM (
    'earned',
    'redeemed',
    'transferred_in',
    'transferred_out',
    'expired',
    'bonus'
);

-- AI agent type enum
CREATE TYPE ai_agent_type_enum AS ENUM (
    'receptionist',
    'booking_agent',
    'concierge',
    'support',
    'sales',
    'customer_service'
);

-- AI session status enum
CREATE TYPE ai_session_status_enum AS ENUM (
    'active',
    'completed',
    'transferred',
    'escalated',
    'abandoned'
);

-- AI message type enum
CREATE TYPE ai_message_type_enum AS ENUM (
    'user_input',
    'ai_response',
    'system_message',
    'escalation',
    'error'
);

-- AI workflow type enum
CREATE TYPE ai_workflow_type_enum AS ENUM (
    'booking_flow',
    'support_flow',
    'concierge_flow',
    'check_in_flow',
    'check_out_flow',
    'payment_flow'
);

-- AI execution status enum
CREATE TYPE ai_execution_status_enum AS ENUM (
    'running',
    'completed',
    'failed',
    'cancelled',
    'timeout'
);

-- Voice model type enum
CREATE TYPE voice_model_type_enum AS ENUM (
    'tts',
    'stt',
    'conversation'
);

-- Voice interaction type enum
CREATE TYPE voice_interaction_type_enum AS ENUM (
    'tts',
    'stt',
    'conversation',
    'translation'
);

-- Audio file purpose enum
CREATE TYPE audio_purpose_enum AS ENUM (
    'tts_output',
    'stt_input',
    'background_music',
    'notification',
    'announcement',
    'training'
);

-- Booking status enum
CREATE TYPE booking_status_enum AS ENUM (
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'no_show'
);

-- Corporate booking type enum
CREATE TYPE corporate_booking_type_enum AS ENUM (
    'conference',
    'group_accommodation',
    'event',
    'corporate_retreat',
    'training',
    'meeting'
);

-- Quotation status enum
CREATE TYPE quotation_status_enum AS ENUM (
    'draft',
    'sent',
    'accepted',
    'rejected',
    'expired'
);

-- Invoice status enum
CREATE TYPE invoice_status_enum AS ENUM (
    'draft',
    'sent',
    'paid',
    'overdue',
    'cancelled',
    'partial'
);

-- Room service status enum
CREATE TYPE room_service_status_enum AS ENUM (
    'pending',
    'preparing',
    'delivered',
    'completed',
    'cancelled'
);

-- Spa service category enum
CREATE TYPE spa_service_category_enum AS ENUM (
    'massage',
    'facial',
    'body_treatment',
    'wellness',
    'beauty',
    'therapy'
);

-- Transportation service type enum
CREATE TYPE transportation_service_type_enum AS ENUM (
    'shuttle',
    'valet',
    'tour',
    'airport_transfer',
    'city_tour',
    'private_transfer'
);

-- Recreation service type enum
CREATE TYPE recreation_service_type_enum AS ENUM (
    'golf',
    'tennis',
    'swimming',
    'fitness',
    'sports',
    'activities',
    'entertainment'
);

-- Specialized service type enum
CREATE TYPE specialized_service_type_enum AS ENUM (
    'camping',
    'laundry',
    'concierge',
    'gift_shop',
    'business_center',
    'valet',
    'cleaning'
);

-- Room type class enum
CREATE TYPE room_type_class_enum AS ENUM (
    'economy',
    'standard',
    'deluxe',
    'premium',
    'luxury',
    'suite'
);

-- Room rate type enum
CREATE TYPE room_rate_type_enum AS ENUM (
    'standard',
    'weekend',
    'holiday',
    'corporate',
    'group',
    'advance_purchase',
    'dynamic'
);

-- Shift type enum
CREATE TYPE shift_type_enum AS ENUM (
    'regular',
    'overtime',
    'holiday',
    'on_call',
    'night',
    'weekend'
);

-- Schedule status enum
CREATE TYPE schedule_status_enum AS ENUM (
    'scheduled',
    'confirmed',
    'completed',
    'cancelled',
    'no_show',
    'modified'
);

-- Performance rating enum (1-5 scale)
CREATE TYPE performance_rating_enum AS ENUM (
    '1',
    '2', 
    '3',
    '4',
    '5'
);

-- Business type enum
CREATE TYPE business_type_enum AS ENUM (
    'corporation',
    'llc',
    'partnership',
    'sole_proprietorship',
    'non_profit',
    'government'
);

-- Company size enum
CREATE TYPE company_size_enum AS ENUM (
    'small',
    'medium',
    'large',
    'enterprise'
);

-- Industry enum
CREATE TYPE industry_enum AS ENUM (
    'technology',
    'finance',
    'healthcare',
    'education',
    'government',
    'non_profit',
    'retail',
    'manufacturing',
    'hospitality',
    'other'
);
