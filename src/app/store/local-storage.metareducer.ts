// store/local-storage.metareducer.ts

import { ActionReducer, MetaReducer, INIT } from '@ngrx/store';
import { AppState, UserState } from '../models';

export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    const nextState = reducer(state, action);

    const partialUserState: Partial<UserState> = {
      users: nextState.users.users,
      selectedOrgId: nextState.users.selectedOrgId,
      mockOrganizations: nextState.users.mockOrganizations,
    };

    localStorage.setItem('appState', JSON.stringify({ users: partialUserState }));

    return nextState;
  };
}

// ✅ This must be exported so app.config.ts can use it
export function getInitialState(): Partial<AppState> {
  const storedState = localStorage.getItem('appState');
  return storedState ? JSON.parse(storedState) : {};
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];
