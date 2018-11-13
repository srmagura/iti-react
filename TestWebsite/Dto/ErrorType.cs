namespace TestWebsite.Dto
{
    // Some of these are errors that occur in the browser.
    // This enum is shared with JS.
    public enum ErrorType
    {
        CancelledAjaxRequest,
        IntervalServerError,
        BackendUnreachable,
        UnknownAjaxError,
        UnknownError,
        Unauthorized,
        UserDoesNotExist
    }
}