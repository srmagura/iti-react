import * as React from 'react'
import { TabManager, Tab, TabManagerRenderTab } from '@interface-technologies/iti-react'
import { TabContent } from './TabContent'

const tabs: Tab[] = [
    ['a', 'Tab A'],
    ['b', 'Tab B'],
    ['c', 'Tab C'],
    ['d', 'Tab D'],
    ['e', 'Tab E'],
    ['f', 'Tab F']
]

export function TabClassesSection() {
    return (
        <div className="mb-5">
            <h4 className="mb-4">Tabs with CSS classes</h4>
            <TabManager tabs={tabs} urlParamName="classesSectionTab">
                {tabs.map(
                    ([name, label]) =>
                        [
                            name,
                            true,
                            <TabContent onReady={() => {}} loadImmediately>
                                {label}
                            </TabContent>
                        ] as TabManagerRenderTab
                )}
            </TabManager>
        </div>
    )
}
