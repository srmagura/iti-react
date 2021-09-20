import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { waitForHookUpdates, PermissionName, PermissionsQueryTuple } from './__helpers__'
import {
    getGuid,
    ItiReactCoreContext,
    defaultItiReactCoreContextData,
    ItiReactCoreContextData,
} from '@interface-technologies/iti-react-core'
import { omit } from 'lodash'
import { usePermissionsFactory } from '../UsePermissions'
import { ConvenientGet } from '../ConvenientGet'
import { CancellablePromise } from 'real-cancellable-promise'

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

//it('requeries when query object changes', async () => {
//    const onReady = jest.fn()
//    const allowedCustomerId = getId()
//    const deniedCustomerId = getId()
//
//    let query = {
//        canViewCustomer: [
//            PermissionName.CanViewCustomer,
//            deniedCustomerId,
//        ] as AppPermissionsQueryTuple,
//    }
//
//    api.appPermissions.get.mockImplementation((query) => {
//        const customerId = (query as any).canViewCustomer[1]
//
//        return CancellablePromise.resolve({
//            canViewCustomer: customerId.guid === allowedCustomerId.guid,
//        })
//    })
//
//    const { result, rerender } = renderHook(
//        () =>
//            useAppPermissions({
//                query,
//                onReady,
//            }),
//        {
//            wrapper: ({ children }) => (
//                <DefaultProviders storeType="cds">{children}</DefaultProviders>
//            ),
//        }
//    )
//    await waitForHookUpdates()
//
//    expect(result.current).toEqual({
//        canViewCustomer: false,
//    })
//
//    query = {
//        canViewCustomer: [
//            PermissionName.CanViewCustomer,
//            allowedCustomerId,
//        ] as AppPermissionsQueryTuple,
//    }
//    rerender()
//    await waitForHookUpdates()
//
//    expect(result.current).toEqual({
//        canViewCustomer: true,
//    })
//    expect(api.appPermissions.get).toHaveBeenCalled()
//})
//
