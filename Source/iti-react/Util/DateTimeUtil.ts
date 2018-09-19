//
// Time conversion functions
//

// Expects hours and minutes to be integers
export function toDecimalHours(hours: number, minutes: number): number {
    return hours + minutes / 60
}

// Always returns integers
export function toHoursAndMinutes(
    decimalHours: number
): { hours: number; minutes: number } {
    const hours = Math.floor(decimalHours)
    const hoursDecimalPart = decimalHours % 1

    const decimalMinutes = hoursDecimalPart * 60
    const minutes = Math.round(decimalMinutes)

    return { hours, minutes }
}
