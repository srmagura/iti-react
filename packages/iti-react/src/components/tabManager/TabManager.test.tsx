import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Tab } from './TabLayout'
import { TabManager } from './TabManager'

it('mounts all tabs if mountAllTabs is true', () => {
    const tabs: Tab[] = [
        ['a', 'A'],
        ['b', 'B'],
    ]

    render(
        <MemoryRouter>
            <TabManager tabs={tabs} mountAllTabs>
                {tabs
                    .map((t) => t[0])
                    .map((tabName) => [tabName, true, <div>tab-content-{tabName}</div>])}
            </TabManager>
        </MemoryRouter>
    )

    expect(screen.getByText('tab-content-a')).toBeInTheDocument()
    expect(screen.getByText('tab-content-b')).toBeInTheDocument()
})
