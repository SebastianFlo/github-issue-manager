export interface Issue {
  node: {
    title: string;
  }
}

export interface Issues {
  edges: Issue[]
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
}

export const defaultGithubState: GithubState = {
  repos: { edges: [] },
};
