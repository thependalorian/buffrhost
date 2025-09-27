/**
 * Email Preferences Form Component
 * 
 * Form for managing email notification preferences
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Bell, 
  Settings, 
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface EmailPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  bookingConfirmations: boolean;
  paymentReceipts: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  emailFrequency: 'immediate' | 'daily' | 'weekly';
  preferredLanguage: string;
  timezone: string;
}

interface EmailPreferencesFormProps {
  preferences?: EmailPreferences;
  onSave?: (preferences: EmailPreferences) => void;
  onReset?: () => void;
}

export default function EmailPreferencesForm({ 
  preferences, 
  onSave, 
  onReset 
}: EmailPreferencesFormProps) {
  const [formData, setFormData] = useState<EmailPreferences>(
    preferences || {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingConfirmations: true,
      paymentReceipts: true,
      marketingEmails: false,
      systemAlerts: true,
      weeklyReports: true,
      monthlyReports: false,
      emailFrequency: 'immediate',
      preferredLanguage: 'en',
      timezone: 'UTC'
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCheckboxChange = (field: keyof EmailPreferences, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleInputChange = (field: keyof EmailPreferences, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(preferences || {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingConfirmations: true,
      paymentReceipts: true,
      marketingEmails: false,
      systemAlerts: true,
      weeklyReports: true,
      monthlyReports: false,
      emailFrequency: 'immediate',
      preferredLanguage: 'en',
      timezone: 'UTC'
    });
    onReset?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Preferences</h1>
          <p className="text-gray-600">Manage your email notification settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>

      {isSaved && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Preferences saved successfully!
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailNotifications"
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => handleCheckboxChange('emailNotifications', checked as boolean)}
            />
            <Label htmlFor="emailNotifications">Email Notifications</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="smsNotifications"
              checked={formData.smsNotifications}
              onCheckedChange={(checked) => handleCheckboxChange('smsNotifications', checked as boolean)}
            />
            <Label htmlFor="smsNotifications">SMS Notifications</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="pushNotifications"
              checked={formData.pushNotifications}
              onCheckedChange={(checked) => handleCheckboxChange('pushNotifications', checked as boolean)}
            />
            <Label htmlFor="pushNotifications">Push Notifications</Label>
          </div>
        </CardContent>
      </Card>

      {/* Email Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bookingConfirmations"
              checked={formData.bookingConfirmations}
              onCheckedChange={(checked) => handleCheckboxChange('bookingConfirmations', checked as boolean)}
            />
            <Label htmlFor="bookingConfirmations">Booking Confirmations</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="paymentReceipts"
              checked={formData.paymentReceipts}
              onCheckedChange={(checked) => handleCheckboxChange('paymentReceipts', checked as boolean)}
            />
            <Label htmlFor="paymentReceipts">Payment Receipts</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketingEmails"
              checked={formData.marketingEmails}
              onCheckedChange={(checked) => handleCheckboxChange('marketingEmails', checked as boolean)}
            />
            <Label htmlFor="marketingEmails">Marketing Emails</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="systemAlerts"
              checked={formData.systemAlerts}
              onCheckedChange={(checked) => handleCheckboxChange('systemAlerts', checked as boolean)}
            />
            <Label htmlFor="systemAlerts">System Alerts</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="weeklyReports"
              checked={formData.weeklyReports}
              onCheckedChange={(checked) => handleCheckboxChange('weeklyReports', checked as boolean)}
            />
            <Label htmlFor="weeklyReports">Weekly Reports</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="monthlyReports"
              checked={formData.monthlyReports}
              onCheckedChange={(checked) => handleCheckboxChange('monthlyReports', checked as boolean)}
            />
            <Label htmlFor="monthlyReports">Monthly Reports</Label>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Advanced Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailFrequency">Email Frequency</Label>
            <select
              id="emailFrequency"
              value={formData.emailFrequency}
              onChange={(e) => handleInputChange('emailFrequency', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Preferred Language</Label>
            <select
              id="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              placeholder="UTC"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}