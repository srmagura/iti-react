import { isRunningAsJestTest } from '@interface-technologies/iti-react-core'

export function isRunningInStorybook(): boolean {
    return process?.env?.STORYBOOK === 'true' ?? false
}

export function isRunningInStorybookOrJest(): boolean {
    return isRunningInStorybook() || isRunningAsJestTest()
}
