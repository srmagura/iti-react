import * as React from 'react'

import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    Tab,
    onChildReady,
    getTabFromLocation,
    TabManager
} from '@interface-technologies/iti-react'

interface TabContentProps {
    onReady(): void
    loadImmediately?: boolean
}

interface TabContentState {
    dataLoaded: boolean
}

class TabContent extends React.Component<TabContentProps, TabContentState> {
    static defaultProps: Pick<TabContentProps, 'loadImmediately'> = {
        loadImmediately: false
    }

    state: TabContentState = { dataLoaded: false }
    timer?: number

    componentDidMount() {
        this.timer = setTimeout(
            () => {
                this.setState({
                    dataLoaded: true
                })

                this.props.onReady()
            },
            !this.props.loadImmediately ? 2000 : 0
        )
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        if (!this.state.dataLoaded) return null

        return (
            <div>
                <h1>{this.props.children}</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </div>
        )
    }
}

//
//
//

enum TabName {
    A = 'a',
    B = 'b',
    C = 'c'
}

const tabs: Tab[] = [
    { name: TabName.A, displayName: 'Tab A' },
    { name: TabName.B, displayName: 'Tab B' },
    { name: TabName.C, displayName: 'Tab C' }
]

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
        displaySingleTab: false
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
                        pageId: ''
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
                                !readiness.a,
                                <TabContent
                                    onReady={() => this.onChildReady({ a: true })}
                                >
                                    A
                                </TabContent>
                            ],
                            [
                                TabName.B,
                                !readiness.b,
                                <TabContent
                                    onReady={() => this.onChildReady({ b: true })}
                                >
                                    B
                                </TabContent>
                            ],
                            [
                                TabName.C,
                                !readiness.c,
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
                                !readiness.a,
                                <TabContent onReady={() => {}} loadImmediately>
                                    A
                                </TabContent>
                            ]
                        ]}
                    </TabManager>
                </div>
            </div>
        )
    }
}
