import { getGuid } from './getGuid'

it('generates a GUID', () => {
    expect(getGuid()).toHaveLength(36)
})
