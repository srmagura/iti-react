See the TypewriterModels ASP.NET Core project. 

We have to have the Typewriter stuff in an ASP.NET project because
Typewriter does not support Node.js projects as of version 2.2.0.

The TypeScript files are not included in the TypeScriptApps project
because it would be tedious to have to include/exclude files whenever
models or enums are added/removed.