import * as React from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
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
import { DifferentSizeSection } from './DifferentSizeSection'

enum TabName {
    Phone = 'phone',
    Time = 'time',
    Date = 'date',
    TimeZone = 'timeZone',
    Select = 'select',
    MultiSelect = 'multiSelect',
    Radio = 'radio',
    Address = 'address',
    DifferentSize = 'differentSize'
}

const tabs: Tab[] = [
    [TabName.Phone, 'Phone'],
    [TabName.Time, 'Time'],
    [TabName.Date, 'Date'],
    [TabName.TimeZone, 'Time Zone'],
    [TabName.Select, 'Select'],
    [TabName.MultiSelect, 'Multi-select'],
    [TabName.Radio, 'Radio'],
    [TabName.Address, 'Address'],
    [TabName.DifferentSize, 'Different Size']
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
                            true,
                            <PhoneInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Time,
                            true,
                            <TimeInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Date,
                            true,
                            <DateInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.TimeZone,
                            true,
                            <TimeZoneInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Select,
                            true,
                            <SelectSection showValidation={showValidation} />
                        ],
                        [
                            TabName.MultiSelect,
                            true,
                            <MultiSelectSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Radio,
                            true,
                            <RadioInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.Address,
                            true,
                            <AddressInputSection showValidation={showValidation} />
                        ],
                        [
                            TabName.DifferentSize,
                            true,
                            <DifferentSizeSection showValidation={showValidation} />
                        ]
                    ]}
                </TabManager>
            </div>
        )
    }
}
