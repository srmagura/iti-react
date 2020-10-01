export enum PermissionName {
    CanViewAudit = 'CanViewAudit',
    CanViewVendor = 'CanViewVendor',
    CanViewAllNotifications = 'CanViewAllNotifications',
}

export type PermissionsQueryTuple =
    | [PermissionName.CanViewAllNotifications]
    | [PermissionName.CanViewAudit, { guid: string }]
    | [PermissionName.CanViewVendor, { guid: string }]
