import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Gift, 
  Star, 
  Crown, 
  Trophy, 
  Users, 
  QrCode, 
  Smartphone, 
  CheckCircle, 
  ArrowRight, 
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  SparklesIcon,
  Monitor,
  BarChart3,
  Shield,
  Zap,
  Heart,
  Target,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Calendar,
  MessageCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Loyalty Program Demo - Buffr Host Platform',
  description: 'Experience our comprehensive loyalty system that drives customer retention and increases revenue across all hospitality services.',
};

export default function LoyaltyDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Loyalty Program Demo</strong> - Drive customer retention and revenue growth
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Crown className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Loyalty Revolution</h1>
            <p className="text-xl md:text-2xl mb-6">Turn guests into lifelong customers</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <QrCode className="w-5 h-5 mr-2" />
                Join Loyalty Program
              </button>
              <Link href="/demo/etuna/management" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-900">
                <Monitor className="w-5 h-5 mr-2" />
                View Management Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Loyalty Program Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Our Loyalty System</h2>
              <p className="text-lg text-base-content/80 mb-6">
                Join the Etuna loyalty program and see how our system rewards guests across all services - 
                from restaurant dining to hotel stays, tours, and spa treatments.
              </p>
              
              {/* Demo Loyalty Card */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8 rounded-lg shadow-xl mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Etuna VIP Member</h3>
                    <p className="text-purple-100">Gold Tier • Member since 2024</p>
                  </div>
                  <Crown className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-purple-100 text-sm">Points Balance</p>
                    <p className="text-2xl font-bold">2,450</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm">Next Reward</p>
                    <p className="text-lg font-semibold">Free Night</p>
                  </div>
                </div>
                <div className="w-full bg-purple-300 rounded-full h-2">
                  <div className="bg-yellow-300 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <p className="text-purple-100 text-sm mt-2">550 points to next reward</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Earn points on every purchase</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Cross-service point earning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Exclusive member benefits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Personalized rewards</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Loyalty Program"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-semibold">Customer Love</p>
                    <p className="text-sm text-nude-700">Increased Retention</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our Loyalty System Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cross-Service Integration */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Cross-Service Integration</h3>
                <p className="text-sm text-nude-700">Earn points from restaurant dining, hotel stays, tours, spa treatments, and more.</p>
              </div>
            </div>
            
            {/* Tiered Rewards */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-yellow-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Tiered Rewards</h3>
                <p className="text-sm text-nude-700">Bronze, Silver, Gold, and Platinum tiers with escalating benefits and rewards.</p>
              </div>
            </div>
            
            {/* Personalized Offers */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Personalized Offers</h3>
                <p className="text-sm text-nude-700">AI-powered recommendations based on guest preferences and behavior.</p>
              </div>
            </div>
            
            {/* Instant Redemption */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Instant Redemption</h3>
                <p className="text-sm text-nude-700">Use points immediately at checkout for discounts, free items, or upgrades.</p>
              </div>
            </div>
            
            {/* Social Features */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-pink-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Social Features</h3>
                <p className="text-sm text-nude-700">Refer friends, share experiences, and earn bonus points for social engagement.</p>
              </div>
            </div>
            
            {/* Analytics */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Advanced Analytics</h3>
                <p className="text-sm text-nude-700">Track member behavior, redemption patterns, and program performance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Loyalty Tiers & Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bronze Tier */}
            <div className="nude-card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bronze</h3>
                <p className="text-sm text-nude-700 mb-4">0 - 999 points</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>1 point per NAD spent</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Birthday reward</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Newsletter access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Silver Tier */}
            <div className="nude-card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Silver</h3>
                <p className="text-sm text-nude-700 mb-4">1,000 - 2,499 points</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>1.25 points per NAD</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Priority booking</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Room upgrade</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold Tier */}
            <div className="nude-card border-2 border-yellow-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-yellow-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Gold</h3>
                <p className="text-sm text-nude-700 mb-4">2,500 - 4,999 points</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>1.5 points per NAD</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Free breakfast</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Concierge service</span>
                  </div>
                </div>
                <div className="badge badge-warning mt-2">Popular</div>
              </div>
            </div>

            {/* Platinum Tier */}
            <div className="nude-card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Platinum</h3>
                <p className="text-sm text-nude-700 mb-4">5,000+ points</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>2 points per NAD</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Free night stay</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>VIP treatment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">How Our Loyalty System Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Program</h3>
              <p className="text-nude-700">Scan QR code or sign up online to become a member instantly.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Points</h3>
              <p className="text-nude-700">Earn points on every purchase across all Etuna services.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
              <p className="text-nude-700">Use points for discounts, free items, upgrades, and exclusive benefits.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience the Loyalty Difference</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Experience */}
              <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Heart className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Guest Experience</h3>
                      <p className="text-white/80">See how loyalty drives satisfaction</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience the personalized rewards and exclusive benefits that keep 
                    guests coming back. From instant point earning to tier upgrades, 
                    see how our loyalty system creates lasting relationships.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Instant point earning</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Personalized rewards</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Tier progression</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Exclusive benefits</span>
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
                      <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center">
                        <TrendingUp className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Management Dashboard</h3>
                      <p className="text-nude-700">See how loyalty drives revenue</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our comprehensive loyalty management system. 
                    Track member engagement, analyze redemption patterns, 
                    and optimize your program for maximum ROI.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Member analytics and insights</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Program performance metrics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Campaign management tools</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Revenue impact analysis</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link href="/demo/etuna/management" className="btn btn-primary">
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
                <h3 className="font-bold text-lg mb-2">Ready to Launch?</h3>
                <p className="text-primary-content/80">Contact us to implement a loyalty program that drives customer retention.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our loyalty management system.</p>
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