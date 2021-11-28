# Contributing to iti-react

## Development

Run the following in the repository root:

1. `yarn install`
2. `yarn build`
3. `yarn test`
4. `yarn lint`

To try out your changes:

1. Run `TestAPI` from Visual Studio.
2. Run `yarn build:watch`.
3. Run `yarn start` and open http://localhost:5278/.

## Publishing

1.  Document changes in `CHANGELOG.md`.
2.  Increase the version numbers of all packages using Replace-All.
3.  Commit, push, and wait for build pipeline to succeed.
4.  **IMPORTANT:** `yarn install` and `yarn build` in the repository root.
5.  `yarn npm publish --access public` for each package that needs to be updated.

## TypeDoc

Run `yarn typedoc` in the root of the repository. The `--watch` option is not
supported. You must have a git remote named `github` pointing to
https://github.com/srmagura/iti-react.git. It's assumed `origin` points to the
ITI Bitbucket.
