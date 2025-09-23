'use client';

import { useState, useEffect } from 'react';
import DemoRequestModal from './components/DemoRequestModal';
import VideoModal from './components/VideoModal';
import { 
  BuildingOffice2Icon, 
  BuildingStorefrontIcon, 
  SparklesIcon, 
  PresentationChartBarIcon, 
  TruckIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  QrCodeIcon,
  EyeIcon,
  CpuChipIcon,
  GiftIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

// --- Helper Components for new design ---

const NavLink = ({ href, children }) => (
  <a href={href} className="text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors duration-300 font-medium">
    {children}
  </a>
);

const CTAButton = ({ children, primary = false, className = '', onClick }) => (
  <button 
    onClick={onClick}
    className={`btn btn-lg rounded-full shadow-lg transition-transform duration-300 hover:scale-105 ${primary ? 'btn-primary text-white' : 'bg-white/20 text-white backdrop-blur-md border-white/30 hover:bg-white/30'} ${className}`}
  >
    {children}
  </button>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 bg-sand-100 dark:bg-sand-800/50 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-sand-600 dark:text-sand-300" />
      </div>
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

// --- Main Page Component ---

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white dark:bg-black text-gray-800 dark:text-gray-200 font-sans">
      {/* --- Navigation -- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-sand-800 to-black rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Buffr Host</span>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#solutions">Solutions</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="btn btn-ghost">Sign In</button>
              <button 
                className="btn btn-primary rounded-full"
                onClick={() => setShowDemoModal(true)}
              >
                Request a Demo
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 dark:text-white">
                {isMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden mt-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4">
              <a href="#features" className="block py-2 text-lg">Features</a>
              <a href="#solutions" className="block py-2 text-lg">Solutions</a>
              <a href="#pricing" className="block py-2 text-lg">Pricing</a>
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <button className="btn btn-ghost w-full">Sign In</button>
                <button 
                  className="btn btn-primary w-full rounded-full"
                  onClick={() => setShowDemoModal(true)}
                >
                  Request a Demo
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* --- Hero Section -- */}
        <section 
          className="relative min-h-screen flex items-center justify-center bg-cover bg-center text-white pt-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562790351-3e9355219858?q=80&w=2940&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center px-6 space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              The Future of Hospitality, Today.
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/80">
              Buffr Host unifies every part of your business on a single, elegant platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <CTAButton 
                primary
                onClick={() => setShowDemoModal(true)}
              >
                Request a Demo <ArrowRightIcon className="w-5 h-5 ml-2" />
              </CTAButton>
              <CTAButton onClick={() => setShowVideoModal(true)}>
                Watch Video <PlayIcon className="w-5 h-5 ml-2" />
              </CTAButton>
            </div>
          </div>
        </section>


        {/* --- Features Section -- */}
        <section id="features" className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={QrCodeIcon}
                title="Contactless QR Suite"
                description="Delight guests with elegant, self-serve digital menus for ordering and payment."
              />
              <FeatureCard 
                icon={EyeIcon}
                title="360° Guest View"
                description="Understand your customers, from their preferred meals to their last visit, with our unified profile."
              />
              <FeatureCard 
                icon={CpuChipIcon}
                title="AI Receptionist & Booking Agent"
                description="24/7 AI assistant that handles bookings and provides information using your establishment's knowledge base."
              />
              <FeatureCard 
                icon={GiftIcon}
                title="Next-Gen Loyalty"
                description="Reward your customers with points they can use across your hotel, restaurant, lodge, and all services."
              />
            </div>
          </div>
        </section>

        {/* --- Solutions Section -- */}
        <section id="solutions" className="py-24 md:py-32 bg-sand-50 dark:bg-sand-900/20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Your Entire Operation, In Hand.</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-16">
              Buffr Host brings everything together - your room bookings, food and beverage orders, inventory, staff schedules, guest preferences and more- all in one place.
            </p>
            <div className="relative max-w-6xl mx-auto mb-16">
              <div className="absolute -inset-2 bg-gradient-to-br from-sand-200 to-amber-200 rounded-3xl opacity-20 blur-2xl"></div>
              <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2940&auto=format&fit=crop" alt="Dashboard on multiple devices" className="relative rounded-2xl shadow-2xl" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">Streamline Your Operations.</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">Manage all your bookings in one place. Auto generate quotations and invoices, see who is checking in, and handle payments without the paperwork.</p>
              </div>
              <div className="h-96 bg-sand-200 dark:bg-sand-800 rounded-2xl bg-cover bg-center shadow-xl" style={{backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop')"}}></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 items-center mt-16">
              <div className="h-96 bg-sand-200 dark:bg-sand-800 rounded-2xl order-last md:order-first bg-cover bg-center shadow-xl" style={{backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop')"}}></div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">Deliver Exceptional Service.</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">Connect your kitchen, your staff, and your inventory. Less waste, faster service, and a clearer view of your daily profits.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Built For You Section --- */}
        <section className="py-24 md:py-32">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for the Visionaries of Hospitality.</h2>
                <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-16">
                    Whether you run an intimate lodge, a hotel, or a bustling restaurant, Buffr Host is designed to elevate your business.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-sand-50 dark:bg-sand-900/20 rounded-2xl p-8 space-y-4">
                        <BuildingOffice2Icon className="w-10 h-10 text-sand-500" />
                        <h4 className="text-xl font-bold">For Hotels</h4>
                        <p className="text-gray-600 dark:text-gray-400">Deliver unparalleled, personalized guest experiences that turn visitors into lifelong advocates.</p>
                    </div>
                    <div className="bg-sand-50 dark:bg-sand-900/20 rounded-2xl p-8 space-y-4">
                        <HomeIcon className="w-10 h-10 text-sand-500" />
                        <h4 className="text-xl font-bold">For Lodges</h4>
                        <p className="text-gray-600 dark:text-gray-400">Manage your unique establishment, from lodges to desert escapes, and create unforgettable guest journeys.</p>
                    </div>
                    <div className="bg-sand-50 dark:bg-sand-900/20 rounded-2xl p-8 space-y-4">
                        <BuildingStorefrontIcon className="w-10 h-10 text-sand-500" />
                        <h4 className="text-xl font-bold">For Restaurants</h4>
                        <p className="text-gray-600 dark:text-gray-400">Run a smoother, more streamlined restaurant with real-time inventory management, QR ordering, and menu analytics.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- Final CTA Section -- */}
        <section className="py-24 md:py-32 bg-white dark:bg-black">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to Revolutionize Your Establishment?</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mt-4 mb-10">
              Let us show you how Buffr Host can unify your operations, delight your guests, and grow your bottom line. Get a personalized demo today.
            </p>
            <CTAButton 
              primary 
              className="w-full sm:w-auto"
              onClick={() => setShowDemoModal(true)}
            >
              Request a Free Demo
            </CTAButton>
          </div>
        </section>

      </main>

      {/* --- Footer -- */}
      <footer className="bg-sand-100 dark:bg-sand-900/20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Footer content can be added here */}
          </div>
          <div className="mt-12 pt-8 border-t border-sand-200 dark:border-sand-800 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 Buffr Host. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DemoRequestModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
      />
      <VideoModal 
        isOpen={showVideoModal} 
        onClose={() => setShowVideoModal(false)} 
      />
    </div>
  );
}
