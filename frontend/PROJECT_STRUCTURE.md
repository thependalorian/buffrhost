# BUFFR HOST FRONTEND PROJECT STRUCTURE

_Multi-tenant hospitality platform with enterprise-grade security and Vercel deployment._

---

## 1. Directory Structure

```
frontend/
├── app/ # Next.js 14 App Router
│   ├── about/
│   │   └── page.tsx # Page: About, Components: Navigation, Footer, PageHero
│   ├── admin-dashboard/
│   │   └── page.tsx # Page: AdminDashboard, Components: BuffrHostAdminDashboard, DB: properties, users, bookings, orders
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts # DB: users, tenants
│   │   │   ├── register/
│   │   │   │   └── route.ts # DB: users, tenants
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   ├── me/
│   │   │   │   └── route.ts # DB: users
│   │   │   ├── forgot-password/
│   │   │   │   └── route.ts
│   │   │   ├── reset-password/
│   │   │   │   └── route.ts
│   │   │   └── validate-reset-token/
│   │   │       └── route.ts
│   │   ├── hotels/
│   │   │   ├── [id]/
│   │   │   │   ├── rooms/
│   │   │   │   │   ├── [roomId]/
│   │   │   │   │   │   └── route.ts # DB: room_types, room_images
│   │   │   │   │   └── route.ts # DB: room_types
│   │   │   │   └── route.ts # DB: properties, hotel_details, room_types, property_images, property_features
│   │   │   └── route.ts # DB: properties
│   │   ├── inquiries/
│   │   │   └── route.ts # DB: waitlist_entries
│   │   ├── locations/
│   │   │   ├── business/
│   │   │   │   └── route.ts
│   │   │   ├── regions/
│   │   │   │   └── route.ts
│   │   │   ├── route.ts
│   │   │   └── tourist/
│   │   │       └── route.ts
│   │   ├── properties/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts # DB: properties, hotel_details, restaurant_details
│   │   │   └── route.ts # DB: properties
│   │   ├── recommendations/
│   │   │   └── route.ts # DB: recommendations
│   │   ├── restaurants/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts # DB: properties, restaurant_details, menu_items
│   │   │   └── route.ts # DB: properties
│   │   ├── reviews/
│   │   │   └── route.ts # DB: guest_feedback
│   │   ├── rooms/
│   │   │   └── [id]/
│   │   │       └── route.ts # DB: room_types, room_images, room_availability
│   │   ├── waitlist/
│   │   │   └── route.ts # DB: waitlist_entries
│   │   └── webhooks/
│   │       └── google-drive-kyc/
│   │           └── route.ts # DB: kyc_documents
│   ├── auth/
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   ├── bookings/
│   │   ├── [id]/
│   │   │   └── page.tsx # Page: BookingDetails, Components: BookingHeader, GuestInfo, PropertyDetails, PaymentInfo, DB: bookings
│   │   ├── calendar/
│   │   │   └── page.tsx # NOTE: Empty directory
│   │   └── reservations/
│   │       └── page.tsx # NOTE: Empty directory
│   ├── contact/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx # Page: Dashboard, Components: WelcomeSection, StatsCards, RecentActivity, QuickActions, NotificationsWidget, DB: analytics_events
│   ├── guest/
│   │   └── page.tsx
│   ├── hotels/
│   │   ├── [id]/
│   │   │   ├── page.tsx # Page: HotelDashboard, Components: HotelDashboardPage, DB: properties, bookings, hotel_details
│   │   │   ├── restaurants/[restaurantId]/
│   │   │   │   └── page.tsx
│   │   │   ├── rooms/[roomId]/
│   │   │   │   └── page.tsx
│   │   │   └── spa/
│   │   │       └── page.tsx
│   │   └── page.tsx # Page: Hotels, Components: Navigation, Footer, PropertySearchHero, PropertyFilters, PropertyGrid, DB: properties
│   ├── layout.tsx
│   ├── page.tsx # Page: Home, Components: Navigation, HeroSection, AIConciergeShowcase, HotelTypes, RestaurantTypes, PlatformOverview, PricingSection, Footer, SmartWaitlist, BottomCTA
│   ├── pricing/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   ├── property/[propertyId]/
│   │   └── page.tsx
│   ├── property-dashboard/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── property-owner/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── restaurants/
│   │   ├── [id]/
│   │   │   └── page.tsx # Page: RestaurantDashboard, Components: RestaurantDashboardPage, DB: properties, orders, menu_items
│   │   └── page.tsx # Page: Restaurants, Components: Navigation, Footer, PropertySearchHero, PropertyFilters, PropertyGrid, DB: properties
│   ├── rooms/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── user/
│       └── profile/
│           └── page.tsx
├── components/ # Reusable components
│   ├── ui/ # Base UI components (buttons, cards, forms, etc.)
│   ├── features/ # Feature-specific components (booking, auth, etc.)
│   ├── landing/ # Components for the landing page
│   └── layout/ # Layout components (Header, Footer, etc.)
├── hooks/ # Custom React hooks
├── lib/ # Core services and utilities
│   ├── api/ # API client and functions
│   ├── auth/ # Authentication services
│   ├── database/ # Database utilities
│   ├── services/ # Business logic services
│   └── types/ # TypeScript types
└── ...
```

---

## 2. Database Schema & Relationships

### 2.1. Core Business Tables

| **Table**       | **Key Columns**                                                                                                                                                                                                                                                                                                                 | **Relationships**                                         | **Purpose**                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------- |
| `properties`    | id, buffr_id, name, type, location, owner_id, tenant_id, status, description, address, phone, email, website, rating, total_orders, total_revenue, created_at, updated_at, slug, contact_email, contact_phone, is_active, is_featured, is_verified, price_range, total_reviews, images, amenities, social_media                 | `users` (owner_id), `tenants` (tenant_id)                 | Main business entities (hotels/restaurants) |
| `bookings`      | id, property_id, customer_id, booking_type, reference_id, check_in_date, check_out_date, booking_date, booking_time, party_size, status, total_amount, special_requests, created_at, updated_at, guest_name, guest_email, guest_phone, check_in, check_out, service_date, service_time, paid_amount, confirmation_number, notes | `properties` (property_id), `crm_customers` (customer_id) | Reservation system for accommodations       |
| `orders`        | id, order_number, property_id, customer_id, order_type, table_number, items, subtotal, tax, tip, total_amount, status, special_instructions, estimated_preparation_time, created_at, updated_at                                                                                                                                 | `properties` (property_id), `crm_customers` (customer_id) | Restaurant order management                 |
| `crm_customers` | id, tenant_id, first_name, last_name, email, phone, date_of_birth, nationality, passport_number, address, city, country, postal_code, preferred_language, vip_status, total_bookings, total_spent, last_booking_date, loyalty_points, marketing_consent, created_at, updated_at                                                 | `tenants` (tenant_id)                                     | Customer relationship management            |

### 2.2. Property Management Tables

