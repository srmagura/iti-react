type NoOptionsMessage = (obj: { inputValue: string }) => string

export const AsyncSelectUtil = {
    getPlaceholder: (entityNamePlural: string): string => {
        return `Search ${entityNamePlural}...`
    },
    getNoOptionsMessage: (entityNamePlural: string): NoOptionsMessage => {
        return ({ inputValue }): string =>
            inputValue
                ? `No ${entityNamePlural} matched your search`
                : `Begin typing to see matching ${entityNamePlural}`
    }
}
