#!/usr/bin/env ts-node

/**
 * Type Consistency Checker
 * Automated tool to validate consistency between PostgreSQL, TypeScript, and Zod schemas
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { z } from 'zod';

interface DatabaseField {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  constraints?: string[];
}

interface TypeScriptField {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
}

interface ZodField {
  name: string;
  schema: string;
  optional: boolean;
  validation?: string[];
}

interface ConsistencyReport {
  table: string;
  inconsistencies: Inconsistency[];
  score: number;
}

interface Inconsistency {
  field: string;
  type: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  suggestion: string;
}

class TypeConsistencyChecker {
  private databaseSchema: Map<string, DatabaseField[]> = new Map();
  private typescriptTypes: Map<string, TypeScriptField[]> = new Map();
  private zodSchemas: Map<string, ZodField[]> = new Map();
  private report: ConsistencyReport[] = [];

  constructor() {
    this.loadDatabaseSchema();
    this.loadTypeScriptTypes();
    this.loadZodSchemas();
  }

  private loadDatabaseSchema() {
    const migrationsDir = join(__dirname, '../backend/migrations');
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const content = readFileSync(join(migrationsDir, file), 'utf8');
      this.parseSQLSchema(content);
    }
  }

  private parseSQLSchema(sql: string) {
    const createTableRegex = /CREATE TABLE\s+(\w+)\s*\(([\s\S]*?)\);/gi;
    let match;

    while ((match = createTableRegex.exec(sql)) !== null) {
      const tableName = match[1];
      const tableDefinition = match[2];
      const fields = this.parseTableFields(tableDefinition);
      this.databaseSchema.set(tableName, fields);
    }
  }

  private parseTableFields(tableDefinition: string): DatabaseField[] {
    const fields: DatabaseField[] = [];
    const lines = tableDefinition.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('PRIMARY KEY') && !trimmed.startsWith('FOREIGN KEY') && !trimmed.startsWith('UNIQUE')) {
        const field = this.parseFieldDefinition(trimmed);
        if (field) {
          fields.push(field);
        }
      }
    }

    return fields;
  }

  private parseFieldDefinition(line: string): DatabaseField | null {
    const fieldRegex = /(\w+)\s+([^,\s]+(?:\([^)]+\))?)\s*(?:DEFAULT\s+([^,\s]+))?\s*(NOT NULL)?/i;
    const match = fieldRegex.exec(line);

    if (!match) return null;

    const [, name, type, defaultValue, notNull] = match;
    
    return {
      name,
      type: type.toUpperCase(),
      nullable: !notNull,
      defaultValue: defaultValue?.replace(/['"]/g, ''),
      constraints: []
    };
  }

  private loadTypeScriptTypes() {
    const typesDir = join(__dirname, '../frontend/lib/types');
    const typeFiles = readdirSync(typesDir)
      .filter(file => file.endsWith('.ts'));

    for (const file of typeFiles) {
      const content = readFileSync(join(typesDir, file), 'utf8');
      this.parseTypeScriptTypes(content, file);
    }
  }

  private parseTypeScriptTypes(content: string, filename: string) {
    const interfaceRegex = /interface\s+(\w+)\s*\{([\s\S]*?)\}/g;
    let match;

    while ((match = interfaceRegex.exec(content)) !== null) {
      const interfaceName = match[1];
      const interfaceBody = match[2];
      const fields = this.parseInterfaceFields(interfaceBody);
      this.typescriptTypes.set(interfaceName, fields);
    }
  }

  private parseInterfaceFields(interfaceBody: string): TypeScriptField[] {
    const fields: TypeScriptField[] = [];
    const lines = interfaceBody.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        const field = this.parseTypeScriptField(trimmed);
        if (field) {
          fields.push(field);
        }
      }
    }

    return fields;
  }

  private parseTypeScriptField(line: string): TypeScriptField | null {
    const fieldRegex = /(\w+)(\?)?\s*:\s*([^;]+);/;
    const match = fieldRegex.exec(line);

    if (!match) return null;

    const [, name, optional, type] = match;
    
    return {
      name,
      type: type.trim(),
      optional: !!optional,
      description: ''
    };
  }

  private loadZodSchemas() {
    const schemasDir = join(__dirname, '../frontend/lib/schemas');
    const schemaFiles = readdirSync(schemasDir)
      .filter(file => file.endsWith('.ts'));

    for (const file of schemaFiles) {
      const content = readFileSync(join(schemasDir, file), 'utf8');
      this.parseZodSchemas(content, file);
    }
  }

  private parseZodSchemas(content: string, filename: string) {
    const schemaRegex = /(\w+)Schema\s*=\s*z\.object\(\{([\s\S]*?)\}\)/g;
    let match;

    while ((match = schemaRegex.exec(content)) !== null) {
      const schemaName = match[1];
      const schemaBody = match[2];
      const fields = this.parseZodFields(schemaBody);
      this.zodSchemas.set(schemaName, fields);
    }
  }

  private parseZodFields(schemaBody: string): ZodField[] {
    const fields: ZodField[] = [];
    const lines = schemaBody.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        const field = this.parseZodField(trimmed);
        if (field) {
          fields.push(field);
        }
      }
    }

    return fields;
  }

  private parseZodField(line: string): ZodField | null {
    const fieldRegex = /(\w+):\s*z\.([^,]+),?/;
    const match = fieldRegex.exec(line);

    if (!match) return null;

    const [, name, schema] = match;
    
    return {
      name,
      schema: schema.trim(),
      optional: schema.includes('.optional()'),
      validation: []
    };
  }

  public checkConsistency(): ConsistencyReport[] {
    this.report = [];

    // Check each table/interface combination
    for (const [tableName, dbFields] of this.databaseSchema) {
      const tsFields = this.findMatchingTypeScriptFields(tableName);
      const zodFields = this.findMatchingZodFields(tableName);
      
      if (tsFields || zodFields) {
        const report = this.generateTableReport(tableName, dbFields, tsFields, zodFields);
        this.report.push(report);
      }
    }

    return this.report;
  }

  private findMatchingTypeScriptFields(tableName: string): TypeScriptField[] | null {
    // Try different naming conventions
    const possibleNames = [
      `${tableName}`,
      `${tableName}Response`,
      `${tableName}Base`,
      `${this.toPascalCase(tableName)}`,
      `${this.toPascalCase(tableName)}Response`,
      `${this.toPascalCase(tableName)}Base`
    ];

    for (const name of possibleNames) {
      if (this.typescriptTypes.has(name)) {
        return this.typescriptTypes.get(name)!;
      }
    }

    return null;
  }

  private findMatchingZodFields(tableName: string): ZodField[] | null {
    // Try different naming conventions
    const possibleNames = [
      `${tableName}Schema`,
      `${tableName}ResponseSchema`,
      `${tableName}BaseSchema`,
      `${this.toPascalCase(tableName)}Schema`,
      `${this.toPascalCase(tableName)}ResponseSchema`,
      `${this.toPascalCase(tableName)}BaseSchema`
    ];

    for (const name of possibleNames) {
      if (this.zodSchemas.has(name)) {
        return this.zodSchemas.get(name)!;
      }
    }

    return null;
  }

  private generateTableReport(
    tableName: string, 
    dbFields: DatabaseField[], 
    tsFields: TypeScriptField[] | null, 
    zodFields: ZodField[] | null
  ): ConsistencyReport {
    const inconsistencies: Inconsistency[] = [];
    let score = 100;

    // Check field existence
    for (const dbField of dbFields) {
      const tsField = tsFields?.find(f => f.name === dbField.name);
      const zodField = zodFields?.find(f => f.name === dbField.name);

      if (!tsField) {
        inconsistencies.push({
          field: dbField.name,
          type: 'missing',
          issue: 'Field missing in TypeScript interface',
          severity: 'error',
          suggestion: `Add ${dbField.name}: ${this.mapDatabaseTypeToTypeScript(dbField.type)}${dbField.nullable ? '?' : ''}`
        });
        score -= 10;
      }

      if (!zodField) {
        inconsistencies.push({
          field: dbField.name,
          type: 'missing',
          issue: 'Field missing in Zod schema',
          severity: 'error',
          suggestion: `Add ${dbField.name}: z.${this.mapDatabaseTypeToZod(dbField.type)}${dbField.nullable ? '.optional()' : ''}`
        });
        score -= 10;
      }

      // Check type consistency
      if (tsField && zodField) {
        const typeConsistency = this.checkTypeConsistency(dbField, tsField, zodField);
        if (typeConsistency.length > 0) {
          inconsistencies.push(...typeConsistency);
          score -= 5;
        }
      }
    }

    return {
      table: tableName,
      inconsistencies,
      score: Math.max(0, score)
    };
  }

  private checkTypeConsistency(
    dbField: DatabaseField, 
    tsField: TypeScriptField, 
    zodField: ZodField
  ): Inconsistency[] {
    const inconsistencies: Inconsistency[] = [];

    // Check nullable consistency
    if (dbField.nullable !== tsField.optional) {
      inconsistencies.push({
        field: dbField.name,
        type: 'nullable',
        issue: 'Nullable/optional mismatch between database and TypeScript',
        severity: 'warning',
        suggestion: `Make TypeScript field ${dbField.nullable ? 'optional' : 'required'}`
      });
    }

    if (dbField.nullable !== zodField.optional) {
      inconsistencies.push({
        field: dbField.name,
        type: 'nullable',
        issue: 'Nullable/optional mismatch between database and Zod',
        severity: 'warning',
        suggestion: `Make Zod field ${dbField.nullable ? 'optional' : 'required'}`
      });
    }

    return inconsistencies;
  }

  private mapDatabaseTypeToTypeScript(dbType: string): string {
    const typeMap: Record<string, string> = {
      'UUID': 'string',
      'VARCHAR': 'string',
      'TEXT': 'string',
      'INTEGER': 'number',
      'BIGINT': 'number',
      'DECIMAL': 'number',
      'NUMERIC': 'number',
      'BOOLEAN': 'boolean',
      'TIMESTAMP WITH TIME ZONE': 'Date',
      'TIMESTAMP': 'Date',
      'JSONB': 'Record<string, any>',
      'JSON': 'Record<string, any>'
    };

    for (const [dbTypeKey, tsType] of Object.entries(typeMap)) {
      if (dbType.includes(dbTypeKey)) {
        return tsType;
      }
    }

    return 'any';
  }

  private mapDatabaseTypeToZod(dbType: string): string {
    const typeMap: Record<string, string> = {
      'UUID': 'string().uuid()',
      'VARCHAR': 'string()',
      'TEXT': 'string()',
      'INTEGER': 'number().int()',
      'BIGINT': 'number().int()',
      'DECIMAL': 'number()',
      'NUMERIC': 'number()',
      'BOOLEAN': 'boolean()',
      'TIMESTAMP WITH TIME ZONE': 'date()',
      'TIMESTAMP': 'date()',
      'JSONB': 'record(z.any())',
      'JSON': 'record(z.any())'
    };

    for (const [dbTypeKey, zodType] of Object.entries(typeMap)) {
      if (dbType.includes(dbTypeKey)) {
        return zodType;
      }
    }

    return 'any()';
  }

  private toPascalCase(str: string): string {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  public generateReport(): string {
    let report = '# Type Consistency Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;

    // Summary
    const totalTables = this.report.length;
    const avgScore = this.report.reduce((sum, r) => sum + r.score, 0) / totalTables;
    const errorCount = this.report.reduce((sum, r) => 
      sum + r.inconsistencies.filter(i => i.severity === 'error').length, 0);
    const warningCount = this.report.reduce((sum, r) => 
      sum + r.inconsistencies.filter(i => i.severity === 'warning').length, 0);

    report += `## Summary\n\n`;
    report += `- **Total Tables**: ${totalTables}\n`;
    report += `- **Average Score**: ${avgScore.toFixed(1)}%\n`;
    report += `- **Errors**: ${errorCount}\n`;
    report += `- **Warnings**: ${warningCount}\n\n`;

    // Detailed reports
    for (const tableReport of this.report) {
      report += `## ${tableReport.table}\n\n`;
      report += `**Score**: ${tableReport.score}%\n\n`;

      if (tableReport.inconsistencies.length === 0) {
        report += `✅ **No inconsistencies found**\n\n`;
      } else {
        report += `### Issues\n\n`;
        
        for (const inconsistency of tableReport.inconsistencies) {
          const icon = inconsistency.severity === 'error' ? '❌' : 
                      inconsistency.severity === 'warning' ? '⚠️' : 'ℹ️';
          
          report += `${icon} **${inconsistency.field}** (${inconsistency.type})\n`;
          report += `- **Issue**: ${inconsistency.issue}\n`;
          report += `- **Suggestion**: ${inconsistency.suggestion}\n\n`;
        }
      }
    }

    return report;
  }

  public saveReport(filename: string = 'type-consistency-report.md') {
    const report = this.generateReport();
    const reportPath = join(__dirname, '..', filename);
    require('fs').writeFileSync(reportPath, report);
    console.log(`Report saved to: ${reportPath}`);
  }
}

// Main execution
if (require.main === module) {
  const checker = new TypeConsistencyChecker();
  const reports = checker.checkConsistency();
  
  console.log('Type Consistency Checker');
  console.log('========================');
  console.log(`Found ${reports.length} tables to check`);
  
  for (const report of reports) {
    console.log(`\n${report.table}: ${report.score}%`);
    if (report.inconsistencies.length > 0) {
      console.log(`  Issues: ${report.inconsistencies.length}`);
      for (const issue of report.inconsistencies) {
        console.log(`    - ${issue.field}: ${issue.issue}`);
      }
    }
  }
  
  checker.saveReport();
}

export default TypeConsistencyChecker;
