
'use client';

import { useState, useEffect } from 'react';
// Assuming a hook for email health monitoring exists or will be created
// import { useEmailHealth } from '@/lib/hooks/useEmailHealth';

export default function EmailHealthMonitor() {
  // const { health, loading, error } = useEmailHealth();
  const [health, setHealth] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setHealth({
        status: 'healthy',
        sentLast24h: 1234,
        failedLast24h: 5,
        lastChecked: new Date().toLocaleString(),
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Email System Health</h2>
      {loading && <p>Loading email health...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Status</div>
          <div className={`stat-value ${health.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`}>
            {health.status}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Sent Last 24h</div>
          <div className="stat-value">{health.sentLast24h}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Failed Last 24h</div>
          <div className="stat-value">{health.failedLast24h}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Last Checked</div>
          <div className="stat-value text-sm">{health.lastChecked}</div>
        </div>
      </div>
    </div>
  );
}
