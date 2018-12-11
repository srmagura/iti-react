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
    children: RenderTab[]

    urlParamName?: string
    renderLoadingIndicator?: () => React.ReactNode
    displaySingleTab?: boolean
}

interface TabManagerState {
    mountedTabs: string[]
}

class _TabManager extends React.Component<TabManagerProps, TabManagerState> {
    static defaultProps: Pick<TabManagerProps, 'urlParamName' | 'displaySingleTab'> = {
        urlParamName: defaultUrlParamName,
        displaySingleTab: false
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

    renderTab = (renderTab: RenderTab) => {
        const { renderLoadingIndicator } = this.props
        const { mountedTabs } = this.state

        const [thisTabName, loading, reactNode] = renderTab

        return (
            mountedTabs.includes(thisTabName) && (
                <div
                    style={{
                        display: this.tab === thisTabName ? undefined : 'none'
                    }}
                    key={thisTabName}
                >
                    {loading && (
                        <TabContentLoading
                            renderLoadingIndicator={renderLoadingIndicator}
                        />
                    )}
                    {reactNode}
                </div>
            )
        )
    }

    render() {
        const { tabs, children } = this.props
        const displaySingleTab = this.props.displaySingleTab!

        if (tabs.length === 1 && !displaySingleTab) {
            if (!children || children.length === 0) return null

            // Display contents with a tab or border
            return this.renderTab(children[0])
        }

        return (
            <TabLayout tabs={tabs} tab={this.tab} onTabClick={this.onTabClick}>
                {children && children.map(this.renderTab)}
            </TabLayout>
        )
    }
}

export const TabManager = withRouter(_TabManager)
