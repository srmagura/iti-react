import { getGuid } from '@interface-technologies/iti-react'
import { CancellablePromise } from 'real-cancellable-promise'
import {
    convenientGetFactory,
    PermissionDto,
    GetPermissionsApiMethod,
} from './convenientGet'
import { PermissionName, PermissionsQueryTuple } from './__testHelpers__'

test('convenientGet', async () => {
    const objectId = { guid: getGuid() }
    const projectId = 123

    const apiMethod: GetPermissionsApiMethod = (q: string[]) => {
        expect(q).toHaveLength(3)
        expect(q[0]).toBe(`CanViewAudit+${objectId.guid}`)
        expect(q[1]).toBe('CanViewAllNotifications')
        expect(q[2]).toBe(`CanViewProject+${projectId}`)

        return CancellablePromise.resolve<PermissionDto[]>([
            { name: PermissionName.CanViewAudit, args: [], isPermitted: true },
            {
                name: PermissionName.CanViewAllNotifications,
                args: [],
                isPermitted: false,
            },
            {
                name: PermissionName.CanViewProject,
                args: [],
                isPermitted: false,
            },
        ])
    }

    const convenientGet = convenientGetFactory<PermissionsQueryTuple>(apiMethod)

    const { canViewAudit, canViewAllNotifications, canViewProject } = await convenientGet(
        {
            canViewAudit: [PermissionName.CanViewAudit, objectId],
            canViewAllNotifications: [PermissionName.CanViewAllNotifications],
            canViewProject: [PermissionName.CanViewProject, projectId],
        }
    )

    expect(canViewAudit).toBe(true)
    expect(canViewAllNotifications).toBe(false)
    expect(canViewProject).toBe(false)
})
