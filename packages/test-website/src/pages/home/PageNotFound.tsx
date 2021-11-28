import { useReady } from 'components/routing'
import { ReactElement, useEffect } from 'react'

export default function Page(): ReactElement {
    const { onReady } = useReady()

    useEffect(() => {
        onReady({
            title: 'Page does not exist',
            activeNavbarLink: undefined,
        })
    }, [onReady])

    return (
        <div className="alert alert-info" role="alert">
            The page you requested does not exist.
        </div>
    )
}
