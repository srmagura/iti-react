export enum ErrorType {
    CanceledAjaxRequest = 'CANCELED_AJAX_REQUEST',
    ConnectionError = 'NETWORK_FAILURE',
    UnknownAjaxError = 'UNKNOWN_AJAX_ERROR',
    UnknownError = 'UNKNOWN_ERROR',
    JavaScriptError = 'JAVASCRIPT_ERROR',
    NotAuthenticated = 'NOT_AUTHENTICATED',

    // HTTP errors
    NotAuthorized = 'NOT_AUTHORIZED',
    InternalServerError = 'INTERNAL_SERVER_ERROR',

    // Application-specific errors
    UserDoesNotExist = 'USER_DOES_NOT_EXIST',
    InvalidLogin = 'INVALID_LOGIN',
}
