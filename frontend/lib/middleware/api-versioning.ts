/**
 * API Versioning Middleware for Buffr Host
 * @fileoverview Handles API versioning through headers, query params, and URL paths
 * @location buffr-host/frontend/lib/middleware/api-versioning.ts
 * @purpose Enables backward compatibility and smooth API evolution
 * @modularity Reusable versioning utilities and middleware
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Supported API versions
 */
export const SUPPORTED_VERSIONS = ['v1', 'v2'] as const;
export type APIVersion = (typeof SUPPORTED_VERSIONS)[number];
export const DEFAULT_VERSION: APIVersion = 'v1';

/**
 * Version information structure
 * @interface VersionInfo
 * @property {APIVersion} version - Detected API version
 * @property {string} source - Where version was detected from ('header' | 'query' | 'path' | 'default')
 * @property {boolean} isDeprecated - Whether the version is deprecated
 * @property {APIVersion} [recommendedVersion] - Recommended version if deprecated
 */
export interface VersionInfo {
  version: APIVersion;
  source: 'header' | 'query' | 'path' | 'default';
  isDeprecated: boolean;
  recommendedVersion?: APIVersion;
}

/**
 * Deprecated versions and their recommended replacements
 */
const DEPRECATED_VERSIONS: Record<string, APIVersion> = {
  // Example: 'v1': 'v2' - if v1 becomes deprecated
};

/**
 * Extract API version from request
 * @function extractApiVersion
 * @param {NextRequest} request - Next.js request object
 * @returns {VersionInfo} Version information
 * @example
 * const versionInfo = extractApiVersion(request);
 * // Returns: { version: 'v1', source: 'header', isDeprecated: false }
 */
export function extractApiVersion(request: NextRequest): VersionInfo {
  // Priority 1: Check API-Version header
  const headerVersion =
    request.headers.get('API-Version') || request.headers.get('X-API-Version');

  if (headerVersion) {
    const normalizedVersion = normalizeVersion(headerVersion);
    if (isValidVersion(normalizedVersion)) {
      return {
        version: normalizedVersion,
        source: 'header',
        isDeprecated: DEPRECATED_VERSIONS[normalizedVersion] !== undefined,
        recommendedVersion: DEPRECATED_VERSIONS[normalizedVersion],
      };
    }
  }

  // Priority 2: Check version query parameter
  try {
    const url = new URL(request.url);
    const queryVersion =
      url.searchParams.get('version') || url.searchParams.get('api_version');

    if (queryVersion) {
      const normalizedVersion = normalizeVersion(queryVersion);
      if (isValidVersion(normalizedVersion)) {
        return {
          version: normalizedVersion,
          source: 'query',
          isDeprecated: DEPRECATED_VERSIONS[normalizedVersion] !== undefined,
          recommendedVersion: DEPRECATED_VERSIONS[normalizedVersion],
        };
      }
    }

    // Priority 3: Check URL path for versioned routes (/api/v1/...)
    const pathMatch = request.url.match(/\/api\/(v\d+)\//);
    if (pathMatch && pathMatch[1]) {
      const pathVersion = normalizeVersion(pathMatch[1]);
      if (isValidVersion(pathVersion)) {
        return {
          version: pathVersion,
          source: 'path',
          isDeprecated: DEPRECATED_VERSIONS[pathVersion] !== undefined,
          recommendedVersion: DEPRECATED_VERSIONS[pathVersion],
        };
      }
    }
  } catch (error) {
    console.warn('Failed to parse URL for version extraction:', error);
  }

  // Default: return default version
  return {
    version: DEFAULT_VERSION,
    source: 'default',
    isDeprecated: false,
  };
}

/**
 * Normalize version string to standard format (v1, v2, etc.)
 * @function normalizeVersion
 * @param {string} version - Version string to normalize
 * @returns {APIVersion} Normalized version
 */
function normalizeVersion(version: string): APIVersion {
  const trimmed = version.trim().toLowerCase();

  // Handle formats: "v1", "1", "V1", etc.
  if (trimmed.startsWith('v')) {
    return trimmed as APIVersion;
  }

  return `v${trimmed}` as APIVersion;
}

/**
 * Check if version is valid and supported
 * @function isValidVersion
 * @param {string} version - Version to validate
 * @returns {boolean} Whether version is valid
 */
function isValidVersion(version: string): version is APIVersion {
  return SUPPORTED_VERSIONS.includes(version as APIVersion);
}

/**
 * Middleware to validate and handle API versioning
 * @function withApiVersioning
 * @param {Function} handler - API route handler
 * @param {APIVersion[]} [supportedVersions] - Versions this endpoint supports (default: all)
 * @returns {Function} Wrapped handler with versioning
 */
export function withApiVersioning(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  supportedVersions?: APIVersion[]
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const versionInfo = extractApiVersion(request);

    // Check if requested version is supported by this endpoint
    if (supportedVersions && !supportedVersions.includes(versionInfo.version)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNSUPPORTED_VERSION',
            message: `API version ${versionInfo.version} is not supported for this endpoint`,
            details: {
              requestedVersion: versionInfo.version,
              supportedVersions,
            },
          },
          metadata: {
            timestamp: new Date().toISOString(),
            version: DEFAULT_VERSION,
          },
        },
        {
          status: 400,
          headers: {
            'X-API-Version': versionInfo.version,
            'X-Supported-Versions': supportedVersions.join(', '),
          },
        }
      );
    }

    // Warn if version is deprecated
    if (versionInfo.isDeprecated) {
      console.warn(
        `[Deprecated API Version] ${versionInfo.version} is deprecated. Recommended: ${versionInfo.recommendedVersion}`
      );
    }

    // Add version to context
    if (!context) context = {};
    context.apiVersion = versionInfo.version;
    context.versionInfo = versionInfo;

    // Execute handler
    const response = await handler(request, context);

    // Add version headers to response
    response.headers.set('X-API-Version', versionInfo.version);

    if (versionInfo.isDeprecated) {
      response.headers.set('X-API-Version-Deprecated', 'true');
      if (versionInfo.recommendedVersion) {
        response.headers.set(
          'X-API-Version-Recommended',
          versionInfo.recommendedVersion
        );
      }
    }

    response.headers.set('X-Supported-Versions', SUPPORTED_VERSIONS.join(', '));

    return response;
  };
}

/**
 * Get version-specific route handler
 * Routes requests to appropriate version handler based on API version
 * @function createVersionedHandler
 * @param {Record<APIVersion, Function>} handlers - Version-specific handlers
 * @returns {Function} Combined handler that routes to correct version
 */
export function createVersionedHandler(
  handlers: Partial<
    Record<
      APIVersion,
      (request: NextRequest, context?: any) => Promise<NextResponse>
    >
  >
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const versionInfo = extractApiVersion(request);
    const handler = handlers[versionInfo.version];

    if (!handler) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VERSION_NOT_IMPLEMENTED',
            message: `Handler for API version ${versionInfo.version} is not implemented`,
            details: {
              requestedVersion: versionInfo.version,
              availableVersions: Object.keys(handlers),
            },
          },
          metadata: {
            timestamp: new Date().toISOString(),
            version: DEFAULT_VERSION,
          },
        },
        {
          status: 501,
          headers: {
            'X-API-Version': versionInfo.version,
            'X-Available-Versions': Object.keys(handlers).join(', '),
          },
        }
      );
    }

    return handler(request, context);
  };
}
