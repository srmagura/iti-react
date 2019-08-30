import { useRef, useState } from 'react'

export interface UseControlledValueOptions<TValue> {
    // Acts like a controlled component when value and onChange are provided.
    // Acts like an uncontrolled component otherwise.
    value?: TValue
    onChange?(value: TValue): void

    defaultValue?: TValue

    // Value to use if neither value nor defaultValue are provided
    fallbackValue: TValue
}

export interface UseControlledValueOutput<TValue> {
    value: TValue
    onChange(value: TValue): void
}

// Allows an input to work as either a controlled or uncontrolled component depending
// on which props are provided
export function useControlledValue<TValue>(
    options: UseControlledValueOptions<TValue>
): UseControlledValueOutput<TValue> {
    const controlledOptionsProvided =
        typeof options.value !== 'undefined' && typeof options.onChange !== 'undefined'

    if (controlledOptionsProvided && typeof options.defaultValue !== 'undefined')
        throw new Error('value and defaultValue were provided.')

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
        // CONTROLLED COMPONENT
        return {
            value: options.value!,
            onChange: options.onChange!
        }
    } else {
        // UNCONTROLLED COMPONENT
        const defaultValue =
            typeof options.defaultValue !== 'undefined'
                ? options.defaultValue
                : options.fallbackValue

        const [value, setValue] = useState<TValue>(defaultValue)

        return {
            value,
            onChange: setValue
        }
    }
}
