import { GithubState } from './state';
import { createSelector } from '@ngrx/store';
import { AppState } from '../state';

export const selectGithub = (state: AppState) => state.github;

export const selectRepos = createSelector(
  selectGithub,
  (github: GithubState) => github.repos.edges
);

export const selectReposWithIssues = createSelector(
  selectGithub,
  (github: GithubState) => github.repos.edges.filter(repo => !!repo.node.issues.edges.length)
);
