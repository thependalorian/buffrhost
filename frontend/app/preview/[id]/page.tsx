"use client";

import { useParams } from "next/navigation";
import ContentPreview from "../../components/ContentPreview";
import React, { useState, useEffect } from "react";
import MenuPreview from "../../components/MenuPreview";
import PropertyPreview from "../../components/PropertyPreview";

interface PreviewData {
  id: string;
  user_id: number;
  property_id: number;
  content_type: "menu" | "property" | "cms" | "image";
  content_data: any;
  preview_type: string;
  status: "draft" | "published" | "expired" | "archived";
  created_at: string;
  expires_at: string;
  metadata: any;
}

const PreviewPage: React.FC = () => {
  const params = useParams();
  const previewId = params?.id as string;

  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/preview/${previewId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Preview not found or expired");
          } else if (response.status === 410) {
            setError("This preview has expired");
          } else {
            setError("Failed to load preview");
          }
          return;
        }

        const data = await response.json();
        setPreviewData(data.preview_data);
      } catch (err) {
        console.error("Error fetching preview:", err);
        setError("Failed to load preview");
      } finally {
        setLoading(false);
      }
    };

    if (previewId) {
      fetchPreviewData();
    }
  }, [previewId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="font-bold text-lg mb-2">Preview Unavailable</h2>
            <p>{error}</p>
          </div>
          <p className="text-gray-600 text-sm">
            This preview may have expired or been removed. Please contact the
            property owner for assistance.
          </p>
        </div>
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No preview data available</p>
        </div>
      </div>
    );
  }

  // Render appropriate preview component based on content type
  const renderPreview = () => {
    switch (previewData.content_type) {
      case "menu":
        return (
          <MenuPreview
            menuData={previewData.content_data}
            isOpen={true}
            onClose={() => {}} // No close functionality for public preview
            showQRCode={false} // Don't show QR code in public preview
          />
        );

      case "property":
        return (
          <PropertyPreview
            propertyData={previewData.content_data}
            isOpen={true}
            onClose={() => {}} // No close functionality for public preview
            showContactInfo={true}
          />
        );

      case "cms":
      case "image":
        return (
          <ContentPreview
            content={{
              type: previewData.content_type,
              data: previewData.content_data,
              title: previewData.content_data.title || "Content Preview",
            }}
            isOpen={true}
            onClose={() => {}} // No close functionality for public preview
            showDeviceToggle={true}
            showSaveButton={false} // No save functionality for public preview
          />
        );

      default:
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Preview</h1>
              <p className="text-gray-600">
                Content type not supported for preview
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BH</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Buffr Host Preview
              </h1>
              <p className="text-sm text-gray-500">
                {previewData.content_type.charAt(0).toUpperCase() +
                  previewData.content_type.slice(1)}{" "}
                Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Preview ID: {previewId.slice(0, 8)}...</span>
            <span>•</span>
            <span>
              Expires: {new Date(previewData.expires_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="relative">{renderPreview()}</div>

      {/* Preview Footer */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            This is a preview of content from Buffr Host.
            <span className="text-blue-600 font-medium">
              {" "}
              Powered by Buffr Host
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
