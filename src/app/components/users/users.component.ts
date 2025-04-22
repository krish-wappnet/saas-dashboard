import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { User, Organization } from '../../models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  selectedOrgId: number | null = null;
  isLoading: boolean = false;
  isAddDisabled: boolean = false;
  tooltipMessage: string = '';
  private mockOrganizations: Organization[] = [];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', [Validators.required]],
      status: ['Active', [Validators.required]]
    });
    this.apiService.getOrganizations(1, '').subscribe({
      next: ({ data }) => this.mockOrganizations = data
    });
  }

  ngOnInit() {
    this.selectedOrgId = 1; // Temporary
    this.loadUsers();
  }

  loadUsers() {
    if (this.selectedOrgId) {
      this.isLoading = true;
      this.apiService.getUsers(this.selectedOrgId).subscribe({
        next: (users) => {
          this.users = users;
          this.checkUserLimit();
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Failed to load users');
          this.isLoading = false;
        }
      });
    }
  }

  checkUserLimit() {
    const org = this.mockOrganizations.find(o => o.id === this.selectedOrgId);
    if (org?.plan === 'Free' && org.userCount >= 5) {
      this.isAddDisabled = true;
      this.tooltipMessage = 'Free plan limited to 5 users';
    } else {
      this.isAddDisabled = false;
      this.tooltipMessage = '';
    }
  }

  onSubmit() {
    if (this.userForm.valid && this.selectedOrgId) {
      this.isLoading = true;
      const user = { ...this.userForm.value, orgId: this.selectedOrgId };
      this.apiService.createUser(user).subscribe({
        next: () => {
          this.toastr.success('User created successfully');
          this.userForm.reset({ role: 'User', status: 'Active' });
          this.loadUsers();
        },
        error: (err) => {
          this.toastr.error(err.message);
          this.isLoading = false;
        }
      });
    }
  }

  resetPassword(userId: number) {
    this.toastr.success('Password reset email sent'); // Simulate
  }
}