// Great for React keys when there is no database ID that can be used
export function getRandomId() {
    function getBase36Int() {
        // Random number has ~15 good digits
        return Math.floor(Math.random() * 1e14).toString(36)
    }

    // Approx 18**36 values... more than a GUID, which is 16**32
    return getBase36Int() + getBase36Int()
}
