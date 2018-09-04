using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Website
{
    public class WebsiteSettings
    {
        /// <summary>
        /// To be used for building URLs for notifications, .etc.
        /// </summary>
        public string BaseUrl { get; set; }

        /// <summary>
        /// All access tokens (auth cookies) will be invalidated if you change this key. For security,
        /// must use a different signing key in development, staging, and production.
        /// </summary>
        public string TokenAuthenticationSigningKey { get; set; }
        public SecurityKey TokenAuthenticationSecurityKey =>
            new SymmetricSecurityKey(Encoding.ASCII.GetBytes(TokenAuthenticationSigningKey));
    }
}