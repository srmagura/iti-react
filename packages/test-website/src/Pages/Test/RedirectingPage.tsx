import { useEffect } from 'react'
import { NavbarLink } from 'Components'
import { useReady } from 'Components/Routing'
import { useNavigate } from 'react-router'

/* This is to test that the page titles update correctly when a page pushes to history
 * in componentDidMount(), like a log out page would. */
export default function Page(): null {
    const { onReady } = useReady()
    const navigate = useNavigate()

    useEffect(() => {
        onReady({
            title: 'SHOULD NOT BE VISIBLE',
            activeNavbarLink: NavbarLink.Index,
        })

        navigate('/')
    }, [onReady, navigate])

    return null
}
