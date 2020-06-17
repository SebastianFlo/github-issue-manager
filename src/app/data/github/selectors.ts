import { GithubState, Issues } from './state';
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

export const selectRepositoriesIssues = createSelector(
  selectGithub,
  (github: GithubState) => github.repos.edges.filter(repo => !!repo.node.issues.edges.length).reduce((acc, repo) => {
    const issues = repo.node.issues.edges;
    return {
      edges: [...acc.edges, ...issues]
    };
  }, { edges: [] })
);

export const selectIssues = createSelector(
  selectGithub,
  (github: GithubState) => github.issues
);
