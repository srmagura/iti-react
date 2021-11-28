import { postalCodeValidator } from './postalCodeValidator'

describe('postalCodeValidator', () => {
    it('is valid if the postal code is empty', () => {
        expect(postalCodeValidator()('')).toBeFalsy()
    })
})
