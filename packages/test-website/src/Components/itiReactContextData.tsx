import {
    defaultItiReactContextData,
    defaultItiReactCoreContextData,
    ItiReactContextData,
    ItiReactCoreContextData,
} from '@interface-technologies/iti-react'
import { Dispatch } from 'redux'
import { onError } from '_Redux'
import { LoadingIcon } from './Icons'

export const itiReactContextData: ItiReactContextData = {
    ...defaultItiReactContextData,
    renderLoadingIndicator: () => <LoadingIcon />,
    addressInput: { allowCanadian: true },
    configurablePager: { pageSizes: [10, 25, 50] },
}

export function getItiReactCoreContextData(dispatch: Dispatch): ItiReactCoreContextData {
    return {
        onError: (e) => dispatch(onError(e)),
        useSimpleAutoRefreshQuery: {
            ...defaultItiReactCoreContextData.useSimpleAutoRefreshQuery,
            isConnectionError: () => false,
        },
    }
}