| **Table**            | **Key Columns**                                                                                                                                                                                                         | **Relationships**              | **Purpose**                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------- |
| `hotel_details`      | id, property_id, star_rating, check_in_time, check_out_time, total_rooms, available_rooms, room_types, amenities, policies, created_at, updated_at, room_types_count                                                    | `properties` (property_id)     | Hotel-specific information and settings      |
| `restaurant_details` | id, property_id, cuisine_type, price_range, opening_hours, delivery_available, takeaway_available, dine_in_available, max_capacity, average_prep_time, special_dietary_options, payment_methods, created_at, updated_at | `properties` (property_id)     | Restaurant-specific information and settings |
| `room_types`         | id, property_id, type_name, description, max_occupancy, base_price, size_sqm, bed_type, amenities, is_active, created_at, updated_at                                                                                    | `properties` (property_id)     | Hotel room categories and configurations     |
| `room_availability`  | id, room_type_id, date, available_rooms, price, is_available, created_at, updated_at                                                                                                                                    | `room_types` (room_type_id)    | Dynamic room availability and pricing        |
| `room_images`        | id, room_type_id, image_url, alt_text, sort_order, is_active, created_at                                                                                                                                                | `room_types` (room_type_id)    | Room type photo gallery                      |
| `menu_items`         | id, property_id, name, description, price, category, is_available, is_popular, dietary_info, created_at, updated_at                                                                                                     | `properties` (property_id)     | Restaurant menu item catalog                 |
| `restaurant_tables`  | id, property_id, table_number, capacity, location, status, floor_plan_data, is_active, created_at, updated_at                                                                                                           | `properties` (property_id)     | Restaurant table management                  |
| `table_reservations` | id, table_id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, party_size, status, special_requests, created_at, updated_at                                                           | `restaurant_tables` (table_id) | Table reservation system                     |
| `property_features`  | id, property_id, feature_name, feature_value, is_active, created_at, updated_at                                                                                                                                         | `properties` (property_id)     | Dynamic property feature flags               |
| `property_images`    | id, property_id, image_url, alt_text, sort_order, is_active, created_at, updated_at                                                                                                                                     | `properties` (property_id)     | Property photo gallery                       |

### 2.3. Staff Management Tables

| **Table**           | **Key Columns**                                                                                                                                                                                                                    | **Relationships**                                                                                                                                  | **Purpose**                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `staff`             | id, user_id, property_id, tenant_id, employee_id, position, department, hire_date, salary, status, shift_type, manager_id, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, created_at, updated_at | `users` (user_id), `properties` (property_id), `tenants` (tenant_id), `users` (manager_id)                                                         | Staff member profiles and employment details |
| `staff_activities`  | id, staff_id, tenant_id, activity_type, activity_description, property_id, customer_id, booking_id, order_id, duration_minutes, status, notes, created_at, updated_at                                                              | `staff` (staff_id), `tenants` (tenant_id), `properties` (property_id), `crm_customers` (customer_id), `bookings` (booking_id), `orders` (order_id) | Staff activity tracking and time management  |
| `staff_performance` | id, staff_id, tenant_id, property_id, metric_name, metric_value, metric_unit, target_value, performance_period_start, performance_period_end, trend, notes, created_at, updated_at                                                 | `staff` (staff_id), `tenants` (tenant_id), `properties` (property_id)                                                                              | Staff performance metrics and KPIs           |
| `staff_schedules`   | id, staff_id, tenant_id, property_id, shift_date, start_time, end_time, break_duration_minutes, shift_type, status, notes, created_at, updated_at                                                                                  | `staff` (staff_id), `tenants` (tenant_id), `properties` (property_id)                                                                              | Staff shift scheduling and availability      |

### 2.4. AI & Communication Tables

| **Table**              | **Key Columns**                                                                                                                                                                                                                                                              | **Relationships**                                                            | **Purpose**                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| `sofia_agents`         | id, property_id, tenant_id, name, personality, configuration, status, is_active, created_at, updated_at                                                                                                                                                                      | `properties` (property_id), `tenants` (tenant_id)                            | AI agent configurations and personalities  |
| `sofia_capabilities`   | id, tenant_id, property_id, tts_enabled, sms_enabled, voice_enabled, chat_enabled, analytics_enabled, vision_enabled, african_voice_enabled, deepseek_vision_enabled, default_language, supported_languages, voice_profile, cultural_context_enabled, created_at, updated_at | `tenants` (tenant_id), `properties` (property_id)                            | AI feature toggles and capability settings |
| `sofia_conversations`  | id, agent_id, property_id, tenant_id, customer_id, customer_email, customer_name, conversation_type, status, context, metadata, created_at, updated_at                                                                                                                       | `sofia_agents` (agent_id), `properties` (property_id), `tenants` (tenant_id) | AI chat conversation management            |
| `sofia_messages`       | id, conversation_id, sender_type, message_type, content, intent, confidence, context, metadata, created_at                                                                                                                                                                   | `sofia_conversations` (conversation_id)                                      | Individual messages in AI conversations    |
| `sofia_memories`       | id, agent_id, property_id, tenant_id, memory_type, content, importance, access_count, last_accessed, metadata, created_at, updated_at                                                                                                                                        | `sofia_agents` (agent_id), `properties` (property_id), `tenants` (tenant_id) | AI learning and memory retention           |
| `sofia_analytics`      | id, agent_id, property_id, tenant_id, metric_type, metric_value, metric_unit, dimensions, metadata, recorded_at                                                                                                                                                              | `sofia_agents` (agent_id), `properties` (property_id), `tenants` (tenant_id) | AI performance and usage analytics         |
| `sofia_communications` | id, agent_id, property_id, tenant_id, communication_type, recipient_email, recipient_phone, subject, content, status, external_id, metadata, sent_at, created_at                                                                                                             | `sofia_agents` (agent_id), `properties` (property_id), `tenants` (tenant_id) | AI-generated communications and messaging  |
| `sofia_config`         | id, tenant_id, config_key, config_value, config_type, category, description, is_encrypted, is_active, created_at, updated_at                                                                                                                                                 | `tenants` (tenant_id)                                                        | AI system configuration settings           |
| `sofia_voice_profiles` | id, profile_name, display_name, context, voice_name, style, tone, pace, accent, cultural_markers, namibian_optimized, is_default, created_at, updated_at                                                                                                                     |                                                                              | AI voice profile configurations            |

### 2.5. Analytics & Reporting Tables

| **Table**               | **Key Columns**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | **Relationships**                                                    | **Purpose**                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| `revenue_analytics`     | id, property_id, tenant_id, period_type, period_start, period_end, total_revenue, booking_revenue, order_revenue, service_revenue, other_revenue, total_transactions, booking_count, order_count, service_count, average_transaction_value, average_booking_value, average_order_value, revenue_growth_percentage, transaction_growth_percentage, previous_period_revenue, previous_period_transactions, data_source, last_calculated_at, created_at, updated_at, total_bookings, total_orders, occupancy_rate, revenue, expenses, profit | `properties` (property_id), `tenants` (tenant_id)                    | Financial reporting and revenue analytics       |
| `analytics_events`      | id, tenant_id, property_id, user_id, event_type, event_category, event_action, event_label, event_value, page_path, referrer, user_agent, ip_address, session_id, metadata, created_at                                                                                                                                                                                                                                                                                                                                                    | `tenants` (tenant_id), `properties` (property_id), `users` (user_id) | User behavior tracking and analytics events     |
| `waitlist_analytics`    | id, tenant_id, date, new_signups, emails_sent, emails_opened, emails_clicked, demos_scheduled, trials_started, conversions, sofia_emails_generated, sofia_avg_confidence, sofia_response_rate, created_at, updated_at                                                                                                                                                                                                                                                                                                                     | `tenants` (tenant_id)                                                | Lead generation and marketing analytics         |
| `voice_usage_analytics` | id, tenant_id, property_id, user_id, language_code, voice_profile, context, text_length, audio_duration_seconds, audio_size_bytes, processing_time_ms, quality_score, cultural_markers_used, namibian_optimization_used, success, error_message, created_at                                                                                                                                                                                                                                                                               | `tenants` (tenant_id), `properties` (property_id), `users` (user_id) | Voice AI usage tracking and performance metrics |

### 2.6. Lead Management & Communication Tables

