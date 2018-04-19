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
    // Testing that GenerateTypeScript can build URLs when attribute routing is used
    [Route("[Controller]")]
    public class ExampleController : BaseController
    {
        public ExampleController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        [HttpGet("Form")]
        // "Test" just so that Action name != the route
        public IActionResult FormTest()
        {
            return ReactView("Example.Form");
        }

        [HttpGet("Ajax")]
        public IActionResult Ajax()
        {
            return ReactView("Example.Ajax");
        }

        [HttpPost("Ajax")]
        public IActionResult Ajax(string data)
        {
            if (data.Length > 0)
            {
                return Json($"You submitted: {data}");
            }

            // so we can test that AJAX code handles this correctly
            return new UnauthorizedResult();
        }

        [HttpGet("NoContent")]
        public new IActionResult NoContent()
        {
            return base.NoContent();
        }

        [Route("InternalServerError")]
        [HttpGet]
        [HttpPost]
        public IActionResult InternalServerError()
        {
            throw new UserPresentableException("Here's the error message from the backend.");
        }

        [HttpGet("Numbers")]
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

        [HttpGet("DateTime")]
        public IActionResult DateTime()
        {
            return ReactView("Example.DateTime");
        }
    }
}
