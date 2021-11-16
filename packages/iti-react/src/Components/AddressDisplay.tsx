import React from 'react'
import {
    formatAddressLine3,
    isCanadianPostalCode,
} from '@interface-technologies/iti-react-core'

/** An address suitable for use in [[`AddressDisplay`]]. */
export interface AddressDisplayAddress {
    // undefined | null to protect against null values from backend (happened in production)
    line1: string | undefined | null
    line2?: string | undefined | null
    city: string | undefined | null
    state: string | undefined | null
    postalCode: string | undefined | null
}

export interface AddressDisplayProps {
    address: AddressDisplayAddress | undefined | null
}

/** A component that displays an address. */
export function AddressDisplay({
    address,
}: AddressDisplayProps): React.ReactElement | null {
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
