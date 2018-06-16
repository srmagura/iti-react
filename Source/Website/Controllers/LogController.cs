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

        public class RequestBody
        {
            public string Message { get; set; }
        }

        [HttpPost]
        public void Info([FromBody] RequestBody body)
        {
            // TODO Implement
            throw new NotImplementedException();
            //Log.Info(Template(body.Message));
        }

        [HttpPost]
        public void Warning([FromBody] RequestBody body)
        {
            // TODO Implement
            throw new NotImplementedException();

            //Log.Warning(Template(body.Message));
        }

        [HttpPost]
        public void Error([FromBody] RequestBody body)
        {
            // TODO Implement
            throw new NotImplementedException();

            //Log.Error(Template(body.Message));
        }
    }
}