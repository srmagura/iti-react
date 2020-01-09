import { templateFormatter } from 'input-format'

/* This code should handle a variety of US phone number formats:
 * - with or without country code 1
 * - with or without leading +
 * - less than the required number of digits
 * - with or without punctuation
 *
 * This code is used by PhoneInput.
 */

export const visibleLen = 10
export const lenWithCountryCode = visibleLen + 1

export const template = '(xxx) xxx-xxxx'
export const formatter = templateFormatter(template)

export function normalizePhoneNumber(phoneNumber: string) {
    let num = phoneNumber.replace(/[^0-9]/g, '')

    if (num.length > 0 && num[0] !== '1') num = '1' + num

    if (num.length > lenWithCountryCode) {
        num = num.substring(0, lenWithCountryCode)
    }

    return num
}

export function formatPhoneNumber(phoneNumber: string | undefined | null) {
    if (!phoneNumber) return ''

    const normalized = normalizePhoneNumber(phoneNumber)
    let noCountry = normalized
    if (noCountry.length > 0 && noCountry[0] === '1') {
        noCountry = noCountry.substring(1)
    }

    return formatter(noCountry).text
}
