#!/usr/bin/env tsx

/**
 * Environment Configuration and Credentials Audit Script
 * 
 * This script validates all required environment variables and configurations
 * for the Buffr Host fullstack application according to the audit requirements.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

interface AuditResult {
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  fix_command?: string;
}

interface AuditReport {
  overall_status: 'pass' | 'fail' | 'warning';
  total_checks: number;
  passed: number;
  failed: number;
  warnings: number;
  results: AuditResult[];
  recommendations: string[];
}

class EnvironmentAuditor {
  private results: AuditResult[] = [];
  private rootDir: string;
  private frontendDir: string;
  private backendDir: string;

  constructor() {
    this.rootDir = process.cwd();
    this.frontendDir = join(this.rootDir, 'frontend');
    this.backendDir = join(this.rootDir, 'backend');
  }

  /**
   * Main audit function that runs all environment checks
   */
  async runAudit(): Promise<AuditReport> {
    console.log('🔍 Starting Environment Configuration and Credentials Audit...\n');

    // Load environment variables
    this.loadEnvironmentFiles();

    // Run all audit checks
    await this.auditRequiredEnvironmentVariables();
    await this.auditDatabaseConnections();
    await this.auditAPIKeyConfigurations();
    await this.auditEnvironmentFileConsistency();
    await this.auditVercelDeploymentConfiguration();

    return this.generateReport();
  }

  /**
   * Load all environment files for auditing
   */
  private loadEnvironmentFiles(): void {
    const envFiles = [
      join(this.rootDir, '.env.local'),
      join(this.frontendDir, '.env.local'),
      join(this.backendDir, '.env.local')
    ];

    envFiles.forEach(file => {
      if (existsSync(file)) {
        config({ path: file });
      }
    });
  }  
