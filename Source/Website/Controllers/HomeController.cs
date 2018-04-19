using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Website.ViewModels;
using Website.ViewModels.Home;
using Microsoft.Extensions.DependencyInjection;
using Website.Dto;

namespace Website.Controllers
{
    public class HomeController : BaseController
    {
        public HomeController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        public IActionResult Index()
        {
            // Get some data from the DB, .etc
            var userDto = new ExampleUserDto
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
    }
}
