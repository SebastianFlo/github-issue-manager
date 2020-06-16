export function ReduxAction(constructor: Function) {
    constructor.prototype = null;
}

export interface ReduxActionApi<T> {
    data: T;
    api: Function;
}
