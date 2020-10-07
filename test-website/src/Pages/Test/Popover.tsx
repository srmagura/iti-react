import React, { useEffect, useState } from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import { PageProps } from 'Components/Routing'
import { NavbarLink } from 'Components'
import { usePopoverClickListener, LinkButton } from '@interface-technologies/iti-react'
import { defer } from 'lodash'


export default function Page({ ready, onReady}: PageProps) {
    useEffect(() => {
        onReady({
            title: 'Popover',
            activeNavbarLink: NavbarLink.Index
        })
    }, [onReady])

    return <div className="page-test-popover" hidden={!ready}>
        <TestPopover />
        </div>
}

function TestPopover(
): React.ReactElement {
    const [visible, setVisible] = useState(false)

    usePopoverClickListener({
        visible,
        onOutsideClick: () => setVisible(false),
    })

    return (
        <Manager>
            <Reference>
                {({ ref }) => (
                    <span ref={ref}>
                        <LinkButton
                            onClick={() => defer(() => setVisible(true))}
                        >Click to open popover</LinkButton>
                    </span>
                )}
            </Reference>
            {visible &&
                
                    <Popper placement="top">
                        {({ ref, style, placement, arrowProps }) => (
                            <div
                                ref={ref}
                                style={style}
                                data-placement={placement}
                                className="custom-popover iti-react-popover"
                            >
                        My popover content!<br />
                        <span style={{backgroundColor: 'lightgray'}}>Element within popover</span>
                                <div
                                    ref={arrowProps.ref}
                            style={arrowProps.style}
                            className="custom-popover__arrow"
                                />
                            </div>
                        )}
                    </Popper>
                }
        </Manager>
    )
}