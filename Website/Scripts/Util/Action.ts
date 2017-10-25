import { Dispatch } from 'redux';

export interface Action<T> {
    type: string;
    payload: T;
}