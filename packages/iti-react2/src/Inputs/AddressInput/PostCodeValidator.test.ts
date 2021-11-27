import { postalCodeValidator } from './PostalCodeValidator'

describe('postalCodeValidator', () => {
    it('is valid if the postal code is empty', () => {
        expect(postalCodeValidator()('')).toBeFalsy()
    })
})
