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
  MapPin, AlertTriangle, Car, Users, Clock, MessageSquare,
  Radio, CheckCircle, XCircle, AlertCircle, LogOut, Menu, X,
  Navigation, Phone, Camera, Briefcase, TrendingUp, Award, Shield,
  Send, Plus, Filter
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";

interface AssignedTask {
  id: string;
  type: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
  assignedTime: string;
  vehicleNumber?: string;
}

interface Report {
  id: string;
  type: string;
  location: string;
  time: string;
  description: string;
  images: number;
  status: 'submitted' | 'reviewed' | 'approved';
}

interface Stat {
  icon: any;
  title: string;
  value: string;
  color: string;
}

export default function AgentDashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [userCity, setUserCity] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [agentStatus, setAgentStatus] = useState<'on-duty' | 'on-break' | 'off-duty'>('on-duty');
  const [showReportForm, setShowReportForm] = useState(false);

  const [newReport, setNewReport] = useState({
    type: '',
    location: '',
    description: '',
  });

  const [tasks, setTasks] = useState<AssignedTask[]>([
    {
      id: 'T001',
      type: 'Traffic Violation Check',
      location: 'Blue Area, Sector F-6',
      priority: 'high',
      status: 'pending',
      description: 'Monitor speeding violations on main road',
      assignedTime: '09:00 AM'
    },
    {
      id: 'T002',
      type: 'Parking Enforcement',
      location: 'F-7 Markaz',
      priority: 'medium',
      status: 'in-progress',
      description: 'Check illegal parking in commercial area',
      assignedTime: '10:30 AM'
    },
    {
      id: 'T003',
      type: 'Accident Investigation',
      location: 'Jinnah Avenue',
      priority: 'high',
      status: 'pending',
      description: 'Vehicle collision - two cars involved',
      assignedTime: '11:00 AM',
      vehicleNumber: 'ABC-123'
    },
    {
      id: 'T004',
      type: 'Traffic Signal Monitoring',
      location: 'Zero Point',
      priority: 'low',
      status: 'completed',
      description: 'Monitor traffic flow at intersection',
      assignedTime: '08:00 AM'
    }
  ]);

  const [reports, setReports] = useState<Report[]>([
    {
      id: 'R001',
      type: 'Speed Violation',
      location: 'Kashmir Highway',
      time: '10:45 AM',
      description: 'Vehicle ABC-123 exceeding speed limit',
      images: 3,
      status: 'submitted'
    },
    {
      id: 'R002',
      type: 'Illegal Parking',
      location: 'Blue Area',
      time: '09:30 AM',
      description: 'Vehicles parked in no-parking zone',
      images: 2,
      status: 'reviewed'
    },
    {
      id: 'R003',
      type: 'Wrong Way Driving',
      location: 'Constitution Avenue',
      time: '08:15 AM',
      description: 'Vehicle driving opposite direction',
      images: 1,
      status: 'approved'
    }
  ]);

  useEffect(() => {
    // CHECK 1: Is user authenticated?
    if (!authUtils.isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    const session = authUtils.getSession();

    // CHECK 2: Does user have agent role?
    if (!session || (!session.role?.startsWith('agent') && session.role !== 'agent1' && session.role !== 'agent2')) {
      console.log("Not an agent. Role:", session?.role);
      router.push("/auth/login");
      return;
    }

    // CHECK 3: Does user have cityCode and cityName?
    if (!session.cityCode || !session.cityName) {
      console.log("No city assigned");
      router.push("/auth/login");
      return;
    }

    // All checks passed! Set user info
    setUserCity(session.cityName);
    setUserName(session.username || 'Agent');
    setUserRole(session.role || 'Agent');
    setIsLoading(false);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    authUtils.logout();
    router.push("/auth/login");
  };

  const handleStatusChange = (status: 'on-duty' | 'on-break' | 'off-duty') => {
    setAgentStatus(status);
  };

  const handleTaskUpdate = (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status } : t
    ));
  };

  const handleSubmitReport = () => {
    if (!newReport.type || !newReport.location) {
      alert('Please fill all required fields');
      return;
    }

    const report: Report = {
      id: `R${String(reports.length + 1).padStart(3, '0')}`,
      type: newReport.type,
      location: newReport.location,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      description: newReport.description,
      images: 0,
      status: 'submitted'
    };

    setReports([report, ...reports]);
    setNewReport({ type: '', location: '', description: '' });
    setShowReportForm(false);
  };

  const stats: Stat[] = [
    {
      icon: Briefcase,
      title: "Assigned Tasks",
      value: tasks.length.toString(),
      color: "#0066b3",
    },
    {
      icon: CheckCircle,
      title: "Completed",
      value: tasks.filter(t => t.status === 'completed').length.toString(),
      color: "#10b981",
    },
    {
      icon: AlertTriangle,
      title: "Pending",
      value: tasks.filter(t => t.status === 'pending').length.toString(),
      color: "#ef4444",
    },
    {
      icon: TrendingUp,
      title: "Reports Submitted",
      value: reports.length.toString(),
      color: "#8b5cf6",
    },
  ];

  if (isLoading || !userCity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'pending': return '#fef3c7';
      case 'in-progress': return '#dbeafe';
      case 'completed': return '#d1fae5';
      case 'submitted': return '#fef3c7';
      case 'reviewed': return '#dbeafe';
      case 'approved': return '#d1fae5';
      default: return '#f3f4f6';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#92400e';
      case 'in-progress': return '#1e40af';
      case 'completed': return '#065f46';
      case 'submitted': return '#92400e';
      case 'reviewed': return '#1e40af';
      case 'approved': return '#065f46';
      default: return '#374151';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .agent-header {
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
          border-bottom: 4px solid #d4af37;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .agent-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
        }
        .agent-card:hover {
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
        .agent-button {
          background: linear-gradient(135deg, #0066b3 0%, #0080cc 100%);
          color: white;
          font-weight: 600;
          border: 2px solid #d4af37;
          transition: all 0.3s ease;
        }
        .agent-button:hover {
          background: linear-gradient(135deg, #0080cc 0%, #0066b3 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 102, 179, 0.4);
        }
        .task-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 0.75rem;
          transition: all 0.3s ease;
        }
        .task-card:hover {
          border-color: #d4af37;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
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
        .status-button {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Header */}
      <header className="agent-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-3 border-gold">
                <Navigation className="w-6 h-6" style={{ color: "#0066b3" }} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-white text-2xl font-bold">
                  Field Agent Portal - {userCity}
                </h1>
                <p className="text-blue-100 text-sm">
                  Manage your tasks and submit field reports
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
                <p className="text-sm text-blue-100">Field Agent</p>
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
                <p className="text-sm text-gray-600">Field Agent</p>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full agent-button"
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

        {/* Agent Status Card */}
        <Card className="agent-card mb-8">
          <CardHeader>
            <CardTitle style={{ color: "#0066b3" }}>Your Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Navigation className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{userName}</h3>
                  <p className="text-sm text-gray-600">{userCity}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Status: <span style={{ color: agentStatus === 'on-duty' ? '#10b981' : agentStatus === 'on-break' ? '#f59e0b' : '#ef4444' }} className="font-bold">
                      {agentStatus.replace('-', ' ').toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStatusChange('on-duty')}
                  className={`${agentStatus === 'on-duty' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 hover:bg-gray-400'} text-white`}
                  size="sm"
                >
                  On Duty
                </Button>
                <Button
                  onClick={() => handleStatusChange('on-break')}
                  className={`${agentStatus === 'on-break' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-300 hover:bg-gray-400'} text-white`}
                  size="sm"
                >
                  On Break
                </Button>
                <Button
                  onClick={() => handleStatusChange('off-duty')}
                  className={`${agentStatus === 'off-duty' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 hover:bg-gray-400'} text-white`}
                  size="sm"
                >
                  Off Duty
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            My Tasks
          </button>
          <button
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Reports
          </button>
          <button
            className={`tab-button ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => setActiveTab('location')}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </button>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#0066b3" }}>
              Assigned Tasks
            </h2>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{task.type}</h3>
                        <span 
                          className="badge" 
                          style={{ background: getPriorityColor(task.priority) + '30', color: getPriorityColor(task.priority) }}
                        >
                          {task.priority} priority
                        </span>
                        <span 
                          className="badge" 
                          style={{ background: getStatusBg(task.status), color: getStatusColor(task.status) }}
                        >
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{task.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{task.assignedTime}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                      {task.vehicleNumber && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">Vehicle:</span> {task.vehicleNumber}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleTaskUpdate(task.id, 'in-progress')}
                        >
                          Start
                        </Button>
                      )}
                      {task.status === 'in-progress' && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleTaskUpdate(task.id, 'completed')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded text-sm font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "#0066b3" }}>
                Field Reports
              </h2>
              <Button
                className="agent-button"
                onClick={() => setShowReportForm(true)}
              >
                <Camera className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="agent-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-bold text-gray-800">{report.type}</h3>
                          <span 
                            className="badge" 
                            style={{ background: getStatusBg(report.status), color: getStatusColor(report.status) }}
                          >
                            {report.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{report.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{report.time}</span>
                          </div>
                          <p className="text-gray-700 mt-2">{report.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Camera className="w-4 h-4 flex-shrink-0 text-blue-600" />
                            <span className="text-blue-600 font-semibold">{report.images} image(s)</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gray-500 hover:bg-gray-600 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#0066b3" }}>
              Your Current Location
            </h2>

            <Card className="agent-card mb-8">
              <CardContent className="pt-6">
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                    border: '2px solid #0066b3',
                    borderRadius: '0.75rem',
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-blue-400 mb-2 mx-auto" />
                    <p className="text-gray-600 font-semibold">Map Loading...</p>
                    <p className="text-sm text-gray-500 mt-2">Location tracking enabled</p>
                    <Button className="agent-button mt-4" size="sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-2">Quick Actions</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Supervisor
                      </Button>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Report Issue
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="modal-overlay" onClick={() => setShowReportForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#0066b3" }}>
              Submit Field Report
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Report Type *
                </label>
                <select
                  className="input-field"
                  value={newReport.type}
                  onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                >
                  <option value="">Select type</option>
                  <option value="Speed Violation">Speed Violation</option>
                  <option value="Illegal Parking">Illegal Parking</option>
                  <option value="Traffic Signal Violation">Traffic Signal Violation</option>
                  <option value="Wrong Way Driving">Wrong Way Driving</option>
                  <option value="Accident">Accident</option>
                  <option value="Road Hazard">Road Hazard</option>
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
                  value={newReport.location}
                  onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Additional details..."
                  value={newReport.description}
                  onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 agent-button"
                  onClick={handleSubmitReport}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
                <Button
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                  onClick={() => setShowReportForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 border-t-4" style={{ borderColor: "#d4af37", background: "white" }}>
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="font-semibold" style={{ color: "#0066b3" }}>
            © 2025 Traffic Police - {userCity} Field Agent Portal
          </p>
          <p className="text-sm mt-2">
            Mobile field operations and reporting system
          </p>
        </div>
      </footer>
    </div>
  );
}