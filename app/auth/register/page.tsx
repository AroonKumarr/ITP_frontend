"use client";
import React, { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RegistrationFormData {
  name: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Registration: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    name: keyof RegistrationFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log(formData);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      `}</style>

      <Card className="w-full max-w-md   itp-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 itp-icon-bg">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl itp-title">
            Join Our Traffic Police Portal
          </CardTitle>
          <CardDescription className="itp-description">
            Create your account to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="itp-label">
                Full Name *
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "#0066b3" }}
                />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10 itp-input"
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="userName" className="itp-label">
                Username *
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "#0066b3" }}
                />
                <Input
                  id="userName"
                  type="text"
                  placeholder="Choose a username"
                  required
                  value={formData.userName}
                  onChange={(e) =>
                    handleInputChange("userName", e.target.value)
                  }
                  className="pl-10 itp-input"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 itp-input"
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
                  placeholder="Create a strong password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="pl-10 pr-10 itp-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" style={{ color: "#0066b3" }} />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: "#0066b3" }} />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="itp-label">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "#0066b3" }}
                />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="pl-10 pr-10 itp-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" style={{ color: "#0066b3" }} />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: "#0066b3" }} />
                  )}
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full itp-button  bg-blue-500">
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
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
      </Card>
    </div>
  );
};

export default Registration;
