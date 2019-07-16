import { useEffect, useRef } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { UrlParamName } from 'Components/Constants'
import { IError, errorSelector } from '_Redux'
import { useSelector } from 'react-redux'

function _ErrorRouteSynchronizer(props: RouteComponentProps<any>) {
    const { location, history } = props

    const error = useSelector(errorSelector)

    const urlSearchParams = new URLSearchParams(location.search)
    const errorUrlParamExists = urlSearchParams.has(UrlParamName.Error)

    const prevError = useRef<IError | undefined>()
    const prevErrorUrlParamExists = useRef<boolean | undefined>()

    useEffect(() => {
        if (error) {
            if (!errorUrlParamExists) {
                // Add error URL param if an error was just set in the Redux state
                urlSearchParams.append(UrlParamName.Error, '')

                // Push so that clicking back takes you to the page you were on
                history.push(location.pathname + '?' + urlSearchParams.toString())
            }
        } else {
            // Remove error URL param if no error in Redux state
            if (errorUrlParamExists) {
                urlSearchParams.delete(UrlParamName.Error)
                history.replace(location.pathname + '?' + urlSearchParams.toString())
            }
        }

        prevError.current = error
        prevErrorUrlParamExists.current = errorUrlParamExists
    }, [error, errorUrlParamExists])

    return null
}

export const ErrorRouteSynchronizer = withRouter(_ErrorRouteSynchronizer)
