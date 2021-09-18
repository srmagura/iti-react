# Users: see repositoy-level README.

## Developing iti-react

### Prequisites

1.  Visual Studio node.js workflow (from Visual Studio Installer)
2.  TypeWriter VS extension

### How to publish

Steps to do a new release are pretty standard:

1.  Document changes in Changelog.md.
2.  Commit all of your changes.
3.  Increase the version numbers of `iti-react-core`, `iti-react`, and `iti-react`'s dependency on `iti-react-core`.
4.  `yarn npm publish --access public` while in the iti-react directory.

### Development tips

-   iti-react needs to compile when using Jest. Since Jest brings in @types/node, you must put `window` in front of setTimeout, setInterval, clearTimeout, and clearInterval. E.g. use `window.setTimeout` instead of `setTimeout`.
-   The solution uses yarn workspaces to link all the packages together. `yarn install` only needs to be run in the repository's root directory.
