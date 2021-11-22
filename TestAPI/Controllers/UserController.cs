using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TestAPI.DTOs;

namespace TestAPI.Controllers
{
    public class UserController : ControllerBase
    {
        private readonly UserDto _user = new(0, "Sam Magura");

        public record LogInRequestBody(string Email, string Password);

        [AllowAnonymous]
        [HttpPost]
        public IActionResult LogIn([FromBody] LogInRequestBody body)
        {
            if (body.Password != "LetMeIn98")
                return BadRequest();

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, _user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
            };

            var signingCredentials = new SigningCredentials(AuthSettings.TokenAuthenticationSecurityKey, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.Add(TimeSpan.FromDays(14));

            // Create the JWT and write it to a string
            var jwt = new JwtSecurityToken(
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expires,
                signingCredentials: signingCredentials
            );

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return Ok(new UserLogInDto(encodedJwt, new DateTimeOffset(expires, TimeSpan.Zero)));
        }

        [HttpGet]
        public UserDto Me()
        {
            return _user;
        }
    }
}
