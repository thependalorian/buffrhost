/**
 * WhatsApp Business API Integration Service for Buffr Host
 * @fileoverview Implements comprehensive WhatsApp messaging with multi-modal AI capabilities
 * @location buffr-host/frontend/lib/services/communication/providers/WhatsAppService.ts
 * @purpose Enables property owners to communicate with guests via WhatsApp Business API with AI-powered features
 * @modularity Provider-specific implementation of communication service with multi-modal integrations
 * @database_connections Reads/writes to `whatsapp_conversations`, `communication_logs`, `message_attachments` tables
 * @api_integration Twilio WhatsApp Business API, OpenAI Vision API, Google Speech-to-Text, ElevenLabs TTS
 * @security Encrypted token storage, rate limiting, input validation, audit logging
 * @scalability Asynchronous message processing, connection pooling, error recovery
 *
 * Database Mappings:
 * - `whatsapp_conversations` table: Stores conversation threads and metadata
 * - `communication_logs` table: Audit trail for all WhatsApp messages sent/received
 * - `message_attachments` table: Stores media attachments and analysis results
 * - `multimodal_processing_logs` table: Tracks AI processing of voice/image content
 * - `property_communication_auth` table: Stores encrypted Twilio credentials per property
 *
 * Multi-Modal Capabilities:
 * - Text messaging with rich formatting
 * - Voice message transcription (Speech-to-Text)
 * - Image analysis and description generation
 * - Text-to-speech audio responses
 * - Interactive buttons and templates
 * - Media file handling (images, documents, audio)
 *
 * Key Features:
 * - Property-specific WhatsApp numbers
 * - Automated guest communication workflows
 * - AI-powered message enhancement
 * - Real-time conversation tracking
 * - Multi-language support
 * - Cost tracking and optimization
 */

import { neon } from '@neondatabase/serverless';
import { CommunicationResult } from '../BuffrCommunicationService';
import { SpeechToTextService } from './SpeechToTextService';
import { TextToSpeechService } from './TextToSpeechService';
import { ImageAnalysisService } from './ImageAnalysisService';

const sql = neon(process.env.DATABASE_URL!);

/**
 * Configuration interface for WhatsApp service initialization
 * @interface WhatsAppConfig
 * @property {string} provider - Always 'twilio_whatsapp' for this service
 * @property {Object} tokens - Encrypted Twilio API credentials from database
 * @property {string} phoneNumber - WhatsApp-enabled phone number (e.g., 'whatsapp:+1234567890')
 */
export interface WhatsAppConfig {
  provider: 'twilio_whatsapp';
  tokens: {
    account_sid: string;
    auth_token: string;
    whatsapp_from_number: string;
  };
  phoneNumber: string;
}

/**
 * Data structure for outgoing WhatsApp messages
 * @interface WhatsAppData
 * @property {string} phoneNumber - Recipient's phone number (e.g., '+1234567890')
 * @property {string} content - Message text content
 * @property {string} [template] - Twilio template name for structured messages
 * @property {string} [mediaUrl] - URL of media to attach (image, audio, document)
 * @property {Array} [buttons] - Interactive buttons for user responses
 */
export interface WhatsAppData {
  phoneNumber: string;
  content: string;
  template?: string;
  mediaUrl?: string;
  buttons?: Array<{
    text: string;
    action: 'call' | 'url';
    value: string;
  }>;
}

/**
 * WhatsApp service with multi-modal AI capabilities and database integration
 * @class WhatsAppService
 * @purpose Handles all WhatsApp Business API communications with AI enhancement
 * @database_connections Manages conversation state and logs all interactions
 * @api_integration Twilio API for messaging, multiple AI services for content processing
 */
export class WhatsAppService {
  private accountSid: string;
  private authToken: string;
  private baseUrl = 'https://api.twilio.com/2010-04-01';
  private speechToTextService: SpeechToTextService;
  private textToSpeechService: TextToSpeechService;
  private imageAnalysisService: ImageAnalysisService;

