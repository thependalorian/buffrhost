/**
 * KYC Analytics Utilities
 *
 * Purpose: Analytics and monitoring for KYC verification processes
 * Location: /lib/analytics/kyc-analytics.ts
 * Usage: Track KYC performance, conversion rates, and compliance metrics
 *
 * Follows Rules:
 * - Real-time analytics collection
 * - Performance monitoring
 * - Business intelligence tracking
 * - Compliance reporting
 */

interface KycAnalyticsEvent {
  eventType: string;
  propertyId: string;
  userId?: string;
  timestamp: string;
  metadata: Record<string, any>;
}

interface KycMetrics {
  totalSubmissions: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  averageProcessingTime: number;
  conversionRate: number;
  documentSuccessRate: number;
  fraudDetectionRate: number;
}

/**
 * Track KYC-related events for analytics
 */
export async function trackKycEvent(
  eventType: string,
  propertyId: string,
  userId?: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  const event: KycAnalyticsEvent = {
    eventType,
    propertyId,
    userId,
    timestamp: new Date().toISOString(),
    metadata,
  };

  // In production, this would send to analytics service
  console.log('KYC Analytics Event:', event);

  // Store locally for immediate processing (in production, use proper analytics service)
  try {
    const events = JSON.parse(
      localStorage.getItem('kyc-analytics-events') || '[]'
    );
    events.push(event);

    // Keep only last 1000 events
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }

    localStorage.setItem('kyc-analytics-events', JSON.stringify(events));
  } catch (error) {
    console.warn('Failed to store analytics event:', error);
  }
}

/**
 * Calculate KYC performance metrics
 */
export function calculateKycMetrics(events: KycAnalyticsEvent[]): KycMetrics {
  const submissions = events.filter((e) => e.eventType === 'kyc_submitted');
  const approvals = events.filter((e) => e.eventType === 'kyc_approved');
  const rejections = events.filter((e) => e.eventType === 'kyc_rejected');
  const pendings = events.filter((e) => e.eventType === 'kyc_pending');

  const totalSubmissions = submissions.length;
  const approvedCount = approvals.length;
  const rejectedCount = rejections.length;
  const pendingCount = pendings.length;

  // Calculate average processing time
  const processingTimes: number[] = [];
  submissions.forEach((submission) => {
    const approval = approvals.find(
      (a) => a.propertyId === submission.propertyId
    );
    if (approval) {
      const submitTime = new Date(submission.timestamp).getTime();
      const approveTime = new Date(approval.timestamp).getTime();
      processingTimes.push(approveTime - submitTime);
    }
  });

  const averageProcessingTime =
    processingTimes.length > 0
      ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
      : 0;

  const conversionRate =
    totalSubmissions > 0 ? (approvedCount / totalSubmissions) * 100 : 0;

  // Document upload success rate
  const documentUploads = events.filter(
    (e) => e.eventType === 'document_uploaded'
  );
  const documentFailures = events.filter(
    (e) => e.eventType === 'document_upload_failed'
  );
  const totalDocumentAttempts =
    documentUploads.length + documentFailures.length;
  const documentSuccessRate =
    totalDocumentAttempts > 0
      ? (documentUploads.length / totalDocumentAttempts) * 100
      : 100;

  // Fraud detection rate
  const fraudFlags = events.filter((e) => e.eventType === 'fraud_detected');
  const fraudDetectionRate =
    totalSubmissions > 0 ? (fraudFlags.length / totalSubmissions) * 100 : 0;

  return {
    totalSubmissions,
    approvedCount,
    rejectedCount,
    pendingCount,
    averageProcessingTime,
    conversionRate,
    documentSuccessRate,
    fraudDetectionRate,
  };
}

/**
 * Get KYC analytics dashboard data
 */
