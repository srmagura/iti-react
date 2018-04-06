﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace GenerateTypeScript
{
    // Automatically runs post build
    class Program
    {
        private static readonly string SourceDir =
            Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent
                .Parent.Parent.FullName;

        private static readonly string TypeScriptDir = Path.Combine(SourceDir, @"Website\Scripts");

        private static readonly string AutoGeneratedMessage = "// Auto-generated by GenerateTypeScript\n";

        /// <summary>
        /// Create an index.ts for the Scripts\Models directory so that it's easier to import models from
        /// other files
        /// </summary>
        private static void BuildModelsIndex()
        {
            var modelsDir = Path.Combine(TypeScriptDir, @"Models");

            var output = new StringBuilder();
            output.Append(AutoGeneratedMessage);

            foreach (var path in Directory.EnumerateFiles(modelsDir, "*.ts", SearchOption.AllDirectories))
            {
                var noExtension = Path.GetFileNameWithoutExtension(path);
                output.Append($"export * from './{noExtension}';\n");
            }

            var outputPath = Path.Combine(modelsDir, "index.ts");
            File.WriteAllText(outputPath, output.ToString());
            PrintWrittenMessage(outputPath);
        }

        private class MvcAction
        {
            public string Controller { get; set; }
            public string Action { get; set; }
        }

        private static List<MvcAction> GetMvcActions()
        {
            var assemblyPath = Path.Combine(SourceDir, @"Website\bin\Debug\net47\Website.exe");
            Assembly asm;

            try
            {
                asm = Assembly.LoadFrom(assemblyPath);
            }
            catch
            {
                throw new Exception($"Could not load Website assembly from {assemblyPath}.");
            }

            // comparing strings, not types, because I was getting an error similar to https://stackoverflow.com/a/345464/752601
            var controllers = asm.GetTypes()
                .Where(type => type.Name.EndsWith("Controller") &&
                               !type.Name.Equals("BaseController") &&
                               !type.Name.Equals("Controller")).ToList();

            List<MethodInfo> actionMethodInfos = controllers
                .SelectMany(type => type.GetMethods())
                .Where(method => method.IsPublic //&& !method.IsDefined(typeof(NonActionAttribute))
                                 && controllers.Contains(method.DeclaringType)).ToList();

            return actionMethodInfos.Select(info => new MvcAction
            {
                Controller = info.DeclaringType.Name.Replace("Controller", ""),
                Action = info.Name
            }).ToList();
        }

        /// <summary>
        /// Generates Url.ts so that we can access URLs in a type-safe manner from TypeScript
        /// </summary>
        private static void GenerateUrls()
        {
            var output = new StringBuilder();
            output.Append(AutoGeneratedMessage);
            output.Append("import { getUrl } from 'Util/UrlUtil';\n\n");

            foreach (var mvcAction in GetMvcActions())
            {
                output.Append($"export const get_{mvcAction.Controller}_{mvcAction.Action}: () => string = () => getUrl(");
                output.Append($"{{ controller: '{mvcAction.Controller}', action: '{mvcAction.Action}' }});\n");
            }

            var outputPath = Path.Combine(TypeScriptDir, "Url.ts");
            File.WriteAllText(outputPath, output.ToString());
            PrintWrittenMessage(outputPath);
        }

        /// <summary>
        /// Imports each page and builds a dictionary. This saves us from having
        /// to add a new import statement when a new view is added.
        /// </summary>
        private static void GeneratePageIndex()
        {
            string GetPageVariableName(MvcAction mvcAction)
            {
                return $"{mvcAction.Controller}{mvcAction.Action}Page";
            }

            var output = new StringBuilder();
            output.Append(AutoGeneratedMessage);
            output.Append("import * as React from 'react';\n");
            output.Append("import { ViewModel } from 'Models';\n");

            foreach (var mvcAction in GetMvcActions())
            {
                output.Append("import { Page as " + GetPageVariableName(mvcAction) + "} from ");
                output.Append($"'Pages/{mvcAction.Controller}/{mvcAction.Action}';\n");
            }

            output.Append("\n\nexport const pages: {[index:string] : ((model: ViewModel) => JSX.Element)} = {\n");

            foreach (var mvcAction in GetMvcActions())
            {
                output.Append($"    '{mvcAction.Controller}.{mvcAction.Action}': model => ");
                output.Append($"<{GetPageVariableName(mvcAction)}" + " model={model as any} />,\n");
            }

            output.Append("};\n\n");

            var outputPath = Path.Combine(TypeScriptDir, "Pages/PageIndex.tsx");
            File.WriteAllText(outputPath, output.ToString());
            PrintWrittenMessage(outputPath);
        }

        private static void PrintWrittenMessage(string path)
        {
            Console.WriteLine($"Wrote file {Path.GetFileName(path)}");
        }

        public static void Main()
        {
            try
            {
                BuildModelsIndex();
                GenerateUrls();
                GeneratePageIndex();
            }
            catch (Exception e)
            {
                Console.WriteLine("GenerateTypeScript failed with error: " + e.Message);
            }
        }
    }
}