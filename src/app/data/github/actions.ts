import * as types from './types';

import { createAction, props } from '@ngrx/store';
import { Repos, Issues } from './state';

export const SetRepos = createAction(
  types.SET_REPOS,
  props<{ payload: Repos }>()
);

export const SetIssues = createAction(
  types.SET_ISSUES,
  props<{ payload: Issues }>()
);
