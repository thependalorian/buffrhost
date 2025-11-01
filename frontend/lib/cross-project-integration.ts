/**
 * Cross-Project Integration Service for Buffr Host
 * Enables seamless user experience across all Buffr ecosystem projects
 */

import BuffrIDService, {
  BuffrIDComponents,
  ProjectType,
  CountryCode,
} from './buffr-id-service';

export interface CrossProjectUser {
  buffrId: string;
  entityType: 'IND' | 'PROP' | 'ORG';
  projects: ProjectType[];
  primaryProject: ProjectType;
  country: string;
  isVerified: boolean;
  lastActive: Date;
}

export interface ProjectUserData {
  project: ProjectType;
  buffrId: string;
  userId: string;
  userData: unknown;
  lastLogin: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface PropertyData {
  buffrId: string;
  propertyId: string;
  name: string;
  type: string;
  location: string;
  ownerId: string;
  status: string;
  lastActivity: Date;
}

export class CrossProjectIntegrationService {
  private static readonly API_BASE_URLS = {
    PAY: process.env['BUFFR_PAY_API_URL'] || 'https://pay.buffr.ai/api',
    SIGN: process.env['BUFFR_SIGN_API_URL'] || 'https://sign.buffr.ai/api',
    LEND: process.env['BUFFR_LEND_API_URL'] || 'https://lend.buffr.ai/api',
    HOST: process.env['BUFFR_HOST_API_URL'] || 'https://host.buffr.ai/api',
  };

  /**
   * Get user's Buffr ID across all projects
   */
  static async getUserBuffrIDs(
    userIdentifier: string,
    country: string = 'NA'
  ): Promise<CrossProjectUser | null> {
    try {
      // Query all projects for user data
      const projectData = await Promise.allSettled([
        this.getProjectUserData('PAY', userIdentifier, country),
        this.getProjectUserData('SIGN', userIdentifier, country),
        this.getProjectUserData('LEND', userIdentifier, country),
        this.getProjectUserData('HOST', userIdentifier, country),
      ]);

      const validProjects = projectData
        .filter(
          (result): result is PromiseFulfilledResult<ProjectUserData> =>
            result.status === 'fulfilled' && result.value !== null
        )
        .map((result) => result.value);

      if (validProjects.length === 0) {
        return null;
      }

      // Get primary project (most recent activity)
      const primaryProject = validProjects.sort(
        (a, b) => b.lastLogin.getTime() - a.lastLogin.getTime()
      )[0];

      if (!primaryProject) {
        return null;
      }

      return {
        buffrId: primaryProject.buffrId,
        entityType: this.getEntityTypeFromProject(primaryProject.project),
        projects: validProjects.map((p) => p.project),
        primaryProject: primaryProject.project,
        country,
        isVerified: validProjects.every((p) => p.status === 'active'),
        lastActive: primaryProject.lastLogin,
      };
    } catch (error) {
      console.error('Error getting user Buffr IDs:', error);
      return null;
    }
  }

  /**
   * Get property's Buffr ID across all projects
   */
  static async getPropertyBuffrIDs(
    propertyIdentifier: string,
    ownerId: string,
    country: string = 'NA'
  ): Promise<PropertyData | null> {
    try {
      // For properties, we primarily work within HOST project
      // but we can check if the property owner has accounts in other projects
      const ownerData = await this.getUserBuffrIDs(ownerId, country);

      if (!ownerData) {
        return null;
      }

      // Generate property Buffr ID for HOST project
      const propertyCode = `${propertyIdentifier.toLowerCase().replace(/\s+/g, '-')}-${ownerId}`;
      const propertyBuffrId = BuffrIDService.generatePropertyID(
        'HOST',
        country as CountryCode,
        propertyCode,
        ownerId
      );

      return {
        buffrId: propertyBuffrId,
        propertyId: propertyIdentifier,
        name: propertyIdentifier,
        type: 'property',
        location: 'Unknown', // Would be filled from property data
        ownerId,
        status: 'active',
        lastActivity: new Date(),
      };
    } catch (error) {
      console.error('Error getting property Buffr IDs:', error);
      return null;
    }
  }

