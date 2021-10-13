import { templateFormatter } from 'input-format'

/**
 * This code should handle a variety of US phone number formats:
 * - with or without country code 1
 * - with or without leading +
 * - less than the required number of digits
 * - with or without punctuation
 *
 * This code is used by [[`PhoneInput`]].
 */

/** The number of phone number digits that are displayed. */
export const visibleLen = 10

/** The number of phone number digits including the US/Canada country code. */
export const lenWithCountryCode = visibleLen + 1

/** The template used for formatting phone numbers. */
export const template = '(xxx) xxx-xxxx'

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const formatter: (s: string) => { text: string } = templateFormatter(template)

/**
 * Takes in a phone number in any format and converts it to an 11-digit string that
 * starts with the US/Canada country code of 1.
 */
export function normalizePhoneNumber(phoneNumber: string): string {
    let num = phoneNumber.replace(/[^0-9]/g, '')

    if (num.length > 0 && !num.startsWith('1')) num = `1${num}`

    if (num.length > lenWithCountryCode) {
        num = num.substring(0, lenWithCountryCode)
    }

    return num
}

/** Format a phone number for display. Uses [[`normalizePhoneNumber`]]. */
export function formatPhoneNumber(phoneNumber: string | undefined | null): string {
    if (!phoneNumber) return ''

    const normalized = normalizePhoneNumber(phoneNumber)
    let noCountry = normalized
    if (noCountry.length > 0 && noCountry.startsWith('1')) {
        noCountry = noCountry.substring(1)
    }

    return formatter(noCountry).text
}
