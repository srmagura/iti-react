import * as React from 'react'

export interface AddressDisplayAddress {
    line1: string
    line2?: string | null
    city: string
    state: string
    zip: string
}

function cleanZip(zip: string) {
    return zip.replace(' ', '').replace('-', '')
}

function isCanadian(address: AddressDisplayAddress) {
    return cleanZip(address.zip).length === 6
}

export function formatZip(zip: string) {
    zip = cleanZip(zip)

    switch (zip.length) {
        case 9:
            return zip.substr(0, 5) + '-' + zip.substr(5)
        case 6:
            // Canadian postal code
            return zip.substr(0, 3) + ' ' + zip.substr(3)
        default:
        case 5:
            return zip
    }
}

function getLine3(address: AddressDisplayAddress) {
    const zip = formatZip(address.zip)

    // building the line3 string this way because all fields are nullable
    const stateZipParts = [address.state, zip].filter(s => !!s)
    const stateZip = stateZipParts.join(' ')

    let line3Parts = [address.city, stateZip].filter(s => !!s)

    const separator = !isCanadian(address) ? ', ' : ' '
    return line3Parts.join(separator)
}

interface AddressDisplayProps {
    address: AddressDisplayAddress | undefined | null
}

export function AddressDisplay(props: AddressDisplayProps) {
    const { address } = props

    if (!address) return null

    return (
        <div className="address-display">
            {address.line1 && <p>{address.line1}</p>}
            {address.line2 && <p>{address.line2}</p>}
            <p>{getLine3(address)}</p>
            {isCanadian(address) && <p>Canada</p>}
        </div>
    )
}
