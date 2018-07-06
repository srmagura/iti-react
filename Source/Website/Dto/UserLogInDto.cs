
using System;

namespace Website.Dto
{
    public class UserLogInDto
    {
        public string AccessToken { get; set; }
        public DateTimeOffset ExpiresUtc { get; set; }
    }
}
