"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const input_format_1 = require("input-format");
const Validation_1 = require("../Validation");
const WithValidation_1 = require("../Validation/WithValidation");
/* This code should handle a variety of US phone number formats:
 * - with or without country code 1
 * - with or without leading +
 * - less than the required number of digits
 * - with or without punctuation
 */
const visibleLen = 10;
const lenWithCountryCode = visibleLen + 1;
function normalizePhoneNumber(phoneNumber) {
    let num = phoneNumber.replace(/[^0-9]/g, '');
    if (num.length > 0 && num[0] !== '1')
        num = '1' + num;
    if (num.length > lenWithCountryCode) {
        num = num.substring(0, lenWithCountryCode);
    }
    return num;
}
const template = '(xxx) xxx-xxxx';
const parser = input_format_1.templateParser(template, input_format_1.parseDigit);
const formatter = input_format_1.templateFormatter(template);
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber)
        return '';
    const normalized = normalizePhoneNumber(phoneNumber);
    let noCountry = normalized;
    if (noCountry.length > 0 && noCountry[0] === '1') {
        noCountry = noCountry.substring(1);
    }
    return formatter(noCountry).text;
}
exports.formatPhoneNumber = formatPhoneNumber;
class _PhoneInput extends React.Component {
    constructor() {
        super(...arguments);
        this.onChange = newValue => {
            const { onChange } = this.props;
            newValue = newValue ? normalizePhoneNumber(newValue) : '';
            onChange(newValue);
        };
    }
    render() {
        const { value, valid, invalidFeedback, showValidation, name, inputAttributes } = this.props;
        const normalized = normalizePhoneNumber(value);
        let noCountryCode = normalized;
        if (normalized.length > 0) {
            noCountryCode = normalized.substring(1);
        }
        return (React.createElement(Validation_1.ValidationFeedback, { showValidation: showValidation, valid: valid, invalidFeedback: invalidFeedback },
            React.createElement("input", { name: name, value: normalized, type: "hidden" }),
            React.createElement(input_format_1.ReactInput, Object.assign({ name: name + '__display', onChange: this.onChange, value: noCountryCode, parse: parser, format: formatter, className: 'form-control ' +
                    Validation_1.getValidationClass(valid, showValidation) }, inputAttributes))));
    }
}
_PhoneInput.defaultProps = {
    inputAttributes: {}
};
exports._PhoneInput = _PhoneInput;
const PhoneInputWithValidation = WithValidation_1.withValidation({
    defaultValue: ''
})(_PhoneInput);
const phoneNumberValidator = (value) => ({
    valid: !value || normalizePhoneNumber(value).length === lenWithCountryCode,
    invalidFeedback: `The phone number must have exactly ${visibleLen} digits.`
});
function PhoneInput(props) {
    const validators = [phoneNumberValidator].concat(props.validators);
    return React.createElement(PhoneInputWithValidation, Object.assign({}, props, { validators: validators }));
}
exports.PhoneInput = PhoneInput;
//# sourceMappingURL=PhoneInput.js.map