import { ReactElement, useEffect, useRef } from 'react'
import { NavbarLink } from 'Components'
import { useReadiness, allReady } from '@interface-technologies/iti-react'
import { useReady } from 'Components/Routing'

interface AsyncComponentProps {
    delay: number

    ready: boolean
    onReady(): void
}

function AsyncComponent({ delay, ready, onReady }: AsyncComponentProps): ReactElement {
    const delayRef = useRef(delay)
    const onReadyRef = useRef(onReady)
    useEffect(() => {
        onReadyRef.current = onReady
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            onReadyRef.current()
        }, delayRef.current)

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

export default function Page(): ReactElement {
    const { ready, onReady } = useReady()

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
