/**
 * BuffrSign-Starter: Collaboration Indicator Component
 * Shows real-time collaboration status and participants
 */

import React from 'react';
import { CollaborationAction } from '../../types/signature';

interface CollaborationIndicatorProps {
  participants: string[];
  actions: CollaborationAction[];
  isSigning: boolean;
}

const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({
  participants,
  actions,
  isSigning
}) => {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'field_update':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'signature':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      case 'comment':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'status_change':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getActionDescription = (action: CollaborationAction) => {
    switch (action.type) {
      case 'field_update':
        return `Updated field ${action.data.field_id}`;
      case 'signature':
        return `Completed signature`;
      case 'comment':
        return `Added comment`;
      case 'status_change':
        return `Changed status to ${action.data.status}`;
      default:
        return `Performed ${action.type}`;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="collaboration-indicator">
      {/* Live Status */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`indicator-dot ${participants.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className="text-sm font-medium">
          {participants.length > 0 ? `${participants.length} participant${participants.length !== 1 ? 's' : ''} online` : 'No active participants'}
        </span>
        {isSigning && (
          <span className="badge badge-warning badge-sm animate-pulse">
            Signing in progress...
          </span>
        )}
      </div>

      {/* Recent Actions */}
      {actions.length > 0 && (
        <div className="recent-actions">
          <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {actions.slice(-5).reverse().map((action, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-base-content/70">
                <div className="flex-shrink-0">
                  {getActionIcon(action.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">
                    {getActionDescription(action)}
                  </div>
                  <div className="text-xs text-base-content/50">
                    {action.user_id} • {formatTimestamp(action.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collaboration Tips */}
      <div className="collaboration-tips mt-3 p-3 bg-base-200 rounded-lg">
        <h5 className="text-sm font-medium mb-2">Collaboration Tips</h5>
        <ul className="text-xs text-base-content/70 space-y-1">
          <li>• Changes are saved automatically</li>
          <li>• Multiple users can sign simultaneously</li>
          <li>• Real-time updates show all activity</li>
          <li>• Comments and changes are tracked</li>
        </ul>
      </div>

      <style jsx>{`
        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CollaborationIndicator;