import * as React from 'react'

export type Tab = [string, string] // [tabId, tabName]

interface TabLinkProps {
    tab: Tab
    current: string
    onClick(): void
}

function TabLink(props: TabLinkProps) {
    const { tab, current, onClick } = props

    const anchorClasses = ['nav-link']
    if (current === tab[0]) anchorClasses.push('active')

    return (
        <li className="nav-item">
            <a
                className={anchorClasses.join(' ')}
                href="javascript:void(0)"
                role="button"
                onClick={onClick}
            >
                {tab[1]}
            </a>
        </li>
    )
}

interface TabLayoutProps {
    tabs: Tab[]
    tab: string
    onTabClick(tabId: string): void
    children?: React.ReactNode
}

export function TabLayout(props: TabLayoutProps) {
    const { tabs, children, tab, onTabClick } = props

    const navClasses = ['nav', 'nav-tabs']

    return (
        <div className="tab-layout">
            <ul className={navClasses.join(' ')}>
                {tabs.map(t => (
                    <TabLink
                        key={t[0]}
                        tab={t}
                        current={tab}
                        onClick={() => onTabClick(t[0])}
                    />
                ))}
            </ul>
            <div className="tab-content">{children}</div>
        </div>
    )
}
