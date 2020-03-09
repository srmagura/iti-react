import $ from 'jquery'
import React from 'react'
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
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
): string {
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

interface UseSmoothTabTransitionOutput {
    tabContentRef: React.RefObject<HTMLDivElement>
    explicitTabContentHeight: number | undefined
    newTabWillMount(): void
}

// When the user switches to a tab that needs to load first, keep the height
// of the tab-content the same until the new tab finishes loading to avoid
// jarring changes in height
function useSmoothTabTransition(
    renderTabs: RenderTab[],
    tab: string
): UseSmoothTabTransitionOutput {
    const tabContentRef = useRef<HTMLDivElement>(null)
    const [explicitTabContentHeight, setExplicitTabContentHeight] = useState<number>()

    const setHeightToRef = useRef<number>()

    // When a new tab is about to mount, get the height of the tabContent
    // BEFORE the tabs actually switch
    function newTabWillMount(): void {
        if (tabContentRef.current) {
            const height = $(tabContentRef.current).outerHeight()

            if (typeof height !== 'number') {
                console.warn('tabContent height came back as undefined.')
                return
            }

            setHeightToRef.current = height
        }
    }

    // Explicitly set the tabContent height immediately after the new tab becomes
    // visible. useLayoutEffect is essential here because we want the effect to
    // run *before the browser paints*.
    useLayoutEffect(() => {
        if (tabContentRef.current && typeof setHeightToRef.current === 'number') {
            setExplicitTabContentHeight(setHeightToRef.current)
            setHeightToRef.current = undefined
        }
    }, [setHeightToRef.current])

    // Set explicit height to undefined when new tab becomes ready
    useLayoutEffect(() => {
        if (typeof explicitTabContentHeight === 'number') {
            const currentRenderTab = renderTabs.find(rt => rt[0] === tab)

            if (currentRenderTab && currentRenderTab[1]) {
                setExplicitTabContentHeight(undefined)
            }
        }
    })

    return { tabContentRef, explicitTabContentHeight, newTabWillMount }
}

//
//
//

type RenderTab = [
    string, // tabName
    boolean, // isTabReadyForDisplay (loading indicator shown if false)
    React.ReactNode
]

export type TabManagerRenderTab = RenderTab

interface TabManagerProps {
    tabs: Tab[]
    children: RenderTab[]

    defaultTabName?: string
    urlParamName?: string
    renderLoadingIndicator?: () => React.ReactNode
    displaySingleTab?: boolean
}

export function TabManager(props: TabManagerProps): React.ReactNode {
    const {
        tabs,
        children,
        defaultTabName,
        renderLoadingIndicator,
        urlParamName,
        displaySingleTab
    } = defaults(
        { ...props },
        {
            urlParamName: defaultUrlParamName,
            displaySingleTab: true
        }
    )

    const history = useHistory()
    const location = useLocation()

    let tab = ''
    if (tabs.length > 0) {
        tab = getTabFromLocation(tabs, location, { defaultTabName, urlParamName })
    }

    const [mountedTabs, setMountedTabs] = useState<string[]>([tab])

    const {
        tabContentRef,
        explicitTabContentHeight,
        newTabWillMount
    } = useSmoothTabTransition(children, tab)

    useEffect(() => {
        if (!mountedTabs.includes(tab)) {
            setMountedTabs(mountedTabs => [...mountedTabs, tab])
        }
    }, [tab])

    function onTabClick(tabName: string): void {
        if (!mountedTabs.includes(tabName)) newTabWillMount()

        const searchParams = new URLSearchParams(location.search)
        searchParams.set(urlParamName, tabName)

        history.replace({
            ...location,
            search: searchParams.toString()
        })
    }

    function renderTab(theRenderTab: RenderTab): React.ReactNode {
        const [thisTabName, ready, reactNode] = theRenderTab

        if (!mountedTabs.includes(thisTabName)) return null

        return (
            <div
                style={{
                    display: tab === thisTabName ? undefined : 'none'
                }}
                className={!ready ? 'render-tab-loading' : undefined}
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
        <div className="tab-manager">
            <TabLayout
                tabs={tabs}
                tab={tab}
                onTabClick={onTabClick}
                tabContentRef={tabContentRef}
                tabContentStyle={
                    typeof explicitTabContentHeight === 'number'
                        ? { height: explicitTabContentHeight }
                        : undefined
                }
            >
                {children && children.map(renderTab)}
            </TabLayout>
        </div>
    )
}
