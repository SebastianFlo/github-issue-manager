import * as actions from './actions';
// import * as types from './types';
// import { defaultCoreState, CoreState } from './state';

import { defaultCoreState, CoreState } from './state';
import { createReducer, on, Action } from '@ngrx/store';

// export function CoreReducer(state: CoreState = defaultCoreState, action: actions.CoreActions): CoreState {
//     switch (action.type) {
//         case types.START_LOADING:
//             return {
//                 ...state,
//                 loading: true,
//                 message: action.payload
//             };

//         case types.FINISH_LOADING:
//             return {
//                 ...state,
//                 loading: false,
//                 message: ''
//             };

//         case types.SET_TOKEN:
//             return {
//                 ...state,
//                 accessToken: action.payload
//             };

//         default: return state;
//     }
// }

const coreReducer = createReducer(
  defaultCoreState,
  on(actions.SetToken, (state, action) => ({ ...state, accessToken: action.payload })),
  on(actions.SetUser, (state, action) => ({ ...state, user: action.payload })),
);

export function CoreReducer(state: CoreState | undefined, action: Action) {
  return coreReducer(state, action);
}
