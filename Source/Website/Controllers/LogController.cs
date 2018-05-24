using System;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Website.Controllers
{
    [Route("api/[Controller]/[Action]")]
    public class LogController : Controller
    {
        private static string Template(string message)
        {
            return $"JavaScript: {message}";
        }

        [HttpPost]
        public void Info(string message)
        {
            // TODO Implement
            throw new NotImplementedException();
            //Log.Info(Template(message));
        }

        [HttpPost]
        public void Warning(string message)
        {
            // TODO Implement
            throw new NotImplementedException();

            //Log.Warning(Template(message));
        }

        [HttpPost]
        public void Error(string message)
        {
            // TODO Implement
            throw new NotImplementedException();

            //Log.Error(Template(message));
        }
    }
}