import * as React from 'react'

import { IPageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import { ITab, getTabFromLocation, TabLayout } from 'Components/TabLayout'

const tabs: ITab[] = [
    {
        name: 'a',
        displayName: 'A'
    },
    {
        name: 'b',
        displayName: 'B'
    }
]

export class Page extends React.Component<IPageProps> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Tab layout test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-tablayout'
        })
    }

    render() {
        if (!this.props.ready) return null

        const { location } = this.props

        console.log('page received: ' + location.search)

        const tab = getTabFromLocation(tabs, location)
        return <TabLayout tabs={tabs} current={tab} />
    }
}
