"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  MapPin, AlertTriangle, Car, Users, Clock, TrendingUp,
  Radio, MessageSquare, FileText, Camera, CheckCircle,
  XCircle, AlertCircle, Navigation, LogOut, Menu, X,
  Bell, Eye, Send, Plus, Filter, Download, Shield
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";

interface Violation {
  id: string;
  vehicleNumber: string;
  type: string;
  location: string;
  time: string;
  status: 'pending' | 'verified' | 'rejected';
  assignedAgent?: string;
  severity: 'low' | 'medium' | 'high';
}

interface Incident {
  id: string;
  type: string;
  location: string;
  time: string;
  status: 'active' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  description: string;
}

interface Agent {
  id: string;
  name: string;
  status: 'on-duty' | 'off-duty' | 'on-break';
  location: string;
  assignedTasks: number;
}

export default function TrafficOfficerDashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [userCity, setUserCity] = useState('');
  const [userName, setUserName] = useState('');

  const [newIncident, setNewIncident] = useState({
    type: '',
    location: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [violations, setViolations] = useState<Violation[]>([
    {
      id: 'V001',
      vehicleNumber: 'ABC-123',
      type: 'Speeding',
      location: 'Blue Area, Sector F-6',
      time: '10:30 AM',
      status: 'pending',
      severity: 'high'
    },
    {
      id: 'V002',
      vehicleNumber: 'XYZ-789',
      type: 'Red Light Violation',
      location: 'Jinnah Avenue',
      time: '11:15 AM',
      status: 'verified',
      assignedAgent: 'Agent 1',
      severity: 'medium'
    },
    {
      id: 'V003',
      vehicleNumber: 'LMN-456',
      type: 'Illegal Parking',
      location: 'F-7 Markaz',
      time: '09:45 AM',
      status: 'pending',
      severity: 'low'
    },
    {
      id: 'V004',
      vehicleNumber: 'PQR-321',
      type: 'Wrong Way Driving',
      location: 'Constitution Avenue',
      time: '12:20 PM',
      status: 'pending',
      severity: 'high'
    }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'I001',
      type: 'Accident',
      location: 'Kashmir Highway',
      time: '08:30 AM',
      status: 'active',
      priority: 'high',
      description: 'Two vehicle collision, minor injuries reported'
    },
    {
      id: 'I002',
      type: 'Road Block',
      location: 'Constitution Avenue',
      time: '09:00 AM',
      status: 'active',
      priority: 'medium',
      description: 'Construction work ongoing, expect delays'
    },
    {
      id: 'I003',
      type: 'Signal Malfunction',
      location: 'Zero Point',
      time: '10:15 AM',
      status: 'active',
      priority: 'high',
      description: 'Traffic signal not working, manual control needed'
    }
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    { id: 'A001', name: 'Traffic sergeant 1', status: 'on-duty', location: 'Sector F-6', assignedTasks: 3 },
    { id: 'A002', name: 'Traffic sergeant 2', status: 'on-duty', location: 'Blue Area', assignedTasks: 2 },
    { id: 'A003', name: 'Traffic sergeant 3', status: 'on-break', location: 'F-7 Markaz', assignedTasks: 0 },
    { id: 'A004', name: 'Traffic sergeant 4', status: 'off-duty', location: 'Offline', assignedTasks: 0 }
  ]);

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    const session = authUtils.getSession();
    if (session) {
      if (session.role !== 'traffic') {
        router.push("/auth/login");
        return;
      }
      setUserCity(session.cityName || 'City');
      setUserName(session.username || 'Officer');
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    authUtils.logout();
    router.push("/auth/login");
  };

  const handleCreateIncident = () => {
    if (!newIncident.type || !newIncident.location) {
      alert('Please fill all required fields');
      return;
    }

    const incident: Incident = {
      id: `I${String(incidents.length + 1).padStart(3, '0')}`,
      type: newIncident.type,
      location: newIncident.location,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      priority: newIncident.priority,
      description: newIncident.description
    };

    setIncidents([incident, ...incidents]);
    setNewIncident({ type: '', location: '', description: '', priority: 'medium' });
    setShowIncidentForm(false);
  };

  const handleAssignAgent = (agentId: string) => {
    if (!selectedViolation) return;

    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    setViolations(violations.map(v => 
      v.id === selectedViolation.id 
        ? { ...v, assignedAgent: agent.name, status: 'pending' }
        : v
    ));

    setAgents(agents.map(a =>
      a.id === agentId
        ? { ...a, assignedTasks: a.assignedTasks + 1 }
        : a
    ));

    setShowAssignModal(false);
    setSelectedViolation(null);
  };

  const handleViolationAction = (violationId: string, action: 'verify' | 'reject') => {
    setViolations(violations.map(v =>
      v.id === violationId
        ? { ...v, status: action === 'verify' ? 'verified' : 'rejected' }
        : v
    ));
  };

  const handleResolveIncident = (incidentId: string) => {
    setIncidents(incidents.map(i =>
      i.id === incidentId
        ? { ...i, status: 'resolved' }
        : i
    ));
  };

  const stats = [
    {
      icon: AlertTriangle,
      title: "Active Incidents",
      value: incidents.filter(i => i.status === 'active').length.toString(),
      color: "#ef4444",
      bgColor: "#fee2e2"
    },
    {
      icon: Car,
      title: "Pending Violations",
      value: violations.filter(v => v.status === 'pending').length.toString(),
      color: "#f59e0b",
      bgColor: "#fef3c7"
    },
    {
      icon: Users,
      title: "Agents On Duty",
      value: agents.filter(a => a.status === 'on-duty').length.toString(),
      color: "#10b981",
      bgColor: "#d1fae5"
    },
    {
      icon: CheckCircle,
      title: "Verified Today",
      value: violations.filter(v => v.status === 'verified').length.toString(),
      color: "#0066b3",
      bgColor: "#dbeafe"
    }
  ];

  if (!userCity) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .traffic-header {
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
          border-bottom: 4px solid #d4af37;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .traffic-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
        }
        .traffic-card:hover {
          border-color: #d4af37;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .stat-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .tab-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .tab-button.active {
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
          color: white;
          border-color: #d4af37;
        }
        .tab-button:not(.active) {
          color: #6b7280;
          background: white;
        }
        .tab-button:not(.active):hover {
          background: #f3f4f6;
          color: #0066b3;
        }
        .traffic-button {
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
          color: white;
          font-weight: 600;
          border: 2px solid #d4af37;
          transition: all 0.3s ease;
        }
        .traffic-button:hover {
          background: linear-gradient(135deg, #0080cc 0%, #0066b3 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 102, 179, 0.4);
        }
        .violation-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 0.75rem;
          transition: all 0.3s ease;
        }
        .violation-card:hover {
          border-color: #d4af37;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .badge-verified {
          background: #d1fae5;
          color: #065f46;
        }
        .badge-rejected {
          background: #fee2e2;
          color: #991b1b;
        }
        .badge-high {
          background: #fee2e2;
          color: #991b1b;
        }
        .badge-medium {
          background: #fef3c7;
          color: #92400e;
        }
        .badge-low {
          background: #dbeafe;
          color: #1e40af;
        }
        .agent-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 0.5rem;
        }
        .agent-status.on-duty {
          background: #10b981;
        }
        .agent-status.off-duty {
          background: #ef4444;
        }
        .agent-status.on-break {
          background: #f59e0b;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        .input-field {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        .input-field:focus {
          border-color: #d4af37;
          outline: none;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        .map-container {
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
          border: 2px solid #0066b3;
          border-radius: 0.75rem;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .map-marker {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .map-marker:hover {
          transform: scale(1.2);
        }
        .map-marker.accident {
          background: #ef4444;
          top: 30%;
          left: 40%;
        }
        .map-marker.violation {
          background: #f59e0b;
          top: 60%;
          left: 65%;
        }
        .map-marker.clear {
          background: #10b981;
          top: 45%;
          left: 50%;
        }
      `}</style>

      {/* Header */}
      <header className="traffic-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-3 border-gold">
                <Radio className="w-6 h-6" style={{ color: "#0066b3" }} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-white text-2xl font-bold">
                  Traffic Control Center - {userCity}
                </h1>
                <p className="text-blue-100 text-sm">
                  Monitor and manage traffic operations in real-time
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <div className="text-white text-right">
                <p className="font-semibold">{userName}</p>
                <p className="text-sm text-blue-100">Traffic Officer</p>
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
                <p className="text-sm text-gray-600">Traffic Officer</p>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full traffic-button"
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: stat.bgColor }}
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'violations' ? 'active' : ''}`}
            onClick={() => setActiveTab('violations')}
          >
            <Car className="w-4 h-4 inline mr-2" />
            Violations
          </button>
          <button
            className={`tab-button ${activeTab === 'incidents' ? 'active' : ''}`}
            onClick={() => setActiveTab('incidents')}
          >
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Incidents
          </button>
          <button
            className={`tab-button ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Agents
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map */}
              <Card className="traffic-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span style={{ color: "#0066b3" }}>Live Traffic Map</span>
                    <Button size="sm" className="traffic-button">
                      <Camera className="w-4 h-4 mr-2" />
                      Cameras
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="map-container">
                    <div className="map-marker accident">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="map-marker violation">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div className="map-marker clear">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-blue-400 mb-2" />
                      <p className="text-gray-600 font-semibold">{userCity} Traffic Map</p>
                      <p className="text-sm text-gray-500">Real-time monitoring</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span>Accidents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                      <span>Violations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span>Clear</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="traffic-card">
                <CardHeader>
                  <CardTitle style={{ color: "#0066b3" }}>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">New Incident Reported</p>
                        <p className="text-sm text-gray-600">Accident at Kashmir Highway</p>
                        <p className="text-xs text-gray-500 mt-1">2 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <Car className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Violation Verified</p>
                        <p className="text-sm text-gray-600">ABC-123 speeding violation confirmed</p>
                        <p className="text-xs text-gray-500 mt-1">5 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Agent Check-in</p>
                        <p className="text-sm text-gray-600">Agent 1 started patrol in F-6</p>
                        <p className="text-xs text-gray-500 mt-1">10 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">System Alert</p>
                        <p className="text-sm text-gray-600">Heavy traffic detected in Blue Area</p>
                        <p className="text-xs text-gray-500 mt-1">15 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Shift Change</p>
                        <p className="text-sm text-gray-600">Agent 3 went on break</p>
                        <p className="text-xs text-gray-500 mt-1">20 mins ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Violations Tab */}
        {activeTab === 'violations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "#0066b3" }}>
                Traffic Violations
              </h2>
              <div className="flex gap-2">
                <Button className="traffic-button" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button className="traffic-button" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {violations.map((violation) => (
                <div key={violation.id} className="violation-card">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{violation.vehicleNumber}</h3>
                        <span className={`badge badge-${violation.status}`}>
                          {violation.status}
                        </span>
                        <span className={`badge badge-${violation.severity}`}>
                          {violation.severity}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{violation.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{violation.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{violation.time}</span>
                        </div>
                      </div>
                      {violation.assignedAgent && (
                        <p className="text-sm text-gray-500 mt-2">
                          Assigned to: <span className="font-semibold">{violation.assignedAgent}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {violation.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleViolationAction(violation.id, 'verify')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleViolationAction(violation.id, 'reject')}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="traffic-button"
                            onClick={() => {
                              setSelectedViolation(violation);
                              setShowAssignModal(true);
                            }}
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        className="bg-gray-500 hover:bg-gray-600 text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incidents Tab */}
        {activeTab === 'incidents' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "#0066b3" }}>
                Traffic Incidents
              </h2>
              <Button
                className="traffic-button"
                onClick={() => setShowIncidentForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Report Incident
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incidents.map((incident) => (
                <Card key={incident.id} className="traffic-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{
                            background: incident.priority === 'high' ? '#fee2e2' : incident.priority === 'medium' ? '#fef3c7' : '#dbeafe'
                          }}
                        >
                          <AlertTriangle
                            className="w-6 h-6"
                            style={{
                              color: incident.priority === 'high' ? '#ef4444' : incident.priority === 'medium' ? '#f59e0b' : '#3b82f6'
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{incident.type}</h3>
                          <span className={`badge badge-${incident.priority}`}>
                            {incident.priority} priority
                          </span>
                        </div>
                      </div>
                      <span className={`badge ${incident.status === 'active' ? 'badge-pending' : 'badge-verified'}`}>
                        {incident.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{incident.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{incident.time}</span>
                      </div>
                      <p className="text-gray-700 mt-2">{incident.description}</p>
                    </div>
                    {incident.status === 'active' && (
                      <Button
                        className="w-full traffic-button"
                        size="sm"
                        onClick={() => handleResolveIncident(incident.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#0066b3" }}>
              Field Agents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="traffic-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`agent-status ${agent.status}`}></span>
                        <span className="capitalize font-semibold">{agent.status.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{agent.location}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Assigned Tasks:</span>
                        <span className="font-bold" style={{ color: "#0066b3" }}>
                          {agent.assignedTasks}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1 traffic-button" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                      <Button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white" size="sm">
                        <Navigation className="w-4 h-4 mr-2" />
                        Track
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Incident Form Modal */}
      {showIncidentForm && (
        <div className="modal-overlay" onClick={() => setShowIncidentForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#0066b3" }}>
              Report New Incident
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Incident Type *
                </label>
                <select
                  className="input-field"
                  value={newIncident.type}
                  onChange={(e) => setNewIncident({...newIncident, type: e.target.value})}
                >
                  <option value="">Select type</option>
                  <option value="Accident">Accident</option>
                  <option value="Road Block">Road Block</option>
                  <option value="Heavy Traffic">Heavy Traffic</option>
                  <option value="Road Damage">Road Damage</option>
                  <option value="Signal Malfunction">Signal Malfunction</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter location"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  className="input-field"
                  value={newIncident.priority}
                  onChange={(e) => setNewIncident({...newIncident, priority: e.target.value as 'low' | 'medium' | 'high'})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Additional details..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 traffic-button"
                  onClick={handleCreateIncident}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
                <Button
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                  onClick={() => setShowIncidentForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Agent Modal */}
      {showAssignModal && selectedViolation && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#0066b3" }}>
              Assign Agent to Violation
            </h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Violation ID: {selectedViolation.id}</p>
              <p className="font-semibold text-gray-800">{selectedViolation.vehicleNumber} - {selectedViolation.type}</p>
              <p className="text-sm text-gray-600">{selectedViolation.location}</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Select Available Agent:</h3>
              {agents.filter(a => a.status === 'on-duty').map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-all"
                  onClick={() => handleAssignAgent(agent.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tasks: {agent.assignedTasks}</p>
                    <span className="text-xs text-green-600 font-semibold">Available</span>
                  </div>
                </div>
              ))}
              {agents.filter(a => a.status === 'on-duty').length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No agents currently on duty</p>
                </div>
              )}
            </div>

            <Button
              className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800"
              onClick={() => setShowAssignModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 border-t-4" style={{ borderColor: "#d4af37", background: "white" }}>
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="font-semibold" style={{ color: "#0066b3" }}>
            © 2025 Traffic Police - {userCity} Control Center
          </p>
          <p className="text-sm mt-2">
            Real-time traffic monitoring and management system
          </p>
        </div>
      </footer>
    </div>
  );
}