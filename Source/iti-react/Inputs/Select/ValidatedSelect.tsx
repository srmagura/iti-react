﻿import * as React from 'react'
import {
    withValidation,
    IWithValidationInjectedProps,
    ValidationFeedback,
    Validator,
    Validators,
    IThemeColors,
    ITIReactContext
} from '../..'
import Select from 'react-select'
import { partition, flatten } from 'lodash'
import * as Color from 'color'

export function getSelectStyles(
    valid: boolean,
    showValidation: boolean,
    themeColors: IThemeColors,
    width?: number
) {
    return {
        control: (base: any, state: any) => {
            const primaryColor = new Color(themeColors.primary)
            const dangerColor = new Color(themeColors.danger)
            const successColor = new Color(themeColors.success)

            const styles: any = {
                ...base,
                borderColor: '#ced4da', // $gray-400
                backgroundColor: 'white'
            }

            if (typeof width === 'number') styles.width = width

            if (showValidation) {
                const borderColor = valid ? successColor : dangerColor
                const boxShadowColor = borderColor.alpha(0.25)

                styles.borderColor = borderColor.toString()
                styles['&:hover'].borderColor = borderColor.toString()
            }

            if (state.isFocused) {
                const borderColor = primaryColor.lighten(0.25)
                const boxShadowColor = primaryColor.alpha(0.25)

                styles.borderColor = borderColor.toString()
                styles['&:hover'].borderColor = borderColor.toString()
                styles.boxShadow = `0 0 0 0.2rem ${boxShadowColor.toString()}`
            }

            return styles
        }
    }
}

export function getNonGroupOptions(options: (IOption | IGroupOption)[]): IOption[] {
    let [groupOptions, nonGroupOptions] = partition(
        options,
        o => typeof (o as any).value === 'undefined'
    ) as [IGroupOption[], IOption[]]

    return [...nonGroupOptions, ...flatten<IOption>(groupOptions.map(go => go.options))]
}

export type SelectValue = string | number | null

export interface IOption {
    value: string | number
    label: string
}

export interface IGroupOption {
    label: string
    options: IOption[]
}

interface IValidatedSelectOwnProps extends React.Props<any> {
    options: (IOption | IGroupOption)[]
    isClearable?: boolean
    placeholder?: string
    className?: string
    width?: number
}

type IValidatedSelectProps = IValidatedSelectOwnProps &
    IWithValidationInjectedProps<SelectValue>

class _ValidatedSelect extends React.Component<IValidatedSelectProps> {
    onChange = (option: IOption | null) => {
        // option will be an array if the user presses backspace

        const { onChange } = this.props

        // Be careful with the conditional - option.value could be 0
        let newValue: SelectValue = null
        if (option && option.value !== null) {
            newValue = option.value
        }

        onChange(newValue)
    }

    render() {
        const {
            options,
            value,
            valid,
            invalidFeedback,
            showValidation,
            name,
            isClearable,
            placeholder,
            className,
            width
        } = this.props

        const nonGroupOptions = getNonGroupOptions(options)

        let selectValue: IOption | null = null

        // Be careful in conditional - value can be 0
        if (value !== null) {
            selectValue = nonGroupOptions.find(o => o.value === value)!
        }

        return (
            <ValidationFeedback
                valid={valid}
                invalidFeedback={invalidFeedback}
                showValidation={showValidation}
            >
                <ITIReactContext.Consumer>
                    {data => (
                        <Select
                            name={name}
                            className={className}
                            options={options}
                            placeholder={placeholder}
                            value={selectValue}
                            onChange={this.onChange}
                            isClearable={isClearable}
                            styles={getSelectStyles(
                                valid,
                                showValidation,
                                data.themeColors,
                                width
                            )}
                        />
                    )}
                </ITIReactContext.Consumer>
            </ValidationFeedback>
        )
    }
}

const options = {
    defaultValue: null
}

export const ValidatedSelect = withValidation<IValidatedSelectOwnProps, SelectValue>(
    options
)(_ValidatedSelect)

function required(): Validator<SelectValue> {
    return (value: SelectValue) => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const SelectValidators = {
    required
}