﻿using System;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
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

        // e can be null
        private ErrorDto GetError(Exception e)
        {
            if (e is UserPresentableException)
            {
                return new ErrorDto
                {
                    Message = e.Message,
                };
            }

            if (e is UserDoesNotExistException)
            {
                return new ErrorDto
                {
                    ErrorType = ErrorType.UserDoesNotExist,
                    Message = "The requested user does not exist.",
                };
            }

            return new ErrorDto
            {
                Message = "There was an unexpected error.",
            };
        }

        [AllowAnonymous]
        public IActionResult ExceptionHandler()
        {
            Exception e = null;
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            if (exceptionFeature != null)
            {
                e = exceptionFeature.Error;
                // route where occurred =  exceptionFeature.Path;
            }

            var error = GetError(e);
            error.DiagnosticInformation = e?.ToString();

            Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return Json(error);
        }
    }
}
