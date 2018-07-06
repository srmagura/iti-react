using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.NodeServices;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.IdentityModel.Tokens;

namespace Website
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

        // FYI (Security) - since we're using the same key on all instances of this web app, 
        // if a user logs into Instance 1 and gets an access token, they could use that same
        // access token to log into Instance 2 (would need to manually create a cookie or
        // call the Web API directly).

        // All access tokens (auth cookies) will be invalidated if you change this key
        private static readonly string TokenAuthenticationSigningKey = "H?mPrr^9JyadXV6Mr^%M5z";
        public static readonly SecurityKey TokenAuthenticationSecurityKey =
            new SymmetricSecurityKey(Encoding.ASCII.GetBytes(TokenAuthenticationSigningKey));

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
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
                        IssuerSigningKey = TokenAuthenticationSecurityKey,
                        ValidateLifetime = true,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                    };
                });

            services.AddMvc(options =>
            {
#if !DEBUG
                options.Filters.Add(new RequireHttpsAttribute());
#endif
            }).AddJsonOptions(options =>
            {
                var settings = options.SerializerSettings;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseStaticFiles();

            if (env.IsDevelopment())
            {
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true,
                });
            }

            app.UseExceptionHandler("/Home/ExceptionHandler");

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                     name: "default",
                     template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
                  name: "api",
                  template: "api/{controller}/{action}/");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
