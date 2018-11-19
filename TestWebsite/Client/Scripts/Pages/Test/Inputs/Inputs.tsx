import * as React from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import { FieldValidity, childValidChange } from '@interface-technologies/iti-react'
import { TabLayout, Tab, getTabFromLocation } from 'Components/TabLayout'
import { PhoneInputSection } from './PhoneSection'
import { TimeInputSection } from './TimeInputSection'
import { DateInputSection } from './DateInputSection'
import { TimeZoneInputSection } from './TimeZoneInputSection'
import { SelectSection } from './SelectSection'
import { RadioInputSection } from './RadioInputSection'
import { AddressInputSection } from './AddressInputSection'
import { MultiSelectSection } from './MultiSelectSection'

const tabs: Tab[] = [
    {
        name: 'phone',
        displayName: 'Phone'
    },
    {
        name: 'time',
        displayName: 'Time'
    },
    {
        name: 'date',
        displayName: 'Date'
    },
    {
        name: 'timeZone',
        displayName: 'Time Zone'
    },
    {
        name: 'select',
        displayName: 'Select'
    },
    { name: 'multiSelect', displayName: 'Multi-select' },
    {
        name: 'radio',
        displayName: 'Radio'
    },
    {
        name: 'address',
        displayName: 'Address'
    }
]

interface PageState {
    fieldValidity: FieldValidity
}

export class Page extends React.Component<PageProps, PageState> {
    state: PageState = {
        fieldValidity: {}
    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Input Test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-test-inputs'
        })
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        if (!this.props.ready) return null

        const { location } = this.props

        const showValidation = true
        const tab = getTabFromLocation(tabs, location)

        return (
            <div>
                <h3 className="mb-3">Inputs</h3>
                <TabLayout tabs={tabs} current={tab}>
                    {tab === 'phone' && (
                        <PhoneInputSection showValidation={showValidation} />
                    )}
                    {tab === 'time' && (
                        <TimeInputSection showValidation={showValidation} />
                    )}
                    {tab === 'date' && (
                        <DateInputSection showValidation={showValidation} />
                    )}
                    {tab === 'timeZone' && (
                        <TimeZoneInputSection showValidation={showValidation} />
                    )}
                    {tab === 'select' && (
                        <SelectSection showValidation={showValidation} />
                    )}
                    {tab === 'multiSelect' && (
                        <MultiSelectSection showValidation={showValidation} />
                    )}
                    {tab === 'radio' && (
                        <RadioInputSection showValidation={showValidation} />
                    )}
                    {tab === 'address' && (
                        <AddressInputSection showValidation={showValidation} />
                    )}
                </TabLayout>
            </div>
        )
    }
}
