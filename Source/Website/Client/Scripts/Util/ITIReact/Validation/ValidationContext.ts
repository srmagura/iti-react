import * as React from 'react';

export interface IValidationContextData {
    loadingIndicatorComponent: React.StatelessComponent<{}>
}

export const ValidationContext = React.createContext<IValidationContextData>({
    loadingIndicatorComponent: () => null
})