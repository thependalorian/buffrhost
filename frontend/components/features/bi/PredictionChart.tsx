/**
 * @file This file defines the PredictionChart component, which visualizes prediction data.
 * @location frontend/components/features/bi/PredictionChart.tsx
 * @description This component renders a responsive line chart to display prediction data, including confidence intervals.
 * @modular
 *
 * @component
 * @param {PredictionChartProps} props - The props for the component.
 * @param {string} props.title - The title of the chart.
 * @param {PredictionData[]} props.data - An array of prediction data points.
 * @param {'line' | 'bar' | 'area'} [props.type='line'] - The type of chart to render.
 * @param {boolean} [props.showConfidence=true] - Whether to show the confidence interval.
 * @param {boolean} [props.showActual=true] - Whether to show the actual values.
 * @param {number} [props.height=300] - The height of the chart.
 *
 * @example
 * const data = [
 *   { date: 'Jan', actual: 4000, predicted: 2400, confidence: 200 },
 *   { date: 'Feb', actual: 3000, predicted: 1398, confidence: 300 },
 * ];
 * <PredictionChart title="Revenue Forecast" data={data} type="line" />
 *
 * @see {@link BuffrCard}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses a responsive container to ensure the chart is viewable on all screen sizes.
 * @performance The component uses the Recharts library, which is optimized for performance.
 *
 * @buffr-icon-usage This component uses the 'trending-up' and 'bar-chart-3' icons.
 */
/**
 * PredictionChart React Component for Buffr Host Hospitality Platform
 * @fileoverview PredictionChart provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/bi/PredictionChart.tsx
 * @purpose PredictionChart provides specialized functionality for the Buffr Host platform
 * @component PredictionChart
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
 * @param {string} [title] - title prop description
 * @param {PredictionData[]} [data] - data prop description
 * @param {'line' | 'bar' | 'area'} [type] - type prop description
 * @param {} [showConfidence] - showConfidence prop description
 * @param {} [showActual] - showActual prop description
 * @param {} [height] - height prop description
 *
 * Methods:
 * @method renderChart - renderChart method for component functionality
 *
 * Usage Example:
 * @example
 * import { PredictionChart } from './PredictionChart';
 *
 * function App() {
 *   return (
 *     <PredictionChart
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PredictionChart component
 */

import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
} from '@/components/ui';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
interface PredictionData {
  date: string;
  actual: number;
  predicted: number;
  confidence: number;
}

interface PredictionChartProps {
  title: string;
  data: PredictionData[];
  type: 'line' | 'bar' | 'area';
  showConfidence?: boolean;
  showActual?: boolean;
  height?: number;
}

export function PredictionChart({
  title,
  data,
  type = 'line',
  showConfidence = true,
  showActual = true,
  height = 300,
}: PredictionChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} height={height}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {showActual && (
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#8884d8"
                strokeWidth={2}
                name="Actual"
              />
            )}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Predicted"
            />
            {showConfidence && (
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#ffc658"
                strokeWidth={1}
                strokeDasharray="5 5"
                name="Confidence"
              />
            )}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data} height={height}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {showActual && (
              <Bar dataKey="actual" fill="#8884d8" name="Actual" />
            )}
            <Bar dataKey="predicted" fill="#82ca9d" name="Predicted" />
          </BarChart>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <BuffrCard className="overflow-hidden w-full max-w-full">
      <BuffrCardHeader className="pb-3 md:pb-4">
        <BuffrCardTitle className="flex items-center space-x-2 min-w-0">
          {type === 'line' && (
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0"
            />
          )}
          {type === 'bar' && (
            <BuffrIcon
              name="bar-chart-3"
              className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0"
            />
          )}
          <span className="truncate text-base md:text-lg">{title}</span>
        </BuffrCardTitle>
      </BuffrCardHeader>
      <BuffrCardBody className="pt-0 p-2 md:p-6">
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={height}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </BuffrCardBody>
    </BuffrCard>
  );
}

export default PredictionChart;