| **Table**                 | **Key Columns**                                                                                                                                                                                                                                                                                                                                       | **Relationships**                                             | **Purpose**                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------- |
| `waitlist_entries`        | id, tenant_id, name, email, business_type, property_count, current_solution, challenges, timeline, lead_score, status, priority, sofia_analysis, sofia_recommendations, sofia_confidence, last_contacted_at, contact_count, response_rate, source, utm_source, utm_medium, utm_campaign, referrer_url, user_agent, ip_address, created_at, updated_at | `tenants` (tenant_id)                                         | Lead capture and qualification system        |
| `waitlist_communications` | id, waitlist_entry_id, tenant_id, type, direction, subject, content, sofia_generated, sofia_prompt, sofia_response, sofia_confidence, email_template_id, email_status, email_provider, email_provider_id, opened_at, clicked_at, replied_at, response_content, metadata, created_at, sent_at, delivered_at                                            | `waitlist_entries` (waitlist_entry_id), `tenants` (tenant_id) | Automated lead communication tracking        |
| `waitlist_templates`      | id, tenant_id, name, type, subject, content, sofia_prompt, sofia_enabled, sofia_personality, trigger_conditions, delay_hours, priority, active, version, created_at, updated_at                                                                                                                                                                       | `tenants` (tenant_id)                                         | Email template management for lead nurturing |
| `notifications`           | id, user_id, tenant_id, type, title, message, data, is_read, read_at, priority, expires_at, created_at, updated_at                                                                                                                                                                                                                                    | `users` (user_id), `tenants` (tenant_id)                      | In-app notification system                   |

### 2.7. User Management & Authentication Tables

| **Table**          | **Key Columns**                                                                                                                                      | **Relationships**                                                    | **Purpose**                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------- |
| `users`            | id, email, password_hash, full_name, phone, role, tenant_id, is_active, email_verified, last_login, login_count, created_at, updated_at, is_verified | `tenants` (tenant_id)                                                | Core user accounts and authentication |
| `tenants`          | id, name, domain, is_active, created_at, updated_at, slug, settings                                                                                  |                                                                      | Multi-tenant organization management  |
| `user_preferences` | id, user_id, preference_type, preference_value, created_at, updated_at                                                                               | `users` (user_id)                                                    | User personalization settings         |
| `users_extended`   | id, payload_id, tenant_id, role, buffr_id, is_verified, last_login, preferences, created_at, updated_at                                              | `tenants` (tenant_id)                                                | Extended user profile information     |
| `workflow_states`  | id, workflow_id, user_id, property_id, tenant_id, state_name, state_data, is_active, created_at, updated_at                                          | `users` (user_id), `properties` (property_id), `tenants` (tenant_id) | Workflow and state management         |

### 2.8. KYC & Document Management Tables

| Table                    | Columns                                                                                                                                                                                                                     | Relationships                                                   |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| `kyc_documents`          | id, user_id, tenant_id, document_type, document_number, issuing_country, issue_date, expiry_date, document_url, verification_status, verification_notes, verified_by, verified_at, rejection_reason, created_at, updated_at | `users` (user_id), `tenants` (tenant_id), `users` (verified_by) |
| `kyc_kyb_results`        | id, tenant_id, property_id, verification_type, provider, request_id, status, risk_score, risk_level, flags, recommendations, raw_response, processed_at, created_at, updated_at                                             | `tenants` (tenant_id), `properties` (property_id)               |
| `document_analysis_logs` | id, document_id, analysis_type, provider, confidence_score, extracted_data, raw_response, error_message, processed_at, created_at, updated_at                                                                               | `kyc_documents` (document_id)                                   |

### 2.9. Voice & Training Tables

| Table                 | Columns                                                                                                                                                                                                                  | Relationships                                                                                                               |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `voice_training_data` | id, language_code, text_content, audio_url, speaker_id, duration_seconds, sample_rate, bit_depth, transcription, quality_score, cultural_context, voice_profile, is_namibian_specific, collected_at, metadata, embedding |                                                                                                                             |
| `sofia_interactions`  | id, customer_id, property_id, interaction_type, message, response, sentiment, resolved, created_at, updated_at                                                                                                           | `crm_customers` (customer_id), `properties` (property_id)                                                                   |
| `conversations`       | id, tenant_id, property_id, customer_id, agent_id, channel, status, priority, assigned_to, last_message_at, resolved_at, satisfaction_rating, tags, metadata, created_at, updated_at                                     | `tenants` (tenant_id), `properties` (property_id), `crm_customers` (customer_id), `users` (agent_id), `users` (assigned_to) |

### 2.10. Financial & Payment Tables

| Table               | Columns                                                                                                                                                            | Relationships                                                                                                                     |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| `financial_records` | id, tenant_id, property_id, transaction_type, amount, currency, description, reference_id, payment_method, status, processed_at, created_at, updated_at            | `tenants` (tenant_id), `properties` (property_id)                                                                                 |
| `guest_feedback`    | id, booking_id, property_id, customer_id, tenant_id, rating, review_text, categories, is_public, response_text, responded_by, responded_at, created_at, updated_at | `bookings` (booking_id), `properties` (property_id), `crm_customers` (customer_id), `tenants` (tenant_id), `users` (responded_by) |
| `recommendations`   | id, tenant_id, property_id, customer_id, recommendation_type, content, confidence_score, status, applied_at, created_at, updated_at                                | `tenants` (tenant_id), `properties` (property_id), `crm_customers` (customer_id)                                                  |

### 2.11. Views & Analytics Views

| Table                          | Columns                                                                                                                                                                                                                         | Relationships              |
| :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------- |
| `restaurant_table_utilization` | property_id, property_name, total_tables, available_tables, occupied_tables, total_reservations, confirmed_reservations                                                                                                         | `properties` (property_id) |
| `revenue_analytics_camelcase`  | id, tenantid, propertyid, periodtype, periodstart, periodend, totalrevenue, bookingrevenue, orderrevenue, otherrevenue, totalbookings, totalorders, averagebookingvalue, averageordervalue, occupancyrate, createdat, updatedat |                            |
| `sofia_agents_camel`           | id, name, status, personality, configuration, isactive, tenantid, propertyid, createdat, updatedat                                                                                                                              |                            |
| `sofia_conversations_camel`    | id, agentid, customername, customeremail, conversationtype, status, context, metadata, tenantid, propertyid, createdat, updatedat                                                                                               |                            |
| `sofia_memories_camel`         | id, agentid, content, memorytype, importance, metadata, accesscount, lastaccessed, createdat, updatedat                                                                                                                         |                            |
| `sofia_messages_camel`         | id, conversationid, content, sendertype, messagetype, intent, confidence, context, metadata, createdat                                                                                                                          |                            |
| `sofia_voice_profiles_active`  | profile_name, display_name, context, voice_name, style, tone, pace, accent, namibian_optimized, is_default                                                                                                                      |                            |
| `sofia_african_languages`      | language_code, language_name, native_name, region, priority, cultural_greeting, is_namibian_optimized, is_active                                                                                                                |                            |
| `staff_camel`                  | id, userid, tenantid, propertyid, employeeid, position, department, hiredate, salary, shifttype, status, managerid, emergencycontactname, emergencycontactphone, emergencycontactrelationship, createdat, updatedat             |                            |
| `tenant_user_summary`          | tenant_id, total_users, admin_count, property_owner_count, customer_count, active_users                                                                                                                                         | `tenants` (tenant_id)      |
| `user_roles_summary`           | role, user_count, active_users, verified_users, recent_users                                                                                                                                                                    |                            |
| `users_camel`                  | id, email, passwordhash, fullname, phone, role, tenantid, isactive, emailverified, lastlogin, logincount, createdat, updatedat, isverified                                                                                      |                            |

---

## 3. Architecture & Mappings

