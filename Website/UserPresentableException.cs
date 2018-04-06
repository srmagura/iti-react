using System;

namespace Website
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