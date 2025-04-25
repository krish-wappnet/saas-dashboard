import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, timeout } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import * as UserActions from './users.actions';

@Injectable()
export class UserEffects {
  loadUsers$;
  loadUsersFailure$;
  loadOrganizations$;
  loadOrganizationsFailure$;
  createUser$;
  createUserSuccess$;
  createUserFailure$;
  resetPassword$;
  resetPasswordSuccess$;
  resetPasswordFailure$;

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.loadUsers$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.loadUsers),
        tap(() => console.log('loadUsers$: Effect triggered')),
        mergeMap(() =>
          this.apiService.getUsers(1).pipe(
            timeout(3000),
            tap(users => console.log('loadUsers$: API response:', users)),
            map(users => UserActions.loadUsersSuccess({ users })),
            catchError(error => {
              console.error('loadUsers$: Error:', error.message);
              return of(UserActions.loadUsersFailure({ error: error.message || 'Failed to load users' }));
            })
          )
        )
      )
    );

    this.loadUsersFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.loadUsersFailure),
        tap(({ error }) => {
          console.log('loadUsersFailure$: Triggering error toast:', error);
          this.toastr.error(error, 'Error', { toastClass: 'ngx-toastr custom-toastr' });
        })
      ),
      { dispatch: false }
    );

    this.loadOrganizations$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.loadOrganizations),
        tap(() => console.log('loadOrganizations$: Effect triggered')),
        mergeMap(() =>
          this.apiService.getOrganizations(1, '').pipe(
            timeout(3000),
            tap(response => console.log('loadOrganizations$: API response:', response)),
            map(({ data }) => UserActions.loadOrganizationsSuccess({ organizations: data })),
            catchError(error => {
              console.error('loadOrganizations$: Error:', error.message);
              return of(UserActions.loadOrganizationsFailure({ error: error.message || 'Failed to load organizations' }));
            })
          )
        )
      )
    );

    this.loadOrganizationsFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.loadOrganizationsFailure),
        tap(({ error }) => {
          console.log('loadOrganizationsFailure$: Triggering error toast:', error);
          this.toastr.error(error, 'Error', { toastClass: 'ngx-toastr custom-toastr' });
        })
      ),
      { dispatch: false }
    );

    this.createUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createUser),
        tap(({ user }) => console.log('createUser$: Effect triggered with user:', user)),
        mergeMap(({ user }) =>
          this.apiService.createUser(user).pipe(
            timeout(3000),
            tap(newUser => console.log('createUser$: API response:', newUser)),
            map(newUser => UserActions.createUserSuccess({ user: newUser })),
            catchError(error => {
              console.error('createUser$: Error:', error.message);
              return of(UserActions.createUserFailure({ error: error.message || 'Failed to create user' }));
            })
          )
        )
      )
    );

    this.createUserSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createUserSuccess),
        tap(({ user }) => {
          console.log('createUserSuccess$: Triggering success toast for user:', user);
          this.toastr.success('User created successfully', 'Success', { toastClass: 'ngx-toastr custom-toastr' });
        })
      ),
      { dispatch: false }
    );

    this.createUserFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createUserFailure),
        tap(({ error }) => {
          console.log('createUserFailure$: Triggering error toast:', error);
          this.toastr.error(error, 'Error', { toastClass: 'ngx-toastr custom-toastr' });
        })
      ),
      { dispatch: false }
    );

    this.resetPassword$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.resetPassword),
        tap(({ userId }) => console.log('resetPassword$: Effect triggered for userId:', userId)),
        mergeMap(({ userId }) =>
          of({}).pipe(
            timeout(3000),
            tap(() => console.log('resetPassword$: Mock API call succeeded')),
            map(() => UserActions.resetPasswordSuccess({ userId })),
            catchError(error => {
              console.error('resetPassword$: Error:', error.message);
              return of(UserActions.resetPasswordFailure({ error: error.message || 'Failed to reset password' }));
            })
          )
        )
      )
    );

    this.resetPasswordSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.resetPasswordSuccess),
        tap(() => {
          console.log('resetPasswordSuccess$: Triggering success toast');
          this.toastr.success('Password reset email sent', 'Success', { toastClass: 'ngx-toastr custom-toastr' });
        })
      ),
      { dispatch: false }
    );

    this.resetPasswordFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.resetPasswordFailure),
        tap(({ error }) => {
          console.log('resetPasswordFailure$: Triggering error toast:', error);
          this.toastr.error(error, 'Error', { toastClass: 'ngx-toastr custom-toastr' });
        })
      ),
      { dispatch: false }
    );
  }
}
