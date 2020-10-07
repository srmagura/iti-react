import { CancellablePromise, getGuid } from '@interface-technologies/iti-react-core'
import {
    convenientGetFactory,
    PermissionDto,
    GetPermissionsApiMethod,
} from '../ConvenientGet'
import { PermissionName, PermissionsQueryTuple } from './__helpers__'

test('convenientGet', async () => {
    const id = { guid: getGuid() }

    const apiMethod: GetPermissionsApiMethod = (q: string[]) => {
        expect(q).toHaveLength(2)
        expect(q[0]).toBe(`CanViewAudit+${id.guid}`)
        expect(q[1]).toBe('CanViewAllNotifications')

        return CancellablePromise.resolve<PermissionDto[]>([
            { name: PermissionName.CanViewAudit, args: [], isPermitted: true },
            {
                name: PermissionName.CanViewAllNotifications,
                args: [],
                isPermitted: false,
            },
        ])
    }

    const convenientGet = convenientGetFactory<PermissionsQueryTuple>(apiMethod)

    const { canViewAudit, canViewAllNotifications } = await convenientGet({
        canViewAudit: [PermissionName.CanViewAudit, id],
        canViewAllNotifications: [PermissionName.CanViewAllNotifications],
    })

    expect(canViewAudit).toBe(true)
    expect(canViewAllNotifications).toBe(false)
})