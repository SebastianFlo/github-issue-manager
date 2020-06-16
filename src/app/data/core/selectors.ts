import { CoreState } from './state';
import { createSelector } from '@ngrx/store';
import { AppState } from '../state';

export const selectCore = (state: AppState) => state.core;

export const selectToken = createSelector(
  selectCore,
  (core: CoreState) => core.accessToken
);

export const selectUser = createSelector(
  selectCore,
  (core: CoreState) => core.user
);
