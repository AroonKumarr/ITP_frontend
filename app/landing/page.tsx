"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  MapPin,
  BarChart3,
  Route,
  Users,
  CheckCircle2,
  MessageCircle,
  Loader,
  Car,
  Smartphone
} from 'lucide-react';

interface CityData {
  id: string;
  cityName: string;
  cityCode: string;
  status: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = () => {
    try {
      const storedCities = localStorage.getItem('traffic_police_cities');
      if (storedCities) {
        const citiesData: CityData[] = JSON.parse(storedCities);
        setCities(citiesData);
      } else {
        const defaultCities: CityData[] = [
          {
            id: '1',
            cityName: 'Islamabad',
            cityCode: 'ISB',
            status: 'active'
          },
          {
            id: '2',
            cityName: 'Karachi',
            cityCode: 'KHI',
            status: 'active'
          },
          {
            id: '3',
            cityName: 'Lahore',
            cityCode: 'LHR',
            status: 'active'
          },
          {
            id: '4',
            cityName: 'Multan',
            cityCode: 'MUL',
            status: 'active'
          },
          {
            id: '5',
            cityName: 'Peshawar',
            cityCode: 'PSH',
            status: 'active'
          }
        ];
        setCities(defaultCities);
        localStorage.setItem('traffic_police_cities', JSON.stringify(defaultCities));
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCitySlug = (cityName: string) => {
    return cityName.toLowerCase().replace(/\s+/g, '-');
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
  };

  const navigateToCity = async (cityName: string) => {
    if (!cityName) {
      alert('Please select a city to continue');
      return;
    }

    setIsNavigating(true);
    const citySlug = generateCitySlug(cityName);
    const route = `/city/${citySlug}`;
    
    console.log('=== NAVIGATION DEBUG ===');
    console.log('City Name:', cityName);
    console.log('City Slug:', citySlug);
    console.log('Full Route:', route);
    
    try {
      router.push(route);
      
      // Fallback: if navigation doesn't happen in 2 seconds, show message
      setTimeout(() => {
        if (isNavigating) {
          console.log('Navigation taking longer than expected...');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  const handleGetStarted = () => {
    if (selectedCity) {
      navigateToCity(selectedCity);
    } else {
      alert('Please select a city to continue');
    }
  };

  const handleDirectNavigation = (cityName: string) => {
    navigateToCity(cityName);
  };

  const features = [
    {
      icon: BarChart3,
      title: "AI Traffic Analytics",
      description: "Real-time traffic data analysis and predictive insights"
    },
    {
      icon: Route,
      title: "Smart Route Planning",
      description: "AI-optimized routes based on live traffic conditions"
    },
    {
      icon: Shield,
      title: "Digital Challan System",
      description: "Automated e-challan issuance and verification"
    },
    {
      icon: Users,
      title: "License Management",
      description: "Complete digital driving license services"
    },
    {
      icon: Car,
      title: "Vehicle Tracking",
      description: "Real-time vehicle monitoring and management"
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Complete mobile solution for traffic management"
    }
  ];

  const stats = [
    {
      value: "15+",
      label: "Cities Covered"
    },
    {
      value: "2M+",
      label: "Active Users"
    },
    {
      value: "98%",
      label: "Accuracy Rate"
    },
    {
      value: "24/7",
      label: "AI Monitoring"
    }
  ];

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/tp.jpg')", // Replace with your image name
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xl font-bold">TrafficX</span>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
              onClick={() => router.push('/auth/login')}
            >
              Admin Login
            </Button>
          </div>
        </nav>

       {/* Hero Section */}
<div className="container mx-auto px-4 py-">
  <div className="max-w-6xl mx-auto text-center">
    {/* Main Heading */}
    <div className="mb-8">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        Algility<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">X </span>

        Sovereign Traffic<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">X</span>
      </h1>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
        Pakistan's 1st Intelligent <br /> AI Traffic Management System
      </h2>
      <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
        Revolutionizing urban mobility with AI-powered traffic solutions, real-time analytics, 
        and smart city integration for a seamless transportation experience.
      </p>
    </div>

            {/* City Selection */}
            <div id="cities" className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-300/30">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Select Your City to Get Started
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
      <div className="flex-1 w-full relative">
        <Select onValueChange={handleCitySelect} disabled={isNavigating}>
          <SelectTrigger className="w-full h-14 bg-white/90 border-2 border-blue-300 text-gray-800 text-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-500 hover:bg-white transition-colors shadow-lg">
                  {/* OR use one of these alternatives: */}
                  {/* placeholder:text-white/50 */}
                  {/* placeholder:text-gray-300 */}
                   {/* placeholder:text-slate-300 */}
                  <SelectValue placeholder="Choose your city..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20 text-white">
                  {cities.map((city) => (
                  <SelectItem 
                   key={city.id} 
                  value={city.cityName}
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                 >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>{city.cityName}</span>
            <span className="text-blue-300 text-sm">({city.cityCode})</span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

                    
                    {isNavigating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg">
                        <div className="flex items-center gap-2 text-green-400">
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Navigating...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleGetStarted}
                    disabled={isNavigating || !selectedCity}
                    className="h-14 px-8 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isNavigating ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      'Get Started'
                    )}
                  </Button>
                </div>

                {/* Quick City Buttons */}
                <div className="mt-6">
                  <p className="text-blue-200 text-sm mb-3">Or select quickly:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {cities.slice(0, 4).map((city) => (
                      <Button
                        key={city.id}
                        variant="outline"
                        onClick={() => handleDirectNavigation(city.cityName)}
                        disabled={isNavigating}
                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-sm disabled:opacity-50"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {city.cityName}
                      </Button>
                    ))}
                  </div>
                </div>

                {isNavigating && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-400 animate-pulse">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Redirecting to selected city...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-3 mb-6 md:mb-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-xl font-bold">TrafficX</span>
              </div>
              
              <div className="flex gap-6 mb-6 md:mb-0">
                <a href="#" className="text-blue-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors">Contact</a>
              </div>
              
              <div className="text-blue-300 text-center md:text-right">
                <p>© 2025 TrafficX - Pakistan's Premier Traffic Management System</p>
                <p className="text-sm mt-1">All rights reserved</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Debug Info - Remove in production */}
        <div className="fixed bottom-6 left-6 bg-black/50 text-white p-2 rounded text-xs max-w-64 z-50">
          <div>Selected: {selectedCity || 'None'}</div>
          <div>Navigating: {isNavigating ? 'Yes' : 'No'}</div>
          <div>Cities: {cities.length}</div>
        </div>
      </div>
    </div>
  );
}