import {
    ItiReactCoreContextData,
    defaultItiReactCoreContextData,
} from '../../ItiReactCoreContext'

export const testItiReactCoreContextData: ItiReactCoreContextData = {
    onError: (e) => {
        throw e
    },
    useAutoRefreshQuery: {
        ...defaultItiReactCoreContextData.useAutoRefreshQuery,
        isConnectionError: (e) => {
            throw new Error('not implemented')
        },
    },
}