export function getKycAnalyticsDashboard(): {
  metrics: KycMetrics;
  recentEvents: KycAnalyticsEvent[];
  trends: {
    submissionsLast7Days: number;
    approvalsLast7Days: number;
    averageProcessingTimeLast7Days: number;
  };
} {
  try {
    const events: KycAnalyticsEvent[] = JSON.parse(
      localStorage.getItem('kyc-analytics-events') || '[]'
    );

    const metrics = calculateKycMetrics(events);

    // Get recent events (last 10)
    const recentEvents = events
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    // Calculate 7-day trends
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEvents7Days = events.filter(
      (e) => new Date(e.timestamp) >= sevenDaysAgo
    );

    const submissionsLast7Days = recentEvents7Days.filter(
      (e) => e.eventType === 'kyc_submitted'
    ).length;

    const approvalsLast7Days = recentEvents7Days.filter(
      (e) => e.eventType === 'kyc_approved'
    ).length;

    const processingTimes7Days = recentEvents7Days
      .filter((e) => e.eventType === 'kyc_submitted')
      .map((submission) => {
        const approval = recentEvents7Days.find(
          (a) =>
            a.eventType === 'kyc_approved' &&
            a.propertyId === submission.propertyId
        );
        if (approval) {
          return (
            new Date(approval.timestamp).getTime() -
            new Date(submission.timestamp).getTime()
          );
        }
        return null;
      })
      .filter((time) => time !== null) as number[];

    const averageProcessingTimeLast7Days =
      processingTimes7Days.length > 0
        ? processingTimes7Days.reduce((a, b) => a + b, 0) /
          processingTimes7Days.length
        : 0;

    return {
      metrics,
      recentEvents,
      trends: {
        submissionsLast7Days,
        approvalsLast7Days,
        averageProcessingTimeLast7Days,
      },
    };
  } catch (error) {
    console.error('Failed to get analytics dashboard:', error);
    return {
      metrics: {
        totalSubmissions: 0,
        approvedCount: 0,
        rejectedCount: 0,
        pendingCount: 0,
        averageProcessingTime: 0,
        conversionRate: 0,
        documentSuccessRate: 100,
        fraudDetectionRate: 0,
      },
      recentEvents: [],
      trends: {
        submissionsLast7Days: 0,
        approvalsLast7Days: 0,
        averageProcessingTimeLast7Days: 0,
      },
    };
  }
}

/**
 * Generate compliance report for KYC activities
 */
export function generateComplianceReport(events: KycAnalyticsEvent[]): {
  reportPeriod: string;
  summary: KycMetrics;
  complianceIssues: string[];
  recommendations: string[];
} {
  const metrics = calculateKycMetrics(events);

  const complianceIssues: string[] = [];
  const recommendations: string[] = [];

  // Check conversion rate (should be above 80%)
  if (metrics.conversionRate < 80) {
    complianceIssues.push(
      `Low approval rate: ${metrics.conversionRate.toFixed(1)}%`
    );
    recommendations.push(
      'Review approval criteria and provide clearer guidelines to users'
    );
  }

  // Check processing time (should be under 48 hours)
  if (metrics.averageProcessingTime > 172800000) {
    // 48 hours in milliseconds
    complianceIssues.push('Average processing time exceeds 48 hours');
    recommendations.push(
      'Optimize review process and consider automation improvements'
    );
  }

  // Check document success rate (should be above 95%)
  if (metrics.documentSuccessRate < 95) {
    complianceIssues.push(
      `Low document upload success rate: ${metrics.documentSuccessRate.toFixed(1)}%`
    );
    recommendations.push(
      'Improve file upload error handling and user guidance'
    );
  }

  // Check fraud detection rate (should be reasonable)
  if (metrics.fraudDetectionRate > 10) {
    complianceIssues.push(
      `High fraud detection rate: ${metrics.fraudDetectionRate.toFixed(1)}%`
    );
    recommendations.push(
      'Review fraud detection rules to avoid false positives'
    );
  }

  return {
    reportPeriod: `${new Date().toISOString().split('T')[0]} Report`,
    summary: metrics,
    complianceIssues,
    recommendations,
  };
}

/**
 * Track user journey through KYC process
 */
export function trackKycJourney(
  propertyId: string,
  userId: string,
  step: string,
  additionalData?: Record<string, any>
): void {
  trackKycEvent('kyc_journey_step', propertyId, userId, {
    step,
    ...additionalData,
  });
}

/**
 * Track document-related events
 */
export function trackDocumentEvent(
  propertyId: string,
  documentType: string,
  eventType: 'uploaded' | 'processed' | 'rejected' | 'failed',
  metadata?: Record<string, any>
): void {
  trackKycEvent(`document_${eventType}`, propertyId, undefined, {
    documentType,
    ...metadata,
  });
}

/**
 * Track verification results
 */
export function trackVerificationResult(
  propertyId: string,
  result: 'approved' | 'rejected' | 'pending',
  processingTime?: number,
  reviewerNotes?: string
): void {
  trackKycEvent(`kyc_${result}`, propertyId, undefined, {
    processingTime,
    reviewerNotes,
  });
}

// Export analytics utilities
export const KYC_ANALYTICS_UTILS = {
  trackKycEvent,
  calculateKycMetrics,
  getKycAnalyticsDashboard,
  generateComplianceReport,
  trackKycJourney,
  trackDocumentEvent,
  trackVerificationResult,
};
