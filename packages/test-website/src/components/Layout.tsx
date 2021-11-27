import { PropsWithChildren, ReactElement } from 'react'
import { NavbarLink } from 'components/navbar/NavbarLink'
import { Navbar } from 'components/navbar/Navbar'

type LayoutProps = PropsWithChildren<{
    activeNavbarLink?: NavbarLink
}>

export function Layout({ activeNavbarLink, children }: LayoutProps): ReactElement {
    return (
        <div>
            <Navbar activeNavbarLink={activeNavbarLink} />
            <div className="container-fluid">
                <div className="p-4">{children}</div>
            </div>
        </div>
    )
}
