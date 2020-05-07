import React from 'react'
import { useEffect, useState } from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import { useReadiness, allReady } from '@interface-technologies/iti-react'

interface AsyncComponentProps {
    delay: number

    ready: boolean
    onReady(): void
}

function AsyncComponent(props: AsyncComponentProps) {
    const { delay, ready, onReady } = props

    useEffect(() => {
        const timer = setTimeout(onReady, delay)

        return () => clearTimeout(timer)
    }, [])

    const className = ready ? 'font-weight-bold text-success' : ''

    return <div className={className}>{ready ? 'READY' : 'not ready'}</div>
}

interface Readiness {
    a: boolean
    b: boolean
    c: boolean
}

export default function Page(props: PageProps) {
    const { ready, onReady } = props

    const [onChildReady, readiness] = useReadiness<Readiness>(
        {
            a: false,
            b: false,
            c: false,
        },
        (readiness) => {
            if (allReady(readiness)) {
                onReady({ title: 'Hooks Test', activeNavbarLink: NavbarLink.Index })
            }
        }
    )

    return (
        <div hidden={!ready}>
            <AsyncComponent
                delay={500}
                ready={readiness.a}
                onReady={() => onChildReady({ a: true })}
            />
            <AsyncComponent
                delay={1500}
                ready={readiness.b}
                onReady={() => onChildReady({ b: true })}
            />
            <AsyncComponent
                delay={2500}
                ready={readiness.c}
                onReady={() => onChildReady({ c: true })}
            />
        </div>
    )
}
