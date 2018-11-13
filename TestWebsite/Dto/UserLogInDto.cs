
using System;

namespace TestWebsite.Dto
{
    public class UserLogInDto
    {
        public string AccessToken { get; set; }
        public DateTimeOffset ExpiresUtc { get; set; }
    }
}
