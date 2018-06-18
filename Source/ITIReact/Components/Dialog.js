"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const SubmitButton_1 = require("./SubmitButton");
// FYI: you can still close a modal with loading=true by focusing one of the fields and pressing escape.
// Ideally we should prevent this, white still letting escape close the dialog if loading=false.
exports.ActionDialog = props => {
    const { actionButtonText, actionButtonClass, action, loading, id, title, modalClass, onClose, children, focusFirst, actionButtonEnabled } = props;
    const footer = [
        React.createElement(SubmitButton_1.SubmitButton, { type: "button", onClick: action, className: `btn ${actionButtonClass}`, submitting: loading, enabled: actionButtonEnabled, key: "action" }, actionButtonText),
        React.createElement("button", { type: "button", className: "btn btn-secondary", "data-dismiss": loading ? '' : 'modal', key: "cancel" }, "Cancel")
    ];
    return (React.createElement(Dialog, { id: id, title: title, modalClass: modalClass, modalFooter: footer, onClose: onClose, children: children, focusFirst: focusFirst, allowDismiss: !loading }));
};
exports.ActionDialog.defaultProps = {
    actionButtonClass: 'btn-primary',
    actionButtonEnabled: true
};
// Wrapper around Bootstrap 4 dialog
class Dialog extends React.Component {
    componentDidMount() {
        const { id, focusFirst, onClose } = this.props;
        const el = $('#' + id);
        el.modal({ backdrop: 'static' });
        el.on('hidden.bs.modal', onClose);
        // Focus the first field. autofocus attribute does not work in Bootstrap modals
        if (focusFirst) {
            el.on('shown.bs.modal', () => {
                const firstInput = el
                    .find('input, select, textarea')
                    .filter(':not([readonly])')
                    .filter(':not([type="hidden"])')
                    .first();
                if (firstInput.attr('type') !== 'radio') {
                    firstInput.focus();
                }
            });
        }
    }
    render() {
        const { allowDismiss, modalClass, modalFooter, title, id, children } = this.props;
        return (React.createElement("div", { id: id, className: "modal fade", role: "dialog" },
            React.createElement("div", { className: 'modal-dialog ' + modalClass, role: "document" },
                React.createElement("div", { className: "modal-content" },
                    React.createElement("div", { className: "modal-header" },
                        React.createElement("h5", { className: "modal-title" }, title),
                        React.createElement("button", { type: "button", className: "close", "data-dismiss": allowDismiss ? 'modal' : undefined, "aria-label": "Close" },
                            React.createElement("span", { "aria-hidden": "true" }, "\u00D7"))),
                    React.createElement("div", { className: "modal-body" }, children),
                    modalFooter && (React.createElement("div", { className: "modal-footer" }, modalFooter))))));
    }
    componentWillUnmount() {
        ;
        $('.modal').modal('hide');
        // This is necessary to remove the backdrop if the dialog calls onError in
        // componentDidMount()
        $('.modal-backdrop').remove();
    }
}
Dialog.defaultProps = {
    modalClass: '',
    focusFirst: true,
    allowDismiss: true
};
exports.Dialog = Dialog;
//# sourceMappingURL=Dialog.js.map