"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Car,
  AlertTriangle,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Menu,
  X,
  Clock,
  Award,
  CheckCircle,
  ChevronDown,
  Home,
  Info,
  ExternalLink,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";
import ITPChatbot from "@/components/ITPChatbot";

interface City {
  id: string;
  cityName: string;
  cityCode: string;
  status: string;
  createdAt?: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Select City");
  const [cities, setCities] = useState<City[]>([]);

  const loadCities = () => {
    try {
      const storedCities = localStorage.getItem('traffic_police_cities');
      if (storedCities) {
        const parsedCities: City[] = JSON.parse(storedCities);
        const activeCities = parsedCities.filter(city => city.status === 'active');
        setCities(activeCities);
      } else {
        const defaultCities: City[] = [
          { id: 'city:isb', cityName: 'Islamabad', cityCode: 'ISB', status: 'active' },
          { id: 'city:khi', cityName: 'Karachi', cityCode: 'KHI', status: 'active' },
          { id: 'city:mlt', cityName: 'Multan', cityCode: 'MLT', status: 'active' }
        ];
        setCities(defaultCities);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      const defaultCities: City[] = [
        { id: 'city:isb', cityName: 'Islamabad', cityCode: 'ISB', status: 'active' },
        { id: 'city:khi', cityName: 'Karachi', cityCode: 'KHI', status: 'active' },
        { id: 'city:mlt', cityName: 'Multan', cityCode: 'MLT', status: 'active' }
      ];
      setCities(defaultCities);
    }
  };

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

    loadCities();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'traffic_police_cities') {
        loadCities();
      }
    };

    const handleCityUpdate = () => {
      loadCities();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('citiesUpdated', handleCityUpdate);

    const pollInterval = setInterval(() => {
      loadCities();
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('citiesUpdated', handleCityUpdate);
    };
  }, [router]);

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

  const handleCitySelect = (city: City) => {
    setSelectedCity(city.cityName);
    // Updated route to match city/[city]/page.tsx structure
    router.push(`/city/${city.cityName.toLowerCase()}`);
    setIsMobileMenuOpen(false);
  };

  const handleCityCardClick = (city: City) => {
    // Updated route to match city/[city]/page.tsx structure
    router.push(`/city/${city.cityName.toLowerCase()}`);
  };

  if (!userEmail) {
    return null;
  }

  const userName =
    userEmail.split("@")[0].charAt(0).toUpperCase() +
    userEmail.split("@")[0].slice(1);

  const stats = [
    {
      icon: Car,
      title: "Registered Vehicles",
      value: "2.5M+",
      color: "#0066b3",
    },
    {
      icon: Users,
      title: "Licensed Drivers",
      value: "3.8M+",
      color: "#0080cc",
    },
    {
      icon: Shield,
      title: "Traffic Officers",
      value: "15,000+",
      color: "#d4af37",
    },
    {
      icon: AlertTriangle,
      title: "Daily Violations",
      value: "5,000+",
      color: "#ef4444",
    },
  ];

  const services = [
    {
      icon: FileText,
      title: "E-Challan System",
      description: "Check and pay traffic violation challans online",
    },
    {
      icon: Car,
      title: "Vehicle Verification",
      description: "Verify vehicle registration and ownership details",
    },
    {
      icon: Award,
      title: "License Services",
      description: "Apply for or renew your driving license",
    },
    {
      icon: CheckCircle,
      title: "Traffic Rules",
      description: "Learn about traffic laws and regulations",
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
        .itp-dropdown-trigger {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .itp-dropdown-trigger:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #d4af37;
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
        .city-count-badge {
          background: #10b981;
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }
        .city-grid-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .city-grid-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
        }
        .city-grid-card:hover {
          border-color: #d4af37;
          box-shadow: 0 8px 24px rgba(0, 102, 179, 0.2);
          transform: translateY(-4px);
        }
        .new-city-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>

      <header className="itp-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-3 border-gold">
                <Shield className="w-6 h-6" style={{ color: "#0066b3" }} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-white text-2xl font-bold">
                  Pakistan Traffic Police
                </h1>
                <p className="text-blue-100 text-sm">
                  Traffic Police Portal
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
              <button onClick={() => scrollToSection("services")} className="itp-nav-link">
                <FileText className="w-4 h-4" />
                Services
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="itp-dropdown-trigger">
                    <MapPin className="w-4 h-4" />
                    {selectedCity}
                    {cities.length > 0 && (
                      <span className="city-count-badge">{cities.length}</span>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white border-2 border-blue-200"
                >
                  <DropdownMenuLabel className="font-bold text-blue-900">
                    Select City ({cities.length} available)
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {cities.length > 0 ? (
                    cities.map((city) => (
                      <DropdownMenuItem
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className="cursor-pointer hover:bg-blue-50"
                      >
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        <div className="flex items-center justify-between w-full">
                          <span>{city.cityName}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {city.cityCode}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No cities available
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

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
                <button onClick={() => scrollToSection("services")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-blue-900 font-semibold">
                  <FileText className="w-4 h-4" />
                  Services
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center justify-between text-blue-900 font-semibold">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedCity}
                        {cities.length > 0 && (
                          <span className="city-count-badge">{cities.length}</span>
                        )}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Select City ({cities.length})</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {cities.length > 0 ? (
                      cities.map((city) => (
                        <DropdownMenuItem
                          key={city.id}
                          onClick={() => handleCitySelect(city)}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          <div className="flex items-center justify-between w-full">
                            <span>{city.cityName}</span>
                            <span className="text-xs text-gray-500">
                              {city.cityCode}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No cities available
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

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
                Access your traffic services and information
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

        {/* City Pages Section */}
        {cities.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold itp-title">
                  Available City Pages
                </h3>
                <p className="text-gray-600 mt-1">
                  Click on any city to view its dedicated page
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-900">{cities.length} Cities</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => {
                const isNew = city.createdAt && 
                  (new Date().getTime() - new Date(city.createdAt).getTime()) < 24 * 60 * 60 * 1000;
                
                return (
                  <div
                    key={city.id}
                    onClick={() => handleCityCardClick(city)}
                    className="city-grid-card"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {city.cityName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Code: {city.cityCode}
                          </p>
                        </div>
                      </div>
                      {isNew && (
                        <span className="new-city-badge">
                          <Sparkles className="w-3 h-3" />
                          New
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        /city/{city.cityName.toLowerCase()}
                      </span>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div id="services" className="mb-8">
          <h3 className="text-2xl font-bold itp-title mb-6">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="itp-card cursor-pointer">
                <CardHeader>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: "#0066b320" }}
                  >
                    <service.icon
                      className="w-6 h-6"
                      style={{ color: "#0066b3" }}
                    />
                  </div>
                  <CardTitle className="text-lg itp-title">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div id="about" className="itp-info-section mb-8">
          <h3 className="text-2xl font-bold itp-title mb-4">
            About Pakistan Traffic Police
          </h3>
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              The Pakistan Traffic Police is dedicated to ensuring safe and
              orderly traffic flow across the nation. Our mission is to enforce
              traffic laws, educate the public about road safety, and provide
              efficient services to all citizens.
            </p>
            <p className="leading-relaxed">
              With a commitment to professionalism and public service, we work
              tirelessly to reduce traffic accidents, minimize congestion, and
              create a culture of responsible driving. Our officers are trained
              to handle various traffic situations with courtesy and fairness.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="itp-badge">24/7 Service</span>
              <span className="itp-badge">Professional Staff</span>
              <span className="itp-badge">Digital Solutions</span>
              <span className="itp-badge">Public Safety</span>
            </div>
          </div>
        </div>

        <div id="contact">
          <h3 className="text-2xl font-bold itp-title mb-6">Contact Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="itp-contact-item">
              <Phone className="w-6 h-6" style={{ color: "#0066b3" }} />
              <div>
                <p className="font-semibold" style={{ color: "#0066b3" }}>
                  Emergency Helpline
                </p>
                <p className="text-gray-600">051-9260408</p>
              </div>
            </div>
            <div className="itp-contact-item">
              <Mail className="w-6 h-6" style={{ color: "#0066b3" }} />
              <div>
                <p className="font-semibold" style={{ color: "#0066b3" }}>
                  Email Support
                </p>
                <p className="text-gray-600">info@itp.gov.pk</p>
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
            © 2025 Pakistan Traffic Police - All Rights Reserved
          </p>
          <p className="text-sm mt-2">
            Serving the nation with integrity and dedication
          </p>
        </div>
      </footer>

      <ITPChatbot />
    </div>
  );
};

export default Dashboard;