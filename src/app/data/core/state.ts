export interface CoreState {
    loading: boolean;
    message: string;
    accessToken: string;
    user: object;
}

export const defaultCoreState: CoreState = {
    loading: false,
    message: '',
    accessToken: 'test',
    user: {}
};
