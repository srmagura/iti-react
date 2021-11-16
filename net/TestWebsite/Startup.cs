using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using TestWebsite.Code;

namespace TestWebsite
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

#if DEBUG
        public static readonly bool IsDebug = true;
#else
        public static readonly bool IsDebug = false;
#endif

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Turn off legacy behavior of converting sub claim to ClaimTypes.NameIdentifier
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            services.Configure<WebsiteSettings>(Configuration.GetSection("WebsiteSettings"));

            var websiteSettings = Configuration.GetSection("WebsiteSettings").Get<WebsiteSettings>();

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        RequireExpirationTime = true,
                        RequireSignedTokens = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = websiteSettings.TokenAuthenticationSecurityKey,
                        ValidateLifetime = true,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                    };
                });

            services.AddControllersWithViews(options =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();

                options.Filters.Add(new AuthorizeFilter(policy));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (!env.IsDevelopment())
            {
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            app.UseStaticFiles();
            app.UseAuthentication();

            // Reference on secure HTTP headers: https://owasp.org/www-project-secure-headers
            app.Use(async (context, next) =>
            {
                // Clickjacking protection  
                context.Response.Headers.Add("Content-Security-Policy", "frame-ancestors 'self'");

                await next();
            });

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
                endpoints.MapFallbackToController("Index", "Home");
            });
        }
    }
}
