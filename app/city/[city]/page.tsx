"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Car,
  AlertTriangle,
  FileText,
  ArrowLeft,
  Activity,
  TrendingUp,
  Building,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  Award,
  CheckCircle,
  CreditCard,
  Search,
  Calendar,
  Download,
  ExternalLink,
  BookOpen,
  Radio,
  Bot,
  Route,
  Map,
  TrafficCone,
  CarFront,
  Bus,
  BarChart3,
  MessageCircle,
  CheckCircle2,
  Send
} from 'lucide-react';
import ITPChatbot from "@/components/ITPChatbot";

interface CityData {
  id: string;
  cityName: string;
  cityCode: string;
  users: any[];
  createdAt: string;
  status: string;
}

interface CityStats {
  registeredVehicles: string;
  licensedDrivers: string;
  trafficOfficers: string;
  activeChallans: string;
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

export default function CityPage() {
  const router = useRouter();
  const params = useParams();
  const citySlug = params?.city as string;
  
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userEmail, setUserEmail] = useState("guest@trafficx.com");
  const [userRole, setUserRole] = useState("user");
  const [notFound, setNotFound] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isRouteResultsVisible, setIsRouteResultsVisible] = useState(false);
  
  // Background Images State - Replace with your own image paths
const backgroundImages = [
  '/tp1.jpg',  // Your first image
  '/tp2.jpg',  // Your second image  
  '/tp3.jpg',  // Your third image
  '/tp4.jpg'   // Your fourth image
];
  
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // AI Advisor State
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    { text: "Hello! I'm your TrafficX AI Advisor. I can help you with route planning, traffic conditions, challan information, and more. How can I assist you today?", sender: 'bot' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-slide background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getCityStats = (cityName: string): CityStats => {
    const statsMap: { [key: string]: CityStats } = {
      'islamabad': {
        registeredVehicles: '450K+',
        licensedDrivers: '520K+',
        trafficOfficers: '2,500+',
        activeChallans: '850+'
      },
      'karachi': {
        registeredVehicles: '1.2M+',
        licensedDrivers: '1.8M+',
        trafficOfficers: '5,000+',
        activeChallans: '2,300+'
      },
      'multan': {
        registeredVehicles: '280K+',
        licensedDrivers: '350K+',
        trafficOfficers: '1,200+',
        activeChallans: '450+'
      },
      'peshawar': {
        registeredVehicles: '320K+',
        licensedDrivers: '410K+',
        trafficOfficers: '1,500+',
        activeChallans: '550+'
      }
    };

    return statsMap[cityName.toLowerCase()] || {
      registeredVehicles: '150K+',
      licensedDrivers: '200K+',
      trafficOfficers: '800+',
      activeChallans: '300+'
    };
  };

  useEffect(() => {
    // Load city data
    loadCityData();

    // Update time
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Listen for city updates
    const handleCityUpdate = () => {
      loadCityData();
    };

    window.addEventListener('citiesUpdated', handleCityUpdate);
    window.addEventListener('storage', handleCityUpdate);

    return () => {
      clearInterval(timer);
      window.removeEventListener('citiesUpdated', handleCityUpdate);
      window.removeEventListener('storage', handleCityUpdate);
    };
  }, [citySlug]);

  useEffect(() => {
    // Scroll to bottom of AI messages
    aiMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const normalizeCityName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-'); // Replace spaces with hyphens for URL consistency
  };

  const loadCityData = () => {
    console.log('=== LOADING CITY DATA ===');
    console.log('Looking for city slug:', citySlug);
    
    try {
      const storedCities = localStorage.getItem('traffic_police_cities');
      console.log('Raw localStorage data:', storedCities);
      
      if (storedCities) {
        const cities: CityData[] = JSON.parse(storedCities);
        console.log('Parsed cities:', cities);
        console.log('Total cities found:', cities.length);
        
        if (cities.length === 0) {
          console.log('❌ No cities in localStorage array');
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Try multiple matching strategies
        const normalizedSlug = normalizeCityName(citySlug);
        console.log('Normalized slug:', normalizedSlug);
        
        // Strategy 1: Exact match with cityName
        let city = cities.find(
          c => normalizeCityName(c.cityName) === normalizedSlug
        );

        // Strategy 2: Case-insensitive contains match
        if (!city) {
          console.log('Trying contains match...');
          city = cities.find(
            c => normalizeCityName(c.cityName).includes(normalizedSlug) ||
                 normalizedSlug.includes(normalizeCityName(c.cityName))
          );
        }

        // Strategy 3: Partial match (for city codes or abbreviations)
        if (!city) {
          console.log('Trying partial match...');
          city = cities.find(
            c => normalizeCityName(c.cityName).startsWith(normalizedSlug) ||
                 normalizedSlug.startsWith(normalizeCityName(c.cityName)) ||
                 normalizeCityName(c.cityCode) === normalizedSlug
          );
        }

        console.log('Final matched city:', city);
        
        if (city) {
          console.log('✅ City found successfully!');
          setCityData(city);
          setNotFound(false);
        } else {
          console.log('❌ City not found after all matching strategies!');
          console.log('Available cities:', cities.map(c => ({
            name: c.cityName,
            normalized: normalizeCityName(c.cityName),
            code: c.cityCode
          })));
          setNotFound(true);
        }
      } else {
        console.log('❌ No cities in localStorage');
        setNotFound(true);
      }
    } catch (error) {
      console.error('❌ Error loading city data:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    router.push("/");
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

  const handleCalculateRoute = () => {
    const startLocation = (document.getElementById('start-location') as HTMLInputElement)?.value;
    const endLocation = (document.getElementById('end-location') as HTMLInputElement)?.value;
    
    if (startLocation && endLocation) {
      setIsRouteResultsVisible(true);
    } else {
      alert('Please enter both start and end locations');
    }
  };

  // AI Advisor Functions
  const handleAiSend = () => {
    const message = aiInput.trim();
    if (!message) return;

    // Add user message
    setAiMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setAiInput('');

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateAiResponse(message);
      setAiMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAiSend();
    }
  };

  const generateAiResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('route') || lowerMessage.includes('travel') || lowerMessage.includes('how to get')) {
      return `Sure! I can help you find the best route in ${cityData?.cityName}. Please provide your starting point and destination for personalized route suggestions.`;
    } else if (lowerMessage.includes('traffic') || lowerMessage.includes('congestion')) {
      return `Current traffic conditions in ${cityData?.cityName} are moderate. There are some delays on main highways due to ongoing construction. Would you like specific information for a particular area?`;
    } else if (lowerMessage.includes('challan') || lowerMessage.includes('fine') || lowerMessage.includes('ticket')) {
      return `You can check your e-Challan status by providing your vehicle registration number or CNIC. Would you like me to direct you to the challan verification page for ${cityData?.cityName}?`;
    } else if (lowerMessage.includes('accident') || lowerMessage.includes('incident')) {
      return `There are currently 12 active incidents reported across ${cityData?.cityName}. The most significant is on the main highway with expected clearance in 45 minutes.`;
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      return `Weather conditions in ${cityData?.cityName} are clear with minimal impact on traffic. However, light rain is expected this evening which may slow evening commute.`;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! I'm your TrafficX AI Advisor for ${cityData?.cityName}. I can help you with route planning, traffic updates, challan information, and more. What would you like to know?`;
    } else if (lowerMessage.includes('office') || lowerMessage.includes('location')) {
      return `The main ${cityData?.cityName} Traffic Police office is located in the city center. You can visit during office hours or book an appointment online for faster service.`;
    } else if (lowerMessage.includes('license') || lowerMessage.includes('permit')) {
      return `For driving licenses in ${cityData?.cityName}, you can apply online or visit our office. I can help you with the required documents and appointment booking.`;
    } else {
      return `I'm here to help with traffic-related queries in ${cityData?.cityName} including route planning, traffic conditions, challan information, and traffic advisories. How can I assist you?`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-blue-900">Loading {citySlug}...</p>
        </div>
      </div>
    );
  }

  if (notFound || !cityData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <MapPin className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">City Not Found</h1>
          <p className="text-gray-600 mb-4">
            The city "{citySlug}" doesn't exist or hasn't been created yet.
          </p>
          <div className="text-sm text-gray-500 mb-6">
            <p>Make sure the city name matches exactly how it was created.</p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={() => router.push('/create-city')}
              variant="outline"
              className="w-full"
            >
              Create New City
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getCityStats(cityData.cityName);
  const userName = " User";

  // TrafficX Features Data
  const trafficXFeatures = [
    {
      icon: Bot,
      title: "AI Traffic Advisor",
      description: "Get personalized traffic advice and route optimization using our advanced AI engine.",
    },
    {
      icon: Map,
      title: "Live Congestion Map",
      description: "Real-time traffic flow visualization with incident reporting and road conditions.",
    },
    {
      icon: Route,
      title: "Smart Route Planner",
      description: "AI-optimized routes considering traffic, weather, and road conditions.",
    },
    {
      icon: AlertTriangle,
      title: "Traffic Incidents",
      description: "Real-time accident reports, road closures, and hazard alerts.",
    },
    {
      icon: BarChart3,
      title: "Traffic Forecasting",
      description: "Predictive analytics for traffic patterns and congestion hotspots.",
    },
    {
      icon: FileText,
      title: "Challan Verification",
      description: "Check and pay traffic fines with our integrated e-Challan system.",
    },
    {
      icon: CarFront,
      title: "My Vehicle Info",
      description: "Manage your vehicle details, license information, and driving history.",
    },
    {
      icon: Bus,
      title: "Public Transport",
      description: "Integrated public transport routes and schedules for major cities.",
    },
  ];

  const trafficStats = [
    {
      icon: TrafficCone,
      title: "City Congestion",
      value: "Moderate",
      trend: "-5% from yesterday",
      color: "#1a5f7a",
    },
    {
      icon: Clock,
      title: "Avg Travel Time",
      value: "42 min",
      trend: "-3 min from peak",
      color: "#159895",
    },
    {
      icon: AlertTriangle,
      title: "Active Incidents",
      value: "12",
      trend: "+2 from last hour",
      color: "#dc3545",
    },
    {
      icon: Car,
      title: "Weather Impact",
      value: "Low",
      trend: "Clear conditions",
      color: "#57c5b6",
    },
  ];

  const primaryServices = [
    {
      icon: CreditCard,
      title: "Pay Digital Challan",
      description: `Pay traffic violation fines online in ${cityData.cityName}`,
      color: "#ef4444",
    },
    {
      icon: Search,
      title: "E-Challan Verification",
      description: "Check and verify your e-challan status",
      color: "#0066b3",
    },
    {
      icon: Award,
      title: "License Verification",
      description: "Verify your driving license online",
      color: "#0080cc",
    },
    {
      icon: Calendar,
      title: "Book Appointment",
      description: `Schedule visit to ${cityData.cityName} traffic office`,
      color: "#d4af37",
    },
  ];

  const emergencyContacts = [
    { icon: Phone, title: "Emergency Helpline", number: "15", color: "#ef4444" },
    { icon: Phone, title: "CTP Helpline", number: "1915", color: "#0066b3" },
    { icon: Phone, title: "Rescue Service", number: "1122", color: "#10b981" },
    { icon: Phone, title: "Fire Brigade", number: "16", color: "#f59e0b" },
  ];

  const announcements = [
    {
      title: "Smart Driving License",
      description: "New smart card licenses available with enhanced security",
      date: "Nov 2025",
    },
    {
      title: "Online Appointments",
      description: `Book your slot online for ${cityData.cityName} offices`,
      date: "Ongoing",
    },
    {
      title: "Overseas Renewal",
      description: "Special facility for overseas Pakistanis",
      date: "Available",
    },
  ];

  const aiFeaturesList = [
    "24/7 Availability: Get traffic advice anytime, anywhere",
    "Real-Time Data: Based on live traffic feeds from multiple sources",
    "Personalized Routes: Tailored to your preferences and vehicle type",
    "Multi-City Coverage: Available across major Pakistani cities",
    "Weather Integration: Considers weather impact on traffic conditions",
    "Predictive Analytics: Forecasts traffic patterns and potential delays"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    {cityData.cityName} Traffic Police
                  </h1>
                  <p className="text-sm text-gray-600">TrafficX AI Integration</p>
                </div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <button onClick={() => scrollToSection("home")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection("ai-advisor")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                AI Advisor
              </button>
              <button onClick={() => scrollToSection("trafficx")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection("services")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection("contact")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{userName}</p>
                <p className="text-sm text-gray-600 capitalize">{userRole}</p>
              </div>
              <Button
                onClick={handleLogout}
               className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="mt-4 md:hidden bg-white rounded-lg p-4 shadow-lg">
              <div className="space-y-2">
                <button onClick={() => scrollToSection("home")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">
                  Home
                </button>
                <button onClick={() => scrollToSection("ai-advisor")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">
                  AI Advisor
                </button>
                <button onClick={() => scrollToSection("trafficx")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">
                  Features
                </button>
                <button onClick={() => scrollToSection("services")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">
                  Services
                </button>
                <button onClick={() => scrollToSection("contact")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">
                  Contact
                </button>
                <Button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Background Images */}
     <section 
  id="home" 
  className="relative text-white py-20 overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(to bottom right, rgba(30, 58, 138, 0.4), rgba(19, 78, 74, 0.4)), url(${backgroundImages[currentBgIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 1s ease-in-out'
  }}
>
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-black/"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            TrafficX – {cityData.cityName}'s Smart AI Traffic Advisor
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Real-time traffic insights, optimized routes, challan info, and smart travel predictions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => scrollToSection("ai-advisor")}
              className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Bot className="w-5 h-5" />
              Start AI Advisor
            </Button>
            <Button 
              onClick={() => scrollToSection("route-planner")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Route className="w-5 h-5" />
              Plan Route
            </Button>
            <Button 
              onClick={() => scrollToSection("trafficx")}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Map className="w-5 h-5" />
              Live Traffic
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-sm opacity-80">Cities Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">500K+</div>
              <div className="text-sm opacity-80">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-sm opacity-80">Accuracy Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-80">AI Monitoring</div>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentBgIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentBgIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* AI Advisor Section */}
      <section id="ai-advisor" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">AI Traffic Advisor</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get personalized traffic advice and route optimization using our advanced AI engine
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* AI Advisor Content */}
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Intelligent Traffic Assistance</h3>
              <p className="text-gray-600 text-lg mb-6">
                Our AI-powered traffic advisor analyzes real-time data, weather conditions, and historical patterns 
                to provide personalized traffic recommendations and route optimizations for {cityData.cityName}.
              </p>
              
              <div className="space-y-4 mb-8">
                {aiFeaturesList.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => {
                  const demoInput = document.getElementById('ai-demo-input');
                  if (demoInput) demoInput.focus();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <Bot className="w-5 h-5 mr-2" />
                Start AI Consultation
              </Button>
            </div>

            {/* AI Advisor Demo */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6" />
                  <CardTitle className="text-white">TrafficX AI Advisor</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {aiMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={aiMessagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="ai-demo-input"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about routes, traffic, or challans..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button
                      onClick={handleAiSend}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TrafficX AI Features */}
      <section id="trafficx" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Smart Traffic Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive traffic management solutions powered by AI for {cityData.cityName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trafficXFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Traffic Analytics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Live Traffic Analytics</h2>
            <p className="text-xl text-gray-600">Real-time traffic data and insights for {cityData.cityName}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {trafficStats.map((stat, index) => (
              <Card key={index} className="bg-white border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.title}</div>
                      <div className={`text-xs ${stat.trend.includes('+') ? 'text-red-500' : 'text-green-500'}`}>
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Route Planner */}
          <div id="route-planner" className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Smart Route Planner</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Location</label>
                <input 
                  type="text" 
                  id="start-location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter start address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input 
                  type="text" 
                  id="end-location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter destination"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Mode</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="public-transport">Public Transport</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleCalculateRoute}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                >
                  Calculate Route
                </Button>
              </div>
            </div>

            {isRouteResultsVisible && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Recommended Route</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">Distance</div>
                    <div className="text-2xl font-bold text-blue-600">15.2 km</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">Time</div>
                    <div className="text-2xl font-bold text-blue-600">32 min</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">Traffic</div>
                    <div className="text-2xl font-bold text-orange-500">Moderate</div>
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Route className="w-4 h-4 mr-2" />
                  Start Navigation
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Traditional Services */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Traditional Services</h2>
            <p className="text-xl text-gray-600">Access essential {cityData.cityName} Traffic Police services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {primaryServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${service.color}20` }}>
                    <service.icon className="w-6 h-6" style={{ color: service.color }} />
                  </div>
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    {service.title}
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements & Contact */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Announcements */}
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-8">Important Announcements</h3>
              <div className="space-y-6">
                {announcements.map((announcement, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-semibold text-gray-800">{announcement.title}</h4>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {announcement.date}
                      </span>
                    </div>
                    <p className="text-gray-600">{announcement.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-8">Emergency Helplines</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border-2 transition-transform hover:scale-105"
                    style={{ borderColor: contact.color }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${contact.color}20` }}
                      >
                        <contact.icon className="w-6 h-6" style={{ color: contact.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">{contact.title}</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: contact.color }}>
                          {contact.number}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Office Contact */}
              <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Office Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">061-9200657</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{cityData.cityCode.toLowerCase()}@ctp.gov.pk</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{cityData.cityName} Head Office</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <h3 className="text-2xl font-bold">{cityData.cityName} Traffic Police</h3>
          </div>
          <p className="text-blue-200 text-lg mb-6">
            Serving {cityData.cityName} with Excellence • Powered by TrafficX AI
          </p>
          <div className="border-t border-blue-700 pt-6">
            <p className="text-blue-100">
              © 2025 {cityData.cityName} Traffic Police. All Rights Reserved
            </p>
            <p className="text-sm text-blue-300 mt-2">
              City Code: {cityData.cityCode} • TrafficX AI Integration
            </p>
          </div>
        </div>
      </footer>

     <ITPChatbot/>
    </div>
  );
}