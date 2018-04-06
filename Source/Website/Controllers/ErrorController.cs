using System;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

            return ReactView("Error.Index", model);
        }
    }
}