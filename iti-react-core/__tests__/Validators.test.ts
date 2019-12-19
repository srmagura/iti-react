import 'jest'
import { Validators } from '../Validation'

test('Validators.number', () => {
    const v = Validators.number()

    expect(v('12').valid).toBe(true)
    expect(v('1').valid).toBe(true)
    expect(v('1.').valid).toBe(true)
    expect(v('1.1').valid).toBe(true)
    expect(v('0.1').valid).toBe(true)
    expect(v('-0.1').valid).toBe(true)
    expect(v('-.1').valid).toBe(true)
    expect(v('-1.1').valid).toBe(true)
    expect(v('').valid).toBe(true)

    expect(v('-').valid).toBe(false)
    expect(v('.').valid).toBe(false)
    expect(v('-.').valid).toBe(false)
    expect(v('12b').valid).toBe(false)
    expect(v('b12').valid).toBe(false)
    expect(v('1.2.3').valid).toBe(false)
    expect(v('1..00').valid).toBe(false)
})

describe('Validators.money', () => {
    test('allowNegative: false', () => {
        const v = Validators.money()

        expect(v('13').valid).toBe(true)
        expect(v('13.').valid).toBe(true)
        expect(v('123133.99').valid).toBe(true)
        expect(v('1.5').valid).toBe(true)
        expect(v('1.50').valid).toBe(true)
        expect(v('.5').valid).toBe(true)
        expect(v('.57').valid).toBe(true)
        expect(v('0').valid).toBe(true)
        expect(v('').valid).toBe(true)

        expect(v('-13').valid).toBe(false)
        expect(v('.').valid).toBe(false)
        expect(v('-.').valid).toBe(false)
        expect(v('1.2.3').valid).toBe(false)
        expect(v('1b').valid).toBe(false)
        expect(v('b1').valid).toBe(false)
        expect(v('1..00').valid).toBe(false)
        expect(v('1.555').valid).toBe(false)
        expect(v('1.5559').valid).toBe(false)
    })
})