### 3.1. API Route to Database Mapping

| API Route                             | Database Table(s)                                                                   | Status      |
| :------------------------------------ | :---------------------------------------------------------------------------------- | :---------- |
| `app/api/auth/login/`                 | `users`, `tenants`                                                                  | ✅ Existing |
| `app/api/auth/register/`              | `users`, `tenants`                                                                  | ✅ Existing |
| `app/api/auth/logout/`                | `users`                                                                             | ✅ Existing |
| `app/api/auth/me/`                    | `users`                                                                             | ✅ Existing |
| `app/api/auth/forgot-password/`       | `users`                                                                             | ✅ Existing |
| `app/api/auth/reset-password/`        | `users`                                                                             | ✅ Existing |
| `app/api/auth/validate-reset-token/`  | `users`                                                                             | ✅ Existing |
| `app/api/hotels/[id]/`                | `properties`, `hotel_details`, `room_types`, `property_images`, `property_features` | ✅ Existing |
| `app/api/hotels/[id]/rooms/`          | `room_types`                                                                        | ✅ Existing |
| `app/api/hotels/[id]/rooms/[roomId]/` | `room_types`, `room_images`                                                         | ✅ Existing |
| `app/api/inquiries/`                  | `waitlist_entries`                                                                  | ✅ Existing |
| `app/api/locations/business/`         | `properties`                                                                        | ✅ Existing |
| `app/api/locations/regions/`          | `properties`                                                                        | ✅ Existing |
| `app/api/locations/tourist/`          | `properties`                                                                        | ✅ Existing |
| `app/api/properties/[id]/`            | `properties`, `hotel_details`, `restaurant_details`                                 | ✅ Existing |
| `app/api/recommendations/`            | `recommendations`                                                                   | ✅ Existing |
| `app/api/restaurants/[id]/`           | `properties`, `restaurant_details`, `menu_items`                                    | ✅ Existing |
| `app/api/reviews/`                    | `guest_feedback`                                                                    | ✅ Existing |
| `app/api/rooms/[id]/`                 | `room_types`, `room_images`, `room_availability`                                    | ✅ Existing |
| `app/api/waitlist/`                   | `waitlist_entries`                                                                  | ✅ Existing |
| `app/api/webhooks/google-drive-kyc/`  | `kyc_documents`, `kyc_kyb_results`, `document_analysis_logs`                        | ✅ Existing |
| **Missing API Endpoints**             |                                                                                     |             |
| `app/api/staff/`                      | `staff`, `staff_activities`, `staff_performance`, `staff_schedules`                 | ❌ Missing  |
| `app/api/crm/customers/`              | `crm_customers`                                                                     | ❌ Missing  |
| `app/api/sofia/agents/`               | `sofia_agents`, `sofia_capabilities`, `sofia_config`                                | ❌ Missing  |
| `app/api/sofia/conversations/`        | `sofia_conversations`, `sofia_messages`                                             | ❌ Missing  |
| `app/api/sofia/memories/`             | `sofia_memories`                                                                    | ❌ Missing  |
| `app/api/sofia/analytics/`            | `sofia_analytics`                                                                   | ❌ Missing  |
| `app/api/sofia/communications/`       | `sofia_communications`                                                              | ❌ Missing  |
| `app/api/sofia/voice/`                | `sofia_voice_profiles`, `voice_training_data`, `voice_usage_analytics`              | ❌ Missing  |
| `app/api/analytics/revenue/`          | `revenue_analytics`                                                                 | ❌ Missing  |
| `app/api/analytics/events/`           | `analytics_events`                                                                  | ❌ Missing  |
| `app/api/analytics/waitlist/`         | `waitlist_analytics`                                                                | ❌ Missing  |
| `app/api/analytics/voice/`            | `voice_usage_analytics`                                                             | ❌ Missing  |
| `app/api/waitlist/communications/`    | `waitlist_communications`                                                           | ❌ Missing  |
| `app/api/waitlist/templates/`         | `waitlist_templates`                                                                | ❌ Missing  |
| `app/api/notifications/`              | `notifications`                                                                     | ❌ Missing  |
| `app/api/kyc/documents/`              | `kyc_documents`, `document_analysis_logs`                                           | ❌ Missing  |
| `app/api/kyc/kyb/`                    | `kyc_kyb_results`                                                                   | ❌ Missing  |
| `app/api/financial/`                  | `financial_records`                                                                 | ❌ Missing  |
| `app/api/table-reservations/`         | `table_reservations`, `restaurant_tables`                                           | ❌ Missing  |
| `app/api/property-features/`          | `property_features`                                                                 | ❌ Missing  |
| `app/api/property-images/`            | `property_images`                                                                   | ❌ Missing  |
| `app/api/user/preferences/`           | `user_preferences`                                                                  | ❌ Missing  |
| `app/api/workflows/`                  | `workflow_states`                                                                   | ❌ Missing  |

### 3.2. Services to Database Tables Mapping

| Service               | Database Table(s)                                                                                                                                                                        | Status                 |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- |
| `authService`         | `users`, `tenants`, `user_preferences`                                                                                                                                                   | ✅ Existing            |
| `propertyService`     | `properties`, `hotel_details`, `restaurant_details`, `room_types`, `property_features`, `property_images`, `room_availability`, `room_images`, `restaurant_tables`, `table_reservations` | ✅ Existing + Enhanced |
| `bookingService`      | `bookings`, `crm_customers`, `room_types`, `restaurant_tables`                                                                                                                           | ✅ Existing            |
| `restaurantService`   | `properties`, `restaurant_details`, `menu_items`, `orders`, `restaurant_tables`, `table_reservations`                                                                                    | ✅ Existing + Enhanced |
| `analyticsService`    | `analytics_events`, `revenue_analytics`, `waitlist_analytics`, `voice_usage_analytics`                                                                                                   | ✅ Existing + Enhanced |
| `paymentService`      | `financial_records`                                                                                                                                                                      | ✅ Existing            |
| `notificationService` | `notifications`                                                                                                                                                                          | ✅ Existing            |
| `waitlistService`     | `waitlist_entries`, `waitlist_communications`, `waitlist_templates`, `waitlist_analytics`                                                                                                | ✅ Existing + Enhanced |
| `aiService`           | `conversations`, `recommendations`, `sofia_agents`, `sofia_conversations`, `sofia_messages`, `sofia_memories`, `sofia_analytics`, `sofia_communications`                                 | ✅ Existing + Enhanced |
| `userService`         | `users`, `user_preferences`, `users_extended`, `workflow_states`                                                                                                                         | ✅ Existing + Enhanced |
| **Missing Services**  |                                                                                                                                                                                          |                        |
| `staffService`        | `staff`, `staff_activities`, `staff_performance`, `staff_schedules`                                                                                                                      | ❌ Missing             |
| `crmService`          | `crm_customers`, `guest_feedback`                                                                                                                                                        | ❌ Missing             |
| `sofiaService`        | `sofia_agents`, `sofia_capabilities`, `sofia_config`, `sofia_voice_profiles`                                                                                                             | ❌ Missing             |
| `voiceService`        | `voice_training_data`, `voice_usage_analytics`                                                                                                                                           | ❌ Missing             |
| `kycService`          | `kyc_documents`, `kyc_kyb_results`, `document_analysis_logs`                                                                                                                             | ❌ Missing             |
| `financialService`    | `financial_records`, `revenue_analytics`                                                                                                                                                 | ❌ Missing             |

### 3.3. Pages to Components, Hooks, and Services Mapping

