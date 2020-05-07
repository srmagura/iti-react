import { get, post, postVoid, onlyIfAuthenticated } from 'Api/ApiUtil'

export const logApi = {
    info: (data: { message: string }) =>
        onlyIfAuthenticated(() => postVoid('api/log/info', data)),
    warning: (data: { message: string }) =>
        onlyIfAuthenticated(() => postVoid('api/log/warning', data)),
    error: (data: { message: string }) =>
        onlyIfAuthenticated(() => postVoid('api/log/error', data)),
}
