import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { Switch } from '@/src/components/ui/switch';
import { 
  CreditCard, 
  Shield, 
  Globe, 
  Zap, 
  Settings,
  DollarSign,
  Percent
} from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'adumo' | 'realpay' | 'buffr' | 'stripe' | 'paypal' | 'custom';
  status: 'active' | 'inactive' | 'pending';
  country: string;
  currency: string;
  transactionFee: string;
  monthlyFee: string;
  setupFee: string;
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  isTestMode: boolean;
  description?: string;
}

interface PaymentGatewayFormProps {
  gateway?: PaymentGateway;
  onSave: (gateway: PaymentGateway) => void;
  onCancel: () => void;
  className?: string;
}

export const PaymentGatewayForm: React.FC<PaymentGatewayFormProps> = ({
  gateway,
  onSave,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: gateway?.name || '',
    type: gateway?.type || 'adumo',
    status: gateway?.status || 'active',
    country: gateway?.country || 'South Africa',
    currency: gateway?.currency || 'ZAR',
    transactionFee: gateway?.transactionFee || '',
    monthlyFee: gateway?.monthlyFee || '',
    setupFee: gateway?.setupFee || '',
    apiKey: gateway?.apiKey || '',
    secretKey: gateway?.secretKey || '',
    webhookUrl: gateway?.webhookUrl || '',
    isTestMode: gateway?.isTestMode || true,
    description: gateway?.description || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Gateway name is required';
    }

    if (!formData.transactionFee.trim()) {
      newErrors.transactionFee = 'Transaction fee is required';
    }

    if (formData.type !== 'buffr' && !formData.apiKey.trim()) {
      newErrors.apiKey = 'API key is required for external gateways';
    }

    if (formData.type !== 'buffr' && !formData.secretKey.trim()) {
      newErrors.secretKey = 'Secret key is required for external gateways';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const paymentGateway: PaymentGateway = {
      id: gateway?.id || Date.now().toString(),
      ...formData
    };

    onSave(paymentGateway);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'adumo':
        return <Shield className="w-6 h-6" />;
      case 'realpay':
        return <Globe className="w-6 h-6" />;
      case 'buffr':
        return <Zap className="w-6 h-6" />;
      case 'stripe':
      case 'paypal':
        return <CreditCard className="w-6 h-6" />;
      default:
        return <Settings className="w-6 h-6" />;
    }
  };

  const getGatewayDescription = (type: string) => {
    switch (type) {
      case 'adumo':
        return 'Adumo Virtual payment gateway for South Africa';
      case 'realpay':
        return 'RealPay EnDO payment gateway for Namibia';
      case 'buffr':
        return 'Buffr internal payment processing system';
      case 'stripe':
        return 'Stripe payment gateway for global payments';
      case 'paypal':
        return 'PayPal payment gateway for online payments';
      default:
        return 'Custom payment gateway integration';
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getGatewayIcon(formData.type)}
          {gateway ? 'Edit Payment Gateway' : 'Add New Payment Gateway'}
        </CardTitle>
        <p className="text-gray-600">
          {getGatewayDescription(formData.type)}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Gateway Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter gateway name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Gateway Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gateway type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adumo">Adumo Virtual</SelectItem>
                    <SelectItem value="realpay">RealPay EnDO</SelectItem>
                    <SelectItem value="buffr">Buffr Pay</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter gateway description"
                rows={3}
              />
            </div>
          </div>

          {/* Location & Currency */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Location & Currency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="South Africa">🇿🇦 South Africa</SelectItem>
                    <SelectItem value="Namibia">🇳🇦 Namibia</SelectItem>
                    <SelectItem value="Multi-region">🌍 Multi-region</SelectItem>
                    <SelectItem value="Global">🌐 Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                    <SelectItem value="NAD">Namibian Dollar (NAD)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="Multi">Multi-currency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionFee">Transaction Fee</Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="transactionFee"
                    value={formData.transactionFee}
                    onChange={(e) => handleInputChange('transactionFee', e.target.value)}
                    placeholder="e.g., 2.9% + R0.50"
                    className={`pl-10 ${errors.transactionFee ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.transactionFee && (
                  <p className="text-sm text-red-500">{errors.transactionFee}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyFee">Monthly Fee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="monthlyFee"
                    value={formData.monthlyFee}
                    onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
                    placeholder="e.g., R0 or N$770"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="setupFee">Setup Fee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="setupFee"
                    value={formData.setupFee}
                    onChange={(e) => handleInputChange('setupFee', e.target.value)}
                    placeholder="e.g., R0 or N$3,064.50"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          {formData.type !== 'buffr' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    placeholder="Enter API key"
                    className={errors.apiKey ? 'border-red-500' : ''}
                  />
                  {errors.apiKey && (
                    <p className="text-sm text-red-500">{errors.apiKey}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secretKey">Secret Key</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={formData.secretKey}
                    onChange={(e) => handleInputChange('secretKey', e.target.value)}
                    placeholder="Enter secret key"
                    className={errors.secretKey ? 'border-red-500' : ''}
                  />
                  {errors.secretKey && (
                    <p className="text-sm text-red-500">{errors.secretKey}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                <Input
                  id="webhookUrl"
                  value={formData.webhookUrl}
                  onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                  placeholder="https://yourdomain.com/webhook"
                />
              </div>
            </div>
          )}

          {/* Status & Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Status & Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isTestMode"
                  checked={formData.isTestMode}
                  onCheckedChange={(checked) => handleInputChange('isTestMode', checked)}
                />
                <Label htmlFor="isTestMode">Test Mode</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6"
            >
              {gateway ? 'Update Gateway' : 'Add Gateway'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentGatewayForm;
