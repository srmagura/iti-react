﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using MoreLinq;

namespace GenerateTypeScript
{
    // Automatically runs post build
    class Program
    {
        private static readonly string SourceDir =
             Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent
                 .Parent.Parent.FullName;

        private static readonly string AutoGeneratedMessage = "// Auto-generated by GenerateTypeScript";

        private static void AutoIndex(string dirPath)
        {
            var output = new StringBuilder();
            output.AppendLine(AutoGeneratedMessage);

            foreach (var path in Directory.EnumerateFiles(dirPath, "*.ts"))
            {
                if (path.Contains("index.ts")) continue;

                var noExtension = Path.GetFileNameWithoutExtension(path);
                output.AppendLine($"export * from './{noExtension}'");
            }

            var outputPath = Path.Combine(dirPath, "index.ts");
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
                AutoIndex(Path.Combine(SourceDir, @"test-website\src\Models\TypeWriterModels"));
            }
            catch (Exception e)
            {
                Console.WriteLine("GenerateTypeScript failed with error: " + e.Message);
            }
        }
    }
}
