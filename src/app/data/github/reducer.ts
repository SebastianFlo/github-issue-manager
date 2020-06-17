import { createReducer, on, Action } from '@ngrx/store';

import * as actions from './actions';
import { defaultGithubState, GithubState } from './state';

const githubReducer = createReducer(
  defaultGithubState,
  on(actions.SetRepos, (state, action) => ({ ...state, repos: action.payload })),
  on(actions.SetIssues, (state, action) => ({ ...state, issues: action.payload })),
);

export function GithubReducer(state: GithubState | undefined, action: Action) {
  return githubReducer(state, action);
}
