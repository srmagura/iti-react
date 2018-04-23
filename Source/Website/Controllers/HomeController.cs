﻿using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Website.Dto;
using Website.Util;

namespace Website.Controllers
{
    public class HomeController : Controller
    {
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
                    Message = e.Message
                };
            }

            return new ErrorDto
            {
                Message = "There was an unexpected error."
            };
        }

        public IActionResult ExceptionHandler()
        {
            Exception e = null;
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            if (exceptionFeature != null)
            {
                e = exceptionFeature.Error;

                // TODO Log the exception
                // route where occurred =  exceptionFeature.Path;
            }

            var error = GetError(e);
            error.DiagnosticInformation = e?.ToString();

            Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return Json(error);
        }
    }
}
