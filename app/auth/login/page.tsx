"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail, UserCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authUtils } from "@/lib/auth";

interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate credentials with email or username
    const user = authUtils.validateCredentials(formData.emailOrUsername, formData.password);

    if (!user) {
      setError("Invalid email/username or password. Please try again.");
      setIsLoading(false);
      return;
    }

    // Create user session
    authUtils.createSession(user);
    
    // Wait a moment for session to be saved
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Redirect to appropriate dashboard based on role and cityCode
    if (user.role === "admin" && !user.cityCode) {
      // Super Admin (no cityCode)
      router.push("/dashboard/sys-admin");
    } else if (user.role === "admin" && user.cityCode && user.cityName) {
      // City Admin (has cityCode and cityName) - redirect to city admin page
      const cityAdminPath = "/dashboard/city-admin";
      console.log(`Redirecting City Admin to: ${cityAdminPath}`);
      router.push(cityAdminPath);
    } else if (user.role === "traffic") {
      // Traffic control officer - redirect to traffic dashboard
      router.push("/dashboard/traffic-dashboard");
    } else if (user.role === "agent1" || user.role === "agent2" || user.role?.startsWith("agent")) {
      // Agents - redirect to agent dashboard
      router.push("/dashboard/agent-dashboard");
    } else if (user.role === "user") {
      // Default user dashboard
      router.push("/dashboard/Main-dashboard");
    } else {
      // Fallback
      router.push("/dashboard/Main-dashboard");
    }
  };

  const handleBackToLanding = () => {
    router.push("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/tp.jpg')", // Replace with your image name
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
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
        .itp-title {
          color: #0066b3;
          font-weight: 700;
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
        .itp-button:hover:not(:disabled) {
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
          margin-left: 4px;
        }
        .itp-link:hover {
          color: #d4af37;
        }
        .itp-label {
          color: #0066b3;
          font-weight: 600;
        }
        .itp-forgot-link {
          color: #0066b3;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }
        .itp-forgot-link:hover {
          color: #d4af37;
        }
        .itp-alert {
          background: #fee2e2;
          border: 2px solid #ef4444;
          border-radius: 0.5rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .itp-alert-error {
          color: #dc2626;
        }
        .itp-alert-info {
          background: #dbeafe;
          border: 2px solid #3b82f6;
          color: #1e40af;
        }
        .itp-back-button {
          background: transparent;
          color: #0066b3;
          border: 2px solid #0066b3;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .itp-back-button:hover {
          background: #0066b3;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 102, 179, 0.3);
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          onClick={handleBackToLanding}
          className="itp-back-button mb-4"
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="w-full itp-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 itp-icon-bg">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl itp-title">
              Welcome Back to Traffic Police Portal
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="itp-alert itp-alert-error">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Demo Credentials Info */}
              <div className="itp-alert itp-alert-info">
                <p className="text-xs">
                  <strong>Demo Credentials:</strong>
                  <br />
                  <strong>Admin:</strong> admin@itp.com / admin123
                  <br />
                  <strong>User:</strong> user@itp.com / user123 or laiba@itp.com / test123
                </p>
              </div>

              {/* Email or Username Field */}
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername" className="itp-label">
                  Email or Username *
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: "#0066b3" }}
                  />
                  <Input
                    id="emailOrUsername"
                    type="text"
                    placeholder="Enter your email or username"
                    required
                    value={formData.emailOrUsername}
                    onChange={(e) => handleInputChange("emailOrUsername", e.target.value)}
                    className="pl-10 itp-input"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="itp-label">
                  Password *
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: "#0066b3" }}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-10 pr-10 itp-input"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" style={{ color: "#0066b3" }} />
                    ) : (
                      <Eye className="w-4 h-4" style={{ color: "#0066b3" }} />
                    )}
                  </Button>
                </div>
                <div className="text-right">
                  <Link
                    href="/forget"
                    className="itp-forgot-link underline-offset-4 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full itp-button"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?
                  <Link
                    href="/register"
                    className="itp-link underline-offset-4 hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;