import { renderHook } from '@testing-library/react-hooks'
import {
    getGuid,
    ItiReactCoreContext,
    defaultItiReactCoreContextData,
    ItiReactCoreContextData,
} from '@interface-technologies/iti-react-core'
import { omit } from 'lodash'
import { CancellablePromise } from 'real-cancellable-promise'
import {
    waitForHookUpdates,
    PermissionName,
    PermissionsQueryTuple,
} from './__TestHelpers__'
import { usePermissionsFactory } from './UsePermissions'
import { ConvenientGet } from './ConvenientGet'

const itiReactCoreContextData: ItiReactCoreContextData = {
    onError: (e) => {
        throw e
    },
    useSimpleAutoRefreshQuery: {
        ...defaultItiReactCoreContextData.useSimpleAutoRefreshQuery,
        isConnectionError: () => false,
    },
}

it('loads permissions', async () => {
    const onReady = jest.fn()

    const query = {
        canViewAudit: [
            PermissionName.CanViewAudit,
            { guid: getGuid() },
        ] as PermissionsQueryTuple,
        canViewAllNotifications: [
            PermissionName.CanViewAllNotifications,
        ] as PermissionsQueryTuple,
        canViewVendor: undefined,
    }

    const convenientGet: ConvenientGet<PermissionsQueryTuple> = (_query) => {
        expect(_query).toEqual(omit(query, 'canViewVendor'))

        const result = {
            canViewAudit: true,
            canViewAllNotifications: false,
            canViewVendor: false,
        } as unknown as { [K in keyof typeof _query]: boolean }

        return CancellablePromise.resolve(result)
    }

    const usePermissions = usePermissionsFactory(convenientGet)

    const { result } = renderHook(
        () =>
            usePermissions({
                query,
                onReady,
            }),
        {
            wrapper: ({ children }) => (
                <ItiReactCoreContext.Provider value={itiReactCoreContextData}>
                    {children}
                </ItiReactCoreContext.Provider>
            ),
        }
    )

    expect(onReady).not.toHaveBeenCalled()
    expect(result.current).toEqual({
        canViewAudit: false,
        canViewAllNotifications: false,
        canViewVendor: false,
    })

    await waitForHookUpdates()
    expect(onReady).toHaveBeenCalled()
    expect(result.current).toEqual({
        canViewAudit: true,
        canViewAllNotifications: false,
        canViewVendor: false,
    })
})
