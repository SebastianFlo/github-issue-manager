export interface CoreState {
    loading: boolean;
    message: string;
}

export const defaultCoreState: CoreState = {
    loading: false,
    message: ''
};
