import { ReactElement, useEffect } from 'react'
import { NavbarLink } from 'components'
import { TabManager, Tab } from '@interface-technologies/iti-react'
import { useReady } from 'components/routing'
import { PhoneInputSection } from './PhoneInputSection'
import { TimeInputSection } from './TimeInputSection'
import { DateInputSection } from './DateInputSection'
import { TimeZoneInputSection } from './TimeZoneInputSection'
import { SelectSection } from './SelectSection'
import { RadioInputSection } from './RadioInputSection'
import { AddressInputSection } from './AddressInputSection'
import { MultiSelectSection } from './MultiSelectSection'
import { DifferentSizeSection } from './DifferentSizeSection'
import { PersonNameSection } from './PersonNameSection'
import { FileInputSection } from './FileInputSection'

enum TabName {
    Phone = 'phone',
    Time = 'time',
    Date = 'date',
    TimeZone = 'timeZone',
    Select = 'select',
    MultiSelect = 'multiSelect',
    Radio = 'radio',
    Address = 'address',
    DifferentSize = 'differentSize',
    PersonName = 'personName',
    File = 'file',
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
    [TabName.DifferentSize, 'Different Size'],
    [TabName.PersonName, 'Person Name'],
    [TabName.File, 'File'],
]

export default function Page(): ReactElement {
    const { onReady } = useReady()

    useEffect(() => {
        onReady({
            title: 'Input Test',
            activeNavbarLink: NavbarLink.Index,
        })
    }, [onReady])

    const showValidation = true

    return (
        <div className="page-test-inputs">
            <h3 className="mb-3">Inputs</h3>
            <TabManager tabs={tabs}>
                {[
                    [
                        TabName.Phone,
                        true,
                        <PhoneInputSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.Time,
                        true,
                        <TimeInputSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.Date,
                        true,
                        <DateInputSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.TimeZone,
                        true,
                        <TimeZoneInputSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.Select,
                        true,
                        <SelectSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.MultiSelect,
                        true,
                        <MultiSelectSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.Radio,
                        true,
                        <RadioInputSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.Address,
                        true,
                        <AddressInputSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.DifferentSize,
                        true,
                        <DifferentSizeSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.PersonName,
                        true,
                        <PersonNameSection showValidation={showValidation} />,
                    ],
                    [
                        TabName.File,
                        true,
                        <FileInputSection showValidation={showValidation} />,
                    ],
                ]}
            </TabManager>
        </div>
    )
}
