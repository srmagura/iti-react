# Contributing to iti-react

## Development

Workspace-wide scripts, to be run from the root directory:

1. `yarn install`
2. `yarn build-all`
3. `yarn test-all`
4. `yarn lint-all`
5. `yarn ci`

Each package also has `build`, `test`, and `lint` scripts.

To try out your changes:

1. Run `TestWebsite` from Visual Studio.
2. Run webpack-dev-server with `yarn watch` in the `test-website` directory.
3. If you make a change to one of the packages, run `yarn build-all` in the
   workspace root or `yarn build` in the affected package's directory.

## Publishing

1.  Document changes in `CHANGELOG.md`.
2.  Commit, push, and wait for build pipeline to succeed.
3.  Increase the version numbers of `iti-react-core`, `iti-react`, and `iti-react`'s dependency on `iti-react-core`.
4.  `yarn npm publish --access public` for each package that needs to be updated.

## TypeDoc

Run `yarn typedoc` in the root of the repository. The `--watch` option is not
supported. You must have a git remote named `github` pointing to
https://github.com/srmagura/iti-react.git. It's assumed `origin` points to the
ITI Bitbucket.
