"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      // Replace this with your actual API endpoint
      // const response = await fetch('/api/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #0066b3 0%, #0080cc 50%, #0066b3 100%)",
      }}
    >
      <style jsx>{`
        .itp-card {
          background: white;
          border: 3px solid #d4af37;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        .itp-icon-bg {
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
          border: 3px solid #d4af37;
        }
        .itp-success-bg {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: 3px solid #d4af37;
        }
        .itp-title {
          color: #0066b3;
          font-weight: 700;
        }
        .itp-description {
          color: #0080cc;
        }
        .itp-input {
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        .itp-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        .itp-button {
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
          color: white;
          font-weight: 600;
          border: 2px solid #d4af37;
          transition: all 0.3s ease;
        }
        .itp-button:hover {
          background: linear-gradient(135deg, #0080cc 0%, #0066b3 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 102, 179, 0.4);
        }
        .itp-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .itp-link {
          color: #0066b3;
          font-weight: 600;
        }
        .itp-link:hover {
          color: #d4af37;
        }
        .itp-label {
          color: #0066b3;
          font-weight: 600;
        }
        .itp-back-button {
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .itp-back-button:hover {
          color: #d4af37;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Link
          href="/login"
          className="flex items-center mb-6 itp-back-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        <Card className="w-full itp-card">
          {status === "success" ? (
            // Success State
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 itp-success-bg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl itp-title">
                  Check Your Email
                </CardTitle>
                <CardDescription className="itp-description">
                  We've sent password reset instructions
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  We've sent password reset instructions to{" "}
                  <strong className="text-[#0066b3]">{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button
                  onClick={() => {
                    setStatus("idle");
                    setEmail("");
                  }}
                  className="w-full itp-button"
                >
                  Send Again
                </Button>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="itp-link underline-offset-4 hover:underline"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            // Form State
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 itp-icon-bg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl itp-title">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="itp-description">
                  No worries! Enter your email and we'll send you reset
                  instructions
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="itp-label">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                        style={{ color: "#0066b3" }}
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 itp-input"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {status === "error" && (
                    <div className="flex items-start gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={status === "loading" || !isValidEmail(email)}
                    className="w-full itp-button"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Remember your password?{" "}
                      <Link
                        href="/login"
                        className="itp-link underline-offset-4 hover:underline"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white opacity-90">
            🔒 For security reasons, we don't disclose whether an email is
            registered
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;