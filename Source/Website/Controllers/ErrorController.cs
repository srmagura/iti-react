using System;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Website.Dto;
using Website.Util;
using Website.ViewModels.Error;
using Website.ViewModels.Home;

namespace Website.Controllers
{
    public class ErrorController : BaseController
    {
        public ErrorController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        // e can be null
        private string GetErrorMessage(Exception e)
        {
            if (e is UserPresentableException)
            {
                return e.Message;
            }

            return "There was an unexpected error.";
        }

        public IActionResult Index()
        {
            Exception e = null;
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            if (exceptionFeature != null)
            {
                e = exceptionFeature.Error;

                // TODO Log the exception
                // route where occurred =  exceptionFeature.Path;
            }

            var model = new ErrorIndexViewModel
            {
                Message = GetErrorMessage(e),
                IsDebug = Startup.IsDebug,
                DiagnosticInformation = e?.ToString()
            };

            if (Request.IsAjaxRequest())
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                return Json(new ErrorDto
                {
                    Message = model.Message,
                    DiagnosticInformation = model.DiagnosticInformation
                });
            }
            else
            {
                Response.StatusCode = (int) HttpStatusCode.OK;
                return ReactView("Error.Index", model);
            }
        }
    }
}