"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface SmartWaitlistProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartWaitlist = ({ isOpen, onClose }: SmartWaitlistProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-nude-900 mb-4">Join the Waitlist</h2>
        <p className="text-nude-600 mb-6">Get early access to Buffr Host</p>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-nude-300 rounded-full focus:ring-2 focus:ring-nude-500 focus:border-transparent"
          />
          <Button
            className="w-full bg-nude-600 hover:bg-nude-700 text-white"
            onClick={onClose}
          >
            Join Waitlist
          </Button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-nude-400 hover:text-nude-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
