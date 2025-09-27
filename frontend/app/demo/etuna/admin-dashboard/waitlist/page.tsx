/**
 * Etuna Waitlist Conversion - Professional Demo
 * 
 * Compelling waitlist page showcasing the full Buffr Host ecosystem
 * Features conversion optimization, value proposition, and social proof
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Users, 
  ArrowLeft,
  TrendingUp,
  Target,
  Zap,
  Brain,
  Database,
  Shield,
  Crown,
  Rocket,
  Megaphone
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse - Join Buffr Host Waitlist',
  description: 'Join the waitlist for Buffr Host - The complete hospitality management platform',
};

export default function EtunaWaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary text-primary-content">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/protected/etuna/dashboard" className="btn btn-ghost text-primary-content hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Join Buffr Host Waitlist</h1>
                  <p className="text-primary-content/80">Be among the first to experience the future of hospitality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Transform Your Hospitality Business
          </h2>
          <p className="text-xl text-primary-content/80 mb-8 max-w-3xl mx-auto">
            Join 500+ hospitality businesses already on the waitlist for Buffr Host - 
            the complete ecosystem that automates operations, boosts efficiency, and delights customers.
          </p>
          <div className="flex items-center justify-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm">Businesses on Waitlist</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">85%</div>
              <div className="text-sm">Efficiency Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">N$2M+</div>
              <div className="text-sm">Revenue Generated</div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="card bg-white/10 backdrop-blur-sm text-primary-content">
            <div className="card-body text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-warning" />
              <h3 className="card-title justify-center mb-4">Automate Everything</h3>
              <p className="text-primary-content/80">
                Free your staff from repetitive tasks with AI-powered automation. 
                Focus on what matters - delighting your customers.
              </p>
            </div>
          </div>

          <div className="card bg-white/10 backdrop-blur-sm text-primary-content">
            <div className="card-body text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-success" />
              <h3 className="card-title justify-center mb-4">Boost Revenue</h3>
              <p className="text-primary-content/80">
                Increase bookings by 40% with intelligent lead management, 
                automated follow-ups, and conversion optimization.
              </p>
            </div>
          </div>

          <div className="card bg-white/10 backdrop-blur-sm text-primary-content">
            <div className="card-body text-center">
              <Brain className="w-12 h-12 mx-auto mb-4 text-info" />
              <h3 className="card-title justify-center mb-4">AI-Powered Insights</h3>
              <p className="text-primary-content/80">
                Make data-driven decisions with advanced analytics, 
                predictive insights, and automated reporting.
              </p>
            </div>
          </div>
        </div>

        {/* Complete Ecosystem Features */}
        <div className="card bg-white/10 backdrop-blur-sm text-primary-content mb-16">
          <div className="card-body">
            <h3 className="card-title text-3xl mb-8 text-center">
              <Rocket className="w-8 h-8 mr-3" />
              Complete Hospitality Ecosystem
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="font-semibold text-lg">Staff Management</div>
                  <div className="text-primary-content/70">
                    Complete HR system with scheduling, performance tracking, and payroll automation
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="font-semibold text-lg">CRM & Lead Management</div>
                  <div className="text-primary-content/70">
                    Intelligent lead scoring, automated follow-ups, and conversion optimization
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Megaphone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="font-semibold text-lg">Marketing Automation</div>
                  <div className="text-primary-content/70">
                    Email campaigns, lead nurturing, and ROI optimization across all channels
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Brain className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="font-semibold text-lg">AI Receptionist</div>
                  <div className="text-primary-content/70">
                    24/7 AI assistant handling bookings, inquiries, and customer service
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Database className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="font-semibold text-lg">Real-time Analytics</div>
                  <div className="text-primary-content/70">
                    Comprehensive dashboards with predictive insights and performance metrics
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="font-semibold text-lg">Enterprise Security</div>
                  <div className="text-primary-content/70">
                    Bank-grade security with GDPR compliance and data protection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="card bg-white/10 backdrop-blur-sm text-primary-content mb-16">
          <div className="card-body">
            <h3 className="card-title text-3xl mb-8 text-center">
              <Crown className="w-8 h-8 mr-3" />
              Join the Waitlist
            </h3>
            <div className="max-w-2xl mx-auto">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text text-primary-content">Business Name</span>
                    </label>
                    <input type="text" placeholder="Your business name" className="input input-bordered w-full" />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-primary-content">Contact Person</span>
                    </label>
                    <input type="text" placeholder="Your full name" className="input input-bordered w-full" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text text-primary-content">Email</span>
                    </label>
                    <input type="email" placeholder="your@email.com" className="input input-bordered w-full" />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-primary-content">Phone</span>
                    </label>
                    <input type="tel" placeholder="+264 XX XXX XXXX" className="input input-bordered w-full" />
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-primary-content">Business Type</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option>Hotel</option>
                    <option>Restaurant</option>
                    <option>Lodge</option>
                    <option>Guesthouse</option>
                    <option>Conference Center</option>
                    <option>Tour Operator</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-primary-content">Number of Rooms/Seats</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option>1-10</option>
                    <option>11-25</option>
                    <option>26-50</option>
                    <option>51-100</option>
                    <option>100+</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-primary-content">Current Challenges</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered w-full" 
                    placeholder="Tell us about your current operational challenges..."
                    rows={4}
                  ></textarea>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input type="checkbox" className="checkbox checkbox-primary" />
                    <span className="label-text text-primary-content ml-3">
                      I agree to receive updates about Buffr Host and understand that early access is limited.
                    </span>
                  </label>
                </div>

                <div className="text-center">
                  <button className="btn btn-primary btn-lg">
                    <Crown className="w-5 h-5 mr-2" />
                    Join Waitlist - Get Early Access
                  </button>
                  <p className="text-sm text-primary-content/70 mt-4">
                    Limited to 100 businesses. Priority given to early signups.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">Trusted by Leading Hospitality Businesses</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-80">
            <div className="text-center">
              <div className="text-lg font-semibold">Namibia Hotels</div>
              <div className="text-sm">25+ properties</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Restaurant Group</div>
              <div className="text-sm">12 locations</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Tour Operators</div>
              <div className="text-sm">8 companies</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Conference Centers</div>
              <div className="text-sm">5 venues</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
