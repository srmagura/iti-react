# Contributing to iti-react

## Development

Run the following in the repository root:

1. `yarn install`
2. `yarn build`
3. `yarn test`
4. `yarn lint`

To try out your changes:

1. Run `TestAPI` from Visual Studio.
2. Run `yarn start` in the `test-website` directory and open http://localhost:5278/.
3. If you make a change to one of the packages, run `yarn build-all` in the
   workspace root or `yarn build` in the affected package's directory.

## Publishing

1.  Document changes in `CHANGELOG.md`.
2.  Commit, push, and wait for build pipeline to succeed.
3.  Increase the version numbers as needed. If updating `iti-react-core`, make
    sure to update `iti-react`'s dependency on `iti-react-core` to the correct
    version!
4.  `yarn install` and `yarn build` in the repository root.
5.  `yarn npm publish --access public` for each package that needs to be updated.

## TypeDoc

Run `yarn typedoc` in the root of the repository. The `--watch` option is not
supported. You must have a git remote named `github` pointing to
https://github.com/srmagura/iti-react.git. It's assumed `origin` points to the
ITI Bitbucket.
