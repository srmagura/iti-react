import { useReady } from 'Components/Routing'
import { ReactElement, useEffect } from 'react'

export default function Page(): ReactElement {
    const { ready, onReady } = useReady()

    useEffect(() => {
        onReady({
            title: 'Page does not exist',
            activeNavbarLink: undefined,
        })
    }, [onReady])

    return (
        <div hidden={!ready} className="alert alert-info" role="alert">
            The page you requested does not exist.
        </div>
    )
}