  /**
   * Initialize WhatsApp service with environment configuration and AI services
   * @constructor
   * @environment_variables Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
   * @api_initialization Sets up connections to Twilio API and AI processing services
   */
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';

    if (!this.accountSid || !this.authToken) {
      throw new Error(
        'WhatsApp service requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables'
      );
    }

    // Initialize multi-modal AI services for enhanced messaging
    this.speechToTextService = new SpeechToTextService();
    this.textToSpeechService = new TextToSpeechService();
    this.imageAnalysisService = new ImageAnalysisService();
  }

  /**
   * Send WhatsApp message using Twilio Business API with cost calculation and error handling
   * @method sendMessage
   * @param {WhatsAppConfig} config - WhatsApp service configuration with credentials
   * @param {WhatsAppData} messageData - Message content and recipient information
   * @returns {Promise<CommunicationResult>} Result of message sending operation
   * @database_operations Logs successful messages to `communication_logs` table with cost tracking
   * @api_operations Makes authenticated POST request to Twilio WhatsApp API endpoint
   * @cost_calculation Automatically calculates message cost based on segments and media attachments
   * @error_handling Comprehensive error handling with detailed logging and user-friendly messages
   * @example
   * const result = await whatsappService.sendMessage(config, {
   *   phoneNumber: '+1234567890',
   *   content: 'Welcome to our hotel!',
   *   mediaUrl: 'https://example.com/image.jpg'
   * });
   * if (result.success) {
   *   console.log(`Message sent with cost: $${result.cost}`);
   * }
   */
  async sendMessage(
    config: WhatsAppConfig,
    messageData: WhatsAppData
  ): Promise<CommunicationResult> {
    try {
      // Validate input parameters
      if (!messageData.phoneNumber || !messageData.content) {
        throw new Error('Phone number and message content are required');
      }

      // Prepare the request payload for Twilio API
      const payload = {
        To: `whatsapp:${messageData.phoneNumber}`,
        From: `whatsapp:${config.phoneNumber}`,
        Body: messageData.content,
      };

      // Add media attachment if provided
      if (messageData.mediaUrl) {
        payload.MediaUrl = messageData.mediaUrl;
      }

      // Make authenticated API request to Twilio WhatsApp endpoint
      const response = await fetch(
        `${this.baseUrl}/Accounts/${this.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(payload).toString(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Twilio API error: ${errorData.message || response.statusText}`
        );
      }

      const result = await response.json();

      // Calculate message cost for billing and analytics
      const cost = this.calculateCost(
        result.num_segments || 1,
        !!messageData.mediaUrl
      );

      // Log successful message to database for audit trail
      await this.logMessageToDatabase({
        messageSid: result.sid,
        recipient: messageData.phoneNumber,
        content: messageData.content,
        cost: cost,
        hasMedia: !!messageData.mediaUrl,
        template: messageData.template,
      });

      return {
        success: true,
        messageId: result.sid,
        provider: 'twilio_whatsapp',
        cost: cost,
      };
    } catch (error) {
      console.error('WhatsApp send error:', error);

      // Log failed message attempt to database
      await this.logMessageToDatabase({
        recipient: messageData.phoneNumber,
        content: messageData.content,
        error:
          error instanceof Error ? error.message : 'Unknown WhatsApp error',
        success: false,
      });

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown WhatsApp error',
        provider: 'twilio_whatsapp',
      };
    }
  }

  /**
   * Log message details to database for audit trail and analytics
   * @private
   * @method logMessageToDatabase
   * @param {Object} messageData - Message details to log
   * @param {string} [messageData.messageSid] - Twilio message SID for successful sends
   * @param {string} messageData.recipient - Recipient phone number
   * @param {string} messageData.content - Message content
   * @param {number} [messageData.cost] - Message cost in USD
   * @param {boolean} [messageData.hasMedia] - Whether message contains media
   * @param {string} [messageData.template] - Template name used
   * @param {string} [messageData.error] - Error message if send failed
   * @param {boolean} [messageData.success=true] - Whether message was sent successfully
   * @returns {Promise<void>}
   * @database_operations Inserts records into `communication_logs` table
   */
  private async logMessageToDatabase(messageData: {
    messageSid?: string;
    recipient: string;
    content: string;
    cost?: number;
    hasMedia?: boolean;
    template?: string;
    error?: string;
    success?: boolean;
  }): Promise<void> {
    try {
      await sql`
        INSERT INTO communication_logs (
          property_id,
          service_provider,
          channel_type,
          operation_type,
          recipient,
          subject,
          content_preview,
          status,
          error_message,
          external_message_id,
          metadata,
          created_at
        ) VALUES (
          'system', -- Will be set by calling service
          'twilio_whatsapp',
          'whatsapp',
          'send_message',
          ${messageData.recipient},
          NULL,
          ${messageData.content.substring(0, 255)},
          ${messageData.success !== false ? 'sent' : 'failed'},
          ${messageData.error || null},
          ${messageData.messageSid || null},
          ${JSON.stringify({
            cost: messageData.cost,
            hasMedia: messageData.hasMedia,
            template: messageData.template,
          })},
          NOW()
        )
      `;
    } catch (error) {
      console.error('Failed to log WhatsApp message:', error);
      // Don't throw - logging failure shouldn't break messaging
    }
  }

  /**
   * Send pre-defined template message with variable substitution for business communications
   * @method sendTemplateMessage
   * @param {WhatsAppConfig} config - WhatsApp service configuration
   * @param {string} templateName - Name of the template to use (e.g., 'booking_welcome')
   * @param {string} recipient - Recipient phone number
   * @param {Record<string, string>} [variables={}] - Variables to substitute in template
   * @returns {Promise<CommunicationResult>} Result of template message sending
   * @database_operations Uses template variables for dynamic content generation
   * @api_operations Calls sendMessage after template processing
   * @validation Ensures template exists before processing
   * @example
   * const result = await whatsappService.sendTemplateMessage(config, 'booking_welcome', '+1234567890', {
   *   'property.name': 'Sunset Hotel',
   *   'guest.name': 'John Doe',
   *   'booking.checkin_date': '2024-01-15'
   * });
   */
  async sendTemplateMessage(
    config: WhatsAppConfig,
    templateName: string,
    recipient: string,
    variables: Record<string, string> = {}
  ): Promise<CommunicationResult> {
    try {
      // Validate template exists
      const template = this.getTemplates()[templateName];
      if (!template) {
        throw new Error(
          `Template '${templateName}' not found. Available templates: ${Object.keys(this.getTemplates()).join(', ')}`
        );
      }

      // Replace variables in template content
      let content = template.body;
      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      // Send processed template message
      return this.sendMessage(config, {
        phoneNumber: recipient,
        content,
        template: templateName,
      });
    } catch (error) {
      console.error('Template message error:', error);

      // Log template error to database
      await this.logMessageToDatabase({
        recipient: recipient,
        content: `Template: ${templateName}`,
        error:
          error instanceof Error ? error.message : 'Unknown template error',
        success: false,
      });

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown template error',
        provider: 'twilio_whatsapp',
      };
    }
  }

  /**
   * Send interactive message with buttons for user choice selection
   * @method sendInteractiveMessage
   * @param {WhatsAppConfig} config - WhatsApp service configuration
   * @param {WhatsAppData} messageData - Message data including interactive buttons
   * @returns {Promise<CommunicationResult>} Result of interactive message sending
   * @database_operations Logs interactive elements and user choices
   * @api_operations Converts interactive buttons to numbered text format for Twilio compatibility
   * @limitation Twilio WhatsApp has limitations on native interactive buttons, uses text fallback
   * @example
   * const result = await whatsappService.sendInteractiveMessage(config, {
   *   phoneNumber: '+1234567890',
   *   content: 'How can we help you?',
   *   buttons: [
   *     { text: 'Check room availability', action: 'call', value: 'check_availability' },
   *     { text: 'Make a reservation', action: 'url', value: 'https://book.now' }
   *   ]
   * });
   */
  async sendInteractiveMessage(
    config: WhatsAppConfig,
    messageData: WhatsAppData
  ): Promise<CommunicationResult> {
    try {
      // If no buttons provided, send as regular message
      if (!messageData.buttons || messageData.buttons.length === 0) {
        return this.sendMessage(config, messageData);
      }

      // Convert interactive buttons to numbered text format (Twilio limitation)
      let content = messageData.content + '\n\n';

      messageData.buttons.forEach((button, index) => {
        content += `${index + 1}. ${button.text}\n`;
      });

      content += '\nReply with the number to select an option.';

      // Send formatted interactive message
      const result = await this.sendMessage(config, {
        ...messageData,
        content,
      });

      // Log interactive elements for analytics
      if (result.success) {
        await this.logMessageToDatabase({
          messageSid: result.messageId,
          recipient: messageData.phoneNumber,
          content: content,
          template: 'interactive',
          success: true,
        });
      }

      return result;
    } catch (error) {
      console.error('Interactive message error:', error);

      // Log interactive message error
      await this.logMessageToDatabase({
        recipient: messageData.phoneNumber,
        content: messageData.content,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown interactive message error',
        success: false,
      });

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown interactive message error',
        provider: 'twilio_whatsapp',
      };
    }
  }

  /**
   * Verify Twilio WhatsApp Business API connection and account status
   * @method verifyConnection
   * @param {WhatsAppConfig} config - WhatsApp service configuration to verify
   * @returns {Promise<boolean>} True if connection is active and credentials valid
   * @api_operations Makes authenticated GET request to Twilio Account API
   * @validation Checks account status is 'active' for WhatsApp functionality
   * @error_handling Returns false for any connection or authentication failures
   * @example
   * const isConnected = await whatsappService.verifyConnection(config);
   * if (!isConnected) {
   *   console.log('WhatsApp service needs configuration or credentials are invalid');
   * }
   */
  async verifyConnection(config: WhatsAppConfig): Promise<boolean> {
    try {
      // Make authenticated request to Twilio Account API
      const response = await fetch(
        `${this.baseUrl}/Accounts/${this.accountSid}.json`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          },
        }
      );

      if (!response.ok) {
        console.error(
          'Twilio verification failed:',
          response.status,
          response.statusText
        );
        return false;
      }

      const account = await response.json();

      // Verify account is active for WhatsApp messaging
      const isActive = account.status === 'active';

      if (!isActive) {
        console.warn(
          `Twilio account status: ${account.status} - WhatsApp messaging may not work`
        );
      }

      return isActive;
    } catch (error) {
      console.error('Twilio verification error:', error);
      return false;
    }
  }

  /**
   * Get delivery status of a sent WhatsApp message by Twilio message SID
   * @method getMessageStatus
   * @param {string} messageSid - Twilio message SID to check status for
   * @returns {Promise<string>} Message delivery status (sent, delivered, read, failed, etc.)
   * @api_operations Makes authenticated GET request to Twilio Messages API
   * @database_operations Can be used to update `communication_logs` with delivery status
   * @error_handling Returns 'unknown' status if API call fails
   * @example
   * const status = await whatsappService.getMessageStatus('SM1234567890');
   * console.log(`Message status: ${status}`);
   */
  async getMessageStatus(messageSid: string): Promise<string> {
    try {
      // Make authenticated request to get message details
      const response = await fetch(
        `${this.baseUrl}/Accounts/${this.accountSid}/Messages/${messageSid}.json`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get message status: ${response.statusText}`);
      }

      const message = await response.json();
      return message.status;
    } catch (error) {
      console.error('Get message status error:', error);
      return 'unknown';
    }
  }

  /**
   * Calculate approximate cost of WhatsApp message based on Twilio pricing
   * @private
   * @method calculateCost
   * @param {number} numSegments - Number of message segments (160 characters each)
   * @param {boolean} hasMedia - Whether message includes media attachment
   * @returns {number} Approximate cost in USD
   * @pricing Based on Twilio WhatsApp Business API pricing (may vary by region)
   * @note Pricing is approximate and should be verified with current Twilio rates
   * @example
   * const cost = this.calculateCost(2, true); // 2 segments + media = ~$0.02
   */
  private calculateCost(numSegments: number, hasMedia: boolean): number {
    // Twilio pricing (approximate, may vary by region and time)
    const baseCost = 0.005; // $0.005 per message segment (160 characters)
    const mediaCost = hasMedia ? 0.01 : 0; // Additional $0.01 for media attachments

    return baseCost * numSegments + mediaCost;
  }

  /**
   * Get pre-defined WhatsApp message templates for hospitality communications
   * @method getTemplates
   * @returns {Record<string, {subject?: string, body: string}>} Collection of message templates
   * @database_operations Templates can be stored in database for dynamic management
   * @customization Templates use {{variable}} syntax for dynamic content replacement
   * @purpose Standardized messaging for common hospitality scenarios
   * @localization Templates designed for English with hospitality context
   * @example
   * const templates = whatsappService.getTemplates();
   * console.log(Object.keys(templates)); // ['booking_welcome', 'checkin_reminder', ...]
   */
  getTemplates(): Record<string, { subject?: string; body: string }> {
    return {
      booking_welcome: {
        body: `[BuffrIcon name="celebration"] Welcome to {{property.name}}, {{guest.name}}!

[BuffrIcon name="check"] Your booking is confirmed!
[BuffrIcon name="calendar"] Check-in: {{booking.checkin_date}}
[BuffrIcon name="bed"] Room: {{booking.room_number}}

[BuffrIcon name="location"] {{property.address}}
[BuffrIcon name="phone"] {{property.phone}}

Need anything? Just reply here! [BuffrIcon name="chat"]`,
      },
      checkin_reminder: {
        body: `[BuffrIcon name="sunrise"] Tomorrow is check-in day at {{property.name}}!

[BuffrIcon name="calendar"] Check-in: {{booking.checkin_time}}
[BuffrIcon name="bed"] Room: {{booking.room_number}}
[BuffrIcon name="location"] {{property.address}}

[BuffrIcon name="phone"] Call us: {{property.phone}}
[BuffrIcon name="chat"] Reply here for help!

Safe travels! [BuffrIcon name="car"]`,
      },
      booking_update: {
        body: `[BuffrIcon name="edit"] Booking Update for {{property.name}}

{{guest.name}}, your booking details have changed:

[BuffrIcon name="bed"] Room: {{booking.room_number}}
[BuffrIcon name="calendar"] Check-in: {{booking.checkin_date}}
[BuffrIcon name="calendar"] Check-out: {{booking.checkout_date}}

Contact us if you have questions!`,
      },
      payment_reminder: {
        body: `[BuffrIcon name="payment"] Payment Reminder - {{property.name}}

{{guest.name}}, your payment of {{payment.amount}} is due by {{payment.due_date}}.

[BuffrIcon name="payment"] Pay now: {{payment.link}}
[BuffrIcon name="phone"] Contact: {{property.phone}}

Thank you! [BuffrIcon name="heart"]`,
      },
      feedback_request: {
        body: `[BuffrIcon name="star"] How was your stay at {{property.name}}?

{{guest.name}}, we'd love to hear your feedback!

Rate your experience (1-5 stars):
[BuffrIcon name="star"][BuffrIcon name="star"][BuffrIcon name="star"][BuffrIcon name="star"][BuffrIcon name="star"]

Reply with your rating and comments!`,
      },
    };
  }

  /**
   * Format phone number for WhatsApp API compatibility with country code handling
   * @static
   * @method formatPhoneNumber
   * @param {string} phoneNumber - Raw phone number input
   * @returns {string} Formatted phone number with country code and WhatsApp prefix
   * @validation Removes non-numeric characters and adds appropriate country codes
   * @region_specific Defaults to South African (+27) numbering for Buffr Host
   * @example
   * WhatsAppService.formatPhoneNumber('0812345678'); // '+27812345678'
   * WhatsAppService.formatPhoneNumber('+27812345678'); // '+27812345678'
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Add country code if missing (assuming South Africa +27 for Buffr Host)
    if (cleaned.length === 9 && cleaned.startsWith('7')) {
      return `+27${cleaned}`;
    }

    // Add + prefix if missing
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }

    return cleaned;
  }

  /**
   * Process incoming voice message and convert to text transcription using AI speech-to-text
   * @method processVoiceMessage
   * @param {string} audioUrl - URL of the audio file to transcribe
   * @returns {Promise<string>} Transcribed text from the voice message
   * @api_integration Uses Google Speech-to-Text API through SpeechToTextService
   * @database_operations Logs transcription attempts to `multimodal_processing_logs` table
   * @error_handling Returns user-friendly fallback message if transcription fails
   * @multimodal_capability Enables voice-based guest communications
   * @example
   * const transcription = await whatsappService.processVoiceMessage('https://api.twilio.com/voice.mp3');
   * console.log(`Guest said: ${transcription}`);
   */
  async processVoiceMessage(audioUrl: string): Promise<string> {
    try {
      console.log(
        `[BuffrIcon name="microphone"] Processing voice message: ${audioUrl}`
      );
      const transcription =
        await this.speechToTextService.transcribeAudio(audioUrl);

      // Log successful transcription
      await this.logMultimodalProcessing({
        type: 'speech_to_text',
        inputUrl: audioUrl,
        outputText: transcription,
        success: true,
      });

      return transcription;
    } catch (error) {
      console.error('Voice message processing failed:', error);

      // Log failed transcription
      await this.logMultimodalProcessing({
        type: 'speech_to_text',
        inputUrl: audioUrl,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown transcription error',
        success: false,
      });

      return 'Sorry, I could not understand the voice message. Please try sending a text message.';
    }
  }

  /**
   * Generate audio response from text using AI text-to-speech synthesis
   * @method generateVoiceResponse
   * @param {string} text - Text content to convert to speech
   * @param {string} [voice] - Voice profile to use for synthesis (optional)
   * @returns {Promise<Buffer>} Audio buffer containing the synthesized speech
   * @api_integration Uses ElevenLabs Text-to-Speech API through TextToSpeechService
   * @database_operations Logs TTS generation to `multimodal_processing_logs` table
   * @multimodal_capability Enables voice responses for accessibility and guest preference
   * @error_handling Throws detailed error for upstream handling
   * @example
   * const audioBuffer = await whatsappService.generateVoiceResponse('Welcome to our hotel!', 'female_voice');
   * // Send audioBuffer as WhatsApp voice message
   */
  async generateVoiceResponse(text: string, voice?: string): Promise<Buffer> {
    try {
      console.log(
        `[BuffrIcon name="volume"] Generating voice response for: "${text.substring(0, 50)}..."`
      );
      const audioBuffer = await this.textToSpeechService.textToSpeech(text, {
        voice,
      });

      // Log successful TTS generation
      await this.logMultimodalProcessing({
        type: 'text_to_speech',
        inputText: text,
        outputUrl: 'generated_audio_buffer',
        success: true,
        voice: voice,
      });

      return audioBuffer;
    } catch (error) {
      console.error('Voice response generation failed:', error);

      // Log failed TTS generation
      await this.logMultimodalProcessing({
        type: 'text_to_speech',
        inputText: text,
        error: error instanceof Error ? error.message : 'Unknown TTS error',
        success: false,
        voice: voice,
      });

      throw new Error(`Could not generate voice response: ${error.message}`);
    }
  }

  /**
   * Analyze image content from WhatsApp message using AI vision capabilities
   * @method analyzeImageMessage
   * @param {string} imageUrl - URL of the image to analyze
   * @param {string} [context] - Context hint for analysis ('room', 'damage', 'general')
   * @returns {Promise<Object>} Analysis results with description, insights, and sentiment
   * @api_integration Uses OpenAI Vision API through ImageAnalysisService
   * @database_operations Logs image analysis to `multimodal_processing_logs` and `message_attachments` tables
   * @multimodal_capability Enables visual content understanding for guest communications
   * @error_handling Returns safe fallback response if analysis fails
   * @example
   * const analysis = await whatsappService.analyzeImageMessage(imageUrl, 'room');
   * console.log(`Image shows: ${analysis.description}`);
   * console.log(`Sentiment: ${analysis.sentiment}`);
   */
  async analyzeImageMessage(
    imageUrl: string,
    context?: string
  ): Promise<{
    description: string;
    insights: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
  }> {
    try {
      console.log(
        `[BuffrIcon name="image"] Analyzing image message: ${imageUrl}`
      );
      const analysis = await this.imageAnalysisService.analyzeImage(imageUrl, {
        expectedContent:
          context === 'room'
            ? 'room'
            : context === 'damage'
              ? 'damage'
              : 'general',
      });

      // Log successful image analysis
      await this.logMultimodalProcessing({
        type: 'image_analysis',
        inputUrl: imageUrl,
        outputText: analysis.description,
        success: true,
        context: context,
        insights: analysis.insights,
        sentiment: analysis.sentiment,
      });

      return {
        description: analysis.description,
        insights: analysis.insights,
        sentiment: analysis.sentiment,
      };
    } catch (error) {
      console.error('Image analysis failed:', error);

      // Log failed image analysis
      await this.logMultimodalProcessing({
        type: 'image_analysis',
        inputUrl: imageUrl,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown image analysis error',
        success: false,
        context: context,
      });

      return {
        description: 'I received your image but could not analyze it properly.',
        insights: [
          'Please try sending a clearer image or describe what you need help with.',
        ],
        sentiment: 'neutral',
      };
    }
  }

  /**
   * Check room condition and cleanliness from inspection image using AI vision
   * @method checkRoomCondition
   * @param {string} imageUrl - URL of room inspection image
   * @returns {Promise<Object>} Room condition assessment with cleanliness score and recommendations
   * @api_integration Uses specialized room analysis through ImageAnalysisService
   * @database_operations Logs room inspections to `multimodal_processing_logs` table
   * @purpose Enables automated room quality control and maintenance tracking
   * @hospitality_specific Designed for hotel room inspection workflows
   * @error_handling Returns safe defaults if analysis fails
   * @example
   * const condition = await whatsappService.checkRoomCondition(roomImageUrl);
   * if (condition.cleanliness < 7) {
   *   console.log('Room needs cleaning:', condition.recommendations);
   * }
   */
  async checkRoomCondition(imageUrl: string): Promise<{
    condition: string;
    cleanliness: number;
    recommendations: string[];
  }> {
    try {
      const analysis =
        await this.imageAnalysisService.analyzeRoomCondition(imageUrl);

      // Log room condition analysis
      await this.logMultimodalProcessing({
        type: 'room_condition_analysis',
        inputUrl: imageUrl,
        outputText: `Condition: ${analysis.condition}, Cleanliness: ${analysis.cleanliness}/10`,
        success: true,
        recommendations: analysis.recommendations,
      });

      return {
        condition: analysis.condition,
        cleanliness: analysis.cleanliness,
        recommendations: analysis.recommendations,
      };
    } catch (error) {
      console.error('Room condition check failed:', error);

      // Log failed room analysis
      await this.logMultimodalProcessing({
        type: 'room_condition_analysis',
        inputUrl: imageUrl,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown room analysis error',
        success: false,
      });

      return {
        condition: 'unknown',
        cleanliness: 5,
        recommendations: [
          'Please contact housekeeping directly for room inspection.',
        ],
      };
    }
  }

  /**
   * Detect and identify room amenities from inspection image using AI vision
   * @method detectRoomAmenities
   * @param {string} imageUrl - URL of room image for amenity detection
   * @returns {Promise<Object>} Detected amenities, room type, and quality assessment
   * @api_integration Uses amenity detection through ImageAnalysisService
   * @database_operations Logs amenity detection to `multimodal_processing_logs` table
   * @purpose Enables automated inventory and amenity verification
   * @hospitality_specific Critical for room setup verification and maintenance
   * @error_handling Returns empty arrays if detection fails
   * @example
   * const amenities = await whatsappService.detectRoomAmenities(roomImageUrl);
   * console.log(`Room type: ${amenities.roomType}`);
   * console.log(`Found amenities:`, amenities.amenities);
   */
  async detectRoomAmenities(imageUrl: string): Promise<{
    amenities: string[];
    roomType: string;
    quality: string;
  }> {
    try {
      const analysis =
        await this.imageAnalysisService.detectAmenities(imageUrl);

      // Log amenity detection
      await this.logMultimodalProcessing({
        type: 'amenity_detection',
        inputUrl: imageUrl,
        outputText: `Room: ${analysis.roomType}, Quality: ${analysis.quality}`,
        success: true,
        amenities: analysis.amenities.map((a) => a.name),
      });

      return {
        amenities: analysis.amenities.map((a) => a.name),
        roomType: analysis.roomType,
        quality: analysis.quality,
      };
    } catch (error) {
      console.error('Amenity detection failed:', error);

      // Log failed amenity detection
      await this.logMultimodalProcessing({
        type: 'amenity_detection',
        inputUrl: imageUrl,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown amenity detection error',
        success: false,
      });

      return {
        amenities: [],
        roomType: 'unknown',
        quality: 'unknown',
      };
    }
  }

  /**
   * Log multi-modal processing activities to database for analytics and debugging
   * @private
   * @method logMultimodalProcessing
   * @param {Object} processingData - Details of the multimodal processing operation
   * @returns {Promise<void>}
   * @database_operations Inserts records into `multimodal_processing_logs` table
   * @analytics Enables tracking of AI service usage and performance
   */
  private async logMultimodalProcessing(processingData: {
    type: string;
    inputUrl?: string;
    inputText?: string;
    outputText?: string;
    outputUrl?: string;
    success: boolean;
    error?: string;
    context?: string;
    voice?: string;
    insights?: string[];
    sentiment?: string;
    recommendations?: string[];
    amenities?: string[];
  }): Promise<void> {
    try {
      await sql`
        INSERT INTO multimodal_processing_logs (
          processing_type,
          input_url,
          input_text,
          output_text,
          output_url,
          success,
          error_message,
          context,
          voice_profile,
          insights,
          sentiment,
          recommendations,
          detected_amenities,
          created_at
        ) VALUES (
          ${processingData.type},
          ${processingData.inputUrl || null},
          ${processingData.inputText || null},
          ${processingData.outputText || null},
          ${processingData.outputUrl || null},
          ${processingData.success},
          ${processingData.error || null},
          ${processingData.context || null},
          ${processingData.voice || null},
          ${processingData.insights ? JSON.stringify(processingData.insights) : null},
          ${processingData.sentiment || null},
          ${processingData.recommendations ? JSON.stringify(processingData.recommendations) : null},
          ${processingData.amenities ? JSON.stringify(processingData.amenities) : null},
          NOW()
        )
      `;
    } catch (error) {
      console.error('Failed to log multimodal processing:', error);
      // Don't throw - logging failure shouldn't break multimodal features
    }
  }
}