  /**
   * Get project-specific user data
   */
  private static async getProjectUserData(
    project: ProjectType,
    userIdentifier: string,
    country: string
  ): Promise<ProjectUserData | null> {
    try {
      const apiUrl = this.API_BASE_URLS[project];
      const response = await fetch(`${apiUrl}/users/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env['BUFFR_API_KEY']}`,
        },
        body: JSON.stringify({
          identifier: userIdentifier,
          country,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        project,
        buffrId: data.buffrId,
        userId: data.userId,
        userData: data.userData,
        lastLogin: new Date(data.lastLogin),
        status: data.status,
      };
    } catch (error) {
      console.error(`Error getting ${project} user data:`, error);
      return null;
    }
  }

  /**
   * Create user account across multiple projects
   */
  static async createUserAcrossProjects(userData: {
    nationalId: string;
    phoneNumber: string;
    email: string;
    fullName: string;
    country: string;
    projects: ProjectType[];
  }): Promise<{ [key in ProjectType]?: string }> {
    const results: { [key in ProjectType]?: string } = {};

    for (const project of userData.projects) {
      try {
        const buffrId = BuffrIDService.generateUserID(
          project,
          userData.country as unknown,
          userData.nationalId,
          userData.phoneNumber
        );

        // Create user in project
        const apiUrl = this.API_BASE_URLS[project];
        const response = await fetch(`${apiUrl}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env['BUFFR_API_KEY']}`,
          },
          body: JSON.stringify({
            buffrId,
            nationalId: userData.nationalId,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            fullName: userData.fullName,
            country: userData.country,
          }),
        });

        if (response.ok) {
          results[project] = buffrId;
        }
      } catch (error) {
        console.error(`Error creating user in ${project}:`, error);
      }
    }

    return results;
  }

