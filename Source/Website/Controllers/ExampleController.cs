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
    public class ExampleController : BaseController
    {
        public ExampleController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        public IActionResult Form()
        {
            return ReactView("Example.Form");
        }

        public IActionResult Ajax()
        {
            return ReactView("Example.Ajax");
        }

        [HttpPost]
        public IActionResult Ajax(string data)
        {
            if (data.Length > 0)
            {
                return Json($"You submitted: {data}");
            }

            // so we can test that AJAX code handles this correctly
            return new UnauthorizedResult();
        }

        public new IActionResult NoContent()
        {
            return base.NoContent();
        }

        public IActionResult InternalServerError()
        {
            throw new UserPresentableException("Here's the error message from the backend.");
        }

        public IActionResult Numbers()
        {
            var random = new Random();

            var numbers = new List<int>();
            for (var i = 0; i < 10; i++)
            {
                numbers.Add(random.Next(0, 100));
            }

            return Json(numbers);
        }
    }
}
