"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ITIReactContext_1 = require("../ITIReactContext");
const WithValidation_1 = require("./WithValidation");
exports.ValidationFeedback = props => {
    const { valid, showValidation, children, invalidFeedback, asyncValidationInProgress } = props;
    const LoadingIndicatorComponent = props.loadingIndicatorComponent;
    let feedback = null;
    if (showValidation && asyncValidationInProgress) {
        if (LoadingIndicatorComponent) {
            feedback = (React.createElement("div", { className: "in-progress-feedback" },
                React.createElement(LoadingIndicatorComponent, null),
                " Validating..."));
        }
        else {
            feedback = React.createElement("div", { className: "in-progress-feedback" }, "Validating...");
        }
    }
    else if (showValidation && !valid) {
        feedback = React.createElement("div", { className: "invalid-feedback" }, invalidFeedback);
    }
    return (React.createElement("div", null,
        children,
        feedback));
};
exports.ValidationFeedback.defaultProps = {
    asyncValidationInProgress: false
};
function getValidationClass(valid, showValidation) {
    if (showValidation) {
        if (valid)
            return 'is-valid';
        else
            return 'is-invalid';
    }
    return '';
}
exports.getValidationClass = getValidationClass;
class InputWithFeedback extends React.Component {
    constructor() {
        super(...arguments);
        this.onChange = e => {
            const value = e.currentTarget.value;
            const { onChange } = this.props;
            if (onChange)
                onChange(value);
        };
    }
    render() {
        let { name, type, value, valid, showValidation, invalidFeedback, inputAttributes, children, validationFeedbackComponent, formLevelValidatorOutput, asyncValidationInProgress } = this.props;
        type = type ? type.toLowerCase() : type;
        // only show form-level validation output if other validators return valid
        if (valid &&
            formLevelValidatorOutput &&
            !formLevelValidatorOutput.valid) {
            valid = formLevelValidatorOutput.valid;
            invalidFeedback = formLevelValidatorOutput.invalidFeedback;
        }
        const className = 'form-control ' + getValidationClass(valid, showValidation);
        let input;
        if (type === 'select') {
            input = (React.createElement("select", Object.assign({ name: name, className: className, value: value, onChange: this.onChange }, inputAttributes), children));
        }
        else if (type === 'textarea') {
            input = (React.createElement("textarea", Object.assign({ name: name, className: className, value: value, onChange: this.onChange }, inputAttributes)));
        }
        else {
            input = (React.createElement("input", Object.assign({ name: name, type: type, className: className, value: value, onChange: this.onChange }, inputAttributes)));
        }
        const ValidationFeedbackComponent = validationFeedbackComponent
            ? validationFeedbackComponent
            : exports.ValidationFeedback;
        return (React.createElement(ITIReactContext_1.ITIReactContext.Consumer, null, (data) => (React.createElement(ValidationFeedbackComponent, { valid: valid, showValidation: showValidation, invalidFeedback: invalidFeedback, asyncValidationInProgress: asyncValidationInProgress, loadingIndicatorComponent: data.loadingIndicatorComponent }, input))));
    }
}
InputWithFeedback.defaultProps = {
    type: 'text',
    inputAttributes: {}
};
exports.ValidatedInput = WithValidation_1.withValidation({
    defaultValue: ''
})(InputWithFeedback);
//# sourceMappingURL=ValidatedInput.js.map