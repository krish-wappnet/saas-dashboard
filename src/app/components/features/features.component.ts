import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { Feature, Organization } from '../../models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  features: Feature[] = [];
  selectedOrgId: number | null = null;
  isLoading: boolean = false;
  private mockOrganizations: Organization[] = [];

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.apiService.getOrganizations(1, '').subscribe({
      next: ({ data }) => this.mockOrganizations = data
    });
  }

  ngOnInit() {
    this.selectedOrgId = 1; // Temporary
    this.loadFeatures();
  }

  loadFeatures() {
    if (this.selectedOrgId) {
      this.isLoading = true;
      this.apiService.getFeatures(this.selectedOrgId).subscribe({
        next: (features) => {
          this.features = features;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Failed to load features');
          this.isLoading = false;
        }
      });
    }
  }

  toggleFeature(feature: Feature) {
    const org = this.mockOrganizations.find(o => o.id === this.selectedOrgId);
    if (org && feature.requiredPlan !== 'Free' && org.plan === 'Free') {
      this.toastr.error(`Feature requires ${feature.requiredPlan} plan`);
      return;
    }
    this.isLoading = true;
    this.apiService.updateFeature(feature.id, !feature.enabled).subscribe({
      next: () => {
        feature.enabled = !feature.enabled;
        this.toastr.success('Feature updated');
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to update feature');
        this.isLoading = false;
      }
    });
  }
}