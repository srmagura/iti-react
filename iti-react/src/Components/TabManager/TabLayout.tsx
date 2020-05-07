﻿import React from 'react'
import { LinkButton } from '../LinkButton'

export interface TabOptions {
    className?: string
}

export type Tab = [string, string] | [string, string, TabOptions] // [tabId, tabName, tabOptions]

interface TabLinkProps {
    tab: Tab
    current: string
    onClick(): void
}

function TabLink(props: TabLinkProps): React.ReactElement {
    const { tab, current, onClick } = props

    const anchorClasses = ['nav-link']
    if (current === tab[0]) anchorClasses.push('active')

    if (tab.length === 3) {
        const tabOptions = tab[2]
        if (tabOptions.className) anchorClasses.push(tabOptions.className)
    }

    return (
        <li className="nav-item">
            <LinkButton className={anchorClasses.join(' ')} onClick={onClick}>
                {tab[1]}
            </LinkButton>
        </li>
    )
}

interface TabLayoutProps {
    tabs: Tab[]
    tab: string
    onTabClick(tabId: string): void
    children?: React.ReactNode

    tabContentRef?: React.Ref<HTMLDivElement>
    tabContentStyle?: React.CSSProperties
}

export function TabLayout(props: TabLayoutProps): React.ReactElement {
    const { tabs, children, tab, onTabClick, tabContentRef, tabContentStyle } = props

    const navClasses = ['nav', 'nav-tabs']

    return (
        <div className="tab-layout">
            <ul className={navClasses.join(' ')}>
                {tabs.map((t) => (
                    <TabLink
                        key={t[0]}
                        tab={t}
                        current={tab}
                        onClick={(): void => onTabClick(t[0])}
                    />
                ))}
            </ul>
            <div className="tab-content" ref={tabContentRef} style={tabContentStyle}>
                {children}
            </div>
        </div>
    )
}
