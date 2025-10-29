'use client';

import React, { useState, useEffect } from 'react';
import type { User } from '@/payload-types';

interface CRMDashboardProps {
  user: User;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  status: string;
  lifetime_value: number;
  last_activity: string;
  personal_info?: {
    name: string;
  };
  type: string;
  lead_score?: number;
}

interface Property {
  id: string;
  name: string;
  type: string;
  location: {
    city: string;
  };
  status: string;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  spent: number;
  leads: number;
  type: string;
  total_budget: number;
  spent_amount: number;
}

interface Analytics {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  color: string;
  metric_name: string;
  metric_value: string | number;
  analytics_type: string;
  created_at: string;
}

interface Event {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  event_type: string;
  entity_type: string;
  created_at: string;
}

interface Workflow {
  id: string;
  name: string;
  status: string;
  triggers: number;
  conversions: number;
  type: string;
  created_at: string;
}

export const CRMDashboard = ({ user }: CRMDashboardProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCRMData = async () => {
      try {
        const [
          customersRes,
          propertiesRes,
          campaignsRes,
          analyticsRes,
          eventsRes,
          workflowsRes,
        ] = await Promise.all([
          fetch(
            `/api/v1/crm-customers?where[organization_id][equals]=${user.tenant_id}&limit=50&sort=-created_at`
          ),
          fetch(
            `/api/v1/crm-properties?where[organization_id][equals]=${user.tenant_id}&limit=50`
          ),
          fetch(
            `/api/v1/crm-campaigns?where[organization_id][equals]=${user.tenant_id}&limit=50&sort=-created_at`
          ),
          fetch(
            `/api/v1/crm-analytics?where[organization_id][equals]=${user.tenant_id}&limit=50&sort=-created_at`
          ),
          fetch(
            `/api/v1/crm-events?where[organization_id][equals]=${user.tenant_id}&limit=50&sort=-created_at`
          ),
          fetch(
            `/api/v1/crm-workflows?where[organization_id][equals]=${user.tenant_id}&limit=50`
          ),
        ]);

        const customersData = await customersRes.json();
        const propertiesData = await propertiesRes.json();
        const campaignsData = await campaignsRes.json();
        const analyticsData = await analyticsRes.json();
        const eventsData = await eventsRes.json();
        const workflowsData = await workflowsRes.json();

        setCustomers(customersData.docs || []);
        setProperties(propertiesData.docs || []);
        setCampaigns(campaignsData.docs || []);
        setAnalytics(analyticsData.docs || []);
        setEvents(eventsData.docs || []);
        setWorkflows(workflowsData.docs || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CRM data:', error);
        setLoading(false);
      }
    };

    fetchCRMData();
  }, [user.tenant_id]);

  if (loading) {
    return <div className="loading-spinner">Loading CRM data...</div>;
  }

  // Calculate CRM metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const totalRevenue = customers.reduce(
    (sum, c) => sum + (c.lifetime_value || 0),
    0
  );
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const totalProperties = properties.length;
  const totalEvents = events.length;

  return (
    <div className="crm-dashboard">
      <h2>CRM Management</h2>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Customers"
          value={totalCustomers}
          icon="👥"
          color="blue"
        />
        <MetricCard
          title="Active Customers"
          value={activeCustomers}
          icon="✅"
          color="green"
        />
        <MetricCard
          title="Total Revenue"
          value={`N$${totalRevenue.toLocaleString()}`}
          icon="💰"
          color="purple"
        />
        <MetricCard
          title="Active Campaigns"
          value={activeCampaigns}
          icon="📢"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* CRM Customers */}
        <div className="dashboard-card customers-card">
          <h3>Recent Customers</h3>
          <div className="customers-list">
            {customers.slice(0, 10).map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
            {customers.length === 0 && (
              <p className="no-customers">
                No customers found.{' '}
                <a href="/admin/collections/crm-customers/create">
                  Create your first customer
                </a>
              </p>
            )}
          </div>
          <a href="/admin/collections/crm-customers" className="view-all-link">
            Manage All Customers →
          </a>
        </div>

        {/* CRM Properties */}
        <div className="dashboard-card properties-card">
          <h3>CRM Properties</h3>
          <div className="properties-list">
            {properties.slice(0, 10).map((property) => (
              <CRMPropertyCard key={property.id} property={property} />
            ))}
            {properties.length === 0 && (
              <p className="no-properties">No CRM properties found</p>
            )}
          </div>
          <a href="/admin/collections/crm-properties" className="view-all-link">
            Manage All Properties →
          </a>
        </div>

        {/* CRM Campaigns */}
        <div className="dashboard-card campaigns-card">
          <h3>Active Campaigns</h3>
          <div className="campaigns-list">
            {campaigns.slice(0, 10).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
            {campaigns.length === 0 && (
              <p className="no-campaigns">
                No campaigns found.{' '}
                <a href="/admin/collections/crm-campaigns/create">
                  Create your first campaign
                </a>
              </p>
            )}
          </div>
          <a href="/admin/collections/crm-campaigns" className="view-all-link">
            Manage All Campaigns →
          </a>
        </div>

        {/* CRM Analytics */}
        <div className="dashboard-card analytics-card">
          <h3>CRM Analytics</h3>
          <div className="analytics-list">
            {analytics.slice(0, 10).map((metric) => (
              <CRMAnalyticsCard key={metric.id} metric={metric} />
            ))}
            {analytics.length === 0 && (
              <p className="no-analytics">No analytics data yet</p>
            )}
          </div>
          <a href="/admin/collections/crm-analytics" className="view-all-link">
            View All Analytics →
          </a>
        </div>

        {/* CRM Events */}
        <div className="dashboard-card events-card">
          <h3>Recent Events</h3>
          <div className="events-list">
            {events.slice(0, 10).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {events.length === 0 && (
              <p className="no-events">No events found</p>
            )}
          </div>
          <a href="/admin/collections/crm-events" className="view-all-link">
            View All Events →
          </a>
        </div>

        {/* CRM Workflows */}
        <div className="dashboard-card workflows-card">
          <h3>Active Workflows</h3>
          <div className="workflows-list">
            {workflows.slice(0, 10).map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
            {workflows.length === 0 && (
              <p className="no-workflows">
                No workflows found.{' '}
                <a href="/admin/collections/crm-workflows/create">
                  Create your first workflow
                </a>
              </p>
            )}
          </div>
          <a href="/admin/collections/crm-workflows" className="view-all-link">
            Manage All Workflows →
          </a>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <a
              href="/admin/collections/crm-customers/create"
              className="action-btn primary"
            >
              Add Customer
            </a>
            <a
              href="/admin/collections/crm-campaigns/create"
              className="action-btn secondary"
            >
              Create Campaign
            </a>
            <a
              href="/admin/collections/crm-workflows/create"
              className="action-btn secondary"
            >
              Create Workflow
            </a>
            <a
              href="/admin/collections/crm-analytics"
              className="action-btn secondary"
            >
              View Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const MetricCard = ({ title, value, icon, color }: MetricCardProps) => (
  <div className={`metric-card ${color}`}>
    <div className="metric-icon">{icon}</div>
    <div className="metric-content">
      <h4>{title}</h4>
      <div className="metric-value">{value}</div>
    </div>
  </div>
);

interface CustomerCardProps {
  customer: Customer;
}

const CustomerCard = ({ customer }: CustomerCardProps) => (
  <div className="customer-card">
    <div className="customer-info">
      <h4>{customer.personal_info?.name || 'Unknown Customer'}</h4>
      <p>Type: {customer.type}</p>
      <p>
        Status:{' '}
        <span className={`status-badge ${customer.status}`}>
          {customer.status}
        </span>
      </p>
      <p>LTV: N${customer.lifetime_value?.toLocaleString() || '0'}</p>
      <p>Lead Score: {customer.lead_score || 0}</p>
    </div>
    <div className="customer-actions">
      <a
        href={`/admin/collections/crm-customers/${customer.id}`}
        className="btn btn-sm"
      >
        View
      </a>
    </div>
  </div>
);

interface PropertyCardProps {
  property: Property;
}

const CRMPropertyCard = ({ property }: PropertyCardProps) => (
  <div className="property-card">
    <div className="property-info">
      <h4>{property.name}</h4>
      <p>Type: {property.type}</p>
      <p>
        Status:{' '}
        <span className={`status-badge ${property.status}`}>
          {property.status}
        </span>
      </p>
      <p>Location: {property.location?.city || 'N/A'}</p>
    </div>
  </div>
);

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => (
  <div className="campaign-card">
    <div className="campaign-info">
      <h4>{campaign.name}</h4>
      <p>Type: {campaign.type}</p>
      <p>
        Status:{' '}
        <span className={`status-badge ${campaign.status}`}>
          {campaign.status}
        </span>
      </p>
      <p>Budget: N${campaign.total_budget?.toLocaleString() || '0'}</p>
      <p>Spent: N${campaign.spent_amount?.toLocaleString() || '0'}</p>
    </div>
    <div className="campaign-actions">
      <a
        href={`/admin/collections/crm-campaigns/${campaign.id}`}
        className="btn btn-sm"
      >
        View
      </a>
    </div>
  </div>
);

interface AnalyticsCardProps {
  metric: Analytics;
}

const CRMAnalyticsCard = ({ metric }: AnalyticsCardProps) => (
  <div className="analytics-card">
    <div className="analytics-info">
      <h5>{metric.metric_name}</h5>
      <p>Value: {metric.metric_value}</p>
      <p>Type: {metric.analytics_type}</p>
      <p>Created: {formatDate(metric.created_at)}</p>
    </div>
  </div>
);

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => (
  <div className="event-card">
    <div className="event-info">
      <h5>{event.event_type}</h5>
      <p>Entity: {event.entity_type}</p>
      <p>Created: {formatDate(event.created_at)}</p>
    </div>
  </div>
);

interface WorkflowCardProps {
  workflow: Workflow;
}

const WorkflowCard = ({ workflow }: WorkflowCardProps) => (
  <div className="workflow-card">
    <div className="workflow-info">
      <h4>{workflow.name}</h4>
      <p>Type: {workflow.type}</p>
      <p>
        Status:{' '}
        <span className={`status-badge ${workflow.status}`}>
          {workflow.status}
        </span>
      </p>
      <p>Created: {formatDate(workflow.created_at)}</p>
    </div>
    <div className="workflow-actions">
      <a
        href={`/admin/collections/crm-workflows/${workflow.id}`}
        className="btn btn-sm"
      >
        Configure
      </a>
    </div>
  </div>
);

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
