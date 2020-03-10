import React, { useEffect } from 'react'
import { PageProps } from 'Components/Routing/RouteProps'

export default function Page(props: PageProps) {
    const { ready, onReady } = props

    useEffect(
        () =>
            onReady({
                title: 'Page does not exist',
                activeNavbarLink: undefined
            }),
        []
    )

    if (!ready) return null

    return (
        <div className="alert alert-info" role="alert">
            The page you requested does not exist.
        </div>
    )
}
