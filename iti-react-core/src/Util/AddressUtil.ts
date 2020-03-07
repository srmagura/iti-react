export function normalizePostalCode(postalCode: string): string {
    return postalCode.replace(' ', '').replace('-', '')
}

export function isCanadianPostalCode(postalCode: string): boolean {
    return normalizePostalCode(postalCode).length === 6
}

export function formatPostalCode(postalCode: string): string {
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

export function formatAddressLine3(partialAddress: {
    city: string
    state: string
    postalCode: string
}): string {
    const postalCode = formatPostalCode(partialAddress.postalCode)

    // building the line3 string this way because all fields are nullable
    const stateZipParts = [partialAddress.state, postalCode].filter(s => !!s)
    const stateZip = stateZipParts.join(' ')

    const line3Parts = [partialAddress.city, stateZip].filter(s => !!s)

    const separator = !isCanadianPostalCode(partialAddress.postalCode) ? ', ' : ' '
    return line3Parts.join(separator)
}
