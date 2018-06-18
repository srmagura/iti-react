"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const __1 = require("../..");
const react_select_1 = require("react-select");
const ValidatedSelect_1 = require("./ValidatedSelect");
class _ValidatedSelect extends React.Component {
    constructor() {
        super(...arguments);
        this.onChange = (options) => {
            const { onChange } = this.props;
            if (options) {
                const newValue = options.map(o => o.value);
                onChange(newValue);
            }
        };
    }
    render() {
        const { options, value, valid, invalidFeedback, showValidation, name, isClearable, placeholder } = this.props;
        const nonGroupOptions = ValidatedSelect_1.getNonGroupOptions(options);
        const selectedValues = new Set(value);
        const selectedOptions = nonGroupOptions.filter(o => selectedValues.has(o.value));
        return (React.createElement(__1.ValidationFeedback, { valid: valid, invalidFeedback: invalidFeedback, showValidation: showValidation },
            React.createElement(react_select_1.default, { name: name, options: options, placeholder: placeholder, value: selectedOptions, onChange: this.onChange, isClearable: isClearable, styles: ValidatedSelect_1.getSelectStyles(valid, showValidation), isMulti: true })));
    }
}
const defaultValue = [];
const options = {
    defaultValue
};
exports.ValidatedMultiSelect = __1.withValidation(options)(_ValidatedSelect);
//# sourceMappingURL=ValidatedMultiSelect.js.map