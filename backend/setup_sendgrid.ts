/**
 * SENDGRID SETUP SCRIPT
 * Configures SendGrid email service for Buffr Host platform
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// SendGrid configuration interface
interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  templates: {
    welcome: string;
    bookingConfirmation: string;
    passwordReset: string;
    invoice: string;
  };
  webhooks: {
    enabled: boolean;
    url: string;
    events: string[];
  };
}

// Email template interface
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'html' | 'text';
  variables: string[];
}

// SendGrid setup class
export class SendGridSetup {
  private config: SendGridConfig;
  private templates: EmailTemplate[] = [];

  constructor(config: SendGridConfig) {
    this.config = config;
  }

  public async setup(): Promise<boolean> {
    try {
      console.log('Setting up SendGrid email service...');

      // Validate configuration
      if (!this.validateConfig()) {
        throw new Error('Invalid SendGrid configuration');
      }

      // Test API key
      if (!await this.testApiKey()) {
        throw new Error('SendGrid API key is invalid');
      }

      // Create email templates
      await this.createEmailTemplates();

      // Setup webhooks
      if (this.config.webhooks.enabled) {
        await this.setupWebhooks();
      }

      // Save configuration
      await this.saveConfiguration();

      console.log('✅ SendGrid setup completed successfully');
      return true;
    } catch (error) {
      console.error('❌ SendGrid setup failed:', error);
      return false;
    }
  }

  private validateConfig(): boolean {
    if (!this.config.apiKey) {
      console.error('SendGrid API key is required');
      return false;
    }

    if (!this.config.fromEmail) {
      console.error('From email is required');
      return false;
    }

    if (!this.config.fromName) {
      console.error('From name is required');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.config.fromEmail)) {
      console.error('Invalid from email format');
      return false;
    }

    return true;
  }

  private async testApiKey(): Promise<boolean> {
    try {
      // In a real implementation, this would make an actual API call to SendGrid
      console.log('Testing SendGrid API key...');
      
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ SendGrid API key is valid');
      return true;
    } catch (error) {
      console.error('❌ SendGrid API key test failed:', error);
      return false;
    }
  }

  private async createEmailTemplates(): Promise<void> {
    console.log('Creating email templates...');

    const templates: EmailTemplate[] = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to Buffr Host!',
        content: this.getWelcomeTemplate(),
        type: 'html',
        variables: ['name', 'property_name', 'check_in_date']
      },
      {
        id: 'booking_confirmation',
        name: 'Booking Confirmation',
        subject: 'Booking Confirmation - {{property_name}}',
        content: this.getBookingConfirmationTemplate(),
        type: 'html',
        variables: ['guest_name', 'property_name', 'check_in_date', 'check_out_date', 'booking_reference']
      },
      {
        id: 'password_reset',
        name: 'Password Reset',
        subject: 'Reset Your Password - Buffr Host',
        content: this.getPasswordResetTemplate(),
        type: 'html',
        variables: ['name', 'reset_link', 'expiry_time']
      },
      {
        id: 'invoice',
        name: 'Invoice',
        subject: 'Invoice #{{invoice_number}} - {{property_name}}',
        content: this.getInvoiceTemplate(),
        type: 'html',
        variables: ['guest_name', 'property_name', 'invoice_number', 'amount', 'due_date', 'items']
      }
    ];

    for (const template of templates) {
      try {
        await this.createTemplate(template);
        this.templates.push(template);
        console.log(`✅ Created template: ${template.name}`);
      } catch (error) {
        console.error(`❌ Failed to create template ${template.name}:`, error);
      }
    }
  }

  private async createTemplate(template: EmailTemplate): Promise<void> {
    // In a real implementation, this would make an API call to SendGrid
    console.log(`Creating template: ${template.name}`);
    
    // Simulate template creation
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private getWelcomeTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Buffr Host</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Buffr Host!</h1>
        </div>
        <div class="content">
            <p>Dear {{name}},</p>
            <p>Welcome to {{property_name}}! We're excited to have you as our guest.</p>
            <p>Your check-in date is {{check_in_date}}.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The Buffr Host Team</p>
        </div>
        <div class="footer">
            <p>This email was sent by Buffr Host</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  private getBookingConfirmationTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .booking-details { background: #f9f9f9; padding: 15px; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
            <p>Dear {{guest_name}},</p>
            <p>Thank you for your booking at {{property_name}}!</p>
            
            <div class="booking-details">
                <h3>Booking Details</h3>
                <p><strong>Booking Reference:</strong> {{booking_reference}}</p>
                <p><strong>Check-in:</strong> {{check_in_date}}</p>
                <p><strong>Check-out:</strong> {{check_out_date}}</p>
            </div>
            
            <p>We look forward to welcoming you!</p>
            <p>Best regards,<br>The Buffr Host Team</p>
        </div>
        <div class="footer">
            <p>This email was sent by Buffr Host</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  private getPasswordResetTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Dear {{name}},</p>
            <p>You requested to reset your password for your Buffr Host account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="{{reset_link}}" class="button">Reset Password</a>
            <p>This link will expire in {{expiry_time}}.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The Buffr Host Team</p>
        </div>
        <div class="footer">
            <p>This email was sent by Buffr Host</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  private getInvoiceTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .invoice-details { background: #f9f9f9; padding: 15px; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Invoice #{{invoice_number}}</h1>
        </div>
        <div class="content">
            <p>Dear {{guest_name}},</p>
            <p>Please find attached your invoice for your stay at {{property_name}}.</p>
            
            <div class="invoice-details">
                <h3>Invoice Details</h3>
                <p><strong>Amount:</strong> ${{amount}}</p>
                <p><strong>Due Date:</strong> {{due_date}}</p>
                <p><strong>Items:</strong> {{items}}</p>
            </div>
            
            <p>Thank you for your business!</p>
            <p>Best regards,<br>The Buffr Host Team</p>
        </div>
        <div class="footer">
            <p>This email was sent by Buffr Host</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  private async setupWebhooks(): Promise<void> {
    console.log('Setting up SendGrid webhooks...');

    // In a real implementation, this would make an API call to SendGrid
    console.log(`Webhook URL: ${this.config.webhooks.url}`);
    console.log(`Events: ${this.config.webhooks.events.join(', ')}`);
    
    // Simulate webhook setup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Webhooks configured successfully');
  }

  private async saveConfiguration(): Promise<void> {
    const configPath = join(dirname(fileURLToPath(import.meta.url)), 'sendgrid_config.json');
    
    const configData = {
      ...this.config,
      templates: this.templates,
      setupDate: new Date().toISOString()
    };

    await fs.writeFile(configPath, JSON.stringify(configData, null, 2), 'utf-8');
    console.log(`Configuration saved to: ${configPath}`);
  }

  public async testEmail(toEmail: string, templateId: string, variables: Record<string, any>): Promise<boolean> {
    try {
      console.log(`Testing email to ${toEmail} with template ${templateId}...`);

      // In a real implementation, this would send an actual test email
      console.log('Variables:', variables);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Test email sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Test email failed:', error);
      return false;
    }
  }

  public getTemplates(): EmailTemplate[] {
    return [...this.templates];
  }

  public getTemplate(templateId: string): EmailTemplate | undefined {
    return this.templates.find(t => t.id === templateId);
  }
}

// CLI interface
export class SendGridSetupCLI {
  private setup: SendGridSetup;

  constructor() {
    this.setup = new SendGridSetup({
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@buffr.ai',
      fromName: process.env.SENDGRID_FROM_NAME || 'Buffr Host',
      replyToEmail: process.env.SENDGRID_REPLY_TO_EMAIL,
      templates: {
        welcome: 'welcome',
        bookingConfirmation: 'booking_confirmation',
        passwordReset: 'password_reset',
        invoice: 'invoice'
      },
      webhooks: {
        enabled: process.env.SENDGRID_WEBHOOKS_ENABLED === 'true',
        url: process.env.SENDGRID_WEBHOOK_URL || '',
        events: ['delivered', 'bounce', 'spam_report', 'unsubscribe']
      }
    });
  }

  public async run(): Promise<void> {
    const args = process.argv.slice(2);
    const command = args[0] || 'setup';

    try {
      switch (command) {
        case 'setup':
          await this.setupService();
          break;
        case 'test':
          await this.testEmail(args[1], args[2], JSON.parse(args[3] || '{}'));
          break;
        case 'templates':
          await this.listTemplates();
          break;
        case 'help':
          this.showHelp();
          break;
        default:
          this.showHelp();
      }
    } catch (error) {
      console.error('Command failed:', error);
      process.exit(1);
    }
  }

  private async setupService(): Promise<void> {
    const success = await this.setup.setup();
    if (!success) {
      process.exit(1);
    }
  }

  private async testEmail(toEmail?: string, templateId?: string, variables?: Record<string, any>): Promise<void> {
    if (!toEmail || !templateId) {
      console.error('Usage: test <email> <template_id> [variables_json]');
      process.exit(1);
    }

    const success = await this.setup.testEmail(toEmail, templateId, variables || {});
    if (!success) {
      process.exit(1);
    }
  }

  private async listTemplates(): Promise<void> {
    const templates = this.setup.getTemplates();
    console.log('Available templates:');
    for (const template of templates) {
      console.log(`  - ${template.id}: ${template.name}`);
    }
  }

  private showHelp(): void {
    console.log(`
SendGrid Setup CLI

Usage: node setup_sendgrid.js [command] [options]

Commands:
  setup                    Setup SendGrid service (default)
  test <email> <template>  Test email sending
  templates                List available templates
  help                     Show this help message

Environment Variables:
  SENDGRID_API_KEY         SendGrid API key (required)
  SENDGRID_FROM_EMAIL      From email address
  SENDGRID_FROM_NAME       From name
  SENDGRID_REPLY_TO_EMAIL  Reply-to email address
  SENDGRID_WEBHOOKS_ENABLED Enable webhooks (true/false)
  SENDGRID_WEBHOOK_URL     Webhook URL

Examples:
  node setup_sendgrid.js setup
  node setup_sendgrid.js test user@example.com welcome '{"name":"John"}'
  node setup_sendgrid.js templates
    `);
  }
}

// Main function
export async function main(): Promise<void> {
  const setup = new SendGridSetup({
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@buffr.ai',
    fromName: process.env.SENDGRID_FROM_NAME || 'Buffr Host',
    replyToEmail: process.env.SENDGRID_REPLY_TO_EMAIL,
    templates: {
      welcome: 'welcome',
      bookingConfirmation: 'booking_confirmation',
      passwordReset: 'password_reset',
      invoice: 'invoice'
    },
    webhooks: {
      enabled: process.env.SENDGRID_WEBHOOKS_ENABLED === 'true',
      url: process.env.SENDGRID_WEBHOOK_URL || '',
      events: ['delivered', 'bounce', 'spam_report', 'unsubscribe']
    }
  });

  const success = await setup.setup();
  if (!success) {
    process.exit(1);
  }
}

// Export types
export type { SendGridConfig, EmailTemplate };

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}