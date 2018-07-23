import * as React from 'react'
import { NavbarLink, Header } from 'Components/Header'
import { Footer } from 'Components/Footer'
import {
    ITIReactContext,
    IITIReactContextData,
    defaultITIReactContextData
} from '@interface-technologies/iti-react'
import { LoadingIcon } from 'Components/Icons'
import ReactHintFactory from 'react-hint'
const ReactHint = ReactHintFactory(React)

const itiReactContextData: IITIReactContextData = {
    ...defaultITIReactContextData,
    loadingIndicatorComponent: LoadingIcon
}

interface ILayoutProps extends React.Props<any> {
    activeNavbarLink?: NavbarLink
    pageId?: string
}

export function Layout(props: ILayoutProps) {
    const { children, pageId, activeNavbarLink } = props

    return (
        <div className="layout">
            <ReactHint events delay={100} attribute="data-tooltip" />
            <Header activeNavbarLink={activeNavbarLink} />
            <div className="body-container-wrapper">
                <div className="container">
                    <div className="body-content" id={pageId}>
                        <ITIReactContext.Provider value={itiReactContextData}>
                            {children}
                        </ITIReactContext.Provider>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
