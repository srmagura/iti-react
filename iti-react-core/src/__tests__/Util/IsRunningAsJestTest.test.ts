import { isRunningAsJestTest } from '../../_Util'

test('isRunningAsJestTest', () => {
    expect(isRunningAsJestTest()).toBe(true)
})
