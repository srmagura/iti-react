﻿import { ThemeColors } from '../..'
import * as Color from 'color'

/* Style the select to match Bootstrap form-control inputs. */
export function getSelectStyles(options: {
    valid: boolean
    showValidation: boolean
    themeColors: ThemeColors
    width?: number
    formControlSize?: 'sm' | 'lg'
}) {
    const { valid, showValidation, themeColors, width, formControlSize } = options

    const disabledDarkenBy = 0.15

    const noStyles = (base: any) => base

    function getSvgStyles(defaultDim: number): object {
        if (formControlSize === 'lg') {
            // Scale up SVG icons to match the larger control

            const scaleFactor = 1.25 // = $font-size-lg / $font-size-base
            const scaledDim = scaleFactor * defaultDim

            return { width: scaledDim, height: scaledDim }
        }

        return {}
    }

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

            if (formControlSize) {
                delete styles.minHeight

                if (formControlSize === 'sm') {
                    styles.height = 'calc(1.8125rem + 2px)'
                    styles.fontSize = '0.875rem'
                    styles.lineHeight = '1.5'
                    styles.borderRadius = '0.2rem'
                } else if (formControlSize === 'lg') {
                    styles.height = 'calc(2.875rem + 2px)'
                    styles.fontSize = '1.25rem'
                    styles.lineHeight = '1.5'
                    styles.borderRadius = '0.3rem'
                }
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
            const styles = { ...base }

            if (state.isDisabled) {
                styles.color = new Color(base.color).darken(disabledDarkenBy).toString()
            }

            styles.svg = getSvgStyles(20)
            return styles
        },
        clearIndicator: (base: any) => {
            const styles = { ...base }

            styles.svg = getSvgStyles(20)
            return styles
        },
        multiValueRemove: (base: any) => {
            const styles = { ...base }

            styles.svg = getSvgStyles(14)
            return styles
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
        menu: (base: any) => {
            return {
                ...base,
                zIndex: 1000 // Value of $zindex-dropdown in the Bootstrap z-index master list
            }
        },
        valueContainer: (base: any) => {
            const styles = { ...base }

            if (formControlSize === 'sm') {
                styles.height = '1.8125rem'

                // -2px because placeholder/option has 2px horiziontal margin
                styles.padding = '0.25rem calc(0.5rem - 2px)'
            } else if (formControlSize === 'lg') {
                styles.height = '2.875rem'

                // -2px because placeholder/option has 2px horiziontal margin
                styles.padding = '0.5rem calc(1rem - 2px)'
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
        container: noStyles,
        group: noStyles,
        groupHeading: noStyles,
        indicatorsContainer: noStyles,
        input: noStyles,
        loadingIndicator: noStyles,
        loadingMessage: noStyles,
        menuList: noStyles,
        multiValue: noStyles,
        multiValueLabel: noStyles,
        noOptionsMessage: noStyles,
        option: noStyles,
        singleValue: noStyles
    }
}