function ThrowOnError() {
    if($LASTEXITCODE) {
        throw 'Command failed.'
    }
}


Set-Location $PSScriptRoot/..
yarn install
ThrowOnError

yarn build
ThrowOnError

function Publish($package) {
    Set-Location $PSScriptRoot/../packages/$package
    yarn npm publish --access public
    ThrowOnError
}

Publish('check-for-js-bundle-update-saga')
Publish('iti-react')
Publish('iti-react-core')
Publish('permissions')
Publish('webpack-config')