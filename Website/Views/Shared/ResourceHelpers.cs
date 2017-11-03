using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace Website.Views.Shared
{
    public class ResourcePaths
    {
        public IEnumerable<string> Js { get; set; }
        public IEnumerable<string> Css { get; set; }
    }

    public class ResourceHelpers
    {
        public static ResourcePaths GetResourcePaths()
        {
            return GetResourcePaths(
                new[] {"webpackRuntime.js", "vendor.js", "client.js"},
                new[] {"vender.css", "client.css"}
            );
        }

        public static ResourcePaths GetResourcePaths(IEnumerable<string> jsNames, IEnumerable<string> cssNames)
        {
            // get out of bin\Debug\net47
            var projectDirectory = AppDomain.CurrentDomain.BaseDirectory + "\\..\\..\\..";
            var manifestPath = Path.Combine(projectDirectory, "manifest.json");

            var json = File.ReadAllText(manifestPath);
            var dict = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);

            foreach (var key in dict.Keys.ToList())
            {
                dict[key] = "~/" + dict[key].Replace("wwwroot/", "");
            }

            return new ResourcePaths
            {
                // Order in which scripts are loaded matters
                Js = jsNames.Where(name => dict.ContainsKey(name)).Select(name => dict[name]),
                Css = cssNames.Where(name => dict.ContainsKey(name)).Select(name => dict[name])
            };
        }

        private static bool IsDebug()
        {
#if DEBUG
            return true;
#else
            return false;
#endif
        }

        public static string GetExternalScriptTags()
        {
            // Use unminified in development
            var min = IsDebug() ? "" : ".min";

            var scriptUrls = new[]
            {
                $"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery{min}.js",
                $"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper{min}.js",
                $"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap{min}.js",
                "https://use.fontawesome.com/b918bbc86d.js",
                "https://cdnjs.cloudflare.com/ajax/libs/react/16.0.0/umd/" + (IsDebug() ? "react.development.js" : "react.production.min.js"),
                "https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.0.0/umd/"+ (IsDebug() ? "react-dom.development.js" : "react-dom.production.min.js")
            };

            var tags = "";
            foreach (var url in scriptUrls)
            {
                tags += $"<script src='{url}'></script>";
            }

            return tags;
        }

    }
}