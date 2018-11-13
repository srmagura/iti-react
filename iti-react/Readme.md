A collection of utilities and React components covering:

-   Form validation
-   Form inputs for time, date, and phone number
-   DataUpdater classes that handle querying for data when the query parameters (e.g. filters and page number) change
-   Commonly-used components: Bootstrap modal dialog, confirmation dialog, pager, submit button with loading indicator

## Usage

_WARNING: Does not follow semver!_ Review Changelog.md before updating.

1.  `npm i --save-exact @interface-technologies/iti-react`
2.  Copy `node_modules/@interface-technologies/iti-react/iti-react.scss` into your stylesheet folder. This stylesheet is just a starting point that you can customize to fit your projects' needs.
3.  Add

        declare module 'input-format'
        declare module 'react-select'

    to your top-level `.d.ts` file. See `ReactSpaTemplate/Source/Website/Library.d.ts` for an example.

## Developing iti-react

### Prequisites

1.  Visual Studio node.js workflow (from Visual Studio Installer)
2.  TypeWriter VS extension
3.  Webpack Task Runner VS extension

### Linking from TestWebsite

The website's package.json has an entry for

    "@interface-technologies/iti-react": "file:../iti-react"

so that the Website's code can import iti-react and get the current working version of the
code, rather than the version available on the npm registry. If you want to start off a new
project using ReactSpaTemplate as a starting point, you need to delete the
"@interface-technologies/iti-react" entry from package.json and run

    npm i --save-exact @interface-technologies/iti-react

so that your project downloads iti-react from npm, rather than trying to get it from the relative
path ../iti-react.

### How to publish

Steps to do a new release are completely standard:

1.  Increment version number in package.json.
2.  Document changes in Changelog.md.
3.  `npm publish` while in the ITIReact directory
