import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
} from '@/components/ui';
/**
 * Prediction Chart Component
 * Visualizes ML model predictions and trends
 */

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {type === 'line' && (
            <BuffrIcon name="trending-up" className="h-5 w-5" />
          )}
          {type === 'bar' && (
            <BuffrIcon name="bar-chart-3" className="h-5 w-5" />
          )}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default PredictionChart;
