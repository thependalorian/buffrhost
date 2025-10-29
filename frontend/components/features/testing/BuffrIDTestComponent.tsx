'use client';
import {
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrInput,
  BuffrBadge,
  BuffrAlert,
} from '@/components/ui';
/**
 * Buffr ID Test Component
 *
 * Comprehensive testing component for Buffr ID system and cross-project integration
 * Features: ID generation, validation, parsing, cross-project lookup
 * Location: components/features/testing/BuffrIDTestComponent.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  BuffrIDService,
  BuffrIDComponents,
  EntityType,
  ProjectType,
  CountryCode,
} from '@/lib/buffr-id-service';
import { CrossProjectIntegrationService } from '@/lib/cross-project-integration';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  BeakerIcon,
  CodeBracketIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  data?: unknown;
}

export default function BuffrIDTestComponent() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [customId, setCustomId] = useState('');
  const [testId, setTestId] = useState('');

  const addTestResult = (
    test: string,
    status: 'pass' | 'fail' | 'pending',
    message: string,
    data?: unknown) => {
    setTestResults((prev) => [...prev, { test, status, message, data }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Buffr ID Generation
      addTestResult(
        'ID Generation',
        'pending',
        'Testing Buffr ID generation...'
      );

      const testUserId = BuffrIDService.generateUserID(
        'HOST',
        'NA',
        'NA123456789',
        '+264811234567'
      );
      const testPropertyId = BuffrIDService.generatePropertyID(
        'HOST',
        'NA',
        'test-property-123',
        'owner-456'
      );
      const testOrgId = BuffrIDService.generateOrganizationID(
        'HOST',
        'NA',
        'BR123456',
        'Test Organization'
      );

      if (testUserId && testPropertyId && testOrgId) {
        addTestResult(
          'ID Generation',
          'pass',
          'All ID types generated successfully',
          {
            userId: testUserId,
            propertyId: testPropertyId,
            orgId: testOrgId,
          }
        );
      } else {
        addTestResult('ID Generation', 'fail', 'Failed to generate some IDs');
      }

      // Test 2: Buffr ID Validation
      addTestResult(
        'ID Validation',
        'pending',
        'Testing Buffr ID validation...'
      );

      const validId = testUserId;
      const invalidId = 'INVALID-ID';

      const isValid = BuffrIDService.validateID(validId);
      const isInvalid = BuffrIDService.validateID(invalidId);

      if (isValid && !isInvalid) {
        addTestResult('ID Validation', 'pass', 'Validation working correctly', {
          validId,
          invalidId,
        });
      } else {
        addTestResult(
          'ID Validation',
          'fail',
          'Validation not working correctly'
        );
      }

      // Test 3: Buffr ID Parsing
      addTestResult('ID Parsing', 'pending', 'Testing Buffr ID parsing...');

      const parsed = BuffrIDService.parseID(validId);

      if (
        parsed &&
        parsed.entityType === 'IND' &&
        parsed.project === 'HOST' &&
        parsed.country === 'NA'
      ) {
        addTestResult(
          'ID Parsing',
          'pass',
          'Parsing working correctly',
          parsed
        );
      } else {
        addTestResult('ID Parsing', 'fail', 'Parsing not working correctly');
      }

      // Test 4: Same Entity Check
      addTestResult(
        'Same Entity Check',
        'pending',
        'Testing same entity detection...'
      );

      const sameEntityId1 = BuffrIDService.generateUserID(
        'HOST',
        'NA',
        'NA123456789',
        '+264811234567'
      );
      const sameEntityId2 = BuffrIDService.generateUserID(
        'SIGN',
        'NA',
        'NA123456789',
        '+264811234567'
      );
      const differentEntityId = BuffrIDService.generateUserID(
        'HOST',
        'NA',
        'NA987654321',
        '+264819876543'
      );

      const isSame = BuffrIDService.isSameEntity(sameEntityId1, sameEntityId2);
      const isDifferent = BuffrIDService.isSameEntity(
        sameEntityId1,
        differentEntityId
      );

      if (isSame && !isDifferent) {
        addTestResult(
          'Same Entity Check',
          'pass',
          'Same entity detection working correctly'
        );
      } else {
        addTestResult(
          'Same Entity Check',
          'fail',
          'Same entity detection not working correctly'
        );
      }

      // Test 5: Project ID Generation
      addTestResult(
        'Project ID Generation',
        'pending',
        'Testing project ID generation...'
      );

      const projectId = BuffrIDService.getProjectID(validId, 'SIGN');

      if (projectId && projectId !== validId) {
        addTestResult(
          'Project ID Generation',
          'pass',
          'Project ID generation working correctly',
          {
            originalId: validId,
            projectId,
          }
        );
      } else {
        addTestResult(
          'Project ID Generation',
          'fail',
          'Project ID generation not working correctly'
        );
      }

      // Test 6: Database Connection
      addTestResult(
        'Database Connection',
        'pending',
        'Testing database connection...'
      );

      try {
        const response = await fetch('/api/test-buffr-ids');
        const data = await response.json();

        if (data.success) {
          addTestResult(
            'Database Connection',
            'pass',
            'Database connection successful',
            data
          );
        } else {
          addTestResult(
            'Database Connection',
            'fail',
            'Database connection failed',
            data
          );
        }
      } catch (error) {
        addTestResult(
          'Database Connection',
          'fail',
          'Database connection failed',
          { error: error instanceof Error ? error.message : String(error) }
        );
      }

      // Test 7: Cross-Project Integration
      addTestResult(
        'Cross-Project Integration',
        'pending',
        'Testing cross-project integration...'
      );

      try {
        const user = await CrossProjectIntegrationService.getUserBuffrIDs(
          'NA123456789',
          'NA'
        );

        if (user) {
          addTestResult(
            'Cross-Project Integration',
            'pass',
            'Cross-project integration working',
            user
          );
        } else {
          addTestResult(
            'Cross-Project Integration',
            'pass',
            'Cross-project integration working (no user found, expected)'
          );
        }
      } catch (error) {
        addTestResult(
          'Cross-Project Integration',
          'fail',
          'Cross-project integration failed',
          { error: error instanceof Error ? error.message : String(error) }
        );
      }
    } catch (error) {
      addTestResult('Test Suite', 'fail', 'Test suite failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testCustomId = () => {
    if (!customId.trim()) return;

    setTestResults([]);

    // Test custom ID
    const isValid = BuffrIDService.validateID(customId);
    const parsed = BuffrIDService.parseID(customId);

    addTestResult(
      'Custom ID Validation',
      isValid ? 'pass' : 'fail',
      isValid ? 'Custom ID is valid' : 'Custom ID is invalid',
      { customId, parsed }
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircleIcon className="h-4 w-4 text-semantic-success" />;
      case 'fail':
        return <XCircleIcon className="h-4 w-4 text-semantic-error" />;
      case 'pending':
        return (
          <ArrowPathIcon className="h-4 w-4 text-semantic-warning animate-spin" />
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-semantic-success/10 text-semantic-success border-semantic-success/20';
      case 'fail':
        return 'bg-semantic-error/10 text-semantic-error border-semantic-error/20';
      case 'pending':
        return 'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20';
      default:
        return 'bg-nude-100 text-nude-800 border-nude-200';
    }
  };

  const passedTests = testResults.filter((r) => r.status === 'pass').length;
  const failedTests = testResults.filter((r) => r.status === 'fail').length;
  const pendingTests = testResults.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BeakerIcon className="h-5 w-5" />
            Buffr ID System Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-semantic-success">
                {passedTests}
              </p>
              <p className="text-sm text-nude-500">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-semantic-error">
                {failedTests}
              </p>
              <p className="text-sm text-nude-500">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-semantic-warning">
                {pendingTests}
              </p>
              <p className="text-sm text-nude-500">Pending</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BeakerIcon className="h-4 w-4 mr-2" />
              )}
              Run All Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom ID Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CodeBracketIcon className="h-5 w-5" />
            Test Custom Buffr ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Buffr ID to test (e.g., BFR-IND-HOST-NA-abc12345-20250128143022)"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={testCustomId} disabled={!customId.trim()}>
              Test ID
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border card"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(result.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-nude-900">
                        {result.test}
                      </h4>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-nude-600 mb-2">
                      {result.message}
                    </p>
                    {result.data && (
                      <div className="mt-2 p-2 bg-nude-50 rounded text-xs font-mono border border-nude-200">
                        <pre>{JSON.stringify(result.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sample Buffr IDs */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Buffr IDs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-nude-700">
                User ID (Individual):
              </p>
              <code className="text-xs bg-nude-100 badge badge-sm rounded border border-nude-200">
                BFR-IND-HOST-NA-abc12345-20250128143022
              </code>
            </div>
            <div>
              <p className="text-sm font-medium text-nude-700">Property ID:</p>
              <code className="text-xs bg-nude-100 badge badge-sm rounded border border-nude-200">
                BFR-PROP-HOST-NA-def67890-20250128143022
              </code>
            </div>
            <div>
              <p className="text-sm font-medium text-nude-700">
                Organization ID:
              </p>
              <code className="text-xs bg-nude-100 badge badge-sm rounded border border-nude-200">
                BFR-ORG-HOST-NA-ghi13579-20250128143022
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
