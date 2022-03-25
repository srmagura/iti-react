import { CancellablePromise, buildCancellablePromise } from 'real-cancellable-promise'

export interface PermissionDto {
    name: string
    args: string[]
    isPermitted: boolean
}

export type GetPermissionsApiMethod = (q: string[]) => CancellablePromise<PermissionDto[]>

function getQueryTupleString(tuple: unknown[]): string {
    const stringArray: string[] = tuple
        .filter((x) => typeof x !== 'undefined' && x !== null)
        .map((x) => {
            if (typeof x === 'string') return x
            if (typeof x === 'number') return x.toString()
            if (typeof x === 'object' && x !== null && Object.keys(x).includes('guid'))
                return (x as { guid: string }).guid

            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`Unexpected object in query tuple: ${x}.`)
        })

    return stringArray.join('+')
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

        const queryTupleStrings = queryTuples.map(getQueryTupleString)
        const promise = apiMethod(queryTupleStrings)

        return buildCancellablePromise(async (capture) => {
            const permissionDtos = await capture(promise)

            const obj: { [key: string]: boolean } = {}

            for (const [key, _queryTuple] of Object.entries(queryObj)) {
                const queryTuple = _queryTuple as TQueryTuple

                if (typeof queryTuple === 'undefined') {
                    obj[key] = false
                } else {
                    const permissionDto = permissionDtos.find(
                        (d) =>
                            getQueryTupleString(queryTuple) ===
                            getQueryTupleString([d.name, ...d.args])
                    )
                    obj[key] = permissionDto ? permissionDto.isPermitted : false
                }
            }

            return obj as { [K in keyof T]: boolean }
        })
    }
}
