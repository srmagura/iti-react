import { PropsWithChildren, ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectAuthenticated } from '_redux'

type ProtectedProps = PropsWithChildren<unknown>

export function Protected({ children }: ProtectedProps): ReactElement {
    const authenticated = useSelector(selectAuthenticated)

    if (authenticated) {
        // eslint-disable-next-line react/jsx-no-useless-fragment -- rule is bogus in this case
        return <>{children}</>
    }

    return <Navigate to="/home/logIn" replace />
}
