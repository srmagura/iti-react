import * as React from 'react'

import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    Tab,
    onChildReady,
    getTabFromLocation,
    TabManager
} from '@interface-technologies/iti-react'
import { TabClassesSection } from './TabClassesSection'
import { TabContent } from './TabContent'

enum TabName {
    A = 'a',
    B = 'b',
    C = 'c'
}

const tabs: Tab[] = [[TabName.A, 'Tab A'], [TabName.B, 'Tab B'], [TabName.C, 'Tab C']]

interface Readiness {
    a: boolean
    b: boolean
    c: boolean
}

interface PageState {
    readiness: Readiness
    displaySingleTab: boolean
}

export class Page extends React.Component<PageProps, PageState> {
    state: PageState = {
        readiness: { a: false, b: false, c: false },
        displaySingleTab: true
    }

    get tab() {
        return getTabFromLocation(tabs, this.props.location)
    }

    isCurrentTabReady = () => {
        const { readiness } = this.state

        switch (this.tab) {
            case TabName.A:
                return readiness.a
            case TabName.B:
                return readiness.b
            case TabName.C:
                return readiness.c
        }

        throw new Error(`Unexpected tab: ${this.tab}.`)
    }

    onChildReady = (args: Partial<Readiness>) => {
        this.setState(
            s => onChildReady(s, args),
            () => {
                if (this.isCurrentTabReady() && !this.props.ready) {
                    this.props.onReady({
                        title: 'Tab Test',
                        activeNavbarLink: NavbarLink.Index,
                        pageId: 'page-test-tabmanager'
                    })
                }
            }
        )
    }

    render() {
        const { ready } = this.props
        const { readiness, displaySingleTab } = this.state

        return (
            <div className={ready ? '' : 'd-none'}>
                <div className="mb-5">
                    <TabManager tabs={tabs}>
                        {[
                            [
                                TabName.A,
                                readiness.a,
                                <TabContent
                                    onReady={() => this.onChildReady({ a: true })}
                                >
                                    A
                                </TabContent>
                            ],
                            [
                                TabName.B,
                                readiness.b,
                                <TabContent
                                    onReady={() => this.onChildReady({ b: true })}
                                >
                                    B
                                </TabContent>
                            ],
                            [
                                TabName.C,
                                readiness.c,
                                <TabContent
                                    onReady={() => this.onChildReady({ c: true })}
                                >
                                    C
                                </TabContent>
                            ]
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
                            onChange={() =>
                                this.setState({ displaySingleTab: !displaySingleTab })
                            }
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
                                </TabContent>
                            ]
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
}
