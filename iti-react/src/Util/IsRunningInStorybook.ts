import { isRunningAsJestTest } from '@interface-technologies/iti-react-core'

export function isRunningInStorybook(): boolean {
    return Object.prototype.hasOwnProperty.call(window, '__STORYBOOK_ADDONS')
}

export function isRunningInStorybookOrJest(): boolean {
    return isRunningInStorybook() || isRunningAsJestTest()
}
