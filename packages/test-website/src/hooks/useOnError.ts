import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { onError } from '_Redux'

export function useOnError(): (e: unknown) => void {
    const dispatch = useDispatch()

    return useCallback((e: unknown) => dispatch(onError(e)), [dispatch])
}
