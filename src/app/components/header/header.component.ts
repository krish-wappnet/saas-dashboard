import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Organization } from '../../models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  organizations: Organization[] = [];
  selectedOrgId: number | null = null;
  isDarkMode: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getOrganizations(1, '').subscribe({
      next: ({ data }) => this.organizations = data
    });
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.toggleDarkMode(this.isDarkMode);
  }

  onOrgChange(orgId: number) {
    this.selectedOrgId = orgId;
    // Emit event or update service
  }

  toggleDarkMode(isEnabled: boolean) {
    this.isDarkMode = isEnabled;
    localStorage.setItem('darkMode', isEnabled.toString());
    document.documentElement.classList.toggle('dark', isEnabled);
  }
}