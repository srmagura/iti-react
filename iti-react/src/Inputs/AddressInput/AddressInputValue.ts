/** The value type for [[`AddressInput`]]. */
export type AddressInputValue = {
    line1: string
    line2: string
    city: string
    state: string
    postalCode: string
}

/** A blank [[`AddressInputValue`]]. */
export const defaultAddressInputValue: AddressInputValue = {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
}
