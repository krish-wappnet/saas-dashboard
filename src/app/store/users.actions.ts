import { createAction, props } from '@ngrx/store';
import { User, Organization } from '../models/index';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: string }>());

export const loadOrganizations = createAction('[Users] Load Organizations');
export const loadOrganizationsSuccess = createAction('[Users] Load Organizations Success', props<{ organizations: Organization[] }>());
export const loadOrganizationsFailure = createAction('[Users] Load Organizations Failure', props<{ error: string }>());

export const createUser = createAction('[Users] Create User', props<{ user: User }>());
export const createUserSuccess = createAction('[Users] Create User Success', props<{ user: User }>());
export const createUserFailure = createAction('[Users] Create User Failure', props<{ error: string }>());

export const resetPassword = createAction('[Users] Reset Password', props<{ userId: number }>());
export const resetPasswordSuccess = createAction('[Users] Reset Password Success', props<{ userId: number }>());
export const resetPasswordFailure = createAction('[Users] Reset Password Failure', props<{ error: string }>());

export const setSelectedOrgId = createAction('[Users] Set Selected Org ID', props<{ orgId: number | null }>());
export const checkUserLimit = createAction('[Users] Check User Limit');