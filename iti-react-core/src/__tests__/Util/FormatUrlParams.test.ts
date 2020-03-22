import { formatUrlParams } from '../../_Util'

it('serializes arrays', () => {
    const formatted = formatUrlParams({ userIds: [1, 2, 3] })
    expect(formatted).toBe('?userIds=1&userIds=2&userIds=3')
})
