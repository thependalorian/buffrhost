'use client';
import {
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrTabs,
  BuffrTabsContent,
  BuffrTabsList,
  BuffrTabsTrigger,
} from '@/components/ui';
/**
 * Buffr ID Test Page
 *
 * Comprehensive testing page for Buffr ID system and cross-project integration
 * Features: ID generation, validation, parsing, cross-project lookup, database tests
 * Location: app/test-buffr-ids/page.tsx
 */

import React from 'react';
import BuffrIDTestComponent from '@/components/features/testing/BuffrIDTestComponent';
import CrossProjectIntegration from '@/components/features/cross-project/CrossProjectIntegration';
import { PropertyGrid } from '@/components/features/landing/PropertyCard';
import {
  BeakerIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

export default function BuffrIDTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-nude-900 mb-2">
          Buffr ID System Test Suite
        </h1>
        <p className="text-nude-600">
          Comprehensive testing and validation for the unified Buffr ID system
          across all projects.
        </p>
      </div>

      <BuffrTabs defaultValue="tests" className="space-y-6">
        <BuffrTabsList className="grid w-full grid-cols-3">
          <BuffrTabsTrigger value="tests" className="flex items-center gap-2">
            <BeakerIcon className="h-4 w-4" />
            System Tests
          </BuffrTabsTrigger>
          <BuffrTabsTrigger
            value="integration"
            className="flex items-center gap-2"
          >
            <GlobeAltIcon className="h-4 w-4" />
            Cross-Project
          </BuffrTabsTrigger>
          <BuffrTabsTrigger
            value="properties"
            className="flex items-center gap-2"
          >
            <BuildingOfficeIcon className="h-4 w-4" />
            Properties
          </BuffrTabsTrigger>
        </BuffrTabsList>

        <BuffrTabsContent value="tests" className="space-y-6">
          <BuffrCard>
            <BuffrCardHeader>
              <BuffrCardTitle>Buffr ID System Tests</BuffrCardTitle>
            </BuffrCardHeader>
            <BuffrCardContent>
              <BuffrIDTestComponent />
            </BuffrCardContent>
          </BuffrCard>
        </BuffrTabsContent>

        <BuffrTabsContent value="integration" className="space-y-6">
          <BuffrCard>
            <BuffrCardHeader>
              <BuffrCardTitle>Cross-Project Integration</BuffrCardTitle>
            </BuffrCardHeader>
            <BuffrCardContent>
              <CrossProjectIntegration />
            </BuffrCardContent>
          </BuffrCard>
        </BuffrTabsContent>

        <BuffrTabsContent value="properties" className="space-y-6">
          <BuffrCard>
            <BuffrCardHeader>
              <BuffrCardTitle>Properties with Buffr IDs</BuffrCardTitle>
            </BuffrCardHeader>
            <BuffrCardContent>
              <PropertyGrid
                properties={[]}
                showBuffrIds={true}
                onPropertyClick={(property) => {
                  console.log('Property clicked:', property);
                }}
                onCrossProjectAction={(buffrId) => {
                  console.log('Cross-project action:', buffrId);
                }}
              />
            </BuffrCardContent>
          </BuffrCard>
        </BuffrTabsContent>
      </BuffrTabs>
    </div>
  );
}