  /**
   * Create property across multiple projects
   */
  static async createPropertyAcrossProjects(propertyData: {
    name: string;
    type: string;
    location: string;
    ownerId: string;
    ownerNationalId: string;
    country: string;
    projects: ProjectType[];
  }): Promise<{ [key in ProjectType]?: string }> {
    const results: { [key in ProjectType]?: string } = {};

    for (const project of propertyData.projects) {
      try {
        const propertyCode = `${propertyData.name.toLowerCase().replace(/\s+/g, '-')}-${propertyData.ownerId}`;
        const buffrId = BuffrIDService.generatePropertyID(
          project,
          propertyData.country as unknown,
          propertyCode,
          propertyData.ownerId
        );

        // Create property in project
        const apiUrl = this.API_BASE_URLS[project];
        const response = await fetch(`${apiUrl}/properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env['BUFFR_API_KEY']}`,
          },
          body: JSON.stringify({
            buffrId,
            name: propertyData.name,
            type: propertyData.type,
            location: propertyData.location,
            ownerId: propertyData.ownerId,
            ownerNationalId: propertyData.ownerNationalId,
            country: propertyData.country,
          }),
        });

        if (response.ok) {
          results[project] = buffrId;
        }
      } catch (error) {
        console.error(`Error creating property in ${project}:`, error);
      }
    }

    return results;
  }

  /**
   * Sync user data across projects
   */
  static async syncUserData(
    primaryBuffrId: string,
    updatedData: unknown
  ): Promise<{ [key in ProjectType]?: boolean }> {
    const results: { [key in ProjectType]?: boolean } = {};

    // Parse primary Buffr ID to get entity info
    const parsed = BuffrIDService.parseID(primaryBuffrId);
    if (!parsed) {
      throw new Error('Invalid Buffr ID format');
    }

    // Get all project IDs for this entity
    const projectIds = await this.getEntityProjectIDs(parsed);

    for (const [project, buffrId] of Object.entries(projectIds)) {
      try {
        const apiUrl = this.API_BASE_URLS[project as ProjectType];
        const response = await fetch(`${apiUrl}/users/sync`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env['BUFFR_API_KEY']}`,
          },
          body: JSON.stringify({
            buffrId,
            updatedData,
          }),
        });

        results[project as ProjectType] = response.ok;
      } catch (error) {
        console.error(`Error syncing user data in ${project}:`, error);
        results[project as ProjectType] = false;
      }
    }

    return results;
  }

  /**
   * Get all project IDs for an entity
   */
  private static async getEntityProjectIDs(
    parsed: BuffrIDComponents
  ): Promise<{ [key in ProjectType]?: string }> {
    const projectIds: { [key in ProjectType]?: string } = {};

    for (const project of ['PAY', 'SIGN', 'LEND', 'HOST'] as ProjectType[]) {
      try {
        const projectId = BuffrIDService.getProjectID(
          parsed.entityType +
            '-' +
            parsed.country +
            '-' +
            parsed.identifierHash,
          project
        );
        if (projectId) {
          projectIds[project] = projectId;
        }
      } catch (error) {
        console.error(`Error getting ${project} ID:`, error);
      }
    }

    return projectIds;
  }

  /**
   * Get entity type from project
   */
  private static getEntityTypeFromProject(
    project: ProjectType
  ): 'IND' | 'PROP' | 'ORG' {
    switch (project) {
      case 'PAY':
      case 'SIGN':
      case 'LEND':
        return 'IND';
      case 'HOST':
        return 'PROP';
      default:
        return 'IND';
    }
  }

  /**
   * Validate cross-project authentication
   */
  static async validateCrossProjectAuth(
    buffrId: string,
    targetProject: ProjectType
  ): Promise<boolean> {
    try {
      const parsed = BuffrIDService.parseID(buffrId);
      if (!parsed) {
        return false;
      }

      // Get target project ID
      const targetProjectId = BuffrIDService.getProjectID(
        buffrId,
        targetProject
      );
      if (!targetProjectId) {
        return false;
      }

      // Validate with target project
      const apiUrl = this.API_BASE_URLS[targetProject];
      const response = await fetch(`${apiUrl}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env['BUFFR_API_KEY']}`,
        },
        body: JSON.stringify({
          buffrId: targetProjectId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating cross-project auth:', error);
      return false;
    }
  }

  /**
   * Get unified user dashboard data
   */
  static async getUnifiedDashboard(buffrId: string): Promise<{
    user: CrossProjectUser;
    projects: { [key in ProjectType]?: any };
    summary: {
      totalProjects: number;
      activeProjects: number;
      lastActivity: Date;
    };
  } | null> {
    try {
      const parsed = BuffrIDService.parseID(buffrId);
      if (!parsed) {
        return null;
      }

      // Get user data from all projects
      const projectData = await Promise.allSettled([
        this.getProjectUserData('PAY', parsed.identifierHash, parsed.country),
        this.getProjectUserData('SIGN', parsed.identifierHash, parsed.country),
        this.getProjectUserData('LEND', parsed.identifierHash, parsed.country),
        this.getProjectUserData('HOST', parsed.identifierHash, parsed.country),
      ]);

      const validProjects = projectData
        .filter(
          (result): result is PromiseFulfilledResult<ProjectUserData> =>
            result.status === 'fulfilled' && result.value !== null
        )
        .map((result) => result.value);

      if (validProjects.length === 0) {
        return null;
      }

      const projects: { [key in ProjectType]?: any } = {};
      validProjects.forEach((project) => {
        projects[project.project] = project.userData;
      });

      return {
        user: {
          buffrId,
          entityType: parsed.entityType as 'IND' | 'PROP' | 'ORG',
          projects: validProjects.map((p) => p.project),
          primaryProject: validProjects[0]?.project || 'HOST',
          country: parsed.country,
          isVerified: validProjects.every((p) => p.status === 'active'),
          lastActive:
            validProjects.sort(
              (a, b) => b.lastLogin.getTime() - a.lastLogin.getTime()
            )[0]?.lastLogin || new Date(),
        },
        projects,
        summary: {
          totalProjects: validProjects.length,
          activeProjects: validProjects.filter((p) => p.status === 'active')
            .length,
          lastActivity:
            validProjects.sort(
              (a, b) => b.lastLogin.getTime() - a.lastLogin.getTime()
            )[0]?.lastLogin || new Date(),
        },
      };
    } catch (error) {
      console.error('Error getting unified dashboard:', error);
      return null;
    }
  }

  /**
   * Get property owner's cross-project data
   */
  static async getPropertyOwnerData(propertyBuffrId: string): Promise<{
    property: PropertyData;
    owner: CrossProjectUser | null;
    crossProjectData: { [key in ProjectType]?: unknown };
  } | null> {
    try {
      const parsed = BuffrIDService.parseID(propertyBuffrId);
      if (!parsed || parsed.entityType !== 'PROP') {
        return null;
      }

      // Extract owner ID from property identifier
      const ownerId = parsed.identifierHash; // This would need to be extracted from the original identifier

      // Get owner's cross-project data
      const ownerData = await this.getUserBuffrIDs(ownerId, parsed.country);

      // Get cross-project data for owner
      const crossProjectData = ownerData
        ? await this.getUnifiedDashboard(ownerData.buffrId)
        : null;

      return {
        property: {
          buffrId: propertyBuffrId,
          propertyId: parsed.identifierHash,
          name: 'Property Name', // Would be fetched from database
          type: 'property',
          location: 'Unknown',
          ownerId,
          status: 'active',
          lastActivity: new Date(),
        },
        owner: ownerData,
        crossProjectData: crossProjectData?.projects || {},
      };
    } catch (error) {
      console.error('Error getting property owner data:', error);
      return null;
    }
  }
}

export default CrossProjectIntegrationService;
