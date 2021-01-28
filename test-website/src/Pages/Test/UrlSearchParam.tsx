import React, { useEffect, useRef } from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import { formatUrlParams } from '@interface-technologies/iti-react'
import { useLocation } from 'react-router-dom'

interface PageState {
    loading: boolean
}

export default function Page({ ready, onReady, history }: PageProps) {
    const onReadyRef = useRef(onReady)
    useEffect(() => {
        onReadyRef.current = onReady
    })

    useEffect(() => {
        const timer = window.setTimeout(() => {
            onReadyRef.current({
                title: 'URL Search Param Test',
                activeNavbarLink: NavbarLink.Index,
            })
        }, 1500)

        return () => {
            window.clearTimeout(timer)
        }
    }, [])

    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const myParam = params.get('myParam')

    function addDigit(): void {
        const digit = Math.random().toString().charAt(3)
        const newPath = location.pathname + formatUrlParams({ myParam: myParam + digit })

        history.push(newPath)
    }

    if (!ready) return null

    return (
        <div>
            <h5 className="mb-3">Current param value: {myParam}</h5>
            <p>
                <button className="btn btn-primary" onClick={addDigit}>
                    Add a digit to param value
                </button>
            </p>
            <p>
                Should cause page to remount because location key will changed - see
                MyAsyncRouter.getLocationKey().
            </p>
        </div>
    )
}
