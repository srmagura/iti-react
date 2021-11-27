import { ReactElement, useEffect, useRef } from 'react'
import { NavbarLink } from 'components'
import { formatUrlParams } from '@interface-technologies/iti-react'
import { useNavigate } from 'react-router-dom'
import { useReady } from 'components/routing'

export default function Page(): ReactElement {
    const navigate = useNavigate()
    const { ready, onReady, location } = useReady()

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

    const params = new URLSearchParams(location.search)
    const myParam = params.get('myParam') ?? ''

    function addDigit(): void {
        const digit = Math.random().toString().charAt(3)
        const newPath = location.pathname + formatUrlParams({ myParam: myParam + digit })

        navigate(newPath)
    }

    return (
        <div hidden={!ready}>
            <h5 className="mb-3">Current param value: {myParam}</h5>
            <p>
                <button className="btn btn-primary" onClick={addDigit} type="button">
                    Add a digit to param value
                </button>
            </p>
            <p>
                Should cause page to remount because location key will changed - see
                MyAsyncRouter.getLocationKey().
            </p>
            <p>
                The &quot;current param value&quot; should not update until the new
                instance of the page has loaded.
            </p>
        </div>
    )
}
