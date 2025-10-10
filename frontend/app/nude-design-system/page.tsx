"use client";
'use client';

import React, { useState } from 'react';
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonAccent,
  HospitalityCard,
  LayeredNudeCard,
  FormInput,
  NavLink,
  DataTable,
  Badge,
  NudeWaveLoader,
  WarmGlowLoader,
  WarmGlowHover,
  Modal,
  Toast,
  DashboardCard,
} from '@/components/ui/NudeDesignSystem';

export default function NudeDesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);

  const sampleData = [
    ['John Doe', 'john@example.com', <Badge key="john" variant="success">Active</Badge>],
    ['Jane Smith', 'jane@example.com', <Badge key="jane" variant="warning">Pending</Badge>],
    ['Bob Johnson', 'bob@example.com', <Badge key="bob" variant="error">Inactive</Badge>],
  ];

  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <header className="header">
        <div className="container-nude">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-display font-bold text-nude-900">
              Buffr Host Design System
            </h1>
            <nav className="flex space-x-6">
              <NavLink href="#buttons" active>Buttons</NavLink>
              <NavLink href="#cards">Cards</NavLink>
              <NavLink href="#forms">Forms</NavLink>
              <NavLink href="#components">Components</NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-nude py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-nude-900 mb-6">
            Sophisticated Nude Design System
          </h1>
          <p className="text-xl text-nude-700 max-w-3xl mx-auto mb-8">
            A comprehensive, inclusive design system crafted for hospitality management platforms. 
            Featuring warm nude tones inspired by luxury beauty brands and spa aesthetics.
          </p>
          <div className="flex justify-center gap-4">
            <ButtonPrimary onClick={() => setIsModalOpen(true)}>
              Get Started
            </ButtonPrimary>
            <ButtonSecondary onClick={() => setShowToast(true)}>
              View Examples
            </ButtonSecondary>
          </div>
        </section>

        {/* Buttons Section */}
        <section id="buttons" className="mb-16">
          <h2 className="text-3xl font-display font-bold text-nude-800 mb-8">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-nude-800">Primary Actions</h3>
              <div className="space-y-3">
                <ButtonPrimary>Book Now</ButtonPrimary>
                <ButtonPrimary>Confirm Reservation</ButtonPrimary>
                <ButtonPrimary>Process Payment</ButtonPrimary>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-nude-800">Secondary Actions</h3>
              <div className="space-y-3">
                <ButtonSecondary>View Details</ButtonSecondary>
                <ButtonSecondary>Edit Booking</ButtonSecondary>
                <ButtonSecondary>Cancel</ButtonSecondary>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-nude-800">Accent Actions</h3>
              <div className="space-y-3">
                <ButtonAccent>VIP Services</ButtonAccent>
                <ButtonAccent>Premium Features</ButtonAccent>
                <ButtonAccent>Special Offers</ButtonAccent>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section id="cards" className="mb-16">
          <h2 className="text-3xl font-display font-bold text-nude-800 mb-8">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HospitalityCard>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-nude-800 mb-3">Standard Card</h3>
                <p className="text-nude-700 mb-4">Perfect for general content display and property information.</p>
                <ButtonSecondary>Learn More</ButtonSecondary>
              </div>
            </HospitalityCard>
            
            <HospitalityCard variant="luxury">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-nude-800 mb-3">Luxury Card</h3>
                <p className="text-nude-700 mb-4">Premium hospitality features with gold accents.</p>
                <ButtonAccent>Upgrade</ButtonAccent>
              </div>
            </HospitalityCard>
            
            <HospitalityCard variant="spa">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-nude-800 mb-3">Spa Card</h3>
                <p className="text-nude-700 mb-4">Relaxing spa services with serene colors.</p>
                <ButtonPrimary>Book Spa</ButtonPrimary>
              </div>
            </HospitalityCard>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-nude-800 mb-8">Interactive Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WarmGlowHover>
              <div className="p-8 bg-white rounded-2xl border border-nude-200 text-center">
                <h3 className="text-xl font-semibold text-nude-800 mb-3">Warm Glow Hover</h3>
                <p className="text-nude-700 mb-4">Hover to see the warm glow effect that creates an inviting feel.</p>
                <Badge variant="nude">Interactive</Badge>
              </div>
            </WarmGlowHover>
            
            <LayeredNudeCard>
              <div className="p-8 text-center">
                <h3 className="text-xl font-semibold text-nude-800 mb-3">Layered Card</h3>
                <p className="text-nude-700 mb-4">Hover to see layered interaction that mimics luxury hospitality.</p>
                <Badge variant="success">Premium</Badge>
              </div>
            </LayeredNudeCard>
          </div>
        </section>

        {/* Forms Section */}
        <section id="forms" className="mb-16">
          <h2 className="text-3xl font-display font-bold text-nude-800 mb-8">Forms</h2>
          <div className="max-w-md mx-auto">
            <div className="hospitality-card p-8">
              <h3 className="text-xl font-semibold text-nude-800 mb-6">Contact Form</h3>
              <div className="space-y-4">
                <FormInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value=""
                />
                <FormInput
                  label="Email Address"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  type="tel"
                />
                <ButtonPrimary className="w-full">Send Message</ButtonPrimary>
              </div>
            </div>
          </div>
        </section>

        {/* Data Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-nude-800 mb-8">Data Table</h2>
          <DataTable
            headers={['Name', 'Email', 'Status']}
            rows={sampleData}
          />
        </section>

        {/* Loading Animations */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-nude-800 mb-8">Loading Animations</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-nude-800 mb-4">Nude Wave Loader</h3>
              <NudeWaveLoader className="w-full" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-nude-800 mb-4">Warm Glow Loader</h3>
              <div className="flex gap-4">
                <WarmGlowLoader />
                <WarmGlowLoader />
                <WarmGlowLoader />
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-nude-800 mb-8">Status Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="nude">Nude</Badge>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-nude-800 mb-8">Dashboard Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Revenue"
              value="$12,450"
              subtitle="+12% from last month"
            />
            <DashboardCard
              title="Active Bookings"
              value="47"
              subtitle="8 pending approval"
            />
            <DashboardCard
              title="Customer Satisfaction"
              value="4.8"
              subtitle="Based on 156 reviews"
            />
            <DashboardCard
              title="Occupancy Rate"
              value="89%"
              subtitle="Above industry average"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container-nude py-8">
          <div className="text-center">
            <p className="text-nude-700">
              © 2024 Buffr Host. Sophisticated nude design system for hospitality excellence.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Welcome to Buffr Host"
      >
        <div className="space-y-4">
          <p className="text-nude-700">
            Thank you for exploring our nude design system. This sophisticated palette creates 
            a warm, inclusive experience for hospitality professionals.
          </p>
          <div className="flex gap-3 pt-4">
            <ButtonPrimary onClick={() => setIsModalOpen(false)}>
              Get Started
            </ButtonPrimary>
            <ButtonSecondary onClick={() => setIsModalOpen(false)}>
              Learn More
            </ButtonSecondary>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast variant="success">
            <div className="flex items-center justify-between">
              <span>Design system loaded successfully!</span>
              <button 
                onClick={() => setShowToast(false)}
                className="ml-4 text-green-600 hover:text-green-800"
              >
                ✕
              </button>
            </div>
          </Toast>
        </div>
      )}
    </div>
  );
}