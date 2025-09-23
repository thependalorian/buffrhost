'use client';

import React from 'react';
import { useState, useEffect } from 'react';

interface Resource {
  id: string;
  name: string;
  resource_type: string;
  capacity?: number;
  is_available: boolean;
}

const ResourceList: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockResources: Resource[] = [
          { id: 'r1', name: 'Conference Room A', resource_type: 'conference_room', capacity: 20, is_available: true },
          { id: 'r2', name: 'Spa Room 3', resource_type: 'spa_treatment_room', is_available: false },
        ];
        setResources(mockResources);
      } catch (err) {
        setError('Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="resource-list">
      <h2>Resource List</h2>
      <ul>
        {resources.map(resource => (
          <li key={resource.id}>
            {resource.name} ({resource.resource_type}) - {resource.is_available ? 'Available' : 'Not Available'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceList;
