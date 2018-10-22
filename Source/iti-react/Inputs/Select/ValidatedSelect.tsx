import * as React from 'react'
import {
    withValidation,
    WithValidationInjectedProps,
    ValidationFeedback,
    Validator,
    Validators,
    IThemeColors,
    ITIReactContext,
    nullToUndefined
} from '../..'
import Select from 'react-select'
import { partition, flatten } from 'lodash'
import * as Color from 'color'

/* Style the select to match Bootstrap form-control inputs. */
export function getSelectStyles(
    valid: boolean,
    showValidation: boolean,
    themeColors: IThemeColors,
    width?: number
) {
    const disabledDarkenBy = 0.15

    const noStyles = (base: any, state: any) => base

    return {
        control: (base: any, state: any) => {
            const styles: any = { ...base }

            if (typeof width === 'number') styles.width = width

            styles.borderColor = '#ced4da' // $gray-400

            if (state.isDisabled) {
                return {
                    ...styles,
                    backgroundColor: '#e9ecef' // $gray-200
                }
            }

            const primaryColor = new Color(themeColors.primary)
            const dangerColor = new Color(themeColors.danger)
            const successColor = new Color(themeColors.success)

            styles.backgroundColor = 'white'

            if (showValidation) {
                const borderColor = valid ? successColor : dangerColor

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
        },
        placeholder: (base: any, state: any) => {
            if (state.isDisabled) return base

            return {
                ...base,
                color: themeColors.inputPlaceholder
            }
        },
        dropdownIndicator: (base: any, state: any) => {
            if (state.isDisabled) {
                return {
                    ...base,
                    color: new Color(base.color).darken(disabledDarkenBy).toString()
                }
            }

            return base
        },
        indicatorSeparator: (base: any, state: any) => {
            const styles: any = { ...base }

            if (!(state.hasValue && state.selectProps.isClearable)) {
                styles.display = 'none'
            }

            if (state.isDisabled) {
                styles.backgroundColor = new Color(base.backgroundColor)
                    .darken(disabledDarkenBy)
                    .toString()
            }

            return styles
        },

        /* Return a function for EVERY part of the select that can be styled. This way,
        * applications that use iti-react can write their own styling functions
        * that build on top of this one, like:
        *
        * return {
        *      control: (base, state) => {
        *          let styles = getSelectStyles(...).control(base, state)
        *
        *          // do stuff to styles
        *
        *          return styles
        *      }
        * }
        *
        * Then, in the future, we can add new styles here and any functions built on top of this one
        * will automatically utilize the new styles.
        */
        clearIndicator: noStyles,
        container: noStyles,
        group: noStyles,
        groupHeading: noStyles,
        indicatorsContainer: noStyles,
        input: noStyles,
        loadingIndicator: noStyles,
        loadingMessage: noStyles,
        menu: noStyles,
        menuList: noStyles,
        multiValue: noStyles,
        multiValueLabel: noStyles,
        multiValueRemove: noStyles,
        noOptionsMessage: noStyles,
        option: noStyles,
        singleValue: noStyles,
        valueContainer: noStyles
    }
}

export function getNonGroupOptions(
    options: (SelectOption | SelectGroupOption)[]
): SelectOption[] {
    let [groupOptions, nonGroupOptions] = partition(
        options,
        o => typeof (o as any).value === 'undefined'
    ) as [SelectGroupOption[], SelectOption[]]

    return [
        ...nonGroupOptions,
        ...flatten<SelectOption>(groupOptions.map(go => go.options))
    ]
}

export type SelectValue = string | number | null

export interface SelectOption {
    value: string | number
    label: string
}

export interface SelectGroupOption {
    label: string
    options: SelectOption[]
}

interface ValidatedSelectOwnProps extends React.Props<any> {
    options: (SelectOption | SelectGroupOption)[]
    isClearable?: boolean
    enabled?: boolean
    placeholder?: string
    className?: string
    width?: number
}

type ValidatedSelectProps = ValidatedSelectOwnProps &
    WithValidationInjectedProps<SelectValue>

class _ValidatedSelect extends React.Component<ValidatedSelectProps> {
    static defaultProps: Pick<ValidatedSelectProps, 'enabled' | 'isClearable'> = {
        enabled: true,
        isClearable: false
    }

    onChange = (option: SelectOption | null, { action }: { action: string }) => {
        // option will be an array if the user presses backspace

        const { onChange, isClearable } = this.props

        // This is so that if isClearable = false, you don't have to worry about ValidatedSelect's
        // onChange returning null. pop-value doesn't happen often so this will hopefully avoid
        // some bugs.
        if (!isClearable && action === 'pop-value') return

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
            enabled,
            placeholder,
            className,
            width
        } = this.props

        const nonGroupOptions = getNonGroupOptions(options)

        let selectValue: SelectOption | null = null

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
                            isDisabled={!enabled}
                            styles={getSelectStyles(
                                valid,
                                showValidation,
                                data.themeColors,
                                width
                            )}
                        />
                    )}
                </ITIReactContext.Consumer>
                {/* ReactSelect does not render the input when isDisabled = true. Render a hidden input with the value,
                  * for situations where the select is disabled but it has a default/controlled value. */}
                {!enabled && (
                    <input type="hidden" name={name} value={nullToUndefined(value)} />
                )}
            </ValidationFeedback>
        )
    }
}

const options = {
    defaultValue: null
}

export const ValidatedSelect = withValidation<ValidatedSelectOwnProps, SelectValue>(
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
