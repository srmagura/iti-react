import { PermissionName, Identity } from 'Models'
import { GlobalPermissions } from '_Redux/Auth/GlobalPermissions'
import { CancellablePromise } from 'real-cancellable-promise'
import { get } from './ApiUtil'
import {
    GetPermissionsApiMethod,
    PermissionDto,
    convenientGetFactory,
} from '@interface-technologies/permissions'

export type AppPermissionsQueryTuple =
    | [PermissionName.CanViewOrders]
    | [PermissionName.CanManageOrders]
    | [PermissionName.CanManageCustomer, Identity]
    | [PermissionName.CanManageVendor, Identity]
    | [PermissionName.CanManageCustomerVendorMap, Identity, Identity]

const apiMethod: GetPermissionsApiMethod = (q) =>
    get<PermissionDto[]>('api/appPermissions/get', {
        q,
    })
const convenientGet = convenientGetFactory<AppPermissionsQueryTuple>(apiMethod)

function getGlobalPermissions(): CancellablePromise<GlobalPermissions> {
    return convenientGet({
        canViewOrders: [PermissionName.CanViewOrders],
        canManageOrders: [PermissionName.CanManageOrders],
    })
}

export const appPermissionsApi = {
    get: convenientGet,
    getGlobalPermissions,
}
