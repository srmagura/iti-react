"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.defaultITIReactContextData = {
    loadingIndicatorComponent: () => null,
    themeColors: {
        primary: '#007bff',
        danger: '#dc3545',
        success: '#28a745'
    }
};
exports.ITIReactContext = React.createContext(exports.defaultITIReactContextData);
//# sourceMappingURL=ITIReactContext.js.map