import { PropsWithChildren, ReactElement, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectAuthenticated } from '_redux'

type ProtectedProps = PropsWithChildren<unknown>

export function Protected({ children }: ProtectedProps): ReactElement | null {
    const authenticated = useSelector(selectAuthenticated)

    const navigate = useNavigate()

    useEffect(() => {
        if (authenticated) return

        navigate('/home/logIn', { replace: true })
    }, [authenticated, navigate])

    if (authenticated) {
        // eslint-disable-next-line react/jsx-no-useless-fragment -- rule is bogus in this case
        return <>{children}</>
    }

    return null
}
