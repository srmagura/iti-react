# Contributing to iti-react

[Azure Pipelines](https://dev.azure.com/iticentral/iti-react/_build)

## Development Prerequisites

-   Node.js (latest LTS)
-   Yarn (installed globally through npm)
-   A way to run the web API (C#), so Visual Studio or the VS Code C# extension
-   Latest PowerShell

## Development

Run the following in the repository root:

1. `yarn install`
2. `yarn build`
3. `yarn test`
4. `yarn lint`

To try out your changes:

1. Run `TestAPI` from Visual Studio, or from VS Code with the C# extension installed.
2. Run `yarn build:watch`.
3. Run `yarn start` and open http://localhost:5278/.
4. Log in with any email address and the password `LetMeIn98`.

## Publishing

1.  Document changes in `CHANGELOG.md` for **each** package you changed.
2.  Increase the version numbers of all packages using Replace-All.
3.  Run `yarn install` to update `yarn.lock` with the new version numbers.
4.  Commit, push, and wait for build pipeline to succeed.
5.  In the repository root: `yarn publish`. This will automatically build all packages first.

## TypeDoc

Run `yarn typedoc` in the root of the repository. The `--watch` option is not
supported. You must have a git remote named `github` pointing to
https://github.com/srmagura/iti-react.git. It's assumed `origin` points to the
ITI Bitbucket.
