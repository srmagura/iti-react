import { PropsWithChildren, ReactElement, useEffect, useRef } from 'react'

type TabContentProps = PropsWithChildren<{
    onReady(): void
    moreContent?: boolean
    loadImmediately?: boolean
}>

export function TabContent({
    onReady,
    moreContent = false,
    loadImmediately = false,
    children,
}: TabContentProps): ReactElement {
    const onReadyRef = useRef(onReady)
    useEffect(() => {
        onReadyRef.current = onReady
    })

    useEffect(() => {
        const timer = window.setTimeout(
            () => {
                onReadyRef.current()
            },
            loadImmediately ? 0 : 2000
        )

        return () => {
            window.clearTimeout(timer)
        }
    }, [loadImmediately])

    const p = (
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
    )

    return (
        <div>
            <h1>{children}</h1>
            {p}
            {moreContent && p}
            {moreContent && p}
            {moreContent && p}
            {moreContent && p}
        </div>
    )
}
