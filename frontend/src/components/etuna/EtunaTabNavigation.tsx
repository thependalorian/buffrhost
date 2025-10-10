'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface EtunaTabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function EtunaTabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}: EtunaTabNavigationProps) {
  return (
    <div className={`tabs tabs-boxed ${className}`}>
      {tabs.map((tab) => {
        const TabIcon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <TabIcon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}