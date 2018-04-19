using System;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Website.Controllers
{
    public class LogController : Controller
    {
        private static string Template(string message)
        {
            return $"JavaScript: {message}";
        }

        [HttpPost]
        public IActionResult Info(string message)
        {
            // TODO Implement
            throw new NotImplementedException();

            //Log.Info(Template(message));
            return NoContent();
        }

        [HttpPost]
        public IActionResult Warning(string message)
        {
            // TODO Implement
            throw new NotImplementedException();

            //Log.Warning(Template(message));
            return NoContent();
        }

        [HttpPost]
        public IActionResult Error(string message)
        {
            // TODO Implement
            throw new NotImplementedException();

            //Log.Error(Template(message));
            return NoContent();
        }
    }
}