import { filterOption } from '../../../Inputs'

const options = [
    { value: '1', label: 'blue', data: {} },
    { value: '2', label: 'purple', data: {} },
]

describe('filterOption', () => {
    it('searches label', () => {
        expect(filterOption(options[0], 'blu')).toBe(true)
        expect(filterOption(options[1], 'blu')).toBe(false)
    })

    it('does not search value', () => {
        expect(filterOption(options[0], '1')).toBe(false)
    })
})
