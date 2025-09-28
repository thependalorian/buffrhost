import { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader, StatCard, ActionButton, ModalForm, FormField, FormSelect, Alert } from '@/src/components/ui';
import { useState } from 'react';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  DollarSign,
  Clock,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  SparklesIcon,
  Monitor,
  Zap,
  Heart,
  Target,
  TrendingUp,
  BarChart3,
  MessageCircle,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  Bell,
  BookOpen,
  GraduationCap,
  Briefcase,
  Home,
  Coffee,
  Utensils,
  Bed,
  Car,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  QrCode,
  Wallet,
  Receipt,
  Banknote,
  Coins
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Processing Demo - Buffr Host Platform',
  description: 'Experience our secure, multi-channel payment processing system that accepts cards, mobile payments, QR codes, and more.',
};

export default function PaymentProcessingDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Payment Processing Demo</strong> - Secure, multi-channel payment solutions
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-green-600 to-blue-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <CreditCard className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Secure Payments</h1>
            <p className="text-xl md:text-2xl mb-6">Multi-channel payment processing for modern hospitality</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <CreditCard className="w-5 h-5 mr-2" />
                Try Payment Demo
              </button>
              <Link href="/demo/etuna/management-demo" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-900">
                <Monitor className="w-5 h-5 mr-2" />
                View Management Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Payment Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Complete Payment Solutions</h2>
              <p className="text-lg text-base-content/80 mb-6">
                Experience our comprehensive payment processing system that accepts cards, 
                mobile payments, QR codes, and traditional methods across all Etuna services.
              </p>
              
              {/* Demo Payment Methods */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Available Payment Methods</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Card Payments */}
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium">Credit/Debit Cards</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  
                  {/* Mobile Payments */}
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Smartphone className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium">Mobile Payments</p>
                      <p className="text-sm text-gray-500">Apple Pay, Google Pay</p>
                    </div>
                  </div>
                  
                  {/* QR Payments */}
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <QrCode className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-medium">QR Code Payments</p>
                      <p className="text-sm text-gray-500">Instant mobile payments</p>
                    </div>
                  </div>
                  
                  {/* Cash */}
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Banknote className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-medium">Cash Payments</p>
                      <p className="text-sm text-gray-500">Traditional cash handling</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>PCI DSS compliant security</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Real-time transaction processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Multi-currency support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Fraud protection</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Payment Processing"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-semibold">Secure Processing</p>
                    <p className="text-sm text-nude-700">PCI DSS Compliant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our Payment System Excels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Security */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Bank-Level Security</h3>
                <p className="text-sm text-nude-700">PCI DSS compliant with end-to-end encryption and fraud protection.</p>
              </div>
            </div>
            
            {/* Multi-Channel */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Multi-Channel</h3>
                <p className="text-sm text-nude-700">Accept payments via cards, mobile, QR codes, and traditional methods.</p>
              </div>
            </div>
            
            {/* Real-time */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Real-time Processing</h3>
                <p className="text-sm text-nude-700">Instant payment confirmation and settlement for improved cash flow.</p>
              </div>
            </div>
            
            {/* Multi-Currency */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Multi-Currency</h3>
                <p className="text-sm text-nude-700">Accept payments in multiple currencies with automatic conversion.</p>
              </div>
            </div>
            
            {/* Analytics */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Payment Analytics</h3>
                <p className="text-sm text-nude-700">Detailed transaction reports, success rates, and payment trends.</p>
              </div>
            </div>
            
            {/* Integration */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Easy Integration</h3>
                <p className="text-sm text-nude-700">Seamless integration with POS systems, online ordering, and loyalty programs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Supported Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Credit Cards */}
            <div className="nude-card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="text-lg font-bold mb-2">Credit Cards</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Visa</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Mastercard</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>American Express</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Discover</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Payments */}
            <div className="nude-card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-lg font-bold mb-2">Mobile Payments</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Apple Pay</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Google Pay</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Samsung Pay</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Contactless</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Digital Wallets */}
            <div className="nude-card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="text-lg font-bold mb-2">Digital Wallets</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>PayPal</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Venmo</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Cash App</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Zelle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Traditional */}
            <div className="nude-card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Banknote className="w-8 h-8 text-yellow-700" />
                </div>
                <h3 className="text-lg font-bold mb-2">Traditional</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Cash</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Check</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Bank Transfer</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Wire Transfer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Security & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PCI Compliance */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">PCI DSS Compliant</h3>
              <p className="text-nude-700">Meets the highest security standards for payment card data protection.</p>
            </div>

            {/* Encryption */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-nude-700">All payment data is encrypted from capture to processing and storage.</p>
            </div>

            {/* Fraud Protection */}
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fraud Protection</h3>
              <p className="text-nude-700">Advanced fraud detection and prevention systems protect against unauthorized transactions.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience Secure Payment Processing</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Experience */}
              <div className="card bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <CreditCard className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Guest Experience</h3>
                      <p className="text-white/80">See how payments enhance guest satisfaction</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience the seamless payment process that guests enjoy. 
                    From quick card payments to contactless mobile payments, 
                    see how our system makes transactions fast and secure.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Quick checkout process</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Multiple payment options</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Secure transaction processing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Instant payment confirmation</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link href="/demo/etuna" className="btn btn-accent">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Try Guest Experience
                    </Link>
                  </div>
                </div>
              </div>

              {/* Management Demo */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <BarChart3 className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Management Dashboard</h3>
                      <p className="text-nude-700">See how payments drive business success</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our comprehensive payment management dashboard. 
                    Track transactions, analyze payment methods, monitor success rates, 
                    and optimize your payment processing for maximum efficiency.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Real-time transaction monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Payment method analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Fraud detection alerts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Revenue optimization insights</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link href="/demo/etuna/management-demo" className="btn btn-primary">
                      <Monitor className="w-4 h-4 mr-2" />
                      View Management Demo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Ready to Process?</h3>
                <p className="text-primary-content/80">Contact us to implement secure payment processing for your business.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our payment processing system.</p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Learn More</h3>
                <p className="text-primary-content/80">Visit our main website for more information about Buffr Host.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}