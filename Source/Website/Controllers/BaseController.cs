using System;
using Microsoft.AspNetCore.Mvc;
using Website.ViewModels;
using Microsoft.Extensions.DependencyInjection;
using Website.Dto;
using Website.ViewModels.Base;

namespace Website.Controllers
{
    public class BaseController : Controller
    {
        private readonly IServiceProvider _serviceProvider;

        public BaseController(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public ActionResult RedirectToHome()
        {
            return RedirectToRoute("Default", new { controller = "", action = "" });
        }

        public IActionResult ReactView(string component)
        {
            return ReactView(component, new ViewModel());
        }

        public IActionResult ReactView(string component, ViewModel viewModel)
        {
            var reactViewModel = new ReactViewModel
            {
                Page = component,
                BaseUrl = $"{Request.Scheme}://{Request.Host}/{Url.Content("~")}",
                ViewModel = viewModel,
                IsDebug = Startup.IsDebug,
            };

            var timeZone = Request.Cookies["TimeZone"];
            if (timeZone != null)
            {
                reactViewModel.TimeZone = new IanaTimeZone(timeZone);
            }

            var razorViewModel = new RazorViewModel
            {
                ReactViewModel = reactViewModel,
                ServiceProvider = _serviceProvider
            };

            return View("Layout", razorViewModel);
        }
    }
}