| Page                                   | Components                                                                                                                                                        | Hooks                   | Services                               | Database Tables                                                        |
| :------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------- | :------------------------------------- | :--------------------------------------------------------------------- |
| `app/page.tsx`                         | `Navigation`, `HeroSection`, `AIConciergeShowcase`, `HotelTypes`, `RestaurantTypes`, `PlatformOverview`, `PricingSection`, `Footer`, `SmartWaitlist`, `BottomCTA` | `useState`              |                                        | `properties`                                                           |
| `app/dashboard/page.tsx`               | `WelcomeSection`, `StatsCards`, `RecentActivity`, `QuickActions`, `NotificationsWidget`                                                                           | `useState`, `useEffect` | `analyticsService`, `bookingService`   | `analytics_events`, `bookings`, `revenue_analytics`                    |
| `app/hotels/[id]/page.tsx`             | `PropertyHeroLayout`, `PropertyDetailLayout`, `BookingForm`                                                                                                       | `useProperties`         | `propertyService`                      | `properties`, `hotel_details`, `room_types`, `property_images`         |
| `app/restaurants/[id]/page.tsx`        | `PropertyHeroLayout`, `PropertyDetailLayout`, `MenuPreview`                                                                                                       | `useProperties`         | `propertyService`, `restaurantService` | `properties`, `restaurant_details`, `menu_items`, `restaurant_tables`  |
| `app/bookings/[id]/page.tsx`           | `BookingConfirmation`                                                                                                                                             | `useBooking`            | `bookingService`                       | `bookings`                                                             |
| **Existing Pages - Enhanced**          |                                                                                                                                                                   |                         |                                        |                                                                        |
| `app/admin-dashboard/page.tsx`         | `BuffrHostAdminDashboard`                                                                                                                                         | `useState`, `useEffect` | `analyticsService`, `userService`      | `users`, `tenants`, `revenue_analytics`, `analytics_events`            |
| `app/hotels/page.tsx`                  | `Navigation`, `Footer`, `PropertySearchHero`, `PropertyFilters`, `PropertyGrid`                                                                                   | `useProperties`         | `propertyService`                      | `properties`, `hotel_details`                                          |
| `app/restaurants/page.tsx`             | `Navigation`, `Footer`, `PropertySearchHero`, `PropertyFilters`, `PropertyGrid`                                                                                   | `useProperties`         | `propertyService`, `restaurantService` | `properties`, `restaurant_details`                                     |
| `app/property-dashboard/[id]/page.tsx` |                                                                                                                                                                   | `useProperties`         | `propertyService`, `analyticsService`  | `properties`, `revenue_analytics`, `bookings`                          |
| **Missing Pages - Must Create**        |                                                                                                                                                                   |                         |                                        |                                                                        |
| `app/staff/`                           | `StaffManagement`, `StaffList`, `StaffForm`, `StaffSchedule`                                                                                                      | `useStaff`              | `staffService`                         | `staff`, `staff_schedules`, `staff_performance`                        |
| `app/staff/[id]/`                      | `StaffProfile`, `StaffActivities`, `StaffPerformance`, `StaffSchedule`                                                                                            | `useStaff`              | `staffService`                         | `staff`, `staff_activities`, `staff_performance`, `staff_schedules`    |
| `app/crm/`                             | `CustomerList`, `CustomerProfile`, `CustomerFilters`, `CustomerStats`                                                                                             | `useCRM`                | `crmService`                           | `crm_customers`, `bookings`, `orders`                                  |
| `app/crm/customers/[id]/`              | `CustomerDetail`, `BookingHistory`, `OrderHistory`, `CustomerNotes`                                                                                               | `useCRM`                | `crmService`                           | `crm_customers`, `bookings`, `orders`, `guest_feedback`                |
| `app/sofia/agents/`                    | `AgentList`, `AgentForm`, `AgentStatus`, `AgentAnalytics`                                                                                                         | `useSofia`              | `sofiaService`                         | `sofia_agents`, `sofia_capabilities`, `sofia_analytics`                |
| `app/sofia/conversations/`             | `ConversationList`, `ChatInterface`, `ConversationFilters`                                                                                                        | `useSofia`              | `sofiaService`                         | `sofia_conversations`, `sofia_messages`                                |
| `app/sofia/analytics/`                 | `AnalyticsDashboard`, `PerformanceCharts`, `AgentMetrics`                                                                                                         | `useSofia`              | `sofiaService`, `analyticsService`     | `sofia_analytics`, `sofia_conversations`                               |
| `app/sofia/voice/`                     | `VoiceProfiles`, `VoiceTraining`, `VoiceAnalytics`                                                                                                                | `useVoice`              | `voiceService`                         | `sofia_voice_profiles`, `voice_training_data`, `voice_usage_analytics` |
| `app/analytics/`                       | `AnalyticsDashboard`, `RevenueCharts`, `PerformanceMetrics`, `UserAnalytics`                                                                                      | `useAnalytics`          | `analyticsService`                     | `revenue_analytics`, `analytics_events`, `waitlist_analytics`          |
| `app/analytics/revenue/`               | `RevenueDashboard`, `RevenueCharts`, `ProfitLoss`, `GrowthMetrics`                                                                                                | `useAnalytics`          | `analyticsService`                     | `revenue_analytics`                                                    |
| `app/waitlist/`                        | `WaitlistDashboard`, `LeadManagement`, `CommunicationTools`                                                                                                       | `useWaitlist`           | `waitlistService`                      | `waitlist_entries`, `waitlist_analytics`, `waitlist_communications`    |
| `app/kyc/`                             | `KYCDashboard`, `DocumentList`, `VerificationStatus`, `KYBAnalysis`                                                                                               | `useKYC`                | `kycService`                           | `kyc_documents`, `kyc_kyb_results`, `document_analysis_logs`           |
| `app/financial/`                       | `FinancialDashboard`, `TransactionList`, `PaymentProcessing`, `FinancialReports`                                                                                  | `useFinancial`          | `financialService`                     | `financial_records`, `revenue_analytics`                               |
| `app/notifications/`                   | `NotificationCenter`, `NotificationList`, `NotificationSettings`                                                                                                  | `useNotifications`      | `notificationService`                  | `notifications`                                                        |
| `app/table-reservations/`              | `ReservationCalendar`, `TableManagement`, `ReservationForm`                                                                                                       | `useReservations`       | `restaurantService`                    | `table_reservations`, `restaurant_tables`                              |

### 3.4. Types to Database Tables Mapping

| Type                            | Database Table(s)         | Status      |
| :------------------------------ | :------------------------ | :---------- |
| `Property`                      | `properties`              | ✅ Existing |
| `HotelDetails`                  | `hotel_details`           | ✅ Existing |
| `RestaurantDetails`             | `restaurant_details`      | ✅ Existing |
| `Booking`                       | `bookings`                | ✅ Existing |
| `Order`                         | `orders`                  | ✅ Existing |
| `MenuItem`                      | `menu_items`              | ✅ Existing |
| `RoomType`                      | `room_types`              | ✅ Existing |
| `RoomAvailability`              | `room_availability`       | ✅ Existing |
| `User`                          | `users`                   | ✅ Existing |
| `Tenant`                        | `tenants`                 | ✅ Existing |
| **Missing Types - Must Create** |                           |             |
| `Staff`                         | `staff`                   | ❌ Missing  |
| `StaffActivity`                 | `staff_activities`        | ❌ Missing  |
| `StaffPerformance`              | `staff_performance`       | ❌ Missing  |
| `StaffSchedule`                 | `staff_schedules`         | ❌ Missing  |
| `Customer`                      | `crm_customers`           | ❌ Missing  |
| `SofiaAgent`                    | `sofia_agents`            | ❌ Missing  |
| `SofiaCapability`               | `sofia_capabilities`      | ❌ Missing  |
| `SofiaConversation`             | `sofia_conversations`     | ❌ Missing  |
| `SofiaMessage`                  | `sofia_messages`          | ❌ Missing  |
| `SofiaMemory`                   | `sofia_memories`          | ❌ Missing  |
| `SofiaAnalytics`                | `sofia_analytics`         | ❌ Missing  |
| `SofiaCommunication`            | `sofia_communications`    | ❌ Missing  |
| `SofiaConfig`                   | `sofia_config`            | ❌ Missing  |
| `SofiaVoiceProfile`             | `sofia_voice_profiles`    | ❌ Missing  |
| `RevenueAnalytics`              | `revenue_analytics`       | ❌ Missing  |
| `AnalyticsEvent`                | `analytics_events`        | ❌ Missing  |
| `WaitlistEntry`                 | `waitlist_entries`        | ❌ Missing  |
| `WaitlistCommunication`         | `waitlist_communications` | ❌ Missing  |
| `WaitlistTemplate`              | `waitlist_templates`      | ❌ Missing  |
| `WaitlistAnalytics`             | `waitlist_analytics`      | ❌ Missing  |
| `Notification`                  | `notifications`           | ❌ Missing  |
| `KYCDocument`                   | `kyc_documents`           | ❌ Missing  |
| `KYBResult`                     | `kyc_kyb_results`         | ❌ Missing  |
| `DocumentAnalysisLog`           | `document_analysis_logs`  | ❌ Missing  |
| `FinancialRecord`               | `financial_records`       | ❌ Missing  |
| `GuestFeedback`                 | `guest_feedback`          | ❌ Missing  |
| `Recommendation`                | `recommendations`         | ❌ Missing  |
| `VoiceTrainingData`             | `voice_training_data`     | ❌ Missing  |
| `VoiceUsageAnalytics`           | `voice_usage_analytics`   | ❌ Missing  |
| `RestaurantTable`               | `restaurant_tables`       | ❌ Missing  |
| `TableReservation`              | `table_reservations`      | ❌ Missing  |
| `PropertyFeature`               | `property_features`       | ❌ Missing  |
| `PropertyImage`                 | `property_images`         | ❌ Missing  |
| `RoomImage`                     | `room_images`             | ❌ Missing  |
| `UserPreference`                | `user_preferences`        | ❌ Missing  |
| `UsersExtended`                 | `users_extended`          | ❌ Missing  |
| `WorkflowState`                 | `workflow_states`         | ❌ Missing  |
| `SofiaInteraction`              | `sofia_interactions`      | ❌ Missing  |
| `Conversation`                  | `conversations`           | ❌ Missing  |

---

## 4. Multi-Tenant Architecture

### 4.1. ID-Based Security System

```typescript
// Hierarchical ID structure for tenant isolation
interface TenantContext {
  tenantId: string; // Platform-level isolation
  tenantType: 'hotel' | 'restaurant' | 'platform' | 'guest';
  userId: string; // User identification
  role: 'admin' | 'manager' | 'staff' | 'guest' | 'platform_admin';
  permissions: string[]; // Role-based permissions
}

interface BusinessContext extends TenantContext {
  businessId: string; // Hotel/Restaurant level
  businessGroupId?: string; // Hotel chain/restaurant group
  departmentId?: string; // Department level (front desk, kitchen, etc.)
}
```

### 4.2. Security Levels

- **PUBLIC**: Anyone can access (menus, public info)
- **TENANT**: Same tenant only
- **BUSINESS**: Same business only
- **DEPARTMENT**: Same department only
- **USER**: Same user only
- **ADMIN**: Platform admins only

### 4.3. Automatic Query Filtering

```typescript
// Every query automatically includes tenant isolation
const query = createSecureQuery(context, 'BUSINESS');
const result = query.select('bookings', ['id', 'guest_id', 'room_id']);
// Automatically adds: WHERE tenant_id = 'tenant_123' AND business_id = 'business_456'
```

---

## 5. Business Type Structure

### 5.1. Hotels (Accommodation + Services)

- **Primary Services**: Rooms, Bookings, Guest Management
- **Secondary Services**: Restaurants, Spa, Concierge
- **Management**: Revenue, Staff, Analytics
- **Routes**: `/hotels/[id]`, `/business/hotels/[businessId]`

### 5.2. Restaurants (Standalone Food Service)

- **Primary Services**: Menu, Orders, Reservations
- **Management**: Staff, Analytics, Customer Service
- **Routes**: `/restaurants/[id]`, `/business/restaurants/[businessId]`

### 5.3. Cross-Tenant Features

- **Guest Experience**: Unified interface for both business types
- **User Profiles**: Cross-tenant user management
- **Platform Admin**: Multi-tenant oversight

---

## 11. Critical Gaps Analysis

### 11.1. Missing Pages (High Priority)

#### **Staff Management System**

- **Pages to Create:**
  - `app/staff/page.tsx` - Staff management dashboard
  - `app/staff/[id]/page.tsx` - Individual staff profile
  - `app/staff/schedules/page.tsx` - Staff scheduling system
  - `app/staff/performance/page.tsx` - Performance analytics

#### **CRM System**

- **Pages to Create:**
  - `app/crm/page.tsx` - Customer relationship management dashboard
  - `app/crm/customers/[id]/page.tsx` - Customer detail view
  - `app/crm/analytics/page.tsx` - Customer analytics

#### **AI/Sofia Management**

- **Pages to Create:**
  - `app/sofia/agents/page.tsx` - AI agent management
  - `app/sofia/conversations/page.tsx` - Conversation management
  - `app/sofia/analytics/page.tsx` - AI performance analytics
  - `app/sofia/voice/page.tsx` - Voice profile management

#### **Analytics & Reporting**

- **Pages to Create:**
  - `app/analytics/page.tsx` - Main analytics dashboard
  - `app/analytics/revenue/page.tsx` - Revenue analytics
  - `app/analytics/users/page.tsx` - User analytics
  - `app/analytics/operations/page.tsx` - Operational metrics

#### **Financial Management**

- **Pages to Create:**
  - `app/financial/page.tsx` - Financial dashboard
  - `app/financial/transactions/page.tsx` - Transaction management
  - `app/financial/reports/page.tsx` - Financial reports

#### **KYC & Compliance**

- **Pages to Create:**
  - `app/kyc/page.tsx` - KYC document management
  - `app/kyc/verification/page.tsx` - Verification status

#### **Other Missing Pages**

- `app/table-reservations/page.tsx` - Table reservation management
- `app/notifications/page.tsx` - Notification center
- `app/waitlist/dashboard/page.tsx` - Waitlist management dashboard

### 11.2. Missing API Endpoints (Critical)

#### **Staff APIs** (`app/api/staff/`)

- `GET /api/staff` - List all staff
- `POST /api/staff` - Create staff member
- `GET /api/staff/[id]` - Get staff details
- `PUT /api/staff/[id]` - Update staff member
- `DELETE /api/staff/[id]` - Delete staff member
- `GET /api/staff/[id]/activities` - Staff activities
- `GET /api/staff/[id]/performance` - Performance metrics
- `GET /api/staff/[id]/schedule` - Staff schedule
- `POST /api/staff/[id]/schedule` - Update schedule

#### **CRM APIs** (`app/api/crm/`)

- `GET /api/crm/customers` - List customers
- `POST /api/crm/customers` - Create customer
- `GET /api/crm/customers/[id]` - Customer details
- `PUT /api/crm/customers/[id]` - Update customer
- `GET /api/crm/customers/[id]/bookings` - Customer bookings
- `GET /api/crm/customers/[id]/feedback` - Customer feedback

#### **Sofia AI APIs** (`app/api/sofia/`)

