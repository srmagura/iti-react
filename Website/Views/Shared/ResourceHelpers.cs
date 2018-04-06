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
                new[] {"client.js"},
                new[] {"client.css"}
            );
        }

        public static ResourcePaths GetResourcePaths(IEnumerable<string> jsNames, IEnumerable<string> cssNames)
        {
            // get out of bin\Debug\net47
            var projectDirectory = AppDomain.CurrentDomain.BaseDirectory + "\\..\\..\\..";
            var manifestPath = Path.Combine(projectDirectory, "wwwroot/dist", "manifest.json");

            var json = File.ReadAllText(manifestPath);
            var dict = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);

            foreach (var key in dict.Keys.ToList())
            {
                dict[key] = "~/dist/" + dict[key];
            }

            return new ResourcePaths
            {
                // Order in which scripts are loaded matters
                Js = jsNames.Where(name => dict.ContainsKey(name)).Select(name => dict[name]),
                Css = cssNames.Where(name => dict.ContainsKey(name)).Select(name => dict[name])
            };
        }
    }
}