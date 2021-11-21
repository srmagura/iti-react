import { PropsWithChildren, ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { authSelectors } from '_Redux'

export function UserGuard({ children }: PropsWithChildren<unknown>): ReactElement | null {
    const initialUserLoadInProgress = useSelector(authSelectors.initialUserLoadInProgress)

    if (initialUserLoadInProgress) {
        // if we render pages before we've gotten the user, a logged in user will get redirected
        // to the log in page because user=null
        return null
    }

    return <>{children}</>
}
