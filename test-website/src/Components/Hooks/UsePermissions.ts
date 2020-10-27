import { api } from 'Api'
import { AppPermissionsQueryTuple } from 'Api/AppPermissionsApi'
import { usePermissionsFactory } from '@interface-technologies/permissions'

export const usePermissions = usePermissionsFactory<AppPermissionsQueryTuple>(
    api.appPermissions.get
)
