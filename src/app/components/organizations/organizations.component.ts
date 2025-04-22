import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { Organization } from '../../models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule, FormsModule, TranslateModule],
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit {
  organizations: Organization[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  orgForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.orgForm = this.fb.group({
      name: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      plan: ['Free', [Validators.required]],
      status: ['Active', [Validators.required]],
      logo: ['']
    });
  }

  ngOnInit() {
    this.loadOrganizations();
  }

  loadOrganizations() {
    this.isLoading = true;
    this.apiService.getOrganizations(this.currentPage, this.searchTerm)
      .subscribe({
        next: ({ data, total }) => {
          this.organizations = data;
          this.totalItems = total;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Failed to load organizations');
          this.isLoading = false;
        }
      });
  }

  onSubmit() {
    if (this.orgForm.valid) {
      this.isLoading = true;
      this.apiService.createOrganization(this.orgForm.value)
        .subscribe({
          next: () => {
            this.toastr.success('Organization created successfully');
            this.orgForm.reset({ plan: 'Free', status: 'Active', logo: '' });
            this.loadOrganizations();
          },
          error: (err) => {
            this.toastr.error(err.message);
            this.isLoading = false;
          }
        });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadOrganizations();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadOrganizations();
  }

  suspendOrg(id: number) {
    this.apiService.updateOrganization(id, { status: 'Suspended' })
      .subscribe({
        next: () => {
          this.toastr.success('Organization suspended');
          this.loadOrganizations();
        },
        error: () => this.toastr.error('Failed to suspend organization')
      });
  }
}