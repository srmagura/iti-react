import { isRunningAsJestTest } from './isRunningAsJestTest'

test('isRunningAsJestTest', () => {
    expect(isRunningAsJestTest()).toBe(true)
})
