/**
 * Unified Buffr ID Service
 * Provides consistent ID generation across all Buffr ecosystem projects
 *
 * Format: BFR-{ENTITY_TYPE}-{PROJECT}-{COUNTRY}-{IDENTIFIER_HASH}-{TIMESTAMP}
 *
 * Entity Types: IND (Individual), PROP (Property), ORG (Organization)
 * Projects: PAY, SIGN, LEND, HOST
 * Countries: NA, ZA, BW, ZM, etc.
 */

export type EntityType = 'IND' | 'PROP' | 'ORG';
export type ProjectType = 'PAY' | 'SIGN' | 'LEND' | 'HOST';
export type CountryCode = 'NA' | 'ZA' | 'BW' | 'ZM' | 'MW' | 'SZ' | 'LS' | 'MZ';

export interface BuffrIDComponents {
  entityType: EntityType;
  project: ProjectType;
  country: CountryCode;
  identifierHash: string;
  timestamp: string;
}

export interface BuffrIDGenerationParams {
  entityType: EntityType;
  project: ProjectType;
  country: CountryCode;
  identifier: string; // National ID, Property Code, etc.
}

export class BuffrIDService {
  private static readonly BUFFR_PREFIX = 'BFR';
  private static readonly ID_REGEX =
    /^BFR-(IND|PROP|ORG)-(PAY|SIGN|LEND|HOST)-[A-Z]{2}-[a-f0-9]{8}-[0-9]{14}$/;

  /**
   * Generate a new Buffr ID
   */
  static generateID(params: BuffrIDGenerationParams): string {
    const { entityType, project, country, identifier } = params;

    // Validate inputs
    this.validateGenerationParams(params);

    // Create identifier hash (first 8 characters of SHA256)
    const identifierHash = this.createIdentifierHash(identifier);

    // Generate timestamp (YYYYMMDDHHMMSS)
    const timestamp = this.generateTimestamp();

    // Assemble Buffr ID
    return `${this.BUFFR_PREFIX}-${entityType}-${project}-${country}-${identifierHash}-${timestamp}`;
  }

  /**
   * Validate Buffr ID format
   */
  static validateID(buffrId: string): boolean {
    if (!buffrId || typeof buffrId !== 'string') {
      return false;
    }

    return this.ID_REGEX.test(buffrId);
  }

  /**
   * Parse Buffr ID into components
   */
  static parseID(buffrId: string): BuffrIDComponents | null {
    if (!this.validateID(buffrId)) {
      return null;
    }

    const parts = buffrId.split('-');
    if (parts.length !== 6) {
      return null;
    }

    return {
      entityType: parts[1] as EntityType,
      project: parts[2] as ProjectType,
      country: parts[3] as CountryCode,
      identifierHash: parts[4] || '',
      timestamp: parts[5] || '',
    };
  }

  /**
   * Check if two Buffr IDs belong to the same entity
   */
  static isSameEntity(buffrId1: string, buffrId2: string): boolean {
    const parsed1 = this.parseID(buffrId1);
    const parsed2 = this.parseID(buffrId2);

    if (!parsed1 || !parsed2) {
      return false;
    }

    return (
      parsed1.entityType === parsed2.entityType &&
      parsed1.country === parsed2.country &&
      parsed1.identifierHash === parsed2.identifierHash
    );
  }

  /**
   * Get project-specific Buffr ID for an entity
   */
  static getProjectID(
    buffrId: string,
    targetProject: ProjectType
  ): string | null {
    const parsed = this.parseID(buffrId);
    if (!parsed) {
      return null;
    }

    // If already in target project, return as-is
    if (parsed.project === targetProject) {
      return buffrId;
    }

    // Generate new ID for target project
    return this.generateID({
      entityType: parsed.entityType,
      project: targetProject,
      country: parsed.country,
      identifier: parsed.identifierHash, // Use hash as identifier for cross-project
    });
  }

  /**
   * Create identifier hash from input
   */
  private static createIdentifierHash(identifier: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(identifier.toLowerCase().trim());
    return hash.digest('hex').substring(0, 8);
  }

  /**
   * Generate timestamp in YYYYMMDDHHMMSS format
   */
  private static generateTimestamp(): string {
    const now = new Date();
    return (
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0')
    );
  }

  /**
   * Validate generation parameters
   */
  private static validateGenerationParams(
    params: BuffrIDGenerationParams
  ): void {
    const { entityType, project, country, identifier } = params;

    if (!entityType || !['IND', 'PROP', 'ORG'].includes(entityType)) {
      throw new Error('Invalid entity type. Must be IND, PROP, or ORG');
    }

    if (!project || !['PAY', 'SIGN', 'LEND', 'HOST'].includes(project)) {
      throw new Error('Invalid project type. Must be PAY, SIGN, LEND, or HOST');
    }

    if (
      !country ||
      !['NA', 'ZA', 'BW', 'ZM', 'MW', 'SZ', 'LS', 'MZ'].includes(country)
    ) {
      throw new Error(
        'Invalid country code. Must be a valid SADC country code'
      );
    }

    if (!identifier || identifier.trim().length === 0) {
      throw new Error('Identifier cannot be empty');
    }
  }

  /**
   * Generate Buffr ID for individual user
   */
  static generateUserID(
    project: ProjectType,
    country: CountryCode,
    nationalId: string,
    phoneNumber?: string
  ): string {
    // Use national ID as primary identifier, phone as fallback
    const identifier = nationalId || phoneNumber || 'unknown';

    return this.generateID({
      entityType: 'IND',
      project,
      country,
      identifier,
    });
  }

  /**
   * Generate Buffr ID for property
   */
  static generatePropertyID(
    project: ProjectType,
    country: CountryCode,
    propertyCode: string,
    ownerId?: string
  ): string {
    // Combine property code with owner ID for uniqueness
    const identifier = ownerId ? `${propertyCode}-${ownerId}` : propertyCode;

    return this.generateID({
      entityType: 'PROP',
      project,
      country,
      identifier,
    });
  }

  /**
   * Generate Buffr ID for organization
   */
  static generateOrganizationID(
    project: ProjectType,
    country: CountryCode,
    businessRegistrationNumber: string,
    organizationName?: string
  ): string {
    // Use business registration as primary identifier
    const identifier = organizationName
      ? `${businessRegistrationNumber}-${organizationName}`
      : businessRegistrationNumber;

    return this.generateID({
      entityType: 'ORG',
      project,
      country,
      identifier,
    });
  }
}

export default BuffrIDService;
