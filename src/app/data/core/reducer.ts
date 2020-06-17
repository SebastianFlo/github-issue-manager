import * as actions from './actions';

import { defaultCoreState, CoreState } from './state';
import { createReducer, on, Action } from '@ngrx/store';

const coreReducer = createReducer(
  defaultCoreState,
  on(actions.SetToken, (state, action) => ({ ...state, accessToken: action.payload })),
  on(actions.SetUser, (state, action) => ({ ...state, user: action.payload })),
);

export function CoreReducer(state: CoreState | undefined, action: Action) {
  return coreReducer(state, action);
}
