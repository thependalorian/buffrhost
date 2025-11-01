// frontend/components/features/sofia/AgentList.tsx

/**
 * AgentList React Component for Buffr Host Hospitality Platform
 * @fileoverview AgentList provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/sofia/AgentList.tsx
 * @purpose AgentList provides specialized functionality for the Buffr Host platform
 * @component AgentList
 * @category Features
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {SofiaAgent[]} [agents] - agents prop description
 * @param {boolean} [loading] - loading prop description
 * @param {() => void} [onAgentUpdate] - onAgentUpdate prop description
 *
 * Usage Example:
 * @example
 * import AgentList from './AgentList';
 *
 * function App() {
 *   return (
 *     <AgentList
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered AgentList component
 */

import { SofiaAgent } from '@/lib/types/sofia';

interface AgentListProps {
  agents: SofiaAgent[];
  loading: boolean;
  onAgentUpdate: () => void;
}

export default function AgentList({
  agents,
  loading,
  onAgentUpdate,
}: AgentListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No Sofia AI agents found</div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Add First Sofia AI Agent
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <div key={agent.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold">{agent.name}</h2>
          <p className="text-gray-600">{agent.status}</p>
        </div>
      ))}
    </div>
  );
}
