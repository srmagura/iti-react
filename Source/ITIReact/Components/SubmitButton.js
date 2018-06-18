"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ITIReactContext_1 = require("../ITIReactContext");
/* Submit button/link that displays a loading indicator and disables the onClick handler
 * when submitting=true. */
function SubmitButtonCore(props) {
    let { submitting, children, onClick, onClickEnabled, enabled, element, className, loadingIndicatorComponent } = props, passThroughProps = __rest(props, ["submitting", "children", "onClick", "onClickEnabled", "enabled", "element", "className", "loadingIndicatorComponent"]);
    const LoadingIndicator = props.loadingIndicatorComponent;
    // Default values
    if (!element)
        element = 'button';
    if (typeof enabled === 'undefined')
        enabled = true;
    if (typeof onClickEnabled === 'undefined')
        onClickEnabled = true;
    if (submitting || !enabled) {
        onClickEnabled = false;
    }
    if (!onClickEnabled) {
        onClick = undefined;
    }
    if (typeof className === 'undefined') {
        className = '';
    }
    className += ' submit-button';
    if (!enabled) {
        className += ' disabled';
    }
    if (element === 'button') {
        return (React.createElement("button", Object.assign({}, passThroughProps, { className: className, onClick: onClick }),
            submitting ? (React.createElement("span", { className: "hidden-label" }, children)) : (children),
            submitting && (React.createElement("div", { className: "loading-icon-container" },
                React.createElement(LoadingIndicator, null)))));
    }
    else {
        return (React.createElement("a", Object.assign({}, passThroughProps, { className: className, href: "javascript:void(0)", onClick: onClick }),
            children,
            submitting && (React.createElement("span", null,
                ' ',
                React.createElement(LoadingIndicator, null)))));
    }
}
function SubmitButton(props) {
    return (React.createElement(ITIReactContext_1.ITIReactContext.Consumer, null, data => (React.createElement(SubmitButtonCore, Object.assign({}, props, { loadingIndicatorComponent: data.loadingIndicatorComponent })))));
}
exports.SubmitButton = SubmitButton;
//# sourceMappingURL=SubmitButton.js.map