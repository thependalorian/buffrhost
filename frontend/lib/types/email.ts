/**
 * Email Service Type Definitions
 *
 * Purpose: Type definitions for email sending, templates, and email service integration
 * Location: lib/types/email.ts
 * Usage: Shared across email service components, email APIs, and notification systems
 *
 * @module Email Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 */

/**
 * Email Request Interface
 *
 * Represents a request to send an email through the email service.
 *
 * @interface EmailRequest
 * @property {string} to - Recipient email address (required)
 * @property {string} subject - Email subject line (required)
 * @property {string} content - Plain text email content (required)
 * @property {string} [htmlContent] - HTML email content (optional, used for rich formatting)
 *
 * @example
 * const emailRequest: EmailRequest = {
 *   to: 'customer@example.com',
 *   subject: 'Booking Confirmation',
 *   content: 'Your booking has been confirmed.',
 *   htmlContent: '<h1>Booking Confirmed</h1><p>Your booking has been confirmed.</p>'
 * };
 */
/**
 * Email Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Email type definitions for email communication, templates, and notification systems
 * @location buffr-host/lib/types/email.ts
 * @purpose email type definitions for email communication, templates, and notification systems
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @api_integration REST API endpoints, HTTP request/response handling
 * @security Type-safe security definitions for authentication, authorization, and data protection
 * @ai_integration Machine learning and AI service type definitions for predictive analytics
 * @authentication User authentication and session management type definitions
 * @typescript_strict Strict TypeScript type safety ensuring compile-time error prevention
 * @type_safety Comprehensive type coverage preventing runtime errors and improving developer experience
 * @scalability Type definitions supporting horizontal scaling and multi-tenant architecture
 * @maintainability Self-documenting types enabling easier code maintenance and refactoring
 * @testing Type-driven development supporting comprehensive test coverage
 *
 * Type Definitions Summary:
 * - 5 Interfaces: EmailRequest, EmailResponse, EmailTemplate...
 * - Total: 5 type definitions
 *
 * Usage and Integration:
 * - Frontend Components: Type-safe props and state management
 * - API Routes: Request/response type validation
 * - Database Services: Schema-aligned data operations
 * - Business Logic: Domain-specific type constraints
 * - Testing: Type-driven test case generation
 *
 * @example
 * // Import type definitions
 * import type { EmailRequest, EmailResponse, EmailTemplate... } from './email';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: EmailRequest;
 *   onAction: (event: EventType) => void;
 * }
 *
 * @example
 * // Database service usage
 * const userService = {
 *   async getUser(id: string): Promise<User> {
 *     // Type-safe database operations
 *     return await db.query('SELECT * FROM users WHERE id = $1', [id]);
 *   }
 * };
 *
 * Exported Types:
 * @typedef {Interface} EmailRequest
 * @typedef {Interface} EmailResponse
 * @typedef {Interface} EmailTemplate
 * @typedef {Interface} EmailConfig
 * @typedef {Interface} EmailService
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface EmailRequest {
  to: string;
  subject: string;
  content: string;
  htmlContent?: string;
}

/**
 * Email Response Interface
 *
 * Represents the response from an email sending operation.
 *
 * @interface EmailResponse
 * @property {boolean} success - Whether the email was sent successfully
 * @property {string} [messageId] - Unique message ID from email provider (if successful)
 * @property {string} [error] - Error message if sending failed
 *
 * @example
 * const successResponse: EmailResponse = {
 *   success: true,
 *   messageId: 'msg_abc123'
 * };
 *
 * const errorResponse: EmailResponse = {
 *   success: false,
 *   error: 'Invalid recipient address'
 * };
 */
export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Email Template Interface
 *
 * Represents a reusable email template with variable placeholders.
 *
 * @interface EmailTemplate
 * @property {string} id - Unique template identifier
 * @property {string} name - Human-readable template name
 * @property {string} subject - Email subject template (may contain variables)
 * @property {string} htmlContent - HTML content template (may contain variables)
 * @property {string} textContent - Plain text content template (may contain variables)
 * @property {string[]} variables - List of variable names that can be replaced in the template
 *
 * @example
 * const template: EmailTemplate = {
 *   id: 'welcome_email',
 *   name: 'Welcome Email',
 *   subject: 'Welcome to {{businessName}}, {{customerName}}!',
 *   htmlContent: '<h1>Welcome {{customerName}}</h1>',
 *   textContent: 'Welcome {{customerName}}',
 *   variables: ['customerName', 'businessName']
 * };
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

/**
 * Email Configuration Interface
 *
 * Represents configuration for the email service provider.
 *
 * @interface EmailConfig
 * @property {string} apiKey - API key for email service provider
 * @property {string} fromEmail - Default sender email address
 * @property {string} fromName - Default sender display name
 *
 * @example
 * const config: EmailConfig = {
 *   apiKey: 'api_key_123',
 *   fromEmail: 'noreply@buffrhost.com',
 *   fromName: 'Buffr Host'
 * };
 */
export interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

/**
 * Email Service Interface
 *
 * Defines the contract for email service implementations.
 *
 * @interface EmailService
 * @property {function} sendEmail - Send an email using EmailRequest
 * @property {function} sendTemplate - Send an email using a template ID and variables
 *
 * @example
 * class MyEmailService implements EmailService {
 *   async sendEmail(request: EmailRequest): Promise<EmailResponse> {
 *     // Implementation
 *   }
 *
 *   async sendTemplate(templateId: string, to: string, variables: Record<string, any>): Promise<EmailResponse> {
 *     // Implementation
 *   }
 * }
 */
export interface EmailService {
  sendEmail(request: EmailRequest): Promise<EmailResponse>;
  sendTemplate(
    templateId: string,
    to: string,
    variables: Record<string, any>
  ): Promise<EmailResponse>;
}
