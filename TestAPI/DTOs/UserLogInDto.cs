namespace TestAPI.DTOs
{
    public class UserLogInDto
    {
        public UserLogInDto(string accessToken, DateTimeOffset expiresUtc)
        {
            AccessToken = accessToken ?? throw new ArgumentNullException(nameof(accessToken));
            ExpiresUtc = expiresUtc;
        }

        public string AccessToken { get; set; }
        public DateTimeOffset ExpiresUtc { get; set; }
    }
}
