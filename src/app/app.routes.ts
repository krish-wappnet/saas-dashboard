import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrganizationsComponent } from './components/organizations/organizations.component';
import { UsersComponent } from './components/users/users.component';
import { FeaturesComponent } from './components/features/features.component';
import { UsageComponent } from './components/usage/usage.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'organizations', component: OrganizationsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'features', component: FeaturesComponent, canActivate: [AuthGuard] },
  { path: 'usage', component: UsageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];