import * as React from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    FieldValidity,
    childValidChange,
    TabManager,
    Tab
} from '@interface-technologies/iti-react'
import { PhoneInputSection } from './PhoneInputSection'
import { TimeInputSection } from './TimeInputSection'
import { DateInputSection } from './DateInputSection'
import { TimeZoneInputSection } from './TimeZoneInputSection'
import { SelectSection } from './SelectSection'
import { RadioInputSection } from './RadioInputSection'
import { AddressInputSection } from './AddressInputSection'
import { MultiSelectSection } from './MultiSelectSection'

enum TabName {
    Phone = 'phone',
    Time = 'time',
    Date = 'date',
    TimeZone = 'timeZone',
    Select = 'select',
    MultiSelect = 'multiSelect',
    Radio = 'radio',
    Address = 'address'
}

const tabs: Tab[] = [
    [TabName.Phone, 'Phone'],
    [TabName.Time, 'Time'],
    [TabName.Date, 'Date'],
    [TabName.TimeZone, 'Time Zone'],
    [TabName.Select, 'Select'],
    [TabName.MultiSelect, 'Multi-select'],
    [TabName.Radio, 'Radio'],
    [TabName.Address, 'Address']
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

        const showValidation = true

        return (
            <div>
                <h3 className="mb-3">Inputs</h3>
                <TabManager tabs={tabs}>
                    {[
                        [
                            TabName.Phone,
                            false,
                            <PhoneInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Time,
                            false,
                            <TimeInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Date,
                            false,
                            <DateInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.TimeZone,
                            false,
                            <TimeZoneInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Select,
                            false,
                            <SelectSection showValidation={showValidation} />
                        ],
                        [
                            TabName.MultiSelect,
                            false,
                            <MultiSelectSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Radio,
                            false,
                            <RadioInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Address,
                            false,
                            <AddressInputSection showValidation={showValidation} />
                        ]
                    ]}
                </TabManager>
            </div>
        )
    }
}
