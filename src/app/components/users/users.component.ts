import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, User } from '../../models';
import { CustomToastComponent } from '../toast/custom-toast.component';
import * as UserActions from '../../store/users.actions';
import * as UserSelectors from '../../store/users.selectors';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ToastrModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  selectedOrgId$: Observable<number | null>;
  isLoading$: Observable<boolean>;
  isAddDisabled$: Observable<boolean>;
  tooltipMessage$: Observable<string>;
  error$: Observable<string | null>;
  submitted: boolean = false;
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private store: Store<AppState>
  ) {
    // Initialize selectors
    this.users$ = this.store.select(UserSelectors.selectUsers);
    this.selectedOrgId$ = this.store.select(UserSelectors.selectSelectedOrgId);
    this.isLoading$ = this.store.select(UserSelectors.selectIsLoading);
    this.isAddDisabled$ = this.store.select(UserSelectors.selectIsAddDisabled);
    this.tooltipMessage$ = this.store.select(UserSelectors.selectTooltipMessage);
    this.error$ = this.store.select(UserSelectors.selectError);

    this.isLoading$.subscribe(isLoading => console.log('isLoading$ value:', isLoading));
this.error$.subscribe(error => console.log('error$ value:', error));

    // Debug observables
    this.isLoading$.subscribe(isLoading => console.log('isLoading$ value:', isLoading));
    this.selectedOrgId$.subscribe(orgId => console.log('selectedOrgId$ value:', orgId));
    this.users$.subscribe(users => console.log('users$ value:', users));
    this.error$.subscribe(error => console.log('error$ value:', error));

    // Configure Toastr
    this.toastr.toastrConfig = {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      tapToDismiss: true,
      enableHtml: false,
      toastClass: 'ngx-toastr custom-toastr',
      maxOpened: 0,
      autoDismiss: false,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      },
      countDuplicates: false,
      resetTimeoutOnDuplicate: false,
      includeTitleDuplicates: false,
      newestOnTop: true,
      progressAnimation: 'decreasing',
      disableTimeOut: false,
      easeTime: 300,
      easing: 'ease-in',
      extendedTimeOut: 1000,
      titleClass: 'toast-title',
      messageClass: 'toast-message',
      onActivateTick: false,
      toastComponent: CustomToastComponent
    };
    console.log('Toastr config set with CustomToastComponent');

    // Initialize form
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', [Validators.required]],
      status: ['Active', [Validators.required]]
    });

    // Subscribe to form status changes
    this.userForm.statusChanges.subscribe(() => {
      console.log('Form status changed, dispatching checkUserLimit');
      this.store.dispatch(UserActions.checkUserLimit());
      console.log('Form valid:', this.userForm.valid);
    });
  }

  ngOnInit() {
    console.log('UsersComponent ngOnInit: Dispatching load actions');
    this.store.dispatch(UserActions.setSelectedOrgId({ orgId: 1 }));
    this.store.dispatch(UserActions.loadOrganizations());
    this.store.dispatch(UserActions.loadUsers());
  }

  onSubmit() {
    this.submitted = true;
    console.log('onSubmit: Form submitted, valid:', this.userForm.valid, 'values:', this.userForm.value);
    if (this.userForm.valid) {
      // Hardcode orgId for testing
      const orgId = 1; // Use TechCorp (Pro plan) to avoid Free plan limit
      console.log('onSubmit: Using orgId:', orgId);
      const user = {
        ...this.userForm.value,
        orgId,
        id: Date.now()
      };
      console.log('onSubmit: Dispatching createUser with user:', user);
      this.store.dispatch(UserActions.createUser({ user }));
      this.userForm.reset({ role: 'User', status: 'Active' });
      this.submitted = false;
    } else {
      console.log('onSubmit: Form invalid');
      this.toastr.error('Please fill out all required fields', 'Error', {
        toastClass: 'ngx-toastr custom-toastr'
      });
    }
  }

  resetPassword(userId: number) {
    console.log('resetPassword: Dispatching resetPassword for userId:', userId);
    this.store.dispatch(UserActions.resetPassword({ userId }));
  }
}