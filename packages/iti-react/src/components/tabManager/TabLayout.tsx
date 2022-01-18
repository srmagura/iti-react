import React, { PropsWithChildren } from 'react'
import { LinkButton } from '../LinkButton'

export interface TabOptions {
    className?: string
}

/** `[tabId, tabName, tabOptions]` */
export type Tab = [string, string] | [string, string, TabOptions]

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

export type TabLayoutProps = PropsWithChildren<{
    tabs: Tab[]
    tab: string
    onTabClick(tabId: string): void

    className?: string
    tabContentClassName?: string

    tabContentRef?: React.Ref<HTMLDivElement>
    tabContentStyle?: React.CSSProperties
}>

/**
 * A presentational component for building user interfaces with tabs.
 *
 * Usually you want to use [[`TabManager`]] which builds on top of `TabLayout`.
 */
export function TabLayout({
    tabs,
    tab,
    onTabClick,
    className,
    tabContentClassName,
    tabContentRef,
    tabContentStyle,
    children,
}: TabLayoutProps): React.ReactElement {
    const navClasses = ['nav', 'nav-tabs']

    const classes = ['tab-layout']
    if (className) classes.push(className)

    const tabContentClasses = ['tab-content']
    if (tabContentClassName) tabContentClasses.push(tabContentClassName)

    return (
        <div className={classes.join(' ')}>
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
            <div
                className={tabContentClasses.join(' ')}
                ref={tabContentRef}
                style={tabContentStyle}
            >
                {children}
            </div>
        </div>
    )
}
