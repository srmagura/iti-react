import React from 'react'
import { useEffect } from 'react'
import { PageProps } from 'Components/Routing'
import { Link } from 'react-router-dom'
import { NavbarLink } from 'Components'

export default function Page(props: PageProps) {
    const { ready, onReady } = props

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
