using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Website.Dto;
using Website.Util;

namespace Website.Controllers
{
    public class ExampleController : BaseController
    {
        public ExampleController()
        {
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
    }
}
