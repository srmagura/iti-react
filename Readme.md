iti-react is a TypeScript library of React components and utilities.

### Prequisites

1.  Visual Studio node.js workflow (from Visual Studio Installer)
2.  TypeWriter VS extension
3.  Webpack Task Runner VS extension

### Developing iti-react

The Website's package.json has an entry for

    "@interface-technologies/iti-react": "file:../iti-react"

so that the Website's code can import iti-react and get the current working version of the
code, rather than the version available on the npm registry. If you want to start off a new
project using ReactSpaTemplate as a starting point, you need to delete the
"@interface-technologies/iti-react" entry from package.json and run

    npm i --save-exact @interface-technologies/iti-react

so that your project downloads iti-react from npm, rather than trying to get it from the relative
path ../iti-react.
