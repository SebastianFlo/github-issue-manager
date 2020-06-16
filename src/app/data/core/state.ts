import { User } from '../models';

export interface CoreState {
    loading: boolean;
    message: string;
    accessToken: string;
    user: User;
}

export const defaultCoreState: CoreState = {
    loading: false,
    message: '',
    accessToken: 'test',
    user: { name: 'Sebastian Florian'}
};
