"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  Building2, 
  Utensils, 
  Spa, 
  Users2, 
  Star,
  ArrowRight,
  CheckCircle,
  X
} from "lucide-react";

interface SmartWaitlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const businessTypes = {
  hotel: {
    name: "Hotel/Resort",
    icon: Building2,
    color: "nude-600",
    questions: [
      "How many rooms do you manage?",
      "What's your current occupancy rate?",
      "What's your biggest operational challenge?"
    ],
    nextSteps: [
      "Room management optimization consultation",
      "Revenue analytics setup",
      "Guest experience enhancement planning"
    ]
  },
  restaurant: {
    name: "Restaurant/Bar",
    icon: Utensils,
    color: "nude-500",
    questions: [
      "How many covers do you serve daily?",
      "What's your average table turnover?",
      "What's your biggest operational challenge?"
    ],
    nextSteps: [
      "Table management system setup",
      "Kitchen display optimization",
      "Customer analytics implementation"
    ]
  },
  "multi-venue": {
    name: "Multi-Venue Complex",
    icon: Users2,
    color: "nude-700",
    questions: [
      "How many venues do you operate?",
      "What types of venues do you manage?",
      "What's your biggest operational challenge?"
    ],
    nextSteps: [
      "Unified management system setup",
      "Cross-venue analytics configuration",
      "Staff coordination optimization"
    ]
  },
  boutique: {
    name: "Boutique Property",
    icon: Star,
    color: "luxury-champagne",
    questions: [
      "What makes your property unique?",
      "What's your guest capacity?",
      "What's your biggest operational challenge?"
    ],
    nextSteps: [
      "Luxury guest experience design",
      "Premium service management setup",
      "Exclusive amenity integration"
    ]
  },
  other: {
    name: "Other",
    icon: Building2,
    color: "nude-400",
    questions: [
      "What type of hospitality business?",
      "What's your current setup?",
      "What's your biggest operational challenge?"
    ],
    nextSteps: [
      "Custom solution consultation",
      "Tailored implementation plan",
      "Specialized feature development"
    ]
  }
};

export default function SmartWaitlist({ isOpen, onClose }: SmartWaitlistProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    location: "",
    currentSystem: "",
    challenge: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBusinessType = formData.businessType as keyof typeof businessTypes;
  const businessConfig = selectedBusinessType ? businessTypes[selectedBusinessType] : null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/waitlist/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to join waitlist");
      }

      const result = await response.json();
      console.log("Waitlist signup successful:", result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error joining waitlist:", error);
      setError("Failed to join waitlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      businessName: "",
      businessType: "",
      location: "",
      currentSystem: "",
      challenge: "",
      message: ""
    });
    setIsSubmitted(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={handleClose}
        ></div>

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-nude-200">
            <div>
              <h2 className="text-2xl font-display font-bold text-nude-900">
                {isSubmitted ? "Welcome to Buffr Host!" : "Join the Waitlist"}
              </h2>
              <p className="text-nude-600">
                {isSubmitted 
                  ? "We'll be in touch soon with your personalized setup plan"
                  : "Get personalized recommendations for your business"
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-nude-400 hover:text-nude-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-semantic-success mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-nude-900 mb-2">
                  You're on the waitlist!
                </h3>
                <p className="text-nude-600 mb-6">
                  Thank you for joining our waitlist! We'll contact you within 24 hours to discuss your specific needs and set up your personalized 3-month free trial.
                </p>
                
                {businessConfig && (
                  <div className="bg-nude-50 rounded-lg p-6 mb-6 text-left">
                    <h4 className="font-semibold text-nude-900 mb-4">
                      Your personalized next steps:
                    </h4>
                    <ul className="space-y-2">
                      {businessConfig.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-nude-700">
                          <CheckCircle className="w-4 h-4 text-semantic-success" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button onClick={handleClose} className="bg-nude-600 hover:bg-nude-700 text-white">
                  Close
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Form */}
                <div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-semantic-error/10 border border-semantic-error/20 text-semantic-error rounded-lg p-4">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-nude-800 font-medium">
                          First Name *
                        </Label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-nude-800 font-medium">
                          Last Name *
                        </Label>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-nude-800 font-medium">
                          Email Address *
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-nude-800 font-medium">
                          Phone Number
                        </Label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="+264 81 123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="businessName" className="text-nude-800 font-medium">
                        Business Name *
                      </Label>
                      <Input
                        type="text"
                        id="businessName"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Your Business Name"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessType" className="text-nude-800 font-medium">
                          Business Type *
                        </Label>
                        <select
                          id="businessType"
                          name="businessType"
                          required
                          value={formData.businessType}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-600 focus:border-nude-600"
                        >
                          <option value="">Select business type</option>
                          {Object.entries(businessTypes).map(([key, type]) => (
                            <option key={key} value={key}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-nude-800 font-medium">
                          Location *
                        </Label>
                        <Input
                          type="text"
                          id="location"
                          name="location"
                          required
                          value={formData.location}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Windhoek, Namibia"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="currentSystem" className="text-nude-800 font-medium">
                        Current System (if any)
                      </Label>
                      <Input
                        type="text"
                        id="currentSystem"
                        name="currentSystem"
                        value={formData.currentSystem}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Manual processes, Excel, other software..."
                      />
                    </div>

                    {businessConfig && (
                      <div>
                        <Label htmlFor="challenge" className="text-nude-800 font-medium">
                          {businessConfig.questions[2]}
                        </Label>
                        <textarea
                          id="challenge"
                          name="challenge"
                          rows={3}
                          value={formData.challenge}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-600 focus:border-nude-600"
                          placeholder="Tell us about your biggest operational challenge..."
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="message" className="text-nude-800 font-medium">
                        Additional Information
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-600 focus:border-nude-600"
                        placeholder="Any other information you'd like to share..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-nude-600 hover:bg-nude-700 text-white"
                      >
                        {isSubmitting ? "Joining Waitlist..." : "Join Waitlist"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        type="button"
                        onClick={handleClose}
                        variant="outline"
                        className="px-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Personalized Preview */}
                {businessConfig && (
                  <div className="bg-nude-50 rounded-2xl p-6">
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 bg-${businessConfig.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <businessConfig.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-nude-900 mb-2">
                        {businessConfig.name} Solution
                      </h3>
                      <p className="text-nude-600">
                        Here's what we'll set up for your business
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-nude-900">
                        Key Questions We'll Address:
                      </h4>
                      <ul className="space-y-2">
                        {businessConfig.questions.slice(0, 2).map((question, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-nude-700">
                            <div className={`w-2 h-2 bg-${businessConfig.color} rounded-full mt-2 flex-shrink-0`}></div>
                            {question}
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-semibold text-nude-900 mt-6">
                        Your Next Steps:
                      </h4>
                      <ul className="space-y-2">
                        {businessConfig.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-nude-700">
                            <CheckCircle className="w-4 h-4 text-semantic-success flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}