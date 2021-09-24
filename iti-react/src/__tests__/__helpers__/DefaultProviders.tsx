import {
    defaultItiReactCoreContextData,
    ItiReactCoreContext,
    ItiReactCoreContextData,
} from '@interface-technologies/iti-react-core'
import { PropsWithChildren } from 'hoist-non-react-statics/node_modules/@types/react'
import { ReactElement } from 'react'
import {
    ItiReactContext,
    defaultItiReactContextData,
    ItiReactContextData,
} from '../../ItiReactContext'

const itiReactContextData: ItiReactContextData = {
    ...defaultItiReactContextData,
    renderLoadingIndicator: () => <div>LOADING INDICATOR</div>,
    addressInput: {
        allowCanadian: true,
    },
    configurablePager: {
        pageSizes: [10, 25, 50],
    },
}

const itiReactCoreContextData: ItiReactCoreContextData = {
    onError: (e) => {
        throw e
    },
    useSimpleAutoRefreshQuery: {
        ...defaultItiReactCoreContextData.useSimpleAutoRefreshQuery,
        isConnectionError: () => false,
    },
}

export function DefaultProviders({ children }: PropsWithChildren<unknown>): ReactElement {
    return (
        <ItiReactContext.Provider value={itiReactContextData}>
            <ItiReactCoreContext.Provider value={itiReactCoreContextData}>
                {children}
            </ItiReactCoreContext.Provider>
        </ItiReactContext.Provider>
    )
}
