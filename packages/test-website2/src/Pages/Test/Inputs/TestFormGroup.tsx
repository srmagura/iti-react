import { FormGroup } from '@interface-technologies/iti-react'
import { ReactElement } from 'react'

interface TestFormGroupProps {
    label?: string | ReactElement
    className?: string
    valid?: boolean

    children?: React.ReactNode | ((id: string) => React.ReactNode)
}

export function TestFormGroup({
    label,
    className,
    valid,
    children,
}: TestFormGroupProps): ReactElement {
    const fullLabel = (
        <span>
            {label} <span className="validity-label">{valid ? 'VALID' : 'INVALID'}</span>
        </span>
    )

    return (
        <FormGroup label={fullLabel} className={className}>
            {children}
        </FormGroup>
    )
}
