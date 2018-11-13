using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TestWebsite
{
    public class WebsiteSettings
    {
        /// <summary>
        /// All access tokens (auth cookies) will be invalidated if you change this key. For security,
        /// must use a different signing key in development, staging, and production.
        /// </summary>
        public string TokenAuthenticationSigningKey { get; set; }
        public SecurityKey TokenAuthenticationSecurityKey =>
            new SymmetricSecurityKey(Encoding.ASCII.GetBytes(TokenAuthenticationSigningKey));
    }
}