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
        Get-ChildItem dist -Include *.test.js -Recurse | Remove-Item
        Get-ChildItem dist -Include *.test.d.ts -Recurse | Remove-Item

        if(Test-Path dist/__testHelpers__) {
            Remove-Item -Recurse dist/__testHelpers__
        }
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