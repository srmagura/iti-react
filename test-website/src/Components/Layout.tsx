import React from 'react'
import { NavbarLink } from 'Components/Navbar/NavbarLink'
import { Navbar } from 'Components/Navbar/Navbar'
import { Footer } from 'Components/Footer'
import {
    ItiReactContext,
    ItiReactContextData,
    defaultItiReactContextData,
    ItiReactCoreContextData,
    defaultItiReactCoreContextData,
    ItiReactCoreContext,
} from '@interface-technologies/iti-react'
import { LoadingIcon } from 'Components/Icons'
import { isConnectionError, store, errorActions } from '_Redux'

const itiReactContextData: ItiReactContextData = {
    ...defaultItiReactContextData,
    renderLoadingIndicator: () => <LoadingIcon />,
    addressInput: { allowCanadian: true },
    configurablePager: { pageSizes: [10, 25, 50] },
}

const itiReactCoreContextData: ItiReactCoreContextData = {
    onError: (e) => store.dispatch(errorActions.onError(e)),
    useAutoRefreshQuery: {
        ...defaultItiReactCoreContextData.useAutoRefreshQuery,
        isConnectionError,
    },
}

interface LayoutProps {
    activeNavbarLink?: NavbarLink
    children: React.ReactNode
}

export function Layout(props: LayoutProps) {
    const { children, activeNavbarLink } = props

    return (
        <div className="layout">
            <Navbar activeNavbarLink={activeNavbarLink} />
            <div className="body-container-wrapper">
                <div className="container">
                    <div className="body-content">
                        <ItiReactContext.Provider value={itiReactContextData}>
                            <ItiReactCoreContext.Provider value={itiReactCoreContextData}>
                                {children}
                            </ItiReactCoreContext.Provider>
                        </ItiReactContext.Provider>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
