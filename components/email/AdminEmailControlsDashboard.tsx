/**
 * Admin Email Controls Dashboard for Buffr Host
 * 
 * Comprehensive dashboard for administrators to manage manual email sending,
 * view logs, and configure booking-specific email settings.
 * 
 * @author Buffr Host Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useAdminEmailControls } from '@/lib/hooks/useAdminEmailControls';
import { EmailTemplateType } from '@/lib/types/email';

const AdminEmailControlsDashboard: React.FC = () => {
  const { 
    isLoading, 
    error, 
    successMessage, 
    emailLogs, 
    sendManualEmail, 
    fetchEmailLogs, 
    cancelEmail,
    getBookingEmailAnalytics,
    clearMessages 
  } = useAdminEmailControls();

  // Form state
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [textContent, setTextContent] = useState('');
  const [templateType, setTemplateType] = useState<EmailTemplateType | ''>('');
  const [bypassChecks, setBypassChecks] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [metadata, setMetadata] = useState('');

  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(10);

  useEffect(() => {
    fetchEmailLogs(currentPage, logsPerPage);
  }, [fetchEmailLogs, currentPage, logsPerPage]);

  useEffect(() => {
    if (selectedPropertyId || selectedBookingId) {
      getBookingEmailAnalytics(selectedPropertyId || undefined, selectedBookingId || undefined)
        .then(setAnalytics);
    }
  }, [selectedPropertyId, selectedBookingId, getBookingEmailAnalytics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    try {
      const payload = {
        to,
        subject,
        htmlContent,
        textContent,
        templateType: templateType || undefined,
        metadata: metadata ? JSON.parse(metadata) : {},
        bypassAutomatedChecks: bypassChecks,
        bookingId: bookingId || undefined,
        propertyId: propertyId || undefined,
      };

      const result = await sendManualEmail(payload);
      
      if (result) {
        // Reset form
        setTo('');
        setSubject('');
        setHtmlContent('');
        setTextContent('');
        setTemplateType('');
        setBypassChecks(false);
        setBookingId('');
        setPropertyId('');
        setMetadata('');
        
        // Refresh logs
        fetchEmailLogs(currentPage, logsPerPage);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancelEmail = async (queueId: string) => {
    if (window.confirm('Are you sure you want to cancel this email?')) {
      const success = await cancelEmail(queueId);
      if (success) {
        fetchEmailLogs(currentPage, logsPerPage);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const templateOptions: { value: EmailTemplateType; label: string }[] = [
    { value: 'booking_confirmation', label: 'Booking Confirmation' },
    { value: 'checkin_reminder', label: 'Check-in Reminder' },
    { value: 'checkout_reminder', label: 'Check-out Reminder' },
    { value: 'property_update', label: 'Property Update' },
    { value: 'booking_cancellation', label: 'Booking Cancellation' },
    { value: 'host_dashboard_summary', label: 'Host Dashboard Summary' },
  ];

  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Admin Email Controls - Buffr Host</h2>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Email Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Send Manual Email</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Recipient Email</span>
                </label>
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Template Type</span>
                </label>
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value as EmailTemplateType)}
                  className="select select-bordered"
                >
                  <option value="">Select template type</option>
                  {templateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Booking ID (Optional)</span>
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="input input-bordered"
                  placeholder="For booking-specific conflict detection"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Property ID (Optional)</span>
                </label>
                <input
                  type="text"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="input input-bordered"
                  placeholder="For property-specific analytics"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">HTML Content</span>
                </label>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="textarea textarea-bordered h-32"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Text Content</span>
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="textarea textarea-bordered h-32"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Metadata (JSON)</span>
                </label>
                <textarea
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  className="textarea textarea-bordered h-20"
                  placeholder='{"key": "value"}'
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Bypass Automated Checks</span>
                  <input
                    type="checkbox"
                    checked={bypassChecks}
                    onChange={(e) => setBypassChecks(e.target.checked)}
                    className="checkbox"
                  />
                </label>
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Analytics Panel */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Booking Email Analytics</h3>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Property ID</span>
                </label>
                <input
                  type="text"
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="input input-bordered"
                  placeholder="Filter by property"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Booking ID</span>
                </label>
                <input
                  type="text"
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="input input-bordered"
                  placeholder="Filter by booking"
                />
              </div>

              {analytics && (
                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Total Emails</div>
                    <div className="stat-value">{analytics.totalEmails}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Sent Today</div>
                    <div className="stat-value text-success">{analytics.sentToday}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Failed Today</div>
                    <div className="stat-value text-error">{analytics.failedToday}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Avg Response Time</div>
                    <div className="stat-value">{Math.round(analytics.averageResponseTime / 1000)}s</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Logs */}
      <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body">
          <h3 className="card-title">Manual Email Logs</h3>
          
          {emailLogs && (
            <>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Recipient</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Sent At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailLogs.logs.map((log) => (
                      <tr key={log.id}>
                        <td>{log.recipient_email}</td>
                        <td>{log.subject}</td>
                        <td>
                          <span className={`badge ${
                            log.status === 'sent' ? 'badge-success' :
                            log.status === 'failed' ? 'badge-error' :
                            log.status === 'pending' ? 'badge-warning' :
                            'badge-neutral'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td>{new Date(log.sent_at).toLocaleString()}</td>
                        <td>
                          {log.is_queued && log.queue_id && (
                            <button
                              onClick={() => handleCancelEmail(log.queue_id)}
                              className="btn btn-sm btn-error"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {emailLogs.totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="btn-group">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn btn-sm"
                    >
                      Previous
                    </button>
                    <span className="btn btn-sm btn-active">
                      Page {currentPage} of {emailLogs.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === emailLogs.totalPages}
                      className="btn btn-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmailControlsDashboard;
