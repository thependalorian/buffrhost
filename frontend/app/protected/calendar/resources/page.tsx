'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import ResourceList from '@/components/calendar/ResourceList';
import ResourceForm from '@/components/calendar/ResourceForm';

const ResourcesPage: React.FC = () => {
  const handleAddResource = (data: any) => {
    console.log('Adding resource:', data);
    // In a real app, send data to backend
  };

  return (
    <div className="resources-page">
      <h1>Resource Management</h1>
      <ResourceList />
      <h2>Create New Resource</h2>
      <ResourceForm onSubmit={handleAddResource} />
    </div>
  );
};

export default ResourcesPage;
