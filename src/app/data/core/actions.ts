import { Action } from 'redux';
import { ReduxAction } from '../models';
import * as types from './types';

@ReduxAction
export class StartLoading implements Action {
    readonly type = types.START_LOADING;
    constructor(public payload: string) { }
}

@ReduxAction
export class FinishLoading implements Action {
    readonly type = types.FINISH_LOADING;
}

export type CoreActions =
    | StartLoading
    | FinishLoading;
