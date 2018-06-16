# ITI React

A collection of utilities and React components covering:

- Form validation
- Form inputs for time, date, and phone number
- DataUpdater classes that handle querying for data when the query parameters (e.g. filters and page number) change
- Commonly-used components: Bootstrap modal dialog, confirmation dialog, pager, submit button with loading indicator

## Usage

_WARNING: Does not follow semver!_ Review Changelog.md before updating.

1.  `npm i --save-exact @interface-technologies/iti-react`
2.  Copy `node_modules/@interface-technologies/iti-react/iti-react.scss` into your stylesheet folder. This stylesheet is just a starting point that you can customize to fit your projects' needs.
3.  Add `declare module 'input-format'` to your top-level `.d.ts` file. See `ReactSpaTemplate/Source/Website/Library.d.ts` for an example.

## Developing

The source code for iti-react is located in the [ReactSpaTemplate project](https://bitbucket.org/itidev/reactspatemplate)
in the ITI BitBucket. See the ReactSpaTemplate README for how documentation on prerequisites for development
and an explanation of how the solution is set up.
