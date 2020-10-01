import {
    CancellablePromise,
    buildCancellablePromise,
} from '@interface-technologies/iti-react-core'

export interface PermissionDto {
    name: string
    args: string[]
    isPermitted: boolean
}

export type GetPermissionsApiMethod = (q: string[]) => CancellablePromise<PermissionDto[]>

function getPermissionDtos<TQueryTuple extends unknown[]>(
    apiMethod: GetPermissionsApiMethod,
    queryTuples: TQueryTuple[]
): CancellablePromise<PermissionDto[]> {
    const queryTupleStrings = queryTuples.map((tuple) => {
        const stringArray = tuple.map((x) => {
            if (typeof x === 'undefined') return undefined
            if (typeof x === 'string') return x
            if (typeof x === 'object' && x !== null && Object.keys(x).includes('guid'))
                return (x as { guid: unknown }).guid

            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`Unexpected object in query tuple: ${x}.`)
        })

        return stringArray.join('+')
    })

    return apiMethod(queryTupleStrings)
}

export type ConvenientGet<TQueryTuple> = <
    T extends { [key: string]: TQueryTuple | undefined }
>(
    queryObj: T
) => CancellablePromise<{ [K in keyof T]: boolean }>

export function convenientGetFactory<TQueryTuple extends unknown[]>(
    apiMethod: GetPermissionsApiMethod
): ConvenientGet<TQueryTuple> {
    return <T>(queryObj: T) => {
        const queryTuples = Object.values(queryObj).filter(
            (v) => typeof v !== 'undefined'
        ) as TQueryTuple[]
        const promise = getPermissionDtos(apiMethod, queryTuples)

        return buildCancellablePromise(async (capture) => {
            const permissionDtos = await capture(promise)

            const obj: { [key: string]: boolean } = {}

            for (const [key, _queryTuple] of Object.entries(queryObj)) {
                const queryTuple = _queryTuple as TQueryTuple

                if (typeof queryTuple === 'undefined') {
                    obj[key] = false
                } else {
                    const permissionDto = permissionDtos.find(
                        (d) => d.name === queryTuple[0]
                    )
                    obj[key] = permissionDto ? permissionDto.isPermitted : false
                }
            }

            return obj as { [K in keyof T]: boolean }
        })
    }
}
