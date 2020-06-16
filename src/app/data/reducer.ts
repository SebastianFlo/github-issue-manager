import { combineReducers } from 'redux';

import { CoreReducer } from './core/reducer';

export const RootReducer: any = combineReducers({
    core: CoreReducer
});
