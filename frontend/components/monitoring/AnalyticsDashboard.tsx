import React, { useState, useEffect } from 'react';
import {
  trackConversion,
  trackABTest,
  trackColorPsychology,
  trackPerformance,
} from '../../utils/performance';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  description,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-semantic-success';
      case 'down':
        return 'text-semantic-error';
      default:
        return 'text-nude-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  return (
    <div className="bg-white border border-nude-200 rounded-lg p-6 shadow-nude-soft">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-nude-600">{title}</h3>
        {trend && (
          <span className={`text-sm ${getTrendColor()}`}>
            {getTrendIcon()} {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-nude-900 mb-1">{value}</div>
      {description && <p className="text-xs text-nude-500">{description}</p>}
    </div>
  );
};

interface ConversionData {
  totalConversions: number;
  conversionRate: number;
  primaryCtaClicks: number;
  secondaryCtaClicks: number;
  tertiaryCtaClicks: number;
}

interface ABTestData {
  variantA: { clicks: number; conversions: number };
  variantB: { clicks: number; conversions: number };
  variantC: { clicks: number; conversions: number };
}

interface ColorPsychologyData {
  goldClicks: number;
  mahoganyClicks: number;
  bronzeClicks: number;
  goldConversions: number;
  mahoganyConversions: number;
  bronzeConversions: number;
}

interface PerformanceData {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [conversionData, setConversionData] = useState<ConversionData>({
    totalConversions: 0,
    conversionRate: 0,
    primaryCtaClicks: 0,
    secondaryCtaClicks: 0,
    tertiaryCtaClicks: 0,
  });

  const [abTestData, setABTestData] = useState<ABTestData>({
    variantA: { clicks: 0, conversions: 0 },
    variantB: { clicks: 0, conversions: 0 },
    variantC: { clicks: 0, conversions: 0 },
  });

  const [colorData, setColorData] = useState<ColorPsychologyData>({
    goldClicks: 0,
    mahoganyClicks: 0,
    bronzeClicks: 0,
    goldConversions: 0,
    mahoganyConversions: 0,
    bronzeConversions: 0,
  });

  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);

      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - in production, this would come from your analytics API
      setConversionData({
        totalConversions: 1247,
        conversionRate: 12.3,
        primaryCtaClicks: 3421,
        secondaryCtaClicks: 1892,
        tertiaryCtaClicks: 756,
      });

      setABTestData({
        variantA: { clicks: 1200, conversions: 156 },
        variantB: { clicks: 1180, conversions: 142 },
        variantC: { clicks: 1195, conversions: 148 },
      });

      setColorData({
        goldClicks: 3421,
        mahoganyClicks: 1892,
        bronzeClicks: 756,
        goldConversions: 420,
        mahoganyConversions: 231,
        bronzeConversions: 89,
      });

      setPerformanceData({
        lcp: 1.2,
        fid: 45,
        cls: 0.05,
        fcp: 0.8,
      });

      setIsLoading(false);
    };

    loadData();
  }, []);

  const getConversionRate = (conversions: number, clicks: number) => {
    return clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0.0';
  };

  const getBestPerformingVariant = () => {
    const rates = {
      A: getConversionRate(
        abTestData.variantA.conversions,
        abTestData.variantA.clicks
      ),
      B: getConversionRate(
        abTestData.variantB.conversions,
        abTestData.variantB.clicks
      ),
      C: getConversionRate(
        abTestData.variantC.conversions,
        abTestData.variantC.clicks
      ),
    };

    const best = Object.entries(rates).reduce((a, b) =>
      parseFloat(a[1]) > parseFloat(b[1]) ? a : b
    );

    return { variant: best[0], rate: best[1] };
  };

  const getBestPerformingColor = () => {
    const rates = {
      gold: getConversionRate(colorData.goldConversions, colorData.goldClicks),
      mahogany: getConversionRate(
        colorData.mahoganyConversions,
        colorData.mahoganyClicks
      ),
      bronze: getConversionRate(
        colorData.bronzeConversions,
        colorData.bronzeClicks
      ),
    };

    const best = Object.entries(rates).reduce((a, b) =>
      parseFloat(a[1]) > parseFloat(b[1]) ? a : b
    );

    return { color: best[0], rate: best[1] };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta-primary mx-auto mb-4"></div>
          <p className="text-nude-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const bestVariant = getBestPerformingVariant();
  const bestColor = getBestPerformingColor();

  return (
    <div className="min-h-screen bg-nude-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nude-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-nude-600">
            Psychology-driven conversion optimization and performance monitoring
          </p>
        </div>

        {/* Core Web Vitals */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-nude-900 mb-6">
            Core Web Vitals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Largest Contentful Paint"
              value={`${performanceData.lcp}s`}
              trend={performanceData.lcp < 2.5 ? 'up' : 'down'}
              change={performanceData.lcp < 2.5 ? 'Good' : 'Needs Improvement'}
              description="Time to render largest content"
            />
            <MetricCard
              title="First Input Delay"
              value={`${performanceData.fid}ms`}
              trend={performanceData.fid < 100 ? 'up' : 'down'}
              change={performanceData.fid < 100 ? 'Good' : 'Needs Improvement'}
              description="Time to first user interaction"
            />
            <MetricCard
              title="Cumulative Layout Shift"
              value={performanceData.cls}
              trend={performanceData.cls < 0.1 ? 'up' : 'down'}
              change={performanceData.cls < 0.1 ? 'Good' : 'Needs Improvement'}
              description="Visual stability measure"
            />
            <MetricCard
              title="First Contentful Paint"
              value={`${performanceData.fcp}s`}
              trend={performanceData.fcp < 1.8 ? 'up' : 'down'}
              change={performanceData.fcp < 1.8 ? 'Good' : 'Needs Improvement'}
              description="Time to first content render"
            />
          </div>
        </section>

        {/* Conversion Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-nude-900 mb-6">
            Conversion Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Conversions"
              value={conversionData.totalConversions.toLocaleString()}
              trend="up"
              change="+12.5%"
              description="All conversion events"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${conversionData.conversionRate}%`}
              trend="up"
              change="+2.1%"
              description="Overall conversion rate"
            />
            <MetricCard
              title="Primary CTA Clicks"
              value={conversionData.primaryCtaClicks.toLocaleString()}
              trend="up"
              change="+8.3%"
              description="Gold button interactions"
            />
            <MetricCard
              title="Secondary CTA Clicks"
              value={conversionData.secondaryCtaClicks.toLocaleString()}
              trend="neutral"
              change="+1.2%"
              description="Mahogany button interactions"
            />
          </div>
        </section>

        {/* A/B Test Results */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-nude-900 mb-6">
            A/B Test Results
          </h2>
          <div className="bg-white border border-nude-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-nude-900 mb-2">
                  Variant A (Gold)
                </div>
                <div className="text-lg text-nude-600 mb-1">
                  {abTestData.variantA.clicks} clicks
                </div>
                <div className="text-lg text-nude-600 mb-1">
                  {abTestData.variantA.conversions} conversions
                </div>
                <div
                  className={`text-lg font-semibold ${bestVariant.variant === 'A' ? 'text-semantic-success' : 'text-nude-600'}`}
                >
                  {getConversionRate(
                    abTestData.variantA.conversions,
                    abTestData.variantA.clicks
                  )}
                  % rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-nude-900 mb-2">
                  Variant B (Mahogany)
                </div>
                <div className="text-lg text-nude-600 mb-1">
                  {abTestData.variantB.clicks} clicks
                </div>
                <div className="text-lg text-nude-600 mb-1">
                  {abTestData.variantB.conversions} conversions
                </div>
                <div
                  className={`text-lg font-semibold ${bestVariant.variant === 'B' ? 'text-semantic-success' : 'text-nude-600'}`}
                >
                  {getConversionRate(
                    abTestData.variantB.conversions,
                    abTestData.variantB.clicks
                  )}
                  % rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-nude-900 mb-2">
                  Variant C (Bronze)
                </div>
                <div className="text-lg text-nude-600 mb-1">
                  {abTestData.variantC.clicks} clicks
                </div>
                <div className="text-lg text-nude-600 mb-1">
                  {abTestData.variantC.conversions} conversions
                </div>
                <div
                  className={`text-lg font-semibold ${bestVariant.variant === 'C' ? 'text-semantic-success' : 'text-nude-600'}`}
                >
                  {getConversionRate(
                    abTestData.variantC.conversions,
                    abTestData.variantC.clicks
                  )}
                  % rate
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-nude-50 rounded-lg">
              <p className="text-nude-800 font-medium">
                🏆 Best Performing: Variant {bestVariant.variant} with{' '}
                {bestVariant.rate}% conversion rate
              </p>
            </div>
          </div>
        </section>

        {/* Color Psychology Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-nude-900 mb-6">
            Color Psychology Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-nude-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-cta-primary rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-nude-900">
                  Gold (Primary)
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-nude-600">Clicks:</span>
                  <span className="font-medium">
                    {colorData.goldClicks.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nude-600">Conversions:</span>
                  <span className="font-medium">
                    {colorData.goldConversions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nude-600">Rate:</span>
                  <span className="font-medium">
                    {getConversionRate(
                      colorData.goldConversions,
                      colorData.goldClicks
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-nude-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-cta-secondary rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-nude-900">
                  Mahogany (Secondary)
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-nude-600">Clicks:</span>
                  <span className="font-medium">
                    {colorData.mahoganyClicks.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nude-600">Conversions:</span>
                  <span className="font-medium">
                    {colorData.mahoganyConversions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nude-600">Rate:</span>
                  <span className="font-medium">
                    {getConversionRate(
                      colorData.mahoganyConversions,
                      colorData.mahoganyClicks
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-nude-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-cta-tertiary rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-nude-900">
                  Bronze (Tertiary)
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-nude-600">Clicks:</span>
                  <span className="font-medium">
                    {colorData.bronzeClicks.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nude-600">Conversions:</span>
                  <span className="font-medium">
                    {colorData.bronzeConversions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nude-600">Rate:</span>
                  <span className="font-medium">
                    {getConversionRate(
                      colorData.bronzeConversions,
                      colorData.bronzeClicks
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-luxury-champagne border border-luxury-charlotte rounded-lg">
            <p className="text-nude-800 font-medium">
              🎨 Best Performing Color: {bestColor.color} with {bestColor.rate}%
              conversion rate
            </p>
            <p className="text-nude-700 text-sm mt-1">
              Psychology-driven color optimization is working! Gold continues to
              outperform other colors for primary actions.
            </p>
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-nude-900 mb-6">
            Optimization Recommendations
          </h2>
          <div className="bg-white border border-nude-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-semantic-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-nude-900">
                    Continue Gold Primary CTAs
                  </h4>
                  <p className="text-nude-600 text-sm">
                    Gold buttons are performing 23% better than other colors for
                    primary actions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-semantic-warning rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-nude-900">
                    Optimize Secondary CTAs
                  </h4>
                  <p className="text-nude-600 text-sm">
                    Consider A/B testing different colors for secondary actions
                    to improve conversion rates.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-semantic-info rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">i</span>
                </div>
                <div>
                  <h4 className="font-medium text-nude-900">
                    Monitor Performance Metrics
                  </h4>
                  <p className="text-nude-600 text-sm">
                    Core Web Vitals are within optimal ranges. Continue
                    monitoring for any performance regressions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
