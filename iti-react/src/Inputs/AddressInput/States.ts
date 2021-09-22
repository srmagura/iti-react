import { GroupTypeBase } from 'react-select/src/types'
import { SelectOption } from '../Select'

/** A US state or Canadian province. */
export interface StateOrProvince {
    abbr: string
    name: string
}

function statesFromObject(obj: { [abbr: string]: string }): StateOrProvince[] {
    return Object.entries(obj).map(([abbr, name]) => ({ abbr, name }))
}

const usStates = statesFromObject({
    AL: 'Alabama',
    AK: 'Alaska',
    AS: 'American Samoa',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'District of Columbia',
    FL: 'Florida',
    FM: 'Micronesia',
    GA: 'Georgia',
    GU: 'Guam',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MH: 'Marshall Islands',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NC: 'North Carolina',
    MP: 'Northern Mariana Islands',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PW: 'Palau',
    PA: 'Pennsylvania',
    PR: 'Puerto Rico',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VA: 'Virginia',
    VI: 'US Virgin Islands',
    VT: 'Vermont',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
})

export const canadianProvinces = statesFromObject({
    AB: 'Alberta',
    BC: 'British Columbia',
    MB: 'Manitoba',
    NB: 'New Brunswick',
    NL: 'Newfoundland and Labrador',
    NS: 'Nova Scotia',
    NT: 'Northwest Territories',
    NU: 'Nunavut',
    ON: 'Ontario',
    PE: 'Prince Edward Island',
    QC: 'Québec',
    SK: 'Saskatchewan',
    YT: 'Yukon',
})

/** Get a list of US states and/or Canadian provinces. */
export function getStates(options: {
    includeUsStates: boolean
    includeCanadianProvinces: boolean
}): StateOrProvince[] {
    let states: StateOrProvince[] = []

    if (options.includeUsStates) states = [...states, ...usStates]
    if (options.includeCanadianProvinces) states = [...states, ...canadianProvinces]

    return states
}

function stateToOption(state: StateOrProvince): SelectOption {
    return { value: state.abbr, label: state.abbr }
}

const usOptions = usStates.map(stateToOption)
const canadianOptions = canadianProvinces.map(stateToOption)

/** Get a list of [[`SelectOption`]]s for US states and/or Canadian provinces. */
export function getStateOptions(options: {
    includeUsStates: boolean
    includeCanadianProvinces: boolean
}): SelectOption[] | GroupTypeBase<SelectOption>[] {
    if (options.includeUsStates && options.includeCanadianProvinces) {
        return [
            { label: 'US States', options: usOptions },
            { label: 'Canadian Provinces', options: canadianOptions },
        ]
    }
    if (options.includeUsStates) {
        return usOptions
    }
    if (options.includeCanadianProvinces) {
        return canadianOptions
    }
    return []
}
