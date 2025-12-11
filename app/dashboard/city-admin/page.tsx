// This file should be created at: app/city-admin/page.tsx
// NOT inside the [cityname] folder

"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Shield, Users, UserCheck, Settings, LogOut, Menu, X, Clock, MapPin, Activity,
  FileText, AlertCircle, CheckCircle, Lock, Unlock,
  BarChart3, TrendingUp, Award, Bell
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";

interface User {
  username: string;
  role: string;
  title: string;
  icon: string;
  status: string;
}

interface CityData {
  cityName: string;
  cityCode: string;
  users: User[];
}

interface CurrentUser {
  username: string;
  role: string;
  cityName: string;
  cityCode: string;
  email: string;
}

interface DashboardSection {
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface Stat {
  icon: any;
  title: string;
  value: string;
  color: string;
}

export default function CityAdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>({});

  const dashboardSections: DashboardSection[] = [
    { id: 'statistics', name: 'Statistics Overview', icon: BarChart3, color: '#0066b3' },
    { id: 'violations', name: 'Traffic Violations', icon: AlertCircle, color: '#ef4444' },
    { id: 'reports', name: 'Reports & Documents', icon: FileText, color: '#8b5cf6' },
    { id: 'monitoring', name: 'Live Monitoring', icon: Activity, color: '#10b981' },
    { id: 'personnel', name: 'Personnel Management', icon: Users, color: '#f59e0b' },
    { id: 'analytics', name: 'Analytics Dashboard', icon: TrendingUp, color: '#06b6d4' },
    { id: 'emergency', name: 'Emergency Services', icon: Bell, color: '#dc2626' },
    { id: 'performance', name: 'Performance Metrics', icon: Award, color: '#d4af37' }
  ];

