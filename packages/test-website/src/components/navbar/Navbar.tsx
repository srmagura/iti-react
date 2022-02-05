import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authActions } from '_redux'
import { useCurrentUser } from 'hooks'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { NavbarLink } from './NavbarLink'

function linkClass(active: boolean): string {
    let className = 'nav-link '

    if (active) className += 'active'

    return className
}

interface NavbarProps {
    activeNavbarLink?: NavbarLink
}

export function Navbar({ activeNavbarLink }: NavbarProps): ReactElement {
    const dispatch = useDispatch()
    const { data: user } = useCurrentUser()

    let userNavItem: React.ReactNode
    if (user) {
        userNavItem = (
            <NavDropdown title={user.name} align="end" id="userDropdown">
                <NavDropdown.Item onClick={() => dispatch(authActions.logOut())}>
                    Log Out
                </NavDropdown.Item>
            </NavDropdown>
        )
    } else {
        userNavItem = (
            <li className="nav-item">
                <Link to="/home/login" className={linkClass(false)}>
                    Log In
                </Link>
            </li>
        )
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    ITI React
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto">
                        {user && (
                            <li className="nav-item">
                                <Link
                                    to="/"
                                    className={linkClass(
                                        activeNavbarLink === NavbarLink.Index
                                    )}
                                >
                                    Index
                                </Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">{userNavItem}</ul>
                </div>
            </div>
        </nav>
    )
}
