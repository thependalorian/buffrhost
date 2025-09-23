
'use client';

import { useState, useEffect } from 'react';
// Assuming a hook for email preferences exists or will be created
// import { useEmailPreferences } from '@/lib/hooks/useEmailPreferences';

export function EmailPreferencesForm() {
  // const { preferences, loading, error, updatePreferences } = useEmailPreferences(userId);
  const [preferences, setPreferences] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPreferences({
        marketing_emails: true,
        notification_emails: true,
        system_emails: false,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleToggle = (key: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // await updatePreferences(preferences);
    alert('Saving preferences...');
    setTimeout(() => {
      setIsSaving(false);
      alert('Preferences saved!');
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Email Preferences</h2>
      {loading && <p>Loading preferences...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Marketing Emails</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={preferences.marketing_emails || false}
              onChange={() => handleToggle('marketing_emails')}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Notification Emails</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={preferences.notification_emails || false}
              onChange={() => handleToggle('notification_emails')}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">System Emails (e.g., security alerts)</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={preferences.system_emails || false}
              onChange={() => handleToggle('system_emails')}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}