  useEffect(() => {
    // CHECK 1: Is user authenticated?
    if (!authUtils.isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    const session = authUtils.getSession();
    
    // CHECK 2: Does user have admin role?
    if (!session || session.role !== 'admin') {
      router.push("/auth/login");
      return;
    }

    // CHECK 3: Does user have a cityCode (City Admin)?
    if (!session.cityCode || !session.cityName) {
      // Super Admin (no cityCode) goes to super admin dashboard
      router.push("/admin");
      return;
    }

    // All checks passed! Load the city data
    try {
      const cities = localStorage.getItem('traffic_police_cities');
      if (cities) {
        const parsedCities = JSON.parse(cities);
        const userCity = parsedCities.find((city: any) => 
          city.cityCode === session.cityCode
        );
        
        if (userCity) {
          const user: CurrentUser = {
            username: session.username,
            role: session.role,
            cityName: userCity.cityName,
            cityCode: userCity.cityCode,
            email: session.email
          };
          setCurrentUser(user);
          loadCityData(userCity.cityCode);
          loadUserPermissions(userCity.cityCode);
        } else {
          console.log("City not found");
          router.push("/auth/login");
        }
      } else {
        console.log("No cities found");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      router.push("/auth/login");
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const loadCityData = (cityCode: string): void => {
    try {
      const cities = localStorage.getItem('traffic_police_cities');
      if (cities) {
        const parsedCities = JSON.parse(cities);
        const city = parsedCities.find((c: any) => c.cityCode === cityCode);
        if (city) {
          setCityData(city);
        }
      }
    } catch (error) {
      console.error('Error loading city data:', error);
    }
  };

  const loadUserPermissions = (cityCode: string): void => {
    try {
      const stored = localStorage.getItem(`permissions_${cityCode}`);
      if (stored) {
        setUserPermissions(JSON.parse(stored));
      } else {
        const defaultPermissions: Record<string, string[]> = {
          'traffic': ['statistics', 'violations', 'monitoring', 'reports'],
          'Traffic sergeant1': ['statistics', 'violations', 'monitoring'],
          'Traffic sergeant2': ['statistics', 'violations', 'monitoring']
        };
        setUserPermissions(defaultPermissions);
        localStorage.setItem(`permissions_${cityCode}`, JSON.stringify(defaultPermissions));
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const saveUserPermissions = (permissions: Record<string, string[]>): void => {
    if (cityData) {
      try {
        localStorage.setItem(`permissions_${cityData.cityCode}`, JSON.stringify(permissions));
        setUserPermissions(permissions);
        showNotification('Permissions updated successfully!');
      } catch (error) {
        console.error('Error saving permissions:', error);
      }
    }
  };

  const togglePermission = (role: string, sectionId: string): void => {
    const newPermissions = { ...userPermissions };
    
    if (!newPermissions[role]) {
      newPermissions[role] = [];
    }

    const index = newPermissions[role].indexOf(sectionId);
    if (index > -1) {
      newPermissions[role].splice(index, 1);
    } else {
      newPermissions[role].push(sectionId);
    }

    saveUserPermissions(newPermissions);
  };

  const hasPermission = (role: string, sectionId: string): boolean => {
    if (!userPermissions[role]) return false;
    return userPermissions[role].includes(sectionId);
  };

  const toggleAllPermissions = (role: string, enable: boolean): void => {
    const newPermissions = { ...userPermissions };
    if (enable) {
      newPermissions[role] = dashboardSections.map(s => s.id);
    } else {
      newPermissions[role] = [];
    }
    saveUserPermissions(newPermissions);
  };

  const showNotification = (message: string): void => {
    setSuccessMessage(message);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  const handleLogout = (): void => {
    authUtils.logout();
    router.push("/auth/login");
  };

  if (!currentUser || !cityData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats: Stat[] = [
    {
      icon: Users,
      title: "Total Users",
      value: cityData.users.length.toString(),
      color: "#0066b3",
    },
    {
      icon: UserCheck,
      title: "Active Users",
      value: cityData.users.filter(u => u.status === 'active').length.toString(),
      color: "#10b981",
    },
    {
      icon: Lock,
      title: "Dashboard Sections",
      value: dashboardSections.length.toString(),
      color: "#8b5cf6",
    },
    {
      icon: Shield,
      title: "City Status",
      value: "Active",
      color: "#d4af37",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .itp-header {
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
          border-bottom: 4px solid #d4af37;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .itp-card {
          background: white;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        .itp-card:hover {
          border-color: #d4af37;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .itp-stat-card {
          background: white;
          border: 3px solid #d4af37;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .itp-title {
          color: #0066b3;
          font-weight: 700;
        }
        .success-notification {
          position: fixed;
          top: 100px;
          right: 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .permission-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }
        .permission-toggle:hover {
          background: #f3f4f6;
        }
        .permission-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .permission-badge:hover {
          transform: scale(1.05);
        }
        .permission-enabled {
          background: #dcfce7;
          color: #166534;
        }
        .permission-disabled {
          background: #fee2e2;
          color: #991b1b;
        }
        .user-role-card {
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        .section-icon {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
      `}</style>

      {showSuccessNotification && (
        <div className="success-notification">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        </div>
      )}

      <header className="itp-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-white text-2xl font-bold">
                  {cityData.cityName} City Admin Dashboard
                </h1>
                <p className="text-blue-100 text-sm">
                  Manage user permissions and dashboard access
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-white text-right">
                <p className="font-semibold">City Admin</p>
                <p className="text-sm text-blue-100">{cityData.cityName}</p>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-white text-blue-900 hover:bg-gray-100 border-2 border-white font-semibold"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {isMobileMenuOpen && (
            <div className="mt-4 md:hidden bg-white rounded-lg p-4">
              <div className="text-center mb-4 pb-4 border-b-2 border-gray-200">
                <p className="font-semibold itp-title">
                  City Admin
                </p>
                <p className="text-sm text-gray-600">{cityData.cityName}</p>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold itp-title">
                Permission Control Center
              </h2>
              <p className="text-gray-600 mt-1">
                Manage what each user role can access in their dashboard
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="itp-stat-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: `${stat.color}20` }}
                  >
                    <StatIcon
                      className="w-6 h-6"
                      style={{ color: stat.color }}
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
              </div>
            );
          })}
        </div>

        <Card className="itp-card mb-8">
          <CardHeader>
            <CardTitle className="itp-title flex items-center gap-2">
              <Settings className="w-6 h-6" />
              User Role Permissions
            </CardTitle>
            <CardDescription>
              Control which dashboard sections each user role can access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cityData.users.filter(u => u.role !== 'admin').map((user) => (
                <div key={user.username} className="user-role-card">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{user.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{user.title}</h3>
                        <p className="text-sm text-gray-600">Role: {user.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleAllPermissions(user.role, true)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs"
                        size="sm"
                      >
                        <Unlock className="w-3 h-3 mr-1" />
                        Enable All
                      </Button>
                      <Button
                        onClick={() => toggleAllPermissions(user.role, false)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs"
                        size="sm"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Disable All
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dashboardSections.map((section) => {
                      const enabled = hasPermission(user.role, section.id);
                      const SectionIcon = section.icon;
                      return (
                        <div key={section.id} className="permission-toggle">
                          <div className="flex items-center gap-3">
                            <div
                              className="section-icon"
                              style={{ background: `${section.color}15` }}
                            >
                              <SectionIcon
                                className="w-5 h-5"
                                style={{ color: section.color }}
                              />
                            </div>
                            <span className="font-medium text-gray-800 text-sm">
                              {section.name}
                            </span>
                          </div>
                          <button
                            onClick={() => togglePermission(user.role, section.id)}
                            className={`permission-badge ${enabled ? 'permission-enabled' : 'permission-disabled'}`}
                          >
                            {enabled ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Enabled
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                Disabled
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Active Permissions:</span>{' '}
                      {userPermissions[user.role]?.length || 0} of {dashboardSections.length} sections
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="itp-card">
          <CardHeader>
            <CardTitle className="itp-title flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Permission System Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Real-time Control:</strong> Changes take effect immediately when users access their dashboards
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Granular Access:</strong> Each section can be independently enabled or disabled per role
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Bulk Operations:</strong> Use Enable All or Disable All for quick configuration
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Admin Access:</strong> City Admin always has full access to all dashboard sections
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="mt-12 py-6 border-t-4 bg-white" style={{ borderColor: '#d4af37' }}>
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="font-semibold itp-title">
            © 2025 {cityData.cityName} Traffic Police - City Admin Control Panel
          </p>
          <p className="text-sm mt-2">
            Secure permission management system
          </p>
        </div>
      </footer>
    </div>
  );
}