export interface Issue {
  title: string;
  id: string;
  resourcePath: string;
  body: string;
  repository: {
    name: string;
    resourcePath: string;
  }
}

export interface Issues {
  edges: { node: Issue }[]
}

export interface Repo {
  node: {
    name: string;
    issues: Issues;
  };
}

export interface Repos {
  edges: Repo[];
}

export interface GithubState {
  repos: Repos;
  issues: Issues;
}

export const defaultGithubState: GithubState = {
  repos: { edges: [] },
  issues: { edges: [] }
};
