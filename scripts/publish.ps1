function ThrowOnError() {
    if($LASTEXITCODE) {
        throw 'Command failed.'
    }
}


Set-Location $PSScriptRoot/..
yarn install
ThrowOnError

yarn clean
ThrowOnError

yarn build
ThrowOnError

function Publish($package) {
    Set-Location $PSScriptRoot/../packages/$package

    if (Test-Path dist) {
        Remove-Item dist/*.test.js
        Remove-Item dist/*.test.d.ts
    }

    yarn npm publish --access public
    ThrowOnError
}

Publish('check-for-js-bundle-update-saga')
Publish('eslint-config')
Publish('iti-react')
Publish('iti-react-core')
Publish('jest-config')
Publish('lint-staged-config')
Publish('permissions')
Publish('prettier-config')
Publish('tsconfig')
Publish('webpack-config')