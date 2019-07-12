import * as React from 'react'
import { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { UrlParamName } from 'Components/Constants'
import {
    AppState,
    errorActions,
    processError,
    IError,
    ErrorType,
    errorSelector,
    ItiAction
} from '_Redux'
import { connect, useDispatch, useSelector } from 'react-redux'
import { nullToUndefined } from '@interface-technologies/iti-react'
import { Dispatch } from 'redux'

function _ErrorRouteSynchronizer(props: RouteComponentProps<any>) {
    const { location, history } = props

    const error = useSelector(errorSelector)
    const dispatch = useDispatch()

    const urlSearchParams = new URLSearchParams(location.search)
    const errorUrlParamExists = () => urlSearchParams.has(UrlParamName.Error)

    // Add error URL param if there is an error in the Redux state
    useEffect(() => {
        if (error && !errorUrlParamExists()) {
            urlSearchParams.append(UrlParamName.Error, '')

            // Push so that clicking back takes you to the page you were on
            history.push(location.pathname + '?' + urlSearchParams.toString())
        }
    }, [error])

    // Remove error URL param if no error in Redux state
    useEffect(() => {
        if (errorUrlParamExists() && !error) {
            urlSearchParams.delete(UrlParamName.Error)
            history.replace(location.pathname + '?' + urlSearchParams.toString())
        }
    }, [error])

    // Clear error from Redux state when error URL goes away
    useEffect(() => {
        if (error && !errorUrlParamExists()) {
            dispatch(errorActions.clearError())
        }
    }, [errorUrlParamExists()])

    return null
}

export const ErrorRouteSynchronizer = withRouter(_ErrorRouteSynchronizer)
