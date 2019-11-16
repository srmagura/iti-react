import React from 'react'
import { useState } from 'react'
import { PageProps } from 'Components/Routing'
import { ListCore, HookName, hookNames } from './ListCore'
import { NavbarLink } from 'Components'
import { RadioInput, RadioOption } from '@interface-technologies/iti-react'

export function Page(props: PageProps) {
    const { onError, ready } = props

    function onReady() {
        props.onReady({
            title: 'Products',
            activeNavbarLink: NavbarLink.Products
        })
    }

    const [hook, setHook] = useState<HookName>('useParameterizedQuery')

    const options: RadioOption[] = hookNames.map(h => ({ value: h, label: h }))

    return (
        <div hidden={!ready}>
            <div className="mb-4">
                <RadioInput
                    name="hook"
                    value={hook}
                    onChange={value => setHook(value as HookName)}
                    options={options}
                    validators={[]}
                    showValidation={false}
                />
            </div>
            <ListCore
                hook={hook}
                onReady={onReady}
                onError={onError}
                // force component to remount when hook changes since we are disobeying the rules of hooks
                // in the component
                key={hook}
            />
        </div>
    )
}
