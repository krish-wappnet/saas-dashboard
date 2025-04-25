import { createReducer, on } from '@ngrx/store';
import { User, Organization } from '../models/index';
import * as UserActions from './users.actions';

export interface UserState {
  users: User[];
  mockOrganizations: Organization[];
  selectedOrgId: number | null;
  isLoading: boolean;
  isAddDisabled: boolean;
  tooltipMessage: string;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  mockOrganizations: [],
  selectedOrgId: null,
  isLoading: false,
  isAddDisabled: false,
  tooltipMessage: '',
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, state => ({ ...state, isLoading: true, error: null })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    isLoading: false
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(UserActions.loadOrganizations, state => ({ ...state, isLoading: true, error: null })),
  on(UserActions.loadOrganizationsSuccess, (state, { organizations }) => ({
    ...state,
    mockOrganizations: organizations,
    isLoading: false
  })),
  on(UserActions.loadOrganizationsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(UserActions.createUser, state => {
    console.log('Reducer: Setting isLoading to true for createUser');
    return { ...state, isLoading: true, error: null };
  }),
  on(UserActions.createUserSuccess, (state, { user }) => {
    console.log('Reducer: createUserSuccess, setting isLoading to false');
    return {
      ...state,
      users: [...state.users, user],
      isLoading: false
    };
  }),
  on(UserActions.createUserFailure, (state, { error }) => {
    console.log('Reducer: createUserFailure, setting isLoading to false');
    return {
      ...state,
      isLoading: false,
      error
    };
  }),

  on(UserActions.resetPassword, state => ({ ...state, isLoading: true, error: null })),
  on(UserActions.resetPasswordSuccess, state => ({
    ...state,
    isLoading: false
  })),
  on(UserActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(UserActions.setSelectedOrgId, (state, { orgId }) => ({
    ...state,
    selectedOrgId: orgId
  })),

  on(UserActions.checkUserLimit, state => {
    const org = state.mockOrganizations.find(o => o.id === state.selectedOrgId);
    const isAddDisabled = org?.plan === 'Free' && state.users.length >= 5;
    return {
      ...state,
      isAddDisabled,
      tooltipMessage: isAddDisabled ? 'Free plan limited to 5 users' : ''
    };
  })
);