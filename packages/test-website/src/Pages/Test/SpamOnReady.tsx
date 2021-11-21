import { ReactElement, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { NavbarLink } from 'Components'
import { useReady } from 'Components/Routing'

export default function Page(): ReactElement {
    const { ready, onReady } = useReady()

    useEffect(() => {
        onReady({ title: 'Spam onReady', activeNavbarLink: NavbarLink.Index })
    })

    return (
        <div hidden={!ready}>
            <h4 className="mb-3">This page calls onReady whenever it updates.</h4>
            <p>
                Click this link to the <Link to="/product/list">products page</Link> and
                make sure
            </p>
            <ul>
                <li>nothing weird happens during the transition</li>
                <li>the page title and active navbar link get updated correctly</li>
            </ul>
        </div>
    )
}
