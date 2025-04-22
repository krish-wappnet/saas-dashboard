import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = 'Super Admin'; // Simulate auth check (replace with real logic)
    if (userRole !== 'Super Admin') {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}