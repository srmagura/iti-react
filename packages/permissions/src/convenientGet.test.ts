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
            {
                name: PermissionName.CanViewAudit,
                args: [objectId.guid],
                isPermitted: true,
            },
            {
                name: PermissionName.CanViewAllNotifications,
                args: [],
                isPermitted: false,
            },
            {
                name: PermissionName.CanViewProject,
                args: [projectId.toString()],
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

test('convenientGet with duplicate names', async () => {
    const projectId1 = 1
    const projectId2 = 2

    const apiMethod: GetPermissionsApiMethod = (q: string[]) => {
        expect(q).toHaveLength(2)
        expect(q[0]).toBe(`CanViewProject+${projectId1}`)
        expect(q[1]).toBe(`CanViewProject+${projectId2}`)

        return CancellablePromise.resolve<PermissionDto[]>([
            {
                name: PermissionName.CanViewProject,
                args: [projectId1.toString()],
                isPermitted: false,
            },
            {
                name: PermissionName.CanViewProject,
                args: [projectId2.toString()],
                isPermitted: true,
            },
        ])
    }

    const convenientGet = convenientGetFactory<PermissionsQueryTuple>(apiMethod)

    const { canViewProject1, canViewProject2 } = await convenientGet({
        canViewProject1: [PermissionName.CanViewProject, projectId1],
        canViewProject2: [PermissionName.CanViewProject, projectId2],
    })

    expect(canViewProject1).toBe(false)
    expect(canViewProject2).toBe(true)
})
