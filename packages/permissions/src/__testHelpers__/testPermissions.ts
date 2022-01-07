export enum PermissionName {
    CanViewAudit = 'CanViewAudit',
    CanViewVendor = 'CanViewVendor',
    CanViewAllNotifications = 'CanViewAllNotifications',
    CanViewProject = 'CanViewProject',
}

export type PermissionsQueryTuple =
    | [PermissionName.CanViewAllNotifications]
    | [PermissionName.CanViewAudit, { guid: string }]
    | [PermissionName.CanViewVendor, { guid: string }]
    | [PermissionName.CanViewProject, number]
