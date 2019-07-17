using System;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TestWebsite.Code;
using TestWebsite.Dto;
using TestWebsite.Util;

namespace TestWebsite.Controllers
{
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        private class HttpErrorDto : ErrorDto
        {
            public HttpErrorDto(ErrorDtoType errorType, string message, string diagnosticInfo = null)
                : base(errorType, message, diagnosticInfo)
            {
            }

            public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.InternalServerError;
        }

        // e can be null
        // this method does not need to set DiagnosticInformation
        private HttpErrorDto GetError(Exception e)
        {
            switch (e)
            {
                case NotAuthorizedException _:
                    return new HttpErrorDto(ErrorDtoType.NotAuthorized, "You are not authorized to perform this action.")
                    {
                        StatusCode = HttpStatusCode.Forbidden
                    };
                case InvalidLoginException _:
                    return new HttpErrorDto(ErrorDtoType.InvalidLogin,
                     "Invalid login credentials.")
                    {
                        StatusCode = HttpStatusCode.BadRequest
                    };
                case UserDoesNotExistException _:
                    return new HttpErrorDto(ErrorDtoType.UserDoesNotExist, "The requested user does not exist.")
                    {
                        StatusCode = HttpStatusCode.NotFound
                    };
                case UserPresentableException _:
                case DomainException _:
                    return new HttpErrorDto(ErrorDtoType.InternalServerError, e.Message);
            }

            return new HttpErrorDto(ErrorDtoType.InternalServerError, "There was an unexpected error.");
        }

        [AllowAnonymous]
        public IActionResult ExceptionHandler()
        {
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            var e = exceptionFeature.Error;

            //var message = e.Message + " at " + exceptionFeature.Path;

            //if (e is UserPresentableException)
            //{
            //    Log.Warning(message, e);
            //}
            //else
            //{
            //    Log.Error(message, e);
            //}

            var error = GetError(e);
            error.DiagnosticInfo = e?.ToString();

            Response.StatusCode = (int)error.StatusCode;

            var errorWithoutStatusCode = new ErrorDto(error.Type, error.Message, error.DiagnosticInfo);

            return Json(errorWithoutStatusCode);
        }
    }
}
