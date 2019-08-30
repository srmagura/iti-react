import * as React from 'react'

export interface AddressDisplayAddress {
    line1: string
    line2?: string | null
    city: string
    state: string
    postalCode: string
}

function normalizePostalCode(postalCode: string) {
    return postalCode.replace(' ', '').replace('-', '')
}

function isCanadian(address: AddressDisplayAddress) {
    return normalizePostalCode(address.postalCode).length === 6
}

export function formatPostalCode(postalCode: string) {
    postalCode = normalizePostalCode(postalCode)

    switch (postalCode.length) {
        case 9:
            return postalCode.substr(0, 5) + '-' + postalCode.substr(5)
        case 6:
            // Canadian postal code
            return postalCode.substr(0, 3) + ' ' + postalCode.substr(3)
        default:
        case 5:
            return postalCode
    }
}

function getLine3(address: AddressDisplayAddress) {
    const postalCode = formatPostalCode(address.postalCode)

    // building the line3 string this way because all fields are nullable
    const stateZipParts = [address.state, postalCode].filter(s => !!s)
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
