import * as React from 'react'
import { NavbarLink, Header } from 'Components/Header'
import { Footer } from 'Components/Footer'
import {
    ItiReactContext,
    ItiReactContextData,
    defaultItiReactContextData
} from '@interface-technologies/iti-react'
import { LoadingIcon } from 'Components/Icons'
import ReactHintFactory from 'react-hint'
const ReactHint = ReactHintFactory(React)

const itiReactContextData: ItiReactContextData = {
    ...defaultItiReactContextData,
    renderLoadingIndicator: () => <LoadingIcon />
}

interface LayoutProps {
    activeNavbarLink?: NavbarLink
    pageId?: string
    children: React.ReactNode
}

export function Layout(props: LayoutProps) {
    const { children, pageId, activeNavbarLink } = props

    return (
        <div className="layout">
            <ReactHint events delay={100} attribute="data-tooltip" />
            <Header activeNavbarLink={activeNavbarLink} />
            <div className="body-container-wrapper">
                <div className="container">
                    <div className="body-content" id={pageId}>
                        <ItiReactContext.Provider value={itiReactContextData}>
                            {children}
                        </ItiReactContext.Provider>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
