'use client';

import React, { useState } from 'react';
import { Navigation, Footer, PageHero, SmartWaitlist } from '@/components/landing';
import { BuffrLoginForm } from '@/components/auth/BuffrLoginForm';

/**
 * Login Page
 * 
 * User authentication page with Buffr ID integration
 * Location: app/login/page.tsx
 * Features: Login form, project selection, authentication
 */

export default function LoginPage() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const handleLoginSuccess = (buffrId: string) => {
    console.log('Login successful:', buffrId);
    // Redirect to dashboard or appropriate page
    window.location.href = '/dashboard';
  };

  return (
    <div className="bg-nude-50 text-nude-900 font-primary min-h-screen flex flex-col">
      <Navigation onStartTrial={() => setShowWaitlistModal(true)} />
      <main className="flex-grow">
        <PageHero
          title="Welcome Back"
          subtitle="Sign In"
          description="Access your Buffr Host account and manage your hospitality business with ease."
        />

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto">
            <BuffrLoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      </main>
      <Footer />
      
      <SmartWaitlist
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
}
