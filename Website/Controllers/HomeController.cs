using System;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Website.ViewModels;
using Website.ViewModels.Home;
using Microsoft.Extensions.DependencyInjection;

namespace Website.Controllers
{
    public class HomeController : BaseController
    {
        public HomeController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        public IActionResult Index(bool simulateError = false, bool simulateErrorRedirect = false)
        {
            if(simulateError)
                throw new UserPresentableException("Whoops!");

            // Get some data from the DB, .etc
            var userDto = new UserDto
            {
                FirstName = "Kelly",
                LastName = "Campbell"
            };

            var model = new HomeIndexViewModel
            {
                User = userDto
            };

            return ReactView("Home.Index", model);
        }

        public IActionResult FormExample()
        {
            return ReactView("Home.FormExample");
        }
    }
}
