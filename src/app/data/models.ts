export function ReduxAction(constructor: Function) {
    constructor.prototype = null;
}

export class User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface ReduxActionApi<T> {
    data: T;
    api: Function;
}
