export enum ErrorType {
    CanceledPromise = 'CANCELED_PROMISE',
    ConnectionError = 'CONNECTION_ERROR',
    UnknownRequestError = 'UNKNOWN_REQUEST_ERROR',
    UnknownError = 'UNKNOWN_ERROR',
    JavaScriptError = 'JAVASCRIPT_ERROR',

    // HTTP errors
    BadRequest = 'BAD_REQUEST',
    NotAuthenticated = 'NOT_AUTHENTICATED',
    InternalServerError = 'INTERNAL_SERVER_ERROR',
    ErrorHttpStatusCode = 'ERROR_HTTP_STATUS_CODE',
}
