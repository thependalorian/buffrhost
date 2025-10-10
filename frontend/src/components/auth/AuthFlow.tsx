/**
 * Auth Flow Component for Buffr Host Frontend
 *
 * Component that handles the complete authentication flow.
 */

"use client";

import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

interface AuthFlowProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  defaultTab?: "login" | "signup" | "forgot-password";
  className?: string;
}

export function AuthFlow({
  onSuccess,
  onError,
  defaultTab = "login",
  className,
}: AuthFlowProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleLoginSuccess = () => {
    onSuccess?.();
  };

  const handleSignUpSuccess = () => {
    onSuccess?.();
  };

  const handleForgotPasswordSuccess = () => {
    // Stay on forgot password tab to show success message
  };

  const handleError = (error: string) => {
    onError?.(error);
  };

  const handleBackToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className={className}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Welcome to BuffrHost</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTab === "forgot-password" ? (
            <ForgotPasswordForm
              onSuccess={handleForgotPasswordSuccess}
              onError={handleError}
              onBackToLogin={handleBackToLogin}
            />
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "login" | "signup")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm
                  onSuccess={handleLoginSuccess}
                  onError={handleError}
                  showSocialAuth={true}
                />
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("forgot-password")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm
                  onSuccess={handleSignUpSuccess}
                  onError={handleError}
                  showSocialAuth={true}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthFlow;
