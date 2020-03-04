import { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { usePrevious } from '@interface-technologies/iti-react-core'

/* Test cases:
 *
 * 1. When an error occurs, the error param is added to the URL and the error page is
 *    displayed
 * 2. When the URL contains the error param and user refreshes the page, the error
 *    param is removed and the error page is not displayed
 * 3. When the user is on the error page and clicks back, they are returned to the page
 *    they were on when the error occurred
 * 4. This tests the errorKey functionality.
 *    a. Error occurs, and error page is displayed.
 *    b. User navigates to some other page.
 *    c. Another error occurs. Make sure the error page is displayed.
 */

type TError = unknown

interface ErrorRouteSynchronizerProps extends RouteComponentProps<{}> {
    errorUrlParamName: string

    // the error page will be shown if the identity of the error object changes
    // (even if the error type and message are exactly the same)
    error: TError
}

function _ErrorRouteSynchronizer(props: ErrorRouteSynchronizerProps): null {
    const { location, history, errorUrlParamName, error } = props

    const urlSearchParams = new URLSearchParams(location.search)
    const errorUrlParamExists = urlSearchParams.has(errorUrlParamName)

    const prevError = usePrevious(error)

    useEffect(() => {
        if (error) {
            if (error !== prevError && !errorUrlParamExists) {
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
    }, [error, errorUrlParamExists])

    return null
}

export const ErrorRouteSynchronizer = withRouter(_ErrorRouteSynchronizer)
