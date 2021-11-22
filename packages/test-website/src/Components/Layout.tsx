import { PropsWithChildren, ReactElement } from 'react'
import { NavbarLink } from 'Components/Navbar/NavbarLink'
import { Navbar } from 'Components/Navbar/Navbar'
import { Footer } from 'Components/Footer'

type LayoutProps = PropsWithChildren<{
    activeNavbarLink?: NavbarLink
}>

export function Layout({ activeNavbarLink }: LayoutProps): ReactElement {
    return (
        <div className="layout">
            <Navbar activeNavbarLink={activeNavbarLink} />
            <div className="body-container-wrapper">
                <div className="container">
                    <div className="body-content" />
                </div>
            </div>
            <Footer />
        </div>
    )
}