- `GET /api/sofia/agents` - List AI agents
- `POST /api/sofia/agents` - Create AI agent
- `GET /api/sofia/agents/[id]` - Agent details
- `PUT /api/sofia/agents/[id]` - Update agent
- `GET /api/sofia/conversations` - List conversations
- `GET /api/sofia/conversations/[id]/messages` - Conversation messages
- `POST /api/sofia/messages` - Send message to AI
- `GET /api/sofia/memories` - AI memories
- `GET /api/sofia/analytics` - AI analytics

#### **Analytics APIs** (`app/api/analytics/`)

- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/events` - Event analytics
- `GET /api/analytics/waitlist` - Waitlist analytics
- `GET /api/analytics/voice` - Voice analytics

#### **Financial APIs** (`app/api/financial/`)

- `GET /api/financial/transactions` - Financial transactions
- `POST /api/financial/transactions` - Create transaction
- `GET /api/financial/reports` - Financial reports

#### **Other Missing APIs**

- `GET/POST/PUT/DELETE /api/table-reservations/` - Table reservations
- `GET/POST/PUT/DELETE /api/notifications/` - Notifications
- `GET/POST/PUT /api/user/preferences/` - User preferences
- `GET/POST/PUT /api/property-features/` - Property features
- `GET/POST/PUT /api/property-images/` - Property images

### 11.3. Missing Services (Backend Logic)

#### **New Services to Create:**

- `staffService` - Staff management business logic
- `crmService` - Customer relationship management
- `sofiaService` - AI agent management
- `voiceService` - Voice processing and analytics
- `kycService` - KYC document processing
- `financialService` - Financial transaction processing

#### **Enhanced Services:**

- `analyticsService` - Add revenue analytics, event tracking
- `waitlistService` - Add communication management
- `aiService` - Add Sofia AI integration
- `userService` - Add extended user management

### 11.4. Missing Components (Frontend UI)

#### **Staff Components:**

- `StaffManagement.tsx` - Main staff dashboard
- `StaffList.tsx` - Staff listing with filters
- `StaffForm.tsx` - Add/edit staff form
- `StaffProfile.tsx` - Individual staff profile
- `StaffSchedule.tsx` - Schedule management
- `StaffPerformance.tsx` - Performance charts

#### **CRM Components:**

- `CustomerList.tsx` - Customer listing
- `CustomerDetail.tsx` - Customer profile view
- `CustomerForm.tsx` - Customer management form
- `BookingHistory.tsx` - Customer booking history
- `CustomerStats.tsx` - Customer analytics

#### **AI/Sofia Components:**

- `AgentList.tsx` - AI agent listing
- `AgentForm.tsx` - Agent configuration
- `ChatInterface.tsx` - AI chat interface
- `AgentAnalytics.tsx` - AI performance metrics
- `VoiceProfiles.tsx` - Voice profile management

#### **Analytics Components:**

- `AnalyticsDashboard.tsx` - Main analytics view
- `RevenueCharts.tsx` - Revenue visualization
- `PerformanceMetrics.tsx` - KPI dashboards
- `UserAnalytics.tsx` - User behavior analytics

#### **Other Components:**

- `KYCDashboard.tsx` - KYC document management
- `FinancialDashboard.tsx` - Financial overview
- `NotificationCenter.tsx` - Notification management
- `ReservationCalendar.tsx` - Table reservation calendar

### 11.5. Missing TypeScript Types

#### **Critical Types to Create:**

- `Staff`, `StaffActivity`, `StaffPerformance`, `StaffSchedule`
- `Customer` (CRM), `SofiaAgent`, `SofiaConversation`, `SofiaMessage`
- `RevenueAnalytics`, `AnalyticsEvent`, `WaitlistEntry`
- `KYCDocument`, `FinancialRecord`, `Notification`
- `TableReservation`, `RestaurantTable`, `VoiceTrainingData`

### 11.6. Missing Custom Hooks

#### **New Hooks to Create:**

- `useStaff()` - Staff management
- `useCRM()` - Customer relationship management
- `useSofia()` - AI agent interactions
- `useAnalytics()` - Analytics data fetching
- `useFinancial()` - Financial data management
- `useKYC()` - KYC document handling
- `useNotifications()` - Notification management

### 11.7. Database Utilization Status

#### **Fully Utilized Tables:** 15/121 (12%)

- `properties`, `bookings`, `orders`, `users`, `tenants`
- `hotel_details`, `restaurant_details`, `menu_items`, `room_types`
- `property_images`, `waitlist_entries`, `notifications`, `financial_records`

#### **Partially Utilized Tables:** 25/121 (21%)

- `room_availability`, `restaurant_tables`, `property_features`
- `user_preferences`, `analytics_events`, `conversations`
- `recommendations`, `guest_feedback`

#### **Completely Unused Tables:** 81/121 (67%) - **CRITICAL GAP**

- All `sofia_*` tables (AI system)
- All `staff_*` tables (Staff management)
- All `crm_*` tables (Customer management)
- `revenue_analytics`, `kyc_*` tables, `voice_*` tables
- And many more...

### 11.8. Implementation Priority Matrix

#### **HIGH PRIORITY** (Must implement first):

1. **Staff Management** - Essential for operations
2. **CRM System** - Customer relationship management
3. **Analytics Dashboard** - Business intelligence
4. **Sofia AI Integration** - Core AI features

#### **MEDIUM PRIORITY**:

1. **Financial Management** - Payment processing
2. **KYC System** - Compliance requirements
3. **Table Reservations** - Restaurant operations
4. **Notification System** - User communication

#### **LOW PRIORITY**:

1. **Voice Analytics** - Advanced features
2. **Advanced Sofia Features** - AI enhancements
3. **Extended Analytics** - Detailed reporting

---

## 6. Security Implementation

### 6.1. Tenant Isolation

- Every database query includes `tenant_id` filtering
- Automatic security level enforcement
- Cross-tenant relationship validation
- Audit logging for all operations

### 6.2. API Protection

```typescript
// Protected API routes with automatic validation
const protectedRoute = createProtectedRoute({
  requiredIds: ['tenantId', 'businessId'],
  securityLevel: SecurityLevel.BUSINESS,
  allowedRoles: ['admin', 'manager', 'staff'],
});
```

### 6.3. ID Validation

- Regex patterns for all ID types
- Sanitization and validation middleware
- Prevention of ID injection attacks

---

## 7. Brand Identity Integration

### 7.1. Nude Foundation Color Palette

```css
/* Primary Colors */
--nude-50: #faf9f7;
--nude-100: #f5f3f0;
--nude-200: #e8e4df;
--nude-300: #d4cdc4;
--nude-400: #b8aea2;
--nude-500: #9c8f80;
--nude-600: #807366;
--nude-700: #645a4d;
--nude-800: #484139;
--nude-900: #2c2826;

/* Charlotte Pillow Talk Collection */
--luxury-charlotte: #d4af8c;
--warm-charlotte: #e8d5c4;
--soft-charlotte: #f2e8e0;
```

### 7.2. Typography Hierarchy

- **Primary**: Inter (body text, UI elements)
- **Display**: Playfair Display (headings, luxury feel)
- **Monospace**: JetBrains Mono (code, technical)
- **Script**: Dancing Script (accent, personality)

### 7.3. Emotional Design Patterns

- Warm glow effects
- Gentle lift animations
- Smooth appear transitions
- Luxury accessibility

---

## 8. Deployment Status

### 8.1. Production Ready

- **Build**: 0 errors, 0 warnings
- **TypeScript**: All types resolved
- **Security**: Tenant isolation implemented
- **Routes**: 55 routes generated successfully
- **Performance**: Optimized for Vercel

### 8.2. Route Statistics

- **Static Routes**: 45 (prerendered)
- **Dynamic Routes**: 10 (server-rendered)
- **API Routes**: 5 (secure endpoints)
- **Total Bundle Size**: 87.3 kB (shared)

### 8.3. Configuration Files

- **Next.js**: Optimized for Vercel deployment
- **Tailwind**: Brand-integrated styling
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement

---

## 9. Usage Examples

### 9.1. Creating Secure Queries

```typescript
import { createSecureQuery } from '@/lib/database/secure-queries';

