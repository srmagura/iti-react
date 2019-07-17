import { useEffect, useRef } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

type TError = any

interface ErrorRouteSynchronizerProps extends RouteComponentProps<any> {
    errorUrlParamName: string
    error: TError
}

function _ErrorRouteSynchronizer(props: ErrorRouteSynchronizerProps): null {
    const { location, history, errorUrlParamName, error } = props

    const urlSearchParams = new URLSearchParams(location.search)
    const errorUrlParamExists = urlSearchParams.has(errorUrlParamName)

    const prevError = useRef<TError | undefined>()

    useEffect(() => {
        if (error) {
            if (!prevError.current && !errorUrlParamExists) {
                // Add error URL param if an error was just set in the Redux state
                urlSearchParams.append(errorUrlParamName, '')

                // Push so that clicking back takes you to the page you were on
                history.push(location.pathname + '?' + urlSearchParams.toString())
            }
        } else {
            // Remove error URL param if no error in Redux state
            if (errorUrlParamExists) {
                urlSearchParams.delete(errorUrlParamName)
                history.replace(location.pathname + '?' + urlSearchParams.toString())
            }
        }

        prevError.current = error
    }, [error, errorUrlParamExists])

    return null
}

export const ErrorRouteSynchronizer = withRouter(_ErrorRouteSynchronizer)
