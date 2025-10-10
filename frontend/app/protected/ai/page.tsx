'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { useMLInsights, useMLRecommendations, useFraudAlerts, useMLModelPerformance } from '../../../hooks/use-ml'
import { useAuth } from '../../../hooks/use-auth'
import { useProperties } from '../../../hooks/use-properties'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap, 
  BarChart3,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'

export default function AIDashboard() {
  const [selectedProperty, setSelectedProperty] = useState('default-property-id')
  const [refreshing, setRefreshing] = useState(false)
  
  const { user } = useAuth()
  const { data: propertiesData } = useProperties()
  
  const { data: insights, isLoading: insightsLoading, refetch: refetchInsights } = 
    useMLInsights(selectedProperty)
  
  const { data: recommendations, isLoading: recommendationsLoading, refetch: refetchRecommendations } = 
    useMLRecommendations(user?.id || '')
  
  const { data: fraudAlerts, isLoading: fraudLoading } = useFraudAlerts()
  
  const { data: modelPerformance, isLoading: performanceLoading } = 
    useMLModelPerformance(selectedProperty)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        refetchInsights(),
        refetchRecommendations()
      ])
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-nude-900">AI & Machine Learning</h1>
          <p className="text-nude-600">Intelligent insights and recommendations powered by advanced ML models</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="form-input-emotional"
          >
            <option value="default-property-id">Select Property</option>
            {propertiesData?.data?.map((property: any) => (
              <option key={property.id} value={property.id}>
                {property.name || property.property_name}
              </option>
            ))}
          </select>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* ML System Status */}
      <Card className="dashboard-card-emotional">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            ML System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-nude-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {modelPerformance?.data?.modelAccuracy || 0}%
              </div>
              <div className="text-sm text-nude-600">Model Accuracy</div>
            </div>
            <div className="text-center p-4 bg-nude-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {modelPerformance?.data?.predictionCount || 0}
              </div>
              <div className="text-sm text-nude-600">Predictions Today</div>
            </div>
            <div className="text-center p-4 bg-nude-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {modelPerformance?.data?.uptime || 0}%
              </div>
              <div className="text-sm text-nude-600">System Uptime</div>
            </div>
            <div className="text-center p-4 bg-nude-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {modelPerformance?.data?.responseTime || 0}ms
              </div>
              <div className="text-sm text-nude-600">Avg Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Insights Panel */}
        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Property Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insightsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading insights...</span>
              </div>
            ) : insights?.data?.recommendations?.length > 0 ? (
              <div className="space-y-4">
                {insights.data.recommendations.map((insight: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-nude-900">{insight.title}</h4>
                    <p className="text-nude-600 text-sm">{insight.description}</p>
                    <p className="text-green-600 text-xs mt-1">
                      Expected impact: {insight.impact}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-nude-500">
                <Target className="w-12 h-12 mx-auto mb-4 text-nude-300" />
                <p>No insights available for this property</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations Panel */}
        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading recommendations...</span>
              </div>
            ) : recommendations?.data?.items?.length > 0 ? (
              <div className="space-y-3">
                {recommendations.data.items.map((rec: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-600' : 
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {rec.icon || '💡'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-nude-900">{rec.title}</h4>
                      <p className="text-nude-600 text-sm">{rec.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-nude-500">
                          Confidence: {rec.confidence}%
                        </span>
                        <Button size="sm" variant="outline">
                          Implement
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-nude-500">
                <Zap className="w-12 h-12 mx-auto mb-4 text-nude-300" />
                <p>No recommendations available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fraud Alerts */}
      {fraudAlerts?.data?.alerts?.length > 0 && (
        <Card className="dashboard-card-emotional border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Fraud Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fraudAlerts.data.alerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="font-semibold text-red-900">{alert.title}</h4>
                      <p className="text-red-700 text-sm">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-red-600 font-medium">
                      {alert.severity}
                    </span>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-600">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ML Models Overview */}
      <Card className="dashboard-card-emotional">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Active ML Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Credit Scoring', status: 'active', accuracy: 94.2, predictions: 1247 },
              { name: 'Fraud Detection', status: 'active', accuracy: 98.7, predictions: 892 },
              { name: 'Recommendation Engine', status: 'active', accuracy: 89.3, predictions: 2156 },
              { name: 'Customer Segmentation', status: 'active', accuracy: 91.8, predictions: 3421 },
              { name: 'Demand Forecasting', status: 'active', accuracy: 87.5, predictions: 156 },
              { name: 'Dynamic Pricing', status: 'active', accuracy: 92.1, predictions: 783 }
            ].map((model, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-nude-900">{model.name}</h4>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-nude-600">Accuracy</span>
                    <span className="font-medium">{model.accuracy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-nude-600">Predictions</span>
                    <span className="font-medium">{model.predictions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
