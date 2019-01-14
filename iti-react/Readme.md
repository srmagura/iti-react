﻿A collection of utilities and React components covering:

-   Form validation
-   Form inputs for time, date, and phone number
-   DataUpdater classes that handle querying for data when the query parameters (e.g. filters and page number) change
-   Commonly-used components: Bootstrap modal dialog, confirmation dialog, pager, submit button with loading indicator

## Usage

_WARNING: Does not follow semver!_ Review Changelog.md before updating.

1.  `yarn add --exact @interface-technologies/iti-react`
2.  Add `@import '~@interface-technologies/iti-react/index';` to your top-level SCSS file.
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

In development, use yarn link so that the website's code can import iti-react and get the current working version of the code, rather than the version available on the npm registry.

In iti-react, run `yarn link`, and then in TestWebsite, run `yarn link "@interface-technologies"`. This doesn't appear to be saved in the repository so it needs to be done on each computer used for development.

### How to publish

Steps to do a new release are pretty standard:

1.  Document changes in Changelog.md.
2.  Commit all of your changes.
3.  `yarn publish` while in the iti-react directory and bump the version number in the iteractive prompt. Yarn will create a git commit with the bumped version number and a git tag.
4.  `git push --tags` to push the tag to origin.