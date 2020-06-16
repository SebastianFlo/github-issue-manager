import * as actions from './actions';
import * as types from './types';
import { defaultCoreState, CoreState } from './state';

export function CoreReducer(state: CoreState = defaultCoreState, action: actions.CoreActions): CoreState {
    switch (action.type) {
        case types.START_LOADING:
            return {
                ...state,
                loading: true,
                message: action.payload
            };

        case types.FINISH_LOADING:
            return {
                ...state,
                loading: false,
                message: ''
            };

        default: return state;
    }
}
