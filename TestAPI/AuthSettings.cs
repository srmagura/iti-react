using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TestAPI
{
    public static class AuthSettings
    {
        public static readonly SecurityKey TokenAuthenticationSecurityKey =
            new SymmetricSecurityKey(Encoding.ASCII.GetBytes("=by?SDS%L!jr_8L7h^+&w*tB8s"));
    }
}
