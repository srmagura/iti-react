import React from 'react'
import { TabManager, Tab, TabManagerRenderTab } from '@interface-technologies/iti-react'
import { TabContent } from './TabContent'

const tabs: Tab[] = [
    ['a', 'Normal'],
    ['b', 'Blue', { className: 'tab-blue' }],
    ['c', 'Green', { className: 'tab-green' }],
    ['d', 'Red text', { className: 'tab-red-text' }],
    ['e', 'Purple text when inactive', { className: 'tab-purple-text-inactive' }],
    ['f', 'Blue', { className: 'tab-blue' }]
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
