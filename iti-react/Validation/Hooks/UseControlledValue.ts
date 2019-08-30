import { useRef, useState } from 'react'

export interface UseControlledValueOptions<TValue> {
    // Acts like a controlled component when these options are provided
    value?: TValue
    onChange?(value: TValue): void

    // Acts like an uncontrolled component when this option is provided
    defaultValue?: TValue
}

export interface UseControlledValueOutput<TValue> {
    value: TValue
    onChange(value: TValue): void
}

export function useControlledValue<TValue>(
    options: UseControlledValueOptions<TValue>
): UseControlledValueOutput<TValue> {
    const controlledOptionsProvided =
        typeof options.value !== 'undefined' && typeof options.onChange !== 'undefined'

    const uncontrolledOptionsProvided = typeof options.defaultValue !== 'undefined'

    const neitherProvided = !controlledOptionsProvided && !uncontrolledOptionsProvided
    const bothProvided = !controlledOptionsProvided && !uncontrolledOptionsProvided

    if (neitherProvided || bothProvided) {
        throw new Error('You must provide (value and onChange) XOR defaultValue.')
    }

    const isControlledRef = useRef(controlledOptionsProvided)

    if (isControlledRef.current !== controlledOptionsProvided) {
        const formatBoolean = (isControlled: boolean) =>
            isControlled ? 'controlled' : 'uncontrolled'

        throw new Error(
            `The input was changed from ${formatBoolean(isControlledRef.current)} ` +
                `to ${formatBoolean(controlledOptionsProvided)}. This is not allowed.`
        )
    }

    if (isControlledRef.current) {
        return {
            value: options.value,
            onChange: options.onChange
        }
    } else {
        const [value, setValue] = useState<TValue>(options.defaultValue)

        return {
            value,
            onChange: setValue
        }
    }
}
