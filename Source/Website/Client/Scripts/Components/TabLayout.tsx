import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Location } from 'history'

export interface ITab {
    name: string
    displayName: string
}

interface TabLinkProps extends React.Props<any> {
    tab: ITab
    current: string
    onClick(): void
}

function TabLink(props: TabLinkProps) {
    const { tab, current, onClick } = props

    const active = current === tab.name

    // The href attribute makes it so the tab name gets added to the URL.
    // This makes it so you stay on the same tab when you refresh or use back button.
    return (
        <li className="nav-item">
            <a
                className={'nav-link ' + (active ? 'active' : '')}
                id={tab.name + '-tab'}
                href="javascript:void(0)"
                onClick={onClick}
            >
                {tab.displayName}
            </a>
        </li>
    )
}

export const tabParamName = 'tab'

export function getTabFromLocation(
    tabs: ITab[],
    location: Location,
    paramName: string = tabParamName
) {
    if (tabs.length === 0) throw new Error('tabs array cannot be empty.')

    // needs to be polyfilled for IE
    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get(tabParamName)

    if (tabParam && tabs.some(t => t.name === tabParam)) {
        return tabParam
    } else {
        return tabs[0].name
    }
}

interface TabLayoutProps extends React.Props<any>, RouteComponentProps<any> {
    tabs: ITab[]
    current: string
    onTabClick?(name: string): void
}

class _TabLayout extends React.Component<TabLayoutProps> {
    // if you want more control over what happens when a tab is clicked, you
    // can pass the onTabClick prop. Otherwise TabLayout will just update
    // the URL params for you.
    onTabClick = (tab: string) => {
        const { onTabClick, history, location } = this.props

        if (onTabClick) {
            onTabClick(tab)
        } else {
            const searchParams = new URLSearchParams(location.search)
            searchParams.set(tabParamName, tab)

            history.replace({
                ...location,
                search: searchParams.toString()
            })
        }
    }

    render() {
        const { tabs, children, current } = this.props

        return (
            <div className="tab-layout">
                <ul
                    className={`nav nav-tabs ${
                        tabs.length > 2 ? 'more-than-2-tabs' : ''
                    }`}
                >
                    {tabs.map(t => (
                        <TabLink
                            key={t.name}
                            tab={t}
                            current={current}
                            onClick={() => this.onTabClick(t.name)}
                        />
                    ))}
                </ul>
                <div className="tab-content">{children}</div>
            </div>
        )
    }
}

export const TabLayout = withRouter(_TabLayout)
