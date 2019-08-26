﻿import * as React from 'react'
import { useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Location } from 'history'
import { Tab, TabLayout } from './TabLayout'
import { TabContentLoading } from './TabContentLoading'
import { defaults } from 'lodash'

const defaultUrlParamName = 'tab'

export function getTabFromLocation(
    tabs: Tab[],
    location: Location,
    options?: {
        defaultTabName?: string
        urlParamName?: string
    }
) {
    if (tabs.length === 0) throw new Error('tabs array cannot be empty.')

    const { defaultTabName, urlParamName } = defaults(options, {
        urlParamName: defaultUrlParamName
    })

    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get(urlParamName)

    if (tabParam && tabs.some(t => t[0] === tabParam)) {
        return tabParam
    } else {
        if (defaultTabName) {
            return defaultTabName
        } else {
            return tabs[0][0]
        }
    }
}

type RenderTab = [
    string, // tabName
    boolean, // isTabReadyForDisplay (loading indicator shown if false)
    React.ReactNode
]

export type TabManagerRenderTab = RenderTab

interface TabManagerProps extends RouteComponentProps<any> {
    tabs: Tab[]
    children: RenderTab[]

    defaultTabName?: string
    urlParamName?: string
    renderLoadingIndicator?: () => React.ReactNode
    displaySingleTab?: boolean
}

function _TabManager(props: TabManagerProps) {
    const {
        tabs,
        children,
        defaultTabName,
        renderLoadingIndicator,
        location,
        history
    } = props
    const urlParamName = props.urlParamName!
    const displaySingleTab = props.displaySingleTab!

    let tab = ''
    if (tabs.length > 0) {
        tab = getTabFromLocation(tabs, location, { defaultTabName, urlParamName })
    }

    const [mountedTabs, setMountedTabs] = useState<string[]>([tab])

    useEffect(() => {
        if (!mountedTabs.includes(tab)) {
            setMountedTabs(mountedTabs => [...mountedTabs, tab])
        }
    }, [tab])

    function onTabClick(tabId: string) {
        const searchParams = new URLSearchParams(location.search)
        searchParams.set(urlParamName, tabId)

        history.replace({
            ...location,
            search: searchParams.toString()
        })
    }

    function renderTab(theRenderTab: RenderTab) {
        const [thisTabName, ready, reactNode] = theRenderTab

        if (!mountedTabs.includes(thisTabName)) return null

        return (
            <div
                style={{
                    display: tab === thisTabName ? undefined : 'none'
                }}
                key={thisTabName}
            >
                {!ready && (
                    <TabContentLoading renderLoadingIndicator={renderLoadingIndicator} />
                )}
                <div className={ready ? '' : 'd-none'}>{reactNode}</div>
            </div>
        )
    }

    if (tabs.length === 1 && !displaySingleTab) {
        if (!children || children.length === 0) return null

        // Display contents without a tab or border
        return renderTab(children[0])
    }

    return (
        <TabLayout tabs={tabs} tab={tab} onTabClick={onTabClick}>
            {children && children.map(renderTab)}
        </TabLayout>
    )
}

_TabManager.defaultProps = {
    urlParamName: defaultUrlParamName,
    displaySingleTab: true
}

export const TabManager = withRouter(_TabManager)
