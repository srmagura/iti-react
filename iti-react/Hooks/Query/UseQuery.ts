import { CancellablePromise } from '@interface-technologies/iti-react-core'
import { useParameterizedQuery } from './UseParameterizedQuery'

// Outside of useQuery to keep a stable identity
const emptyQueryParams = {}

// useParameterizedQuery, without the QueryParams
export function useQuery<TResult>(options: {
    query(): CancellablePromise<TResult>

    onResultReceived(result: TResult): void
    onLoadingChange?(loading: boolean): void
    onError(e: any): void
}) {
    const { query, onResultReceived, onLoadingChange, onError } = options

    return useParameterizedQuery<{}, TResult>({
        queryParams: emptyQueryParams,
        query,
        shouldQueryImmediately: () => true,

        onResultReceived,
        onLoadingChange,
        onError
    })
}
