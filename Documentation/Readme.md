# React Template

Template for using ASP.NET Core controllers with React for rendering views. Server-side rendering powered by 
ASP.NET JavaScriptServices. 

Using TypeScript, with the TypeWriter Visual Studio extension automatically creating TypeScript classes for 
C# DTOs and ViewModels.

TypeScript and Sass stylesheets are compiled and bundled through Webpack. 

### Prequisites

Install the following Visual Studio extensions:

1. TypeWriter
2. Webpack Task Runner - once it's installed, Webpack will run in watch mode when you open
   the project.
3. Web Compiler, for Sass intellisense

### GenerateTypeScript

This project generates several TypeScript files postbuild:

1. `Url.ts` - strongly-typed URLs from TypeScript
2. `Models/index.ts` - re-exports models so you can write 
    import { UserDto, CustomerDto, BlahDto } from 'Models'
	instead of having to write a separate import statement for each type.
3. `PageIndex.ts` - imports each page and builds a dictionary. This saves us from having
    to add a new import statement when a new view is added.

### Adding a new page

1. Create an MVC controller action like usual.
2. Duplicate one of the existing pages in Scripts/Pages and place the new copy at
   `Pages/{Controller}/{Action}.tsx`. The file must export a React component named Page
   that takes a single prop named `model`.
3. You may wish to add a new stylesheet as well. You'll need to import this stylesheet in
   Client.tsx.

### Form validation

Validation components are in Scripts/Util/FormUtil.

Look at HPS Portal codebase (in Care Services VSTS) for examples of how to use them. 

### Deployment

When project configuration is RELEASE, the postbuild script executes Webpack in production mode.
This means you do not need to fiddle with Webpack at all when using one-click Web Deploy to Azure - the 
JavaScript will be minified automatically.

The downside to this is that you need to restart webpack --watch when you return to development.