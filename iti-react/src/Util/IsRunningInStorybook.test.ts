import { isRunningInStorybook, isRunningInStorybookOrJest } from '.'

test('isRunningInStorybook', () => {
    expect(isRunningInStorybook()).toBe(false)
})

test('isRunningInStorybookOrJest', () => {
    expect(isRunningInStorybookOrJest()).toBe(true)
})
