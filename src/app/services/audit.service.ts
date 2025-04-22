import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private logs: { action: string, user: string, timestamp: string }[] = [];

  logAction(action: string, user: string) {
    this.logs.push({ action, user, timestamp: new Date().toISOString() });
  }

  getLogs() {
    return this.logs;
  }
}