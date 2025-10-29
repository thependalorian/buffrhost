'use client';

import React, { useState } from 'react';
import { Navigation, Footer, BottomCTA, PageHero, SmartWaitlist } from '@/components/landing';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';
import { BuffrInput } from '@/components/ui/forms/BuffrInput';
import { BuffrTextarea } from '@/components/ui/forms/BuffrTextarea';
import { BuffrSelect } from '@/components/ui/forms/BuffrSelect';

/**
 * Contact & Support Page
 * 
 * Consolidated contact and support page with form submission to george@buffr.ai
 * Location: app/contact/page.tsx
 * Features: Contact form, support resources, FAQ section
 */

export default function ContactSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:george@buffr.ai?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.inquiryType}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-nude-50 text-nude-900 font-primary min-h-screen flex flex-col">
      <Navigation onStartTrial={() => setShowWaitlistModal(true)} />
      <main className="flex-grow">
        <PageHero
          title="Contact & Support"
          subtitle="We're Here to Help You Succeed"
          description="Get in touch with our team for support, questions, or to learn more about how Buffr Host can transform your hospitality business."
        />

        <div className="container mx-auto px-6 py-16">
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg text-nude-700 mb-6">
              Have questions or need assistance? Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <BuffrInput
                id="name"
                name="name"
                type="text"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                variant="primary"
                size="md"
              />
              <BuffrInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@example.com"
                required
                variant="primary"
                size="md"
              />
              <BuffrSelect
                id="inquiryType"
                name="inquiryType"
                label="Inquiry Type"
                value={formData.inquiryType}
                onChange={handleChange}
                variant="primary"
                size="md"
              >
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales Question</option>
                <option value="partnership">Partnership</option>
                <option value="feedback">Feedback</option>
              </BuffrSelect>
              <BuffrInput
                id="subject"
                name="subject"
                type="text"
                label="Subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief subject line"
                required
                variant="primary"
                size="md"
              />
              <BuffrTextarea
                id="message"
                name="message"
                label="Message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your detailed message"
                rows={5}
                required
                variant="primary"
                size="md"
              />
              <BuffrButton type="submit" variant="primary" size="lg" className="w-full">
                Send Message
              </BuffrButton>
            </form>
          </div>

          {/* Support Resources */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Support Resources</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-nude-800">Frequently Asked Questions</h3>
                  <p className="text-nude-600">Find quick answers to common questions about Buffr Host platform features, pricing, and implementation.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-nude-800">Documentation</h3>
                  <p className="text-nude-600">Comprehensive guides and tutorials to help you get the most out of our platform.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-nude-800">Video Tutorials</h3>
                  <p className="text-nude-600">Step-by-step video guides for setting up and using Buffr Host features.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-nude-800">Response Time</h3>
                  <p className="text-nude-600">We typically respond within 24 hours</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-nude-800">Business Hours</h3>
                  <p className="text-nude-600">Monday - Friday: 8:00 AM - 6:00 PM (CAT)</p>
                  <p className="text-nude-600">Saturday: 9:00 AM - 1:00 PM (CAT)</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-nude-800">Emergency Support</h3>
                  <p className="text-nude-600">For critical issues, use the form above with "Emergency" as the inquiry type</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <BottomCTA onJoinWaitlist={() => setShowWaitlistModal(true)} />
      </main>
      <Footer />
      
      <SmartWaitlist
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
}