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
})
