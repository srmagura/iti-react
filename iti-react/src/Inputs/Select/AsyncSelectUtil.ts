type NoOptionsMessage = (obj: { inputValue: string }) => string

export const AsyncSelectUtil = {
    /** @returns e.g. "Search users..." */
    getPlaceholder: (entityNamePlural: string): string => `Search ${entityNamePlural}...`,

    /** @returns e.g. "No users matched your search" or "Begin typing to see matching users" */
    getNoOptionsMessage:
        (entityNamePlural: string): NoOptionsMessage =>
        ({ inputValue }): string =>
            inputValue
                ? `No ${entityNamePlural} matched your search`
                : `Begin typing to see matching ${entityNamePlural}`,
}
