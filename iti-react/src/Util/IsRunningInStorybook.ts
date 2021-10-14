import { isRunningAsJestTest } from '@interface-technologies/iti-react-core'

export function isRunningInStorybook(): boolean {
    return typeof process?.env?.STORYBOOK !== 'undefined'
}

export function isRunningInStorybookOrJest(): boolean {
    return isRunningInStorybook() || isRunningAsJestTest()
}
