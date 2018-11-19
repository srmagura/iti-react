import * as React from 'react'

export interface Tab {
    name: string
    displayName: string
}

interface TabLinkProps extends React.Props<any> {
    tab: Tab
    current: string
    onClick(): void
}

function TabLink(props: TabLinkProps) {
    const { tab, current, onClick } = props

    const anchorClasses = ['nav-link']
    if (current === tab.name) anchorClasses.push('active')

    return (
        <li className="nav-item">
            <a
                className={anchorClasses.join(' ')}
                href="javascript:void(0)"
                role="button"
                onClick={onClick}
            >
                {tab.displayName}
            </a>
        </li>
    )
}

interface TabLayoutProps extends React.Props<any> {
    tabs: Tab[]
    tab: string
    onTabClick(name: string): void
}

export function TabLayout(props: TabLayoutProps) {
    const { tabs, children, tab, onTabClick } = props

    const navClasses = ['nav', 'nav-tabs']

    return (
        <div className="tab-layout">
            <ul className={navClasses.join(' ')}>
                {tabs.map(t => (
                    <TabLink
                        key={t.name}
                        tab={t}
                        current={tab}
                        onClick={() => onTabClick(t.name)}
                    />
                ))}
            </ul>
            <div className="tab-content">{children}</div>
        </div>
    )
}
