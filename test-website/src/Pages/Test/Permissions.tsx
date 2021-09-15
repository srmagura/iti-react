import React, { useState, useMemo } from 'react'
import { PageProps } from 'Components/Routing'
import {
    useSimpleParameterlessQuery,
    useReadiness,
    allReady,
    FormCheck,
    useSimpleQuery,
    getGuid,
} from '@interface-technologies/iti-react'
import { GlobalPermissions } from '_Redux/Auth/GlobalPermissions'
import { api } from 'Api'
import { NavbarLink } from 'Components'
import { Identity, PermissionName } from 'Models'
import { usePermissions } from 'Components/Hooks'
import { AppPermissionsQueryTuple } from 'Api/AppPermissionsApi'

export default function Page({ ready, onReady, onError }: PageProps): React.ReactElement {
    const [onChildReady] = useReadiness(
        { globalPermissions: false, convenientGet: false, usePermissions: true },
        (readiness) => {
            if (allReady(readiness)) {
                onReady({ title: 'Permissions', activeNavbarLink: NavbarLink.Index })
            }
        }
    )

    const [globalPermissions, setGlobalPermissions] = useState<GlobalPermissions>()

    useSimpleParameterlessQuery<GlobalPermissions>({
        query: api.appPermissions.getGlobalPermissions,
        onResultReceived: (globalPermissions) => {
            setGlobalPermissions(globalPermissions)
            onChildReady({ globalPermissions: true })
        },
        onError,
    })

    const [allowedCustomerId, setAllowedCustomerId] = useState(true)
    const [allowedVendorId, setAllowedVendorId] = useState(true)

    const customerId: Identity = useMemo(
        () =>
            allowedCustomerId
                ? { guid: '643534f0-af21-41b1-b7f2-3e76cc407dcc' }
                : {
                      guid: '00000000-0000-0000-0000-000000000000',
                  },
        [allowedCustomerId]
    )
    const vendorId: Identity = useMemo(
        () =>
            allowedVendorId
                ? { guid: '7f1e6ef0-4559-4d6a-b3df-f78e66ceaf76' }
                : {
                      guid: '00000000-0000-0000-0000-000000000000',
                  },
        [allowedVendorId]
    )

    const [canManageCustomer, setCanManageCustomer] = useState<boolean>()

    useSimpleQuery<Identity, { canManageCustomer: boolean }>({
        queryParams: customerId,
        query: (customerId) =>
            api.appPermissions.get({
                canManageCustomer: [PermissionName.CanManageCustomer, customerId],
            }),
        shouldQueryImmediately: () => true,
        onResultReceived: ({ canManageCustomer }) => {
            setCanManageCustomer(canManageCustomer)
            onChildReady({ convenientGet: true })
        },
        onError,
    })

    const permissionsQuery = useMemo(
        () => ({
            canManageVendor: [
                PermissionName.CanManageVendor,
                vendorId,
            ] as AppPermissionsQueryTuple,
            canManageCustomerVendorMap: [
                PermissionName.CanManageCustomerVendorMap,
                customerId,
                vendorId,
            ] as AppPermissionsQueryTuple,
        }),
        [customerId, vendorId]
    )

    const { canManageVendor, canManageCustomerVendorMap } = usePermissions({
        query: permissionsQuery,
        onReady: () => onChildReady({ usePermissions: true }),
    })

    return (
        <div className="page-test-permissions" hidden={!ready}>
            <div className="heading-row">
                <h1>Permissions</h1>
            </div>
            <h4>Global Permissions</h4>
            <p className="mb-0">
                canViewOrders: {globalPermissions?.canViewOrders.toString()}
            </p>
            <p>canManageOrders: {globalPermissions?.canManageOrders.toString()}</p>
            <h4>Non-Global Permissions</h4>
            <div className="mb-3">
                <FormCheck
                    checked={allowedCustomerId}
                    onChange={() => setAllowedCustomerId((b) => !b)}
                    label="Allowed customer ID"
                />
                <FormCheck
                    checked={allowedVendorId}
                    onChange={() => setAllowedVendorId((b) => !b)}
                    label="Allowed vendor ID"
                />
            </div>
            <h6>convenientGet</h6>
            <p>canManageCustomer: {canManageCustomer?.toString()}</p>
            <h6>useAppPermissions</h6>
            <p className="mb-0">canManageVendor: {canManageVendor.toString()}</p>
            <p>canManageCustomerVendorMap: {canManageCustomerVendorMap.toString()}</p>
        </div>
    )
}
