# React SPA Template

Purpose 1: Template for building a React single page app on top of an ASP.NET Core Web API.
Purpose 2: Source repository for the iti-react npm package, which contains React components
to be shared among multiple projects.

Using TypeScript, with the TypeWriter Visual Studio extension automatically creating TypeScript classes for
C# DTOs and ViewModels.

TypeScript and Sass stylesheets are compiled and bundled through Webpack.

### Prequisites

1.  Visual Studio node.js workflow (from Visual Studio Installer)
2.  TypeWriter VS extension
3.  Web Compiler VS extension, for Sass intellisense

### Developing iti-react

The Website's package.json has an entry for

    file:../ITIReact

so that the Website's code can import iti-react and get the current working version of the
code, rather than the version available on the npm registry. If you want to start off a new
project using ReactSpaTemplate as a starting point, you'll want to run

    npm i --save-exact @interface-technologies/iti-react

so that your project downloads iti-react from npm, rather than trying to get it from the relative
path ../ITIReact, which will fail.

_Releases / git workflow_ master branch should have the current "production" code that's available from npm.
Make you changes on dev, and then update master when you release a new iti-react version.

### GenerateTypeScript

This project generates several TypeScript files postbuild:

1.  `Url.ts` - strongly-typed URLs from TypeScript
2.  `Models/index.ts` - re-exports models so you can write
    import { UserDto, CustomerDto, BlahDto } from 'Models'
    instead of having to write a separate import statement for each type.
3.  `PageIndex.ts` - imports each page and builds a dictionary. This saves us from having
    to add a new import statement when a new view is added.

### Deployment

When project configuration is RELEASE, the postbuild script executes Webpack in production mode.
This means you do not need to fiddle with Webpack at all when using one-click Web Deploy to Azure - the
JavaScript will be minified automatically.
