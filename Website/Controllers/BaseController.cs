using System;
using Microsoft.AspNetCore.Mvc;
using Website.ViewModels;
using Microsoft.Extensions.DependencyInjection;

namespace Website.Controllers
{
    public class BaseController : Controller
    {
        private readonly IServiceProvider _serviceProvider;

        public BaseController(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public IActionResult ReactView(string component)
        {
            return ReactView(component, new ViewModel());
        }

        public IActionResult ReactView(string component, ViewModel viewModel)
        {
            string host;

            if (Request.Host.Host.Contains("localhost"))
            {
                host = Request.Host.Value; // include port number
            }
            else
            {
                host = Request.Host.Host; // do not include port number, assuming it's 80
            }

            var razorViewModel = new MetaViewModel
            {
                Page = component,
                BaseUrl = $"{Request.Scheme}://{host}/{Url.Content("~")}",
                ViewModel = viewModel,
                ServiceProvider = _serviceProvider
            };

            return View("Layout", razorViewModel);
        }

        public IActionResult RedirectToErrorPage(string message)
        {
            return RedirectToAction("Error", "Home", new {message});
        }
    }
}