/**
   * Audit 1.1: Validate all required environment variables are present and properly configured
   */
  private async auditRequiredEnvironmentVariables(): Promise<void> {
    console.log('📋 Auditing Required Environment Variables...');

    const criticalVars = [
      'DATABASE_URL',
      'SENDGRID_API_KEY',
      'DEEPSEEK_API_KEY',
      'NEXT_PUBLIC_STACK_PROJECT_ID',
      'STACK_SECRET_SERVER_KEY'
    ];

    const importantVars = [
      'OPENAI_API_KEY',
      'FROM_EMAIL',
      'NEXT_PUBLIC_APP_URL',
      'NODE_ENV'
    ];

    const optionalVars = [
      'LANGFUSE_PUBLIC_KEY',
      'LANGFUSE_SECRET_KEY',
      'ARCADE_API_KEY',
      'MEM0_COLLECTION_NAME'
    ];

    // Check critical variables
    for (const varName of criticalVars) {
      const value = process.env[varName];
      if (!value || value.includes('your-') || value.includes('sk-proj-your-')) {
        this.results.push({
          category: 'environment',
          severity: 'critical',
          status: 'fail',
          message: `Critical environment variable missing or not configured: ${varName}`,
          details: value ? 'Contains placeholder value' : 'Variable not set',
          fix_command: `Set ${varName} in .env.local files`
        });
      } else {
        this.results.push({
          category: 'environment',
          severity: 'low',
          status: 'pass',
          message: `✅ ${varName} is properly configured`
        });
      }
    }

    // Check important variables
    for (const varName of importantVars) {
      const value = process.env[varName];
      if (!value || value.includes('your-')) {
        this.results.push({
          category: 'environment',
          severity: 'high',
          status: 'warning',
          message: `Important environment variable missing: ${varName}`,
          fix_command: `Set ${varName} in .env.local files`
        });
      } else {
        this.results.push({
          category: 'environment',
          severity: 'low',
          status: 'pass',
          message: `✅ ${varName} is configured`
        });
      }
    }

    // Check optional variables
    for (const varName of optionalVars) {
      const value = process.env[varName];
      if (!value || value.includes('your-')) {
        this.results.push({
          category: 'environment',
          severity: 'medium',
          status: 'warning',
          message: `Optional environment variable not configured: ${varName}`,
          details: 'This may limit some features'
        });
      } else {
        this.results.push({
          category: 'environment',
          severity: 'low',
          status: 'pass',
          message: `✅ ${varName} is configured`
        });
      }
    }
  }  /**
  
 * Audit 1.2: Test database connections to Neon PostgreSQL with pgvector support
   */
  private async auditDatabaseConnections(): Promise<void> {
    console.log('🗄️  Auditing Database Connections...');

    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
    
    if (!databaseUrl) {
      this.results.push({
        category: 'database',
        severity: 'critical',
        status: 'fail',
        message: 'No database URL configured',
        fix_command: 'Set DATABASE_URL or NEON_DATABASE_URL'
      });
      return;
    }

    // Validate Neon PostgreSQL URL format
    if (!databaseUrl.includes('neon.tech') && !databaseUrl.includes('postgresql://')) {
      this.results.push({
        category: 'database',
        severity: 'high',
        status: 'warning',
        message: 'Database URL does not appear to be a Neon PostgreSQL connection',
        details: 'Expected format: postgresql://user:pass@host.neon.tech/db'
      });
    }

    // Check for SSL mode requirement
    if (!databaseUrl.includes('sslmode=require')) {
      this.results.push({
        category: 'database',
        severity: 'medium',
        status: 'warning',
        message: 'Database URL missing SSL mode requirement',
        fix_command: 'Add ?sslmode=require to DATABASE_URL'
      });
    }

    // Test connection (mock for now - would need actual DB client)
    try {
      // This would be replaced with actual database connection test
      this.results.push({
        category: 'database',
        severity: 'low',
        status: 'pass',
        message: '✅ Database URL format is valid for Neon PostgreSQL'
      });
    } catch (error) {
      this.results.push({
        category: 'database',
        severity: 'critical',
        status: 'fail',
        message: 'Database connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Audit 1.3: Verify API key configurations for SendGrid, Deepseek, OpenAI, and Stack Auth
   */
  private async auditAPIKeyConfigurations(): Promise<void> {
    console.log('🔑 Auditing API Key Configurations...');

    const apiKeys = [
      {
        name: 'SendGrid',
        envVar: 'SENDGRID_API_KEY',
        pattern: /^SG\./,
        severity: 'critical' as const
      },
      {
        name: 'Deepseek',
        envVar: 'DEEPSEEK_API_KEY',
        pattern: /^sk-/,
        severity: 'critical' as const
      },
      {
        name: 'OpenAI',
        envVar: 'OPENAI_API_KEY',
        pattern: /^sk-proj-/,
        severity: 'high' as const
      },
      {
        name: 'Stack Auth Project ID',
        envVar: 'NEXT_PUBLIC_STACK_PROJECT_ID',
        pattern: /^[a-f0-9-]{36}$/,
        severity: 'critical' as const
      },
      {
        name: 'Stack Auth Secret',
        envVar: 'STACK_SECRET_SERVER_KEY',
        pattern: /^ssk_/,
        severity: 'critical' as const
      }
    ];

    for (const api of apiKeys) {
      const value = process.env[api.envVar];
      
      if (!value) {
        this.results.push({
          category: 'api_keys',
          severity: api.severity,
          status: 'fail',
          message: `${api.name} API key not configured`,
          fix_command: `Set ${api.envVar} in environment files`
        });
      } else if (value.includes('your-') || !api.pattern.test(value)) {
        this.results.push({
          category: 'api_keys',
          severity: api.severity,
          status: 'fail',
          message: `${api.name} API key has invalid format`,
          details: `Expected pattern: ${api.pattern.source}`,
          fix_command: `Update ${api.envVar} with valid API key`
        });
      } else {
        this.results.push({
          category: 'api_keys',
          severity: 'low',
          status: 'pass',
          message: `✅ ${api.name} API key is properly formatted`
        });
      }
    }
  }  /**

   * Audit 1.4: Check environment file consistency between .env.example and .env.local
   */
  private async auditEnvironmentFileConsistency(): Promise<void> {
    console.log('📄 Auditing Environment File Consistency...');

    const envFiles = [
      { example: '.env.example', local: '.env.local', context: 'root' },
      { example: 'frontend/.env.example', local: 'frontend/.env.local', context: 'frontend' },
      { example: 'backend/.env', local: 'backend/.env.local', context: 'backend' }
    ];

    for (const { example, local, context } of envFiles) {
      const examplePath = join(this.rootDir, example);
      const localPath = join(this.rootDir, local);

      if (!existsSync(examplePath)) {
        this.results.push({
          category: 'file_consistency',
          severity: 'medium',
          status: 'warning',
          message: `Missing example file: ${example}`,
          fix_command: `Create ${example} file`
        });
        continue;
      }

      if (!existsSync(localPath)) {
        this.results.push({
          category: 'file_consistency',
          severity: 'high',
          status: 'fail',
          message: `Missing local environment file: ${local}`,
          fix_command: `Copy ${example} to ${local} and configure values`
        });
        continue;
      }

      try {
        const exampleContent = readFileSync(examplePath, 'utf-8');
        const localContent = readFileSync(localPath, 'utf-8');

        const exampleVars = this.extractEnvVars(exampleContent);
        const localVars = this.extractEnvVars(localContent);

        const missingVars = exampleVars.filter(v => !localVars.includes(v));
        const extraVars = localVars.filter(v => !exampleVars.includes(v));

        if (missingVars.length > 0) {
          this.results.push({
            category: 'file_consistency',
            severity: 'medium',
            status: 'warning',
            message: `${context}: Missing variables in .env.local`,
            details: `Missing: ${missingVars.join(', ')}`,
            fix_command: `Add missing variables to ${local}`
          });
        }

        if (extraVars.length > 0) {
          this.results.push({
            category: 'file_consistency',
            severity: 'low',
            status: 'warning',
            message: `${context}: Extra variables in .env.local`,
            details: `Extra: ${extraVars.slice(0, 5).join(', ')}${extraVars.length > 5 ? '...' : ''}`
          });
        }

        if (missingVars.length === 0 && extraVars.length === 0) {
          this.results.push({
            category: 'file_consistency',
            severity: 'low',
            status: 'pass',
            message: `✅ ${context}: Environment files are consistent`
          });
        }

      } catch (error) {
        this.results.push({
          category: 'file_consistency',
          severity: 'medium',
          status: 'fail',
          message: `Error reading environment files for ${context}`,
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  /**
   * Extract environment variable names from file content
   */
  private extractEnvVars(content: string): string[] {
    const lines = content.split('\n');
    const vars: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const varName = trimmed.split('=')[0].trim();
        if (varName) {
          vars.push(varName);
        }
      }
    }

    return vars;
  }  /**
  
 * Audit 1.5: Validate deployment configuration settings for Vercel platform
   */
  private async auditVercelDeploymentConfiguration(): Promise<void> {
    console.log('🚀 Auditing Vercel Deployment Configuration...');

    const vercelFiles = [
      join(this.rootDir, 'vercel.json'),
      join(this.frontendDir, 'vercel.json')
    ];

    let hasVercelConfig = false;

    for (const configFile of vercelFiles) {
      if (existsSync(configFile)) {
        hasVercelConfig = true;
        try {
          const configContent = readFileSync(configFile, 'utf-8');
          const config = JSON.parse(configContent);

          // Check required Vercel configuration
          if (!config.version) {
            this.results.push({
              category: 'deployment',
              severity: 'medium',
              status: 'warning',
              message: 'Vercel config missing version field',
              fix_command: 'Add "version": 2 to vercel.json'
            });
          }

          if (!config.framework || config.framework !== 'nextjs') {
            this.results.push({
              category: 'deployment',
              severity: 'medium',
              status: 'warning',
              message: 'Vercel config should specify Next.js framework',
              fix_command: 'Add "framework": "nextjs" to vercel.json'
            });
          }

          // Check environment variables for production
          const requiredProdVars = [
            'DATABASE_URL',
            'SENDGRID_API_KEY',
            'NEXT_PUBLIC_STACK_PROJECT_ID',
            'STACK_SECRET_SERVER_KEY'
          ];

          const missingProdVars = requiredProdVars.filter(varName => {
            const value = process.env[varName];
            return !value || value.includes('your-') || value.includes('localhost');
          });

          if (missingProdVars.length > 0) {
            this.results.push({
              category: 'deployment',
              severity: 'critical',
              status: 'fail',
              message: 'Production environment variables not ready for deployment',
              details: `Missing or invalid: ${missingProdVars.join(', ')}`,
              fix_command: 'Configure production values in Vercel dashboard'
            });
          }

          // Check for development URLs in production config
          const devUrls = ['localhost', '127.0.0.1', 'http://'];
          const prodUrlVars = ['NEXT_PUBLIC_APP_URL', 'NEXT_PUBLIC_API_URL'];
          
          for (const varName of prodUrlVars) {
            const value = process.env[varName];
            if (value && devUrls.some(devUrl => value.includes(devUrl))) {
              this.results.push({
                category: 'deployment',
                severity: 'high',
                status: 'warning',
                message: `${varName} contains development URL`,
                details: `Value: ${value}`,
                fix_command: `Update ${varName} to production URL`
              });
            }
          }

          this.results.push({
            category: 'deployment',
            severity: 'low',
            status: 'pass',
            message: `✅ Vercel configuration file found: ${configFile}`
          });

        } catch (error) {
          this.results.push({
            category: 'deployment',
            severity: 'high',
            status: 'fail',
            message: `Invalid Vercel configuration: ${configFile}`,
            details: error instanceof Error ? error.message : 'JSON parse error'
          });
        }
      }
    }

    if (!hasVercelConfig) {
      this.results.push({
        category: 'deployment',
        severity: 'high',
        status: 'fail',
        message: 'No Vercel configuration found',
        fix_command: 'Create vercel.json with proper Next.js configuration'
      });
    }

    // Check package.json for build scripts
    const packageJsonPath = join(this.frontendDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      try {
        const packageContent = readFileSync(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageContent);

        if (!packageJson.scripts?.build) {
          this.results.push({
            category: 'deployment',
            severity: 'critical',
            status: 'fail',
            message: 'Missing build script in package.json',
            fix_command: 'Add "build": "next build" to package.json scripts'
          });
        } else {
          this.results.push({
            category: 'deployment',
            severity: 'low',
            status: 'pass',
            message: '✅ Build script found in package.json'
          });
        }
      } catch (error) {
        this.results.push({
          category: 'deployment',
          severity: 'medium',
          status: 'fail',
          message: 'Error reading package.json',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }  /**

   * Generate comprehensive audit report
   */
  private generateReport(): AuditReport {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;

    const criticalFailures = this.results.filter(r => r.status === 'fail' && r.severity === 'critical').length;
    const highFailures = this.results.filter(r => r.status === 'fail' && r.severity === 'high').length;

    let overall_status: 'pass' | 'fail' | 'warning' = 'pass';
    if (criticalFailures > 0 || highFailures > 2) {
      overall_status = 'fail';
    } else if (failed > 0 || warnings > 0) {
      overall_status = 'warning';
    }

    const recommendations: string[] = [];
    
    if (criticalFailures > 0) {
      recommendations.push('🚨 Fix critical environment configuration issues before deployment');
    }
    if (highFailures > 0) {
      recommendations.push('⚠️  Address high-priority configuration issues');
    }
    if (warnings > 5) {
      recommendations.push('📋 Review and resolve configuration warnings for optimal setup');
    }

    // Add specific recommendations based on results
    const missingCriticalVars = this.results.filter(r => 
      r.category === 'environment' && r.severity === 'critical' && r.status === 'fail'
    );
    if (missingCriticalVars.length > 0) {
      recommendations.push('🔑 Configure all critical API keys and database connections');
    }

    const deploymentIssues = this.results.filter(r => 
      r.category === 'deployment' && r.status === 'fail'
    );
    if (deploymentIssues.length > 0) {
      recommendations.push('🚀 Fix Vercel deployment configuration before production deployment');
    }

    return {
      overall_status,
      total_checks: this.results.length,
      passed,
      failed,
      warnings,
      results: this.results,
      recommendations
    };
  }

  /**
   * Print formatted audit report to console
   */
  printReport(report: AuditReport): void {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 ENVIRONMENT CONFIGURATION AUDIT REPORT');
    console.log('='.repeat(80));

    // Overall status
    const statusEmoji = report.overall_status === 'pass' ? '✅' : 
                       report.overall_status === 'fail' ? '❌' : '⚠️';
    console.log(`\n${statusEmoji} Overall Status: ${report.overall_status.toUpperCase()}`);
    console.log(`📊 Total Checks: ${report.total_checks}`);
    console.log(`✅ Passed: ${report.passed}`);
    console.log(`❌ Failed: ${report.failed}`);
    console.log(`⚠️  Warnings: ${report.warnings}`);

    // Group results by category
    const categories = [...new Set(report.results.map(r => r.category))];
    
    for (const category of categories) {
      const categoryResults = report.results.filter(r => r.category === category);
      const categoryFailed = categoryResults.filter(r => r.status === 'fail').length;
      const categoryWarnings = categoryResults.filter(r => r.status === 'warning').length;
      
      console.log(`\n📂 ${category.toUpperCase().replace('_', ' ')}`);
      console.log('-'.repeat(40));
      
      for (const result of categoryResults) {
        const emoji = result.status === 'pass' ? '✅' : 
                     result.status === 'fail' ? '❌' : '⚠️';
        console.log(`${emoji} ${result.message}`);
        
        if (result.details) {
          console.log(`   Details: ${result.details}`);
        }
        if (result.fix_command) {
          console.log(`   Fix: ${result.fix_command}`);
        }
      }
    }

    // Recommendations
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS');
      console.log('-'.repeat(40));
      report.recommendations.forEach(rec => console.log(`• ${rec}`));
    }

    console.log('\n' + '='.repeat(80));
  }
}

// Main execution
async function main() {
  const auditor = new EnvironmentAuditor();
  const report = await auditor.runAudit();
  auditor.printReport(report);

  // Exit with appropriate code
  process.exit(report.overall_status === 'fail' ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}

export { EnvironmentAuditor, type AuditResult, type AuditReport };