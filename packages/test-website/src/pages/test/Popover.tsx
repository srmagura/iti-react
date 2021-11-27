import React, { ReactElement, useEffect, useState } from 'react'
import { NavbarLink } from 'components'
import {
    SelectValue,
    usePopoverClickListener,
    ValidatedSelect,
} from '@interface-technologies/iti-react'
import { usePopper } from 'react-popper'
import { useReady } from 'components/routing'

export default function Page(): ReactElement {
    const { ready, onReady } = useReady()

    useEffect(() => {
        onReady({
            title: 'Popover',
            activeNavbarLink: NavbarLink.Index,
        })
    }, [onReady])

    return (
        <div className="page-test-popover" hidden={!ready}>
            <TestPopover />
        </div>
    )
}

function TestPopover(): React.ReactElement {
    const [visible, setVisible] = useState(false)
    const [selectValue, setSelectValue] = useState<SelectValue>(null)

    usePopoverClickListener({
        visible,
        onOutsideClick: () => setVisible(false),
    })

    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)

    const { styles, attributes } = usePopper(referenceElement, popperElement)

    return (
        <>
            <button
                type="button"
                className="btn btn-secondary"
                ref={setReferenceElement}
                onClick={() => setVisible(true)}
            >
                Click to show popover
            </button>

            <div
                ref={setPopperElement}
                style={{ ...styles.popper, visibility: visible ? undefined : 'hidden' }}
                {...attributes.popper}
                className="custom-popover iti-react-popover"
            >
                <button type="button" className="btn btn-secondary mb-3">
                    Button that does nothing
                </button>
                <p>Make sure selecting an option doesn&apos;t close the popover.</p>
                <ValidatedSelect
                    name="mySelect"
                    options={[
                        { value: 'a', label: 'Option A' },
                        { value: 'b', label: 'Option B' },
                    ]}
                    value={selectValue}
                    onChange={setSelectValue}
                    showValidation={false}
                    validators={[]}
                />
            </div>
        </>
    )
}
