'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlayIcon } from '@heroicons/react/24/outline';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Default demo video URL (you can replace this with your actual demo video)
  const defaultVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Replace with your demo video
  const finalVideoUrl = videoUrl || defaultVideoUrl;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsPlaying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-75" onClick={handleClose}></div>
        
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Buffr Host Demo Video
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Video Content */}
          <div className="p-6">
            {isPlaying ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={finalVideoUrl}
                  title="Buffr Host Demo Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video bg-sand-100 dark:bg-sand-800 rounded-lg flex items-center justify-center relative group cursor-pointer"
                   onClick={() => setIsPlaying(true)}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <PlayIcon className="w-8 h-8 text-white ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Watch Buffr Host in Action
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    See how our platform transforms hospitality management
                  </p>
                </div>
              </div>
            )}

            {/* Video Description */}
            <div className="mt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What you'll see:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• QR Code ordering system</li>
                    <li>• Real-time inventory management</li>
                    <li>• AI receptionist capabilities</li>
                    <li>• Analytics dashboard</li>
                    <li>• Multi-location management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Duration:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">5 minutes</p>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Perfect for:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Hotel managers</li>
                    <li>• Restaurant owners</li>
                    <li>• Hospitality decision makers</li>
                  </ul>
                </div>
              </div>

              {!isPlaying && (
                <div className="bg-sand-50 dark:bg-sand-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Note:</strong> This is a general demo video. For a personalized demonstration 
                    tailored to your specific business needs, please request a custom demo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
