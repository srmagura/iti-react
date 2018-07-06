import * as React from 'react'
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
    themeColors: IThemeColors
) {
    return {
        control: (base: any, state: any) => {
            const primaryColor = new Color(themeColors.primary)
            const dangerColor = new Color(themeColors.danger)
            const successColor = new Color(themeColors.success)

            let borderColor = primaryColor.lighten(0.25)
            let boxShadowColor = primaryColor.alpha(0.25)

            if (showValidation) {
                borderColor = valid ? successColor : dangerColor
                boxShadowColor = borderColor.alpha(0.25)
            }

            const styles: any = {
                ...base,
                backgroundColor: 'white'
            }

            if (showValidation) {
                styles.borderColor = borderColor.toString()
                styles['&:hover'].borderColor = borderColor.toString()
            }

            if (state.isFocused) {
                styles.borderColor = borderColor.toString()
                styles['&:hover'].borderColor = borderColor.toString()
                styles.boxShadow = `0 0 0 0.2rem ${boxShadowColor.toString()}`
            }

            return styles
        }
    }
}

export function getNonGroupOptions(
    options: (IOption | IGroupOption)[]
): IOption[] {
    let [groupOptions, nonGroupOptions] = partition(
        options,
        o => typeof (o as any).value === 'undefined'
    ) as [IGroupOption[], IOption[]]

    return [
        ...nonGroupOptions,
        ...flatten<IOption>(groupOptions.map(go => go.options))
    ]
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
}

type IValidatedSelectProps = IValidatedSelectOwnProps &
    IWithValidationInjectedProps<SelectValue>

class _ValidatedSelect extends React.Component<IValidatedSelectProps> {
    onChange = (option: IOption | null) => {
        const { onChange } = this.props
        const newValue = option ? option.value : null

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
            className
        } = this.props

        const nonGroupOptions = getNonGroupOptions(options)

        let selectValue: IOption | null = null
        if (value) {
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
                                data.themeColors
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

export const ValidatedSelect = withValidation<
    IValidatedSelectOwnProps,
    SelectValue
>(options)(_ValidatedSelect)

function required(): Validator<SelectValue> {
    return (value: SelectValue) => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const SelectValidators = {
    required
}
