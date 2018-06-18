"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_confirm_1 = require("react-confirm");
const Dialog_1 = require("./Dialog");
// this is throwing a "DOMException failed to remove child" when performing the action.
// it's not actually causing any problems
class ConfirmDialogPresentation extends React.Component {
    constructor() {
        super(...arguments);
        this.proceedCalled = false;
        this.proceed = () => {
            this.proceedCalled = true;
            this.props.proceed();
        };
        this.dismiss = () => {
            if (!this.proceedCalled) {
                // important #1: we want to be able to await our confirm function, so call cancel
                // instead of dismiss so that closing the dialog results in the promise being rejected.
                // react-confirm does not resolve or reject if you call dismiss()
                //
                // important #2: don't call cancel if proceed has already been called.
                this.props.cancel();
            }
        };
    }
    render() {
        const { actionButtonText, actionButtonClass, show, confirmation } = this.props;
        const loading = this.props.loading;
        const dialogId = 'confirm-dialog';
        return (show && (React.createElement(Dialog_1.ActionDialog, { title: "Confirm", id: dialogId, onClose: this.dismiss, actionButtonText: actionButtonText, actionButtonClass: actionButtonClass, action: this.proceed, loading: loading }, confirmation)));
    }
}
ConfirmDialogPresentation.defaultProps = {
    loading: false
};
// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component
const ConfirmableDialog = react_confirm_1.confirmable(ConfirmDialogPresentation);
const _confirm = react_confirm_1.createConfirmation(ConfirmableDialog);
function confirm(confirmation, options) {
    return _confirm(Object.assign({}, options, { confirmation }));
}
exports.confirm = confirm;
exports.ConfirmDialog = props => {
    const { confirmation, proceed, cancel, actionButtonText, actionButtonClass, loading } = props;
    return (React.createElement(ConfirmDialogPresentation, { confirmation: confirmation, proceed: proceed, cancel: cancel, dismiss: () => {
            throw new Error('ConfirmDialogPresentation called dismiss(). This should never happen!');
        }, actionButtonText: actionButtonText, actionButtonClass: actionButtonClass, show: true, loading: loading }));
};
exports.ConfirmDialog.defaultProps = {
    loading: false
};
//# sourceMappingURL=Confirm.js.map