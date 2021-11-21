﻿import { ReactElement, useEffect } from 'react'
import { NavbarLink } from 'Components'
import { api } from 'Api'
import { Link } from 'react-router-dom'
import { LinkButton } from '@interface-technologies/iti-react'
import { useReady } from 'Components/Routing'
import { useOnError } from 'hooks'

export default function Page(): ReactElement {
    const { ready, onReady } = useReady()
    const onError = useOnError()

    useEffect(() => {
        onReady({
            title: 'Index',
            activeNavbarLink: NavbarLink.Index,
        })
    }, [onReady])

    async function testError(): Promise<void> {
        try {
            await api.product.internalServerError({})
        } catch (e) {
            onError(e)
        }
    }

    return (
        <div hidden={!ready}>
            <h3>Index</h3>
            <ul>
                <li>
                    <Link to="/test/form">Form test</Link>
                </li>
                <li>
                    <Link to="/test/inputs">Input test</Link>
                </li>
                <li>
                    <Link to="/test/components">Component test</Link>
                </li>
                <li>
                    <Link to="/test/tabManager">Tab test</Link>
                </li>
                <li>
                    <Link to="/test/popover">Popover test</Link>
                </li>
                <li>
                    <Link to="/test/hooks">Hooks test</Link>
                </li>
                <li>
                    <Link to="/test/urlSearchParam?myParam=0">URL search param test</Link>
                </li>
                <li>
                    <Link to="/test/routeParam/0">Route param test</Link>
                </li>
                <li>
                    <Link to="/test/redirectingPage">Redirecting page test</Link> - make
                    sure page titles update correctly
                </li>
                <li>
                    <LinkButton onClick={testError}>
                        Click to receive InternalServerError from API
                    </LinkButton>
                </li>
                <li>
                    <Link to="/test/spamOnReady">Spam onReady</Link>
                </li>
                <li>
                    <Link to="/test/permissions">
                        @interface-technologies/permissions test
                    </Link>
                </li>
            </ul>
        </div>
    )
}
