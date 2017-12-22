using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.NodeServices;

namespace Website
{
    public class MyAppSettings
    {
        private bool _disableServerSideRendering;

        // Disable server side rendering so that you can use console.log and the browser's JS
        // debugging to fix errors.
        public bool DisableServerSideRendering
        {
            // You can only disable SSR when in DEBUG configuration
            get => Startup.IsDebug && _disableServerSideRendering;
            set => _disableServerSideRendering = value;
        }
    }

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
            services.Configure<MyAppSettings>(Configuration.GetSection("MyApp"));

            services.AddMvc(options =>
            {
#if !DEBUG
                options.Filters.Add(new RequireHttpsAttribute());
#endif
            });

            services.AddNodeServices();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
