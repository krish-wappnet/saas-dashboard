import { createSelector } from '@ngrx/store';
import { AppState, UserState } from '../models/index';

export const selectUserState = (state: AppState) => state.users;

export const selectUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
);

export const selectSelectedOrgId = createSelector(
  selectUserState,
  (state: UserState) => state.selectedOrgId
);

export const selectIsLoading = createSelector(
  selectUserState,
  (state: UserState) => state.isLoading
);

export const selectIsAddDisabled = createSelector(
  selectUserState,
  (state: UserState) => state.isAddDisabled
);

export const selectTooltipMessage = createSelector(
  selectUserState,
  (state: UserState) => state.tooltipMessage
);

export const selectError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);