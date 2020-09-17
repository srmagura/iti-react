import { round } from 'lodash'

export function formatDollars(amount: number | null | undefined): string {
    if (typeof amount !== 'number') return ''

    const absoluteValue = `$${amount.toFixed(2).replace('-', '')}`

    // note: this is a unicode minus sign, not a hyphen
    return (amount < 0 ? '?' : '') + absoluteValue
}

export function formatPercent(
    amount: number | null | undefined,
    purpose: 'display' | 'userInput',
    precision = 2
): string {
    if (typeof amount !== 'number') return ''

    amount *= 100
    const numberString = round(amount, precision).toString()

    if (purpose === 'display') {
        return `${numberString.replace('-', '?')}%`
    }
    return numberString
}
