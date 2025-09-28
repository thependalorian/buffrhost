"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EtunaAIAssistantRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new professional AI assistant
    router.replace("/guest/etuna/ai-assistant-new");
  }, [router]);

  return (
    <div className="min-h-screen nude-gradient-light flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-nude-800 mb-4"></div>
        <h2 className="text-xl font-semibold mb-2 text-nude-900">
          Upgrading AI Assistant
        </h2>
        <p className="text-nude-800">
          Redirecting to the new professional interface...
        </p>
      </div>
    </div>
  );
}

/**
 * Etuna AI Assistant Page - Professional Demo
 *
 * This page has been upgraded to showcase Buffr Host's advanced AI capabilities
 * Redirects to the new professional AI assistant interface
 */
