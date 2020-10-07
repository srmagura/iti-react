import { useEffect, useState, useRef, useMemo, useContext } from 'react'
import produce from 'immer'
import { useQuery, ItiReactCoreContext } from '@interface-technologies/iti-react-core'
import { ConvenientGet } from './ConvenientGet'

// Usage:
//
// const query = useMemo(() => ({
//     canViewAudit: [PermissionName.CanViewAudit]
// }), [])

// const { canViewAudit } = useAppPermissions(
//     query,
//     onReady: () => { /* ... */ },
// )
//

interface Options<T> {
    query: T
    onReady(permissions: { [K in keyof T]: boolean }): void
}

type UsePermissions<TQueryTuple> = <T extends { [key: string]: TQueryTuple | undefined }>(
    options: Options<T>
) => { [K in keyof T]: boolean }

/* eslint-disable react-hooks/rules-of-hooks -- does not understand the factory function */
export function usePermissionsFactory<TQueryTuple>(
    convenientGet: ConvenientGet<TQueryTuple>
): UsePermissions<TQueryTuple> {
    return <T extends { [key: string]: TQueryTuple | undefined }>({
        query,
        onReady,
    }: Options<T>) => {
        const { onError } = useContext(ItiReactCoreContext)
        const defaultValue: { [key: string]: boolean } = {}

        for (const key of Object.keys(query)) {
            defaultValue[key] = false
        }

        const [permissions, setPermissions] = useState<{ [K in keyof T]: boolean }>(
            defaultValue as { [K in keyof T]: boolean }
        )

        const onReadyRef = useRef(onReady)
        useEffect(() => {
            onReadyRef.current = onReady
        })

        const filteredQuery = useMemo(
            () =>
                produce(query, (draft) => {
                    const keys = Array.from(Object.keys(draft))

                    for (const key of keys) {
                        if (!draft[key]) delete draft[key]
                    }
                }),
            [query]
        )

        useQuery<T, { [K in keyof T]: boolean }>({
            queryParams: filteredQuery,
            query: convenientGet,
            shouldQueryImmediately: () => true,
            onResultReceived: (permissions) => {
                setPermissions(permissions)
                onReadyRef.current(permissions)
            },
            onError,
        })

        return permissions
    }
}