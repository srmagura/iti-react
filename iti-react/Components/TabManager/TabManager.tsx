import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Location } from 'history'
import { Tab, TabLayout } from './TabLayout'
import { TabContentLoading } from './TabContentLoading'

const defaultUrlParamName = 'tab'

export function getTabFromLocation(
    tabs: Tab[],
    location: Location,
    urlParamName: string = defaultUrlParamName
) {
    if (tabs.length === 0) throw new Error('tabs array cannot be empty.')

    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get(urlParamName)

    if (tabParam && tabs.some(t => t.name === tabParam)) {
        return tabParam
    } else {
        return tabs[0].name
    }
}

type RenderTab = [
    string, // tabName
    boolean, // showLoadingIndicator
    React.ReactNode
]

interface TabManagerProps extends RouteComponentProps<any> {
    tabs: Tab[]
    children: RenderTab[] // TypeScript is allowing children props that don't match this. IDK why

    urlParamName?: string
    renderLoadingIndicator?: () => React.ReactNode
}

interface TabManagerState {
    mountedTabs: string[]
}

class _TabManager extends React.Component<TabManagerProps, TabManagerState> {
    static defaultProps: Pick<TabManagerProps, 'urlParamName'> = {
        urlParamName: defaultUrlParamName
    }

    constructor(props: TabManagerProps) {
        super(props)

        this.state = {
            mountedTabs: [this.tab]
        }
    }

    get tab() {
        const { tabs, location, urlParamName } = this.props

        return getTabFromLocation(tabs, location, urlParamName)
    }

    onTabClick = (tab: string) => {
        const { history, location } = this.props
        const urlParamName = this.props.urlParamName!

        const searchParams = new URLSearchParams(location.search)
        searchParams.set(urlParamName, tab)

        history.replace({
            ...location,
            search: searchParams.toString()
        })
    }

    componentDidUpdate() {
        const tab = this.tab

        if (!this.state.mountedTabs.includes(tab)) {
            this.setState(s => ({
                ...s,
                mountedTabs: [...s.mountedTabs, tab]
            }))
        }
    }

    render() {
        const { tabs, children, renderLoadingIndicator } = this.props
        const { mountedTabs } = this.state

        const tab = this.tab

        return (
            <TabLayout tabs={tabs} tab={tab} onTabClick={this.onTabClick}>
                {children.map(renderTab => {
                    const [thisTabName, loading, reactNode] = renderTab
                    return (
                        mountedTabs.includes(thisTabName) && (
                            <div
                                style={{
                                    display: tab === thisTabName ? undefined : 'none'
                                }}
                                key={thisTabName}
                            >
                                {loading && (
                                    <TabContentLoading
                                        renderLoadingIndicator={renderLoadingIndicator}
                                    />
                                )}
                                {!loading && reactNode}
                            </div>
                        )
                    )
                })}
            </TabLayout>
        )
    }
}

export const TabManager = withRouter(_TabManager)
