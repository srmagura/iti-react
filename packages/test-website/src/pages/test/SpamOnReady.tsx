import { ReactElement, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { NavbarLink } from 'components'
import { useReady } from 'components/routing'

export default function Page(): ReactElement {
    const { onReady } = useReady()

    useEffect(() => {
        onReady({ title: 'Spam onReady', activeNavbarLink: NavbarLink.Index })
    })

    return (
        <div>
            <h4 className="mb-3">This page calls onReady whenever it updates.</h4>
            <p>
                Click this link to the <Link to="/test/tabManager">TabManager page</Link>{' '}
                and make sure
            </p>
            <ul>
                <li>nothing weird happens during the transition</li>
                <li>the page title and active navbar link get updated correctly</li>
            </ul>
        </div>
    )
}
