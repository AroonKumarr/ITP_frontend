// lib/auth.ts
// Authentication utility functions with dynamic user support

interface UserSession {
  username: string;
  email: string;
  role: string;
  cityCode?: string;
  cityName?: string;
  isAuthenticated: boolean;
  loginTime: string;
}

export interface User {
  email: string;
  username?: string;
  password: string;
  role: string;
  cityCode?: string;
  cityName?: string;
}

interface CityUser {
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
  users: CityUser[];
  createdAt: string;
  status: string;
}

// Static admin and demo users
export const STATIC_USERS: User[] = [
  { 
    email: "admin@itp.com", 
    username: "admin",
    password: "admin123", 
    role: "admin" 
  },
  { 
    email: "user@itp.com", 
    username: "user",
    password: "user123", 
    role: "user" 
  },
  { 
    email: "laiba@itp.com", 
    username: "laiba",
    password: "test123", 
    role: "user" 
  },
];

export const authUtils = {
  // Load all dynamic city users from localStorage
  loadDynamicUsers: (): User[] => {
    if (typeof window === "undefined") return [];
    
    try {
      const storedCities = localStorage.getItem("traffic_police_cities");
      if (!storedCities) return [];
      
      const cities: City[] = JSON.parse(storedCities);
      const dynamicUsers: User[] = [];
      
      // Convert city users to User format
      cities.forEach((city) => {
        city.users.forEach((cityUser) => {
          dynamicUsers.push({
            email: `${cityUser.username}@${city.cityCode.toLowerCase()}.itp.com`,
            username: cityUser.username,
            password: cityUser.password,
            role: cityUser.role,
            cityCode: city.cityCode,
            cityName: city.cityName,
          });
        });
      });
      
      return dynamicUsers;
    } catch (error) {
      console.error("Error loading dynamic users:", error);
      return [];
    }
  },

  // Get all valid users (static + dynamic)
  getAllUsers: (): User[] => {
    return [...STATIC_USERS, ...authUtils.loadDynamicUsers()];
  },

  // Get current user session
  getSession: (): UserSession | null => {
    if (typeof window === "undefined") return null;
    
    const session = localStorage.getItem("userSession");
    if (!session) return null;
    
    try {
      return JSON.parse(session) as UserSession;
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const session = authUtils.getSession();
    return session?.isAuthenticated ?? false;
  },

  // Logout user
  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userSession");
    }
  },

  // Get user role
  getUserRole: (): string | null => {
    const session = authUtils.getSession();
    return session?.role ?? null;
  },

  // Check if user has specific role
  hasRole: (role: string): boolean => {
    const userRole = authUtils.getUserRole();
    return userRole === role;
  },

  // Validate user credentials (supports email or username)
  validateCredentials: (emailOrUsername: string, password: string): User | null => {
    const allUsers = authUtils.getAllUsers();
    
    // Check if input matches email or username
    const user = allUsers.find(
      (u) => 
        (u.email === emailOrUsername || u.username === emailOrUsername) && 
        u.password === password
    );
    
    // Return user with their original role (no modification needed)
    // Traffic officers have role: 'traffic' from city users
    // Admin users have role: 'admin'
    // User roles have role: 'user'
    
    return user ?? null;
  },

  // Create session
  createSession: (user: User): void => {
    if (typeof window === "undefined") return;
    
    const userSession: UserSession = {
      username: user.username || user.email.split("@")[0],
      email: user.email,
      role: user.role,
      cityCode: user.cityCode,
      cityName: user.cityName,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };
    
    localStorage.setItem("userSession", JSON.stringify(userSession));
  },

  // Get user by username (useful for lookups)
  getUserByUsername: (username: string): User | null => {
    const allUsers = authUtils.getAllUsers();
    return allUsers.find((u) => u.username === username) ?? null;
  },

  // Get user by email
  getUserByEmail: (email: string): User | null => {
    const allUsers = authUtils.getAllUsers();
    return allUsers.find((u) => u.email === email) ?? null;
  },

  // Get all users for a specific city
  getCityUsers: (cityCode: string): User[] => {
    const dynamicUsers = authUtils.loadDynamicUsers();
    return dynamicUsers.filter((u) => u.cityCode === cityCode);
  },

  // Check if user is super admin
  isSuperAdmin: (): boolean => {
    const session = authUtils.getSession();
    return session?.role === 'admin' && !session?.cityCode;
  },

  // Check if user is city admin
  isCityAdmin: (): boolean => {
    const session = authUtils.getSession();
    return session?.role === 'admin' && !!session?.cityCode;
  },

  // Check if user is traffic officer
  isTrafficOfficer: (): boolean => {
    const session = authUtils.getSession();
    return session?.role === 'traffic';
  },

  // Check if user is agent
  isAgent: (): boolean => {
    const session = authUtils.getSession();
    // FIX: Added '?? false' to ensure it returns a boolean, not undefined
    return session?.role === 'agent1' || session?.role === 'agent2' || (session?.role?.startsWith('agent') ?? false);
  },

  // Check if user is admin (both super admin and city admin)
  isAdmin: (): boolean => {
    const session = authUtils.getSession();
    return session?.role === 'admin';
  },

  // Get redirect path based on role
  getRedirectPath: (): string => {
    const session = authUtils.getSession();
    if (!session) return '/login';
    
    // Super Admin (no cityCode)
    if (session.role === 'admin' && !session.cityCode) {
      return '/sys-admin'; // Super Admin Dashboard
    }
    
    // City Admin (has cityCode)
    if (session.role === 'admin' && session.cityCode) {
      return '/city-admin'; // City Admin Dashboard
    }
    
    // Traffic Officer
    if (session.role === 'traffic') {
      return '/traffic-dashboard'; // Traffic Officer Dashboard
    }
    
    // Field Agents
    if (session.role === 'agent1' || session.role === 'agent2' || session.role?.startsWith('agent')) {
      return '/agent-dashboard'; // Agent Dashboard
    }
    
    // Regular User
    if (session.role === 'user') {
      return '/Main-dashboard'; // Regular User Dashboard
    }
    
    return '/login';
  },

  // Get user role display name
  getRoleDisplayName: (): string => {
    const session = authUtils.getSession();
    if (!session) return 'Guest';
    
    if (session.role === 'admin' && !session.cityCode) {
      return 'Super Admin';
    }
    if (session.role !== 'admin' && session.cityCode) {
      return 'City Admin';
    }
    if (session.role === 'traffic') {
      return 'Traffic Officer';
    }
    if (session.role === 'agent1' || session.role === 'agent2' || session.role?.startsWith('agent')) {
      return 'Field Agent';
    }
    if (session.role === 'user') {
      return 'User';
    }
    
    return session.role;
  },
};