import { ReactElement, useState } from 'react'
import { NavbarLink } from 'components'
import {
    Tab,
    getTabFromLocation,
    TabManager,
    RadioInput,
    useReadiness,
    FormGroup,
} from '@interface-technologies/iti-react'
import { useReady } from 'components/routing'
import { TabClassesSection } from './TabClassesSection'
import { TabContent } from './TabContent'

enum TabName {
    A = 'a',
    B = 'b',
    C = 'c',
}

const tabs: Tab[] = [
    [TabName.A, 'Tab A'],
    [TabName.B, 'Tab B'],
    [TabName.C, 'Tab C'],
]

export default function Page(): ReactElement {
    const { onReady, location } = useReady()

    const [defaultTabName, setDefaultTabName] = useState<TabName>()
    const [displaySingleTab, setDisplaySingleTab] = useState(true)

    const tab = getTabFromLocation(tabs, location, {
        defaultTabName,
    })

    const [onChildReady, readiness] = useReadiness(
        { a: false, b: false, c: false },
        (readiness) => {
            function isCurrentTabReady(): boolean {
                switch (tab) {
                    case TabName.A:
                        return readiness.a
                    case TabName.B:
                        return readiness.b
                    case TabName.C:
                        return readiness.c
                }

                throw new Error(`Unexpected tab: ${tab}.`)
            }

            if (isCurrentTabReady()) {
                onReady({
                    title: 'Tab Test',
                    activeNavbarLink: NavbarLink.Index,
                })
            }
        }
    )

    return (
        <div className="page-test-tabmanager">
            <div className="mb-5">
                <h4 className="mb-3">Basic</h4>
                <FormGroup label="Default tab name" className="mb-4">
                    <RadioInput
                        name="defaultTabName"
                        options={[
                            { value: 'undefined', label: 'undefined' },
                            { value: TabName.A, label: 'Tab A' },
                            { value: TabName.B, label: 'Tab B' },
                            { value: TabName.C, label: 'Tab C' },
                        ]}
                        value={defaultTabName ?? 'undefined'}
                        onChange={(value) =>
                            setDefaultTabName(
                                value === 'undefined' ? undefined : (value as TabName)
                            )
                        }
                        validators={[]}
                        showValidation={false}
                    />
                </FormGroup>
                <TabManager tabs={tabs} defaultTabName={defaultTabName}>
                    {[
                        [
                            TabName.A,
                            readiness.a,
                            <TabContent
                                onReady={() => onChildReady({ a: true })}
                                moreContent
                            >
                                A
                            </TabContent>,
                        ],
                        [
                            TabName.B,
                            readiness.b,
                            <TabContent onReady={() => onChildReady({ b: true })}>
                                B
                            </TabContent>,
                        ],
                        [
                            TabName.C,
                            readiness.c,
                            <TabContent onReady={() => onChildReady({ c: true })}>
                                C
                            </TabContent>,
                        ],
                    ]}
                </TabManager>
            </div>
            <div>
                <h4>TabManager with only one tab</h4>
                <div className="form-check form-check-inline mt-2 mb-3">
                    <input
                        id="display-single-tab-checkbox"
                        type="checkbox"
                        className="form-check-input"
                        checked={displaySingleTab}
                        onChange={() => setDisplaySingleTab((b) => !b)}
                    />
                    <label
                        htmlFor="display-single-tab-checkbox"
                        className="form-check-label"
                    >
                        Display single tab
                    </label>
                </div>
                <TabManager
                    tabs={[tabs[0]]}
                    urlParamName="tab2"
                    displaySingleTab={displaySingleTab}
                >
                    {[
                        [
                            TabName.A,
                            readiness.a,
                            <TabContent onReady={() => {}} loadImmediately>
                                A
                            </TabContent>,
                        ],
                    ]}
                </TabManager>
            </div>
            <div>
                <h4>TabManager with no tabs</h4>
                <p>Should not throw an error</p>
                <TabManager tabs={[]} urlParamName="tab3">
                    {[]}
                </TabManager>
            </div>
            <TabClassesSection />
        </div>
    )
}
