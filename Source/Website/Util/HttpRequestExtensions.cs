using System;
using Microsoft.AspNetCore.Http;

namespace Website.Util
{
    public static class HttpRequestExtensions
    {
        public static bool IsAjaxRequest(this HttpRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (request.Headers != null)
                return request.Headers["X-Requested-With"] == "AJAX";

            return false;
        }
    }
}