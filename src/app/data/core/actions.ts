// import { Action } from 'redux';
// import { ReduxAction } from '../models';
import * as types from './types';

import { createAction, props } from '@ngrx/store';
import { User } from '../models';

export const SetToken = createAction(
  types.SET_TOKEN,
  props<{ payload: string }>()
);

export const SetUser = createAction(
  types.SET_USER,
  props<{ payload: User }>()
);
