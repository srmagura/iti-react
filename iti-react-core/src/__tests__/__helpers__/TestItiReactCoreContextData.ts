import {
    ItiReactCoreContextData,
    defaultItiReactCoreContextData,
} from '../../ItiReactCoreContext'

export const testItiReactCoreContextData: ItiReactCoreContextData = {
    onError: (e) => {
        throw e
    },
    useSimpleAutoRefreshQuery: {
        ...defaultItiReactCoreContextData.useSimpleAutoRefreshQuery,
        isConnectionError: (e) => {
            throw new Error('not implemented')
        },
    },
}
