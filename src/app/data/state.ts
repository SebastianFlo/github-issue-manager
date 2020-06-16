import { CoreState } from './core/state';
import { GithubState } from './github/state';

export interface AppState {
    core: CoreState;
    github: GithubState;
}
