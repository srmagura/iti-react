import * as React from 'react';

export interface IITIReactContextData {
    loadingIndicatorComponent: React.StatelessComponent<{}>
}

export const ITIReactContext = React.createContext<IITIReactContextData>({
    loadingIndicatorComponent: () => null
})