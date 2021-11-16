using System;

namespace TestWebsite.Util
{
    public class UserPresentableException : Exception
    {
        public UserPresentableException(string message) : base(message)
        {
        }

        public UserPresentableException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}