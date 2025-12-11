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
  Plus, Users, MapPin, Shield, UserCheck, Trash2, Eye, EyeOff,
  LogOut, Menu, X, Clock, Home, Info, Phone, Mail, ExternalLink,
  CheckCircle
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";

interface User {
  username: string;
  password: string;
  role: string;
  title: string;
  icon: string;
  status: string;
}

interface City {
  id: string;
  cityName: string;
  cityCode: string;
  users: User[];
  createdAt: string;
  status: string;
}

interface FormData {
  cityName: string;
  cityCode: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    cityName: '',
    cityCode: '',
  });

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    const session = authUtils.getSession();
    if (session) {
      setUserEmail(session.email);
      setUserRole(session.role);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    loadCities();
    initializeDefaultCities();

    return () => clearInterval(timer);
  }, [router]);

  const loadCities = (): void => {
    try {
      const storedCities = localStorage.getItem('traffic_police_cities');
      if (storedCities) {
        const parsedCities = JSON.parse(storedCities);
        setCities(parsedCities);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      setCities([]);
    }
  };

  const saveCities = (citiesToSave: City[]): void => {
    try {
      localStorage.setItem('traffic_police_cities', JSON.stringify(citiesToSave));
      setCities(citiesToSave);
      
      window.dispatchEvent(new Event('citiesUpdated'));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'traffic_police_cities',
        newValue: JSON.stringify(citiesToSave),
        url: window.location.href
      }));
    } catch (error) {
      console.error('Error saving cities:', error);
    }
  };

  const initializeDefaultCities = (): void => {
    const storedCities = localStorage.getItem('traffic_police_cities');
    
    if (!storedCities) {
      const defaultCities = [
        { name: 'Islamabad', code: 'ISB' },
        { name: 'Karachi', code: 'KHI' },
        { name: 'Multan', code: 'MLT' }
      ];

      const newCities: City[] = defaultCities.map(city => {
        const users = createCityUsers(city.name, city.code);
        return {
          id: `city:${city.code.toLowerCase()}`,
          cityName: city.name,
          cityCode: city.code,
          users: users,
          createdAt: new Date().toISOString(),
          status: 'active'
        };
      });

      saveCities(newCities);
    }
  };

  const generatePassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateUsername = (role: string, cityCode: string): string => {
    const timestamp = Date.now().toString().slice(-4);
    return `${role}_${cityCode}_${timestamp}`.toLowerCase();
  };

  const createCityUsers = (cityName: string, cityCode: string): User[] => {
    const roles = [
      { role: 'admin', icon: '👤', title: 'City Admin' },
      { role: 'traffic', icon: '🚦', title: 'Traffic Control Officer' },
      { role: 'Traffic sergeant 1', icon: '🕵️', title: 'Traffic sergeant 1' },
      { role: 'Traffic sergeant  2', icon: '🕵️', title: 'Traffic sergeant 2' }
    ];

    return roles.map(r => ({
      username: generateUsername(r.role, cityCode),
      password: generatePassword(),
      role: r.role,
      title: r.title,
      icon: r.icon,
      status: 'active'
    }));
  };

  const showNotification = (message: string): void => {
    setSuccessMessage(message);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

  const handleSubmit = (): void => {
    if (!formData.cityName || !formData.cityCode) {
      alert('Please fill all fields');
      return;
    }
    
    const cityId = `city:${formData.cityCode.toLowerCase()}`;
    
    const existingCity = cities.find(c => c.id === cityId);
    if (existingCity) {
      alert('City with this code already exists!');
      return;
    }
    
    const users = createCityUsers(formData.cityName, formData.cityCode);
    
    const newCity: City = {
      id: cityId,
      cityName: formData.cityName,
      cityCode: formData.cityCode.toUpperCase(),
      users: users,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    try {
      const updatedCities = [...cities, newCity];
      saveCities(updatedCities);
      setFormData({ cityName: '', cityCode: '' });
      setShowForm(false);
      
      // Updated route to match city/[city]/page.tsx structure
      const cityUrl = `/city/${formData.cityName.toLowerCase()}`;
      showNotification(
        `✅ City "${formData.cityName}" created successfully! Page available at: ${cityUrl}`
      );
    } catch (error) {
      alert('Error creating city. Please try again.');
    }
  };

  const deleteCity = (cityId: string): void => {
    if (window.confirm('Are you sure you want to delete this city and all its users?')) {
      try {
        const updatedCities = cities.filter(city => city.id !== cityId);
        saveCities(updatedCities);
        setSelectedCity(null);
        showNotification('City and its page deleted successfully!');
      } catch (error) {
        alert('Error deleting city.');
      }
    }
  };

  const togglePasswordVisibility = (userId: string): void => {
    setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const visitCityPage = (cityName: string): void => {
    // Updated route to match city/[city]/page.tsx structure
    const cityUrl = `/city/${cityName.toLowerCase()}`;
    window.open(cityUrl, '_blank');
  };

  const handleLogout = () => {
    authUtils.logout();
    router.push("/auth/login");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  if (!userEmail) {
    return null;
  }

  const userName = userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1);

  const stats = [
    {
      icon: MapPin,
      title: "Total Cities",
      value: cities.length.toString(),
      color: "#0066b3",
    },
    {
      icon: Users,
      title: "Total Users",
      value: (cities.length * 4).toString(),
      color: "#0080cc",
    },
    {
      icon: UserCheck,
      title: "Active Cities",
      value: cities.filter(c => c.status === 'active').length.toString(),
      color: "#d4af37",
    },
    {
      icon: Shield,
      title: "System Status",
      value: "Active",
      color: "#10b981",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
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
          transform: translateY(-4px);
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
        .itp-nav-link {
          color: white;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .itp-nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .itp-info-section {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 2px solid #0066b3;
          border-radius: 1rem;
          padding: 2rem;
        }
        .itp-contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        .itp-contact-item:hover {
          border-color: #d4af37;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .itp-badge {
          background: #d4af37;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .itp-city-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .itp-city-card:hover {
          border-color: #d4af37;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .itp-city-header {
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
          padding: 1.5rem;
          color: white;
        }
        .itp-input {
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
          padding: 0.75rem;
          border-radius: 0.5rem;
          width: 100%;
        }
        .itp-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
          outline: none;
        }
        .itp-label {
          color: #0066b3;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
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
          max-width: 400px;
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
        .page-link-badge {
          background: #10b981;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .page-link-badge:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
      `}</style>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="success-notification">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Success!</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <header className="itp-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-3 border-gold">
                <Shield className="w-6 h-6" style={{ color: "#0066b3" }} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-white text-2xl font-bold">
                  Super Admin Dashboard
                </h1>
                <p className="text-blue-100 text-sm">
                  Manage cities and automatically generate web pages
                </p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-2">
              <button onClick={() => scrollToSection("home")} className="itp-nav-link">
                <Home className="w-4 h-4" />
                Home
              </button>
              <button onClick={() => scrollToSection("about")} className="itp-nav-link">
                <Info className="w-4 h-4" />
                About
              </button>
              <button onClick={() => scrollToSection("cities")} className="itp-nav-link">
                <MapPin className="w-4 h-4" />
                Cities
              </button>
              <button onClick={() => scrollToSection("contact")} className="itp-nav-link">
                <Phone className="w-4 h-4" />
                Contact
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-white text-right">
                <p className="font-semibold">{userName}</p>
                <p className="text-sm text-blue-100 capitalize">{userRole}</p>
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

            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="mt-4 md:hidden bg-white rounded-lg p-4">
              <div className="text-center mb-4 pb-4 border-b-2 border-gray-200">
                <p className="font-semibold" style={{ color: "#0066b3" }}>
                  {userName}
                </p>
                <p className="text-sm text-gray-600 capitalize">{userRole}</p>
              </div>

              <div className="space-y-2 mb-4">
                <button onClick={() => scrollToSection("home")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-blue-900 font-semibold">
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button onClick={() => scrollToSection("about")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-blue-900 font-semibold">
                  <Info className="w-4 h-4" />
                  About
                </button>
                <button onClick={() => scrollToSection("cities")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-blue-900 font-semibold">
                  <MapPin className="w-4 h-4" />
                  Cities
                </button>
                <button onClick={() => scrollToSection("contact")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-blue-900 font-semibold">
                  <Phone className="w-4 h-4" />
                  Contact
                </button>
              </div>

              <Button
                onClick={handleLogout}
                className="w-full itp-button"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <main id="home" className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold itp-title">
                Welcome, {userName}!
              </h2>
              <p className="text-gray-600 mt-1">
                Create cities and their web pages will be generated automatically
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="itp-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New City
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="itp-stat-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <stat.icon
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
          ))}
        </div>

        {showForm && (
          <Card className="itp-card mb-8">
            <CardHeader>
              <CardTitle className="itp-title">Create New City & Web Page</CardTitle>
              <CardDescription>Add a new city and its dedicated page will be created automatically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="itp-label">City Name</label>
                  <input
                    type="text"
                    value={formData.cityName}
                    onChange={(e) => setFormData({...formData, cityName: e.target.value})}
                    className="itp-input"
                    placeholder="e.g., Peshawar"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {/* Updated route display */}
                    Page URL: /city/{formData.cityName.toLowerCase() || 'cityname'}
                  </p>
                </div>
                <div>
                  <label className="itp-label">City Code</label>
                  <input
                    type="text"
                    value={formData.cityCode}
                    onChange={(e) => setFormData({...formData, cityCode: e.target.value})}
                    className="itp-input"
                    placeholder="e.g., PSH"
                    maxLength={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    3-letter city code
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSubmit}
                  className="itp-button"
                >
                  Create City & Generate Page
                </Button>
                <Button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div id="cities" className="mb-8">
          <h3 className="text-2xl font-bold itp-title mb-6">Managed Cities & Their Pages</h3>
          
          {cities.length === 0 && !showForm ? (
            <Card className="itp-card text-center p-12">
              <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Cities Yet</h3>
              <p className="text-gray-600 mb-4">Create your first city to generate its web page</p>
              <Button
                onClick={() => setShowForm(true)}
                className="itp-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New City
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cities.map((city) => (
                <div key={city.id} className="itp-city-card">
                  <div className="itp-city-header">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{city.cityName}</h3>
                        <p className="text-blue-100">Code: {city.cityCode}</p>
                        <button
                          onClick={() => visitCityPage(city.cityName)}
                          className="page-link-badge mt-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {/* Updated route display */}
                          Visit Page: /city/{city.cityName.toLowerCase()}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedCity(selectedCity?.id === city.id ? null : city)}
                          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                          size="sm"
                        >
                          {selectedCity?.id === city.id ? 'Hide' : 'View'}
                        </Button>
                        <Button
                          onClick={() => deleteCity(city.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {selectedCity?.id === city.id && (
                    <div className="p-6">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Users size={20} style={{ color: "#0066b3" }} />
                        <span className="itp-title">User Accounts</span>
                      </h4>
                      <div className="space-y-3">
                        {city.users.map((user, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl">{user.icon}</span>
                                  <span className="font-semibold itp-title">{user.title}</span>
                                </div>
                                <div className="text-sm space-y-1">
                                  <p className="text-gray-600">
                                    <span className="font-medium">Username:</span> {user.username}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-600">Password:</span>
                                    <span className="font-mono text-gray-800">
                                      {showPassword[user.username] ? user.password : '••••••••••••'}
                                    </span>
                                    <button
                                      onClick={() => togglePasswordVisibility(user.username)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      {showPassword[user.username] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  </div>
                                  <p className="text-gray-600">
                                    <span className="font-medium">Role:</span> {user.role}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="about" className="itp-info-section mb-8">
          <h3 className="text-2xl font-bold itp-title mb-4">
            About Super Admin Dashboard
          </h3>
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              The Super Admin Dashboard provides centralized control with automatic page generation. 
              When you create a new city, the system automatically generates a dedicated web page 
              accessible at /city/{'{cityname}'}.
            </p>
            <p className="leading-relaxed">
              Each city page includes statistics, services, emergency contacts, and information 
              specific to that city. Four user accounts are also automatically created with secure 
              passwords for each city.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="itp-badge">Auto Page Generation</span>
              <span className="itp-badge">User Management</span>
              <span className="itp-badge">System Oversight</span>
              <span className="itp-badge">Secure Access</span>
            </div>
          </div>
        </div>

        <div id="contact">
          <h3 className="text-2xl font-bold itp-title mb-6">Admin Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="itp-contact-item">
              <Phone className="w-6 h-6" style={{ color: "#0066b3" }} />
              <div>
                <p className="font-semibold" style={{ color: "#0066b3" }}>
                  Admin Helpline
                </p>
                <p className="text-gray-600">051-9260408</p>
              </div>
            </div>
            <div className="itp-contact-item">
              <Mail className="w-6 h-6" style={{ color: "#0066b3" }} />
              <div>
                <p className="font-semibold" style={{ color: "#0066b3" }}>
                  Admin Support
                </p>
                <p className="text-gray-600">admin@itp.gov.pk</p>
              </div>
            </div>
            <div className="itp-contact-item">
              <MapPin className="w-6 h-6" style={{ color: "#0066b3" }} />
              <div>
                <p className="font-semibold" style={{ color: "#0066b3" }}>
                  Head Office
                </p>
                <p className="text-gray-600">Islamabad, Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t-4 border-gold bg-white">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="font-semibold" style={{ color: "#0066b3" }}>
            © 2025 Pakistan Traffic Police - Super Admin Portal
          </p>
          <p className="text-sm mt-2">
            Secure system management and automatic page generation
          </p>
        </div>
      </footer>
    </div>
  );
}