export interface Organization {
    id: number;
    name: string;
    logo: string;
    industry: string;
    plan: 'Free' | 'Pro' | 'Enterprise';
    status: 'Active' | 'Suspended';
    userCount: number;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'User';
    status: 'Active' | 'Suspended';
    orgId: number;
  }
  
  export interface Feature {
    id: number;
    name: string;
    enabled: boolean;
    requiredPlan: 'Free' | 'Pro' | 'Enterprise';
    orgId: number;
  }
  
  export interface UsageData {
    orgId: number;
    apiCalls: number;
    activeUsers: number;
    storage: number;
    date: string;
  }