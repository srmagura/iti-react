import { ReactElement, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NavbarLink } from 'Components'
import { useReady } from 'Components/Routing'

export default function Page(): ReactElement {
    const { ready, onReady } = useReady()

    useEffect(() => {
        onReady({
            title: 'URL Param Test',
            activeNavbarLink: NavbarLink.Index,
        })
    }, [onReady])

    const params = useParams()
    const number = params.number ? parseInt(params.number) : 0

    return (
        <div hidden={!ready}>
            <h1>Route Param Test</h1>
            <p>
                The loading bar should not show when clicking the + button, because
                getLocationKey(&apos;/test/routeParam/x&apos;) =
                &apos;/test/routeparam&apos;.
            </p>
            <p>
                <strong>URL param:</strong> {number}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Link className="btn btn-primary" to={`/test/routeParam/${number + 1}`}>
                    +
                </Link>
            </p>
        </div>
    )
}
