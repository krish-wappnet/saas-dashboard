import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Organization, User, Feature, UsageData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private mockOrganizations: Organization[] = [
    { id: 1, name: 'TechCorp', logo: '', industry: 'Tech', plan: 'Pro', status: 'Active', userCount: 3 },
    { id: 2, name: 'HealthInc', logo: '', industry: 'Healthcare', plan: 'Free', status: 'Active', userCount: 4 },
  ];

  private mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@techcorp.com', role: 'Admin', status: 'Active', orgId: 1 },
    { id: 2, name: 'Jane Smith', email: 'jane@techcorp.com', role: 'User', status: 'Active', orgId: 1 },
  ];

  private mockFeatures: Feature[] = [
    { id: 1, name: 'Export Data', enabled: true, requiredPlan: 'Pro', orgId: 1 },
    { id: 2, name: 'Custom Branding', enabled: false, requiredPlan: 'Enterprise', orgId: 1 },
  ];

  private mockUsage: UsageData[] = [
    { orgId: 1, apiCalls: 500, activeUsers: 10, storage: 50, date: '2025-04-01' },
  ];

  getOrganizations(page: number, search: string): Observable<{ data: Organization[], total: number }> {
    console.log('ApiService: getOrganizations called with page:', page, 'search:', search);
    let filtered = this.mockOrganizations;
    if (search) {
      filtered = filtered.filter(org => org.name.toLowerCase().includes(search.toLowerCase()));
    }
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    return of({
      data: filtered.slice(start, start + pageSize),
      total: filtered.length
    }).pipe(delay(100)); // Reduced delay
  }

  createOrganization(org: Organization): Observable<Organization> {
    console.log('ApiService: createOrganization called with org:', org);
    if (this.mockOrganizations.some(o => o.name === org.name)) {
      console.error('ApiService: createOrganization error - Organization name already exists');
      return throwError(() => new Error('Organization name already exists'));
    }
    const newOrg = { ...org, id: this.mockOrganizations.length + 1, userCount: 0 };
    this.mockOrganizations.push(newOrg);
    return of(newOrg).pipe(delay(200)); // Reduced delay
  }

  updateOrganization(id: number, org: Partial<Organization>): Observable<Organization> {
    console.log('ApiService: updateOrganization called with id:', id, 'org:', org);
    const index = this.mockOrganizations.findIndex(o => o.id === id);
    if (index !== -1) {
      if (org.status === 'Suspended') {
        this.mockUsers = this.mockUsers.map(u => u.orgId === id ? { ...u, status: 'Suspended' } : u);
      }
      this.mockOrganizations[index] = { ...this.mockOrganizations[index], ...org };
      return of(this.mockOrganizations[index]).pipe(delay(200)); // Reduced delay
    }
    console.error('ApiService: updateOrganization error - Organization not found');
    return throwError(() => new Error('Organization not found'));
  }

  getUsers(orgId: number): Observable<User[]> {
    console.log('ApiService: getUsers called with orgId:', orgId);
    return of(this.mockUsers.filter(u => u.orgId === orgId)).pipe(delay(100)); // Reduced delay
  }

  createUser(user: User): Observable<User> {
    console.log('ApiService: createUser called with user:', user);
    const org = this.mockOrganizations.find(o => o.id === user.orgId);
    if (org?.plan === 'Free' && org.userCount >= 5) {
      console.error('ApiService: createUser error - Free plan limited to 5 users');
      return throwError(() => new Error('Free plan limited to 5 users'));
    }
    const newUser = { ...user, id: this.mockUsers.length + 1 };
    this.mockUsers.push(newUser);
    if (org) {
      const updatedOrg = { ...org, userCount: org.userCount + 1 };
      const index = this.mockOrganizations.findIndex(o => o.id === org.id);
      this.mockOrganizations[index] = updatedOrg;
    }
    
    return of(newUser).pipe(delay(200)); // Reduced delay
  }

  getFeatures(orgId: number): Observable<Feature[]> {
    console.log('ApiService: getFeatures called with orgId:', orgId);
    return of(this.mockFeatures.filter(f => f.orgId === orgId)).pipe(delay(100)); // Reduced delay
  }

  updateFeature(id: number, enabled: boolean): Observable<Feature> {
    console.log('ApiService: updateFeature called with id:', id, 'enabled:', enabled);
    const feature = this.mockFeatures.find(f => f.id === id);
    if (!feature) {
      console.error('ApiService: updateFeature error - Feature not found');
      return throwError(() => new Error('Feature not found'));
    }
    feature.enabled = enabled;
    return of(feature).pipe(delay(200)); // Reduced delay
  }

  getUsageData(orgId: number, dateRange: { start: string, end: string }): Observable<UsageData[]> {
    console.log('ApiService: getUsageData called with orgId:', orgId, 'dateRange:', dateRange);
    return of(this.mockUsage.filter(u => u.orgId === orgId)).pipe(delay(100)); // Reduced delay
  }
}