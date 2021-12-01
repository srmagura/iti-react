export function requireOption(name: string, value: unknown): void {
    if (value === null || typeof value === 'undefined') {
        throw new Error(
            '@interface-technologies/webpack-config: ' +
                `Missing required option \`${name}\`.`
        )
    }
}
