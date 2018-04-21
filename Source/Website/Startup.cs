using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.NodeServices;
using System.Collections.Generic;
using Microsoft.AspNetCore.SpaServices.Webpack;

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

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

            services.AddMvc(options =>
            {
#if !DEBUG
                options.Filters.Add(new RequireHttpsAttribute());
#endif
            }).AddJsonOptions(options =>
            {
                var settings = options.SerializerSettings;
            });


            services.AddNodeServices();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseDefaultFiles(new DefaultFilesOptions
            {
                DefaultFileNames = new List<string> { "dist/index.html" }
            });
            app.UseStaticFiles();

            app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
            {

            });

            app.UseExceptionHandler("/Error");

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                     name: "default",
                     template: "{controller=Home}/{action=Index}/{id?}");


                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