// Automatically includes tenant isolation
const query = createSecureQuery(context, SecurityLevel.BUSINESS);
const bookings = query.select('bookings', ['id', 'guest_id', 'check_in']);
```

### 9.2. Protected API Routes

```typescript
import {
  createProtectedRoute,
  ROUTE_CONFIGS,
} from '@/lib/middleware/api-protection';

const protectedRoute = createProtectedRoute(ROUTE_CONFIGS.HOTEL_MANAGEMENT);
export const GET = protectedRoute(async (req, context) => {
  // Your secure handler here
});
```

### 9.3. ID Validation

```typescript
import { validateId } from '@/lib/middleware/id-validation';

const validation = validateId(bookingId, 'bookingId');
if (!validation.isValid) {
  throw new Error(validation.error);
}
```

---

## 12. Updated Next Steps & Implementation Roadmap

### 12.1. Critical Implementation Priority (Week 1-2)

#### **PHASE 1A: Core Operations (Staff Management)**

1. **Create Staff Management System:**
   - `app/api/staff/` - Complete API endpoints
   - `app/staff/` - Staff dashboard and profile pages
   - `StaffManagement.tsx`, `StaffList.tsx`, `StaffForm.tsx` - Core components
   - `staffService` - Backend business logic
   - `Staff`, `StaffActivity`, `StaffSchedule` - TypeScript types

2. **Database Tables to Implement:**
   - `staff`, `staff_activities`, `staff_performance`, `staff_schedules`

#### **PHASE 1B: Customer Management (CRM)**

1. **Create CRM System:**
   - `app/api/crm/` - Customer API endpoints
   - `app/crm/` - CRM dashboard and customer pages
   - `CustomerList.tsx`, `CustomerDetail.tsx`, `CustomerForm.tsx` - Components
   - `crmService` - CRM business logic
   - `Customer` - TypeScript types

2. **Database Tables to Implement:**
   - `crm_customers`, `guest_feedback`

### 12.2. Business Intelligence Priority (Week 3-4)

#### **PHASE 2A: Analytics Dashboard**

1. **Create Analytics System:**
   - `app/api/analytics/` - Analytics API endpoints
   - `app/analytics/` - Analytics dashboard pages
   - `AnalyticsDashboard.tsx`, `RevenueCharts.tsx`, `PerformanceMetrics.tsx` - Components
   - Enhanced `analyticsService` - Analytics business logic
   - `RevenueAnalytics`, `AnalyticsEvent` - TypeScript types

2. **Database Tables to Implement:**
   - `revenue_analytics`, `analytics_events` (enhance existing)

#### **PHASE 2B: AI Integration (Sofia)**

1. **Create Sofia AI Management:**
   - `app/api/sofia/` - AI agent API endpoints
   - `app/sofia/` - AI management pages
   - `AgentList.tsx`, `ChatInterface.tsx`, `AgentAnalytics.tsx` - Components
   - `sofiaService` - AI management logic
   - `SofiaAgent`, `SofiaConversation`, `SofiaMessage` - TypeScript types

2. **Database Tables to Implement:**
   - `sofia_agents`, `sofia_conversations`, `sofia_messages`, `sofia_memories`, `sofia_analytics`

### 12.3. Operational Features Priority (Week 5-6)

#### **PHASE 3A: Financial Management**

1. **Create Financial System:**
   - `app/api/financial/` - Financial API endpoints
   - `app/financial/` - Financial management pages
   - `FinancialDashboard.tsx`, `TransactionList.tsx` - Components
   - `financialService` - Financial processing logic
   - `FinancialRecord` - TypeScript types

#### **PHASE 3B: Compliance & KYC**

1. **Create KYC System:**
   - `app/api/kyc/` - KYC API endpoints
   - `app/kyc/` - KYC management pages
   - `KYCDashboard.tsx`, `DocumentList.tsx` - Components
   - `kycService` - Document processing logic
   - `KYCDocument`, `KYBResult` - TypeScript types

### 12.4. Enhanced Features Priority (Week 7-8)

#### **PHASE 4A: Restaurant Operations**

1. **Table Reservation System:**
   - `app/api/table-reservations/` - Reservation API endpoints
   - `app/table-reservations/` - Reservation management pages
   - `ReservationCalendar.tsx`, `TableManagement.tsx` - Components
   - Enhanced `restaurantService` - Reservation logic
   - `TableReservation`, `RestaurantTable` - TypeScript types

#### **PHASE 4B: Communication Systems**

1. **Notification Center:**
   - `app/api/notifications/` - Notification API endpoints
   - `app/notifications/` - Notification management pages
   - `NotificationCenter.tsx`, `NotificationList.tsx` - Components
   - Enhanced `notificationService` - Notification logic

### 12.5. Advanced Features (Future Phases)

#### **PHASE 5: Voice & AI Enhancement**

1. **Voice Analytics System:**
   - `app/api/sofia/voice/` - Voice API endpoints
   - `app/sofia/voice/` - Voice management pages
   - `voiceService` - Voice processing logic
   - `VoiceTrainingData`, `VoiceUsageAnalytics` - TypeScript types

#### **PHASE 6: Advanced Analytics**

1. **Extended Reporting:**
   - Enhanced analytics with machine learning insights
   - Predictive analytics for revenue forecasting
   - Customer behavior analysis
   - Operational efficiency metrics

### 12.6. Technical Debt & Infrastructure

#### **Immediate Technical Tasks:**

1. **Create Missing TypeScript Types** (Day 1-2)
   - Generate types for all 121 database tables
   - Implement proper type safety across the application

2. **Create Missing Services** (Day 3-5)
   - Implement all 6 new services (`staffService`, `crmService`, etc.)
   - Enhance existing services with new functionality

3. **Create Missing Custom Hooks** (Day 6-7)
   - Implement data fetching hooks for all new features
   - Ensure proper error handling and loading states

4. **Component Library Expansion** (Ongoing)
   - Create reusable components for data tables, forms, charts
   - Implement consistent UI patterns across all new features

### 12.7. Database Optimization Tasks

#### **Immediate Database Tasks:**

1. **Table Optimization:**
   - Add proper indexes to all new tables
   - Implement database constraints and foreign keys
   - Set up automated data cleanup jobs

2. **Performance Monitoring:**
   - Implement query performance monitoring
   - Set up database health checks
   - Create automated backup procedures

### 12.8. Quality Assurance & Testing

#### **Testing Strategy:**

1. **API Testing:** Unit tests for all new endpoints
2. **Component Testing:** Integration tests for UI components
3. **E2E Testing:** Critical user flows for new features
4. **Performance Testing:** Load testing for high-traffic features

---

**UPDATED STATUS:** PARTIALLY IMPLEMENTED (15% Complete)
**Critical Gap:** 81/121 database tables unused (67%)
**Immediate Focus:** Staff Management, CRM, Analytics, AI Integration
**Architecture:** Multi-tenant with Enterprise Security
**Next Milestone:** Complete Phase 1A (Staff Management) - Week 1-2

---

_This structure provides a scalable, secure foundation for the Buffr Host hospitality platform with proper multi-tenant architecture and enterprise-grade security._
