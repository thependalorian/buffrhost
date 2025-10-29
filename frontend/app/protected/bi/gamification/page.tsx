'use client';
import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrBadge,
} from '@/components/ui';
/**
 * Gamification ML BI Dashboard
 * Displays gamification system performance and user engagement
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function GamificationDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [leaderboard, setLeaderboard] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, leaderboardData, qualityData] = await Promise.all([
        biService.getGamificationMetrics(),
        biService.getGamificationLeaderboard(),
        biService.getDataQualityMetrics(),
      ]);

      setMetrics(metricsData);
      setLeaderboard(leaderboardData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load gamification dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('gamification', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure gamification system');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.7) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Engagement Rate',
          value: metrics.accuracy * 100,
          target: 80,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.8 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Retention Rate',
          value: metrics.precision * 100,
          target: 70,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.7 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Achievement Rate',
          value: metrics.recall * 100,
          target: 60,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.recall >= 0.6 ? ('good' as const) : ('warning' as const),
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nude-900"></div>
      </div>
    );
  }

  return (
    <MLDashboardLayout
      title="Gamification ML Dashboard"
      description="Monitor gamification system performance and user engagement"
      status={getStatus()}
      lastUpdated={lastUpdated}
      onRefresh={handleRefresh}
      onExport={handleExport}
      onConfigure={handleConfigure}
    >
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Active Players
            </BuffrCardTitle>
            <BuffrIcon name="users" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">8,456</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Points Earned
            </BuffrCardTitle>
            <BuffrIcon name="star" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">234,567</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Achievements
            </BuffrCardTitle>
            <BuffrIcon
              name="trophy"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Unlocked this week</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Avg. Session
            </BuffrCardTitle>
            <BuffrIcon
              name="target"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">23.5 min</div>
            <p className="text-xs text-muted-foreground">
              +2.3 min from last week
            </p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Gamification ML Performance"
        metrics={modelMetrics}
        modelVersion="v2.1.7"
        lastTrained="2 days ago"
      />

      {/* Leaderboard */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Top Performers</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {leaderboard.slice(0, 10).map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-nude-200">
                    <span className="text-sm font-semibold">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Level {player.level} • {player.achievements} achievements
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {player.points.toLocaleString()} pts
                  </div>
                  <BuffrBadge variant="outline">{player.rank}</BuffrBadge>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Game Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Popular Challenges</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-3">
              {[
                {
                  name: 'Daily Check-in Streak',
                  participants: 4567,
                  completion: 78,
                },
                { name: 'Budget Master', participants: 2345, completion: 65 },
                {
                  name: 'Savings Champion',
                  participants: 1890,
                  completion: 82,
                },
                {
                  name: 'Investment Explorer',
                  participants: 1234,
                  completion: 71,
                },
              ].map((challenge, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{challenge.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {challenge.participants} participants
                    </p>
                  </div>
                  <div className="text-right">
                    <BuffrBadge variant="outline">
                      {challenge.completion}%
                    </BuffrBadge>
                  </div>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Reward Distribution</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-3">
              {[
                {
                  reward: 'Discount Coupons',
                  distributed: 1234,
                  value: '$12,340',
                },
                {
                  reward: 'Loyalty Points',
                  distributed: 5678,
                  value: '56,780 pts',
                },
                {
                  reward: 'Premium Features',
                  distributed: 890,
                  value: '$8,900',
                },
                { reward: 'Gift Cards', distributed: 234, value: '$2,340' },
              ].map((reward, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{reward.reward}</p>
                    <p className="text-sm text-muted-foreground">
                      {reward.distributed} distributed
                    </p>
                  </div>
                  <div className="text-right">
                    <BuffrBadge variant="outline">{reward.value}</BuffrBadge>
                  </div>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>
      </div>
    </MLDashboardLayout>
  );
}
