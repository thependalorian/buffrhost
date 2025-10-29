'use client';

import React, { useState, useEffect } from 'react';

interface SofiaAIDashboardProps {
  user: unknown;
}

interface Agent {
  id: string;
  name: string;
  is_active: boolean;
  tenant_id: string;
  created_at: string;
  property_id?: string;
  status: string;
}

interface Conversation {
  id: string;
  agent_id: string;
  user_id: string;
  messages: (string | number | boolean)[];
  created_at: string;
  message_type: string;
  content: string;
}

interface Memory {
  id: string;
  agent_id: string;
  content: string;
  type: string;
  created_at: string;
  memory_type: string;
  importance: number;
  access_count: number;
}

interface Analytics {
  id: string;
  metric_name: string;
  metric_value: number;
  created_at: string;
  agent_id?: string;
}

interface Communication {
  id: string;
  type: string;
  content: string;
  created_at: string;
  channel: string;
  message_type: string;
  status: string;
}

export const SofiaAIDashboard = ({ user }: SofiaAIDashboardProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSofiaData = async () => {
      try {
        const [
          agentsRes,
          conversationsRes,
          memoriesRes,
          analyticsRes,
          communicationsRes,
        ] = await Promise.all([
          fetch(
            `/api/v1/sofia-agents?where[tenant_id][equals]=${user.tenant_id}&limit=20`
          ),
          fetch(
            `/api/v1/sofia-conversations?where[tenant_id][equals]=${user.tenant_id}&limit=50&sort=-created_at`
          ),
          fetch(
            `/api/v1/sofia-memories?where[tenant_id][equals]=${user.tenant_id}&limit=50&sort=-created_at`
          ),
          fetch(
            `/api/v1/sofia-analytics?where[tenant_id][equals]=${user.tenant_id}&limit=50&sort=-created_at`
          ),
          fetch(
            `/api/v1/sofia-communications?where[tenant_id][equals]=${user.tenant_id}&limit=50&sort=-created_at`
          ),
        ]);

        const agentsData = await agentsRes.json();
        const conversationsData = await conversationsRes.json();
        const memoriesData = await memoriesRes.json();
        const analyticsData = await analyticsRes.json();
        const communicationsData = await communicationsRes.json();

        setAgents(agentsData.docs || []);
        setConversations(conversationsData.docs || []);
        setMemories(memoriesData.docs || []);
        setAnalytics(analyticsData.docs || []);
        setCommunications(communicationsData.docs || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Sofia AI data:', error);
        setLoading(false);
      }
    };

    fetchSofiaData();
  }, [user.tenant_id]);

  if (loading) {
    return <div className="loading-spinner">Loading Sofia AI data...</div>;
  }

  return (
    <div className="sofia-ai-dashboard">
      <h2>Sofia AI Management</h2>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Active Agents"
          value={agents.filter((a) => a.is_active).length}
          icon="Agent"
          color="blue"
        />
        <MetricCard
          title="Total Conversations"
          value={conversations.length}
          icon="Chat"
          color="green"
        />
        <MetricCard
          title="Memory Entries"
          value={memories.length}
          icon="Memory"
          color="purple"
        />
        <MetricCard
          title="Communications Sent"
          value={communications.length}
          icon="Email"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Sofia Agents */}
        <div className="dashboard-card agents-card">
          <h3>Sofia AI Agents</h3>
          <div className="agents-list">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
            {agents.length === 0 && (
              <p className="no-agents">
                No Sofia AI agents found.{' '}
                <a href="/admin/collections/sofia-agents/create">
                  Create your first agent
                </a>
              </p>
            )}
          </div>
          <a href="/admin/collections/sofia-agents" className="view-all-link">
            Manage All Agents →
          </a>
        </div>

        {/* Recent Conversations */}
        <div className="dashboard-card conversations-card">
          <h3>Recent Conversations</h3>
          <div className="conversations-list">
            {conversations.slice(0, 10).map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
              />
            ))}
            {conversations.length === 0 && (
              <p className="no-conversations">No conversations yet</p>
            )}
          </div>
          <a
            href="/admin/collections/sofia-conversations"
            className="view-all-link"
          >
            View All Conversations →
          </a>
        </div>

        {/* Sofia Memories */}
        <div className="dashboard-card memories-card">
          <h3>Recent Memories</h3>
          <div className="memories-list">
            {memories.slice(0, 10).map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
            {memories.length === 0 && (
              <p className="no-memories">No memories yet</p>
            )}
          </div>
          <a href="/admin/collections/sofia-memories" className="view-all-link">
            View All Memories →
          </a>
        </div>

        {/* Sofia Analytics */}
        <div className="dashboard-card analytics-card">
          <h3>Performance Analytics</h3>
          <div className="analytics-list">
            {analytics.slice(0, 10).map((metric) => (
              <AnalyticsCard key={metric.id} metric={metric} />
            ))}
            {analytics.length === 0 && (
              <p className="no-analytics">No analytics data yet</p>
            )}
          </div>
          <a
            href="/admin/collections/sofia-analytics"
            className="view-all-link"
          >
            View All Analytics →
          </a>
        </div>

        {/* Sofia Communications */}
        <div className="dashboard-card communications-card">
          <h3>Recent Communications</h3>
          <div className="communications-list">
            {communications.slice(0, 10).map((comm) => (
              <CommunicationCard key={comm.id} communication={comm} />
            ))}
            {communications.length === 0 && (
              <p className="no-communications">No communications sent yet</p>
            )}
          </div>
          <a
            href="/admin/collections/sofia-communications"
            className="view-all-link"
          >
            View All Communications →
          </a>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <a
              href="/admin/collections/sofia-agents/create"
              className="action-btn primary"
            >
              Create New Agent
            </a>
            <a
              href="/admin/collections/sofia-conversations"
              className="action-btn secondary"
            >
              View Conversations
            </a>
            <a
              href="/admin/collections/sofia-memories"
              className="action-btn secondary"
            >
              Manage Memories
            </a>
            <a
              href="/admin/collections/sofia-analytics"
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

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => (
  <div className="agent-card">
    <div className="agent-info">
      <h4>{agent.name}</h4>
      <p>Property: {agent.property_id ? 'Linked' : 'Not Linked'}</p>
      <p>
        Status:{' '}
        <span className={`status-badge ${agent.status}`}>{agent.status}</span>
      </p>
      <p>Created: {formatDate(agent.created_at)}</p>
    </div>
    <div className="agent-actions">
      <a
        href={`/admin/collections/sofia-agents/${agent.id}`}
        className="btn btn-sm"
      >
        Configure
      </a>
    </div>
  </div>
);

interface ConversationCardProps {
  conversation: Conversation;
}

const ConversationCard = ({ conversation }: ConversationCardProps) => (
  <div className="conversation-card">
    <div className="conversation-info">
      <h5>{conversation.message_type}</h5>
      <p>{truncateText(conversation.content, 100)}</p>
      <p>Agent: {conversation.agent_id ? 'Active' : 'N/A'}</p>
      <p>Created: {formatDate(conversation.created_at)}</p>
    </div>
  </div>
);

interface MemoryCardProps {
  memory: Memory;
}

const MemoryCard = ({ memory }: MemoryCardProps) => (
  <div className="memory-card">
    <div className="memory-info">
      <h5>{memory.memory_type}</h5>
      <p>{truncateText(memory.content, 100)}</p>
      <p>Importance: {memory.importance}/1.0</p>
      <p>Access Count: {memory.access_count}</p>
      <p>Created: {formatDate(memory.created_at)}</p>
    </div>
  </div>
);

interface AnalyticsCardProps {
  metric: Analytics;
}

const AnalyticsCard = ({ metric }: AnalyticsCardProps) => (
  <div className="analytics-card">
    <div className="analytics-info">
      <h5>{metric.metric_name}</h5>
      <p>Value: {metric.metric_value}</p>
      <p>Agent: {metric.agent_id ? 'Active' : 'N/A'}</p>
      <p>Created: {formatDate(metric.created_at)}</p>
    </div>
  </div>
);

interface CommunicationCardProps {
  communication: Communication;
}

const CommunicationCard = ({ communication }: CommunicationCardProps) => (
  <div className="communication-card">
    <div className="communication-info">
      <h5>
        {communication.channel} - {communication.message_type}
      </h5>
      <p>{truncateText(communication.content, 100)}</p>
      <p>
        Status:{' '}
        <span className={`status-badge ${communication.status}`}>
          {communication.status}
        </span>
      </p>
      <p>Created: {formatDate(communication.created_at)}</p>
    </div>
  </div>
);

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return 'N/A';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
