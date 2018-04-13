using System;
using System.Collections.Generic;
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

        public IActionResult AjaxExample()
        {
            return ReactView("Home.AjaxExample");
        }

        [HttpPost]
        public IActionResult AjaxExample(string data)
        {
            if (data.Length > 0)
            {
                return new JsonResult($"You submitted: {data}");
            }

            // so we can test that AJAX code handles this correctly
            return new UnauthorizedResult();
        }

        public IActionResult Numbers()
        {
            var random = new Random();

            var numbers = new List<int>();
            for (var i = 0; i < 10; i++)
            {
                numbers.Add(random.Next(0, 100));
            }

            return new JsonResult(numbers);
        }
    }
}
