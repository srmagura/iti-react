import React from 'react'
import {
    formatAddressLine3,
    isCanadianPostalCode
} from '@interface-technologies/iti-react-core'

export interface AddressDisplayAddress {
    line1: string
    line2?: string | null
    city: string
    state: string
    postalCode: string
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
            <p>{formatAddressLine3(address)}</p>
            {isCanadianPostalCode(address.postalCode) && <p>Canada</p>}
        </div>
    )
}
