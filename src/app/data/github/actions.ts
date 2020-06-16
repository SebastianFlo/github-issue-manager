import * as types from './types';

import { createAction, props } from '@ngrx/store';
import { Repos } from './state';

export const SetRepos = createAction(
  types.SET_REPOS,
  props<{ payload: Repos }>()
);
