using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TestWebsite.Code;
using TestWebsite.Dto;

namespace TestWebsite.Controllers
{
    [Route("api/[Controller]/[Action]")]
    public class UserController : Controller
    {
        private readonly WebsiteSettings _websiteSettings;

        public UserController(IOptions<WebsiteSettings> websiteSettings)
        {
            _websiteSettings = websiteSettings.Value;
        }

        public class LogInRequestBody
        {
            public EmailAddress Email { get; set; }
            public string Password { get; set; }
        }

        private readonly UserDto _hardCodedUser = new UserDto
        {
            Id = 0,
            Name = "Sam Magura"
        };

        // Reference: https://stormpath.com/blog/token-authentication-asp-net-core
        [AllowAnonymous]
        [HttpPost]
        public IActionResult LogIn([FromBody] LogInRequestBody body)
        {
            UserDto user = null;

            // TODO for users of the template: Implement real authentication!
            if (body.Password.Equals("LetMeIn98", StringComparison.InvariantCultureIgnoreCase))
            {
                user = _hardCodedUser;
            }

            //try
            //{
            //    user = _userAppService.GetByLogin(body.Email, body.Password);
            //}
            //catch (LoginFailedException)
            //{
            //    throw new UserPresentableException("Your account has been deactivated. You cannot log in.");
            //}

            if (user == null)
                throw new BadRequestException();

            // Specifically add the jti (random nonce), iat (issued timestamp), and sub (subject/user) claims.
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
            };

            var signingCredentials = new SigningCredentials(_websiteSettings.TokenAuthenticationSecurityKey, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.Add(TimeSpan.FromDays(14));

            // Create the JWT and write it to a string
            var jwt = new JwtSecurityToken(
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expires,
                signingCredentials: signingCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return Json(new UserLogInDto
            {
                AccessToken = encodedJwt,
                ExpiresUtc = new DateTimeOffset(expires, TimeSpan.Zero)
            });
        }

        public UserDto Get(long id)
        {
            //var r = new Random();
            //if (r.NextDouble() < 0.1) throw new UserDoesNotExistException();

            return _hardCodedUser;
            // return _userAppService.Get(id) ?? throw new UserDoesNotExistExcpetion();
        }

        public UserDto Me()
        {
            return Get(default(long));
            //var userId = _authContext.UserId;

            //if (userId == null)
            //{
            //    throw new NotAuthenticatedException();
            //}

            //return Get(userId.Value);
        }
    }
}
