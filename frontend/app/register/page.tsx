'use client';

import React, { useState } from 'react';
import { Navigation, Footer, PageHero, SmartWaitlist } from '@/components/landing';
import { BuffrSignUpForm } from '@/components/auth/BuffrSignUpForm';

/**
 * Register Page
 * 
 * User registration page with Buffr ID integration
 * Location: app/register/page.tsx
 * Features: Sign up form, project selection, account creation
 */

export default function RegisterPage() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const handleSignUpSuccess = (buffrId: string) => {
    console.log('Sign up successful:', buffrId);
    // Redirect to dashboard or appropriate page
    window.location.href = '/dashboard';
  };

  return (
    <div className="bg-nude-50 text-nude-900 font-primary min-h-screen flex flex-col">
      <Navigation onStartTrial={() => setShowWaitlistModal(true)} />
      <main className="flex-grow">
        <PageHero
          title="Join Buffr Host"
          subtitle="Create Account"
          description="Start your hospitality management journey with our comprehensive platform. Free 3-month trial included."
        />

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto">
            <BuffrSignUpForm onSuccess={handleSignUpSuccess} />
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
