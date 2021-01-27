﻿/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Color from 'color'
import { CSSProperties } from 'react'
import { ThemeColors } from '../../ItiReactContext'

type EmotionCSS = any
type StyleFn = (base: CSSProperties, state: any) => EmotionCSS

export interface GetSelectStylesOptions {
    valid: boolean
    showValidation: boolean
    themeColors: ThemeColors
    width?: number
    formControlSize?: 'sm' | 'lg'
}

interface AllSelectStyles {
    clearIndicator: StyleFn
    container: StyleFn
    control: StyleFn
    dropdownIndicator: StyleFn
    group: StyleFn
    groupHeading: StyleFn
    indicatorsContainer: StyleFn
    indicatorSeparator: StyleFn
    input: StyleFn
    loadingIndicator: StyleFn
    loadingMessage: StyleFn
    menu: StyleFn
    menuList: StyleFn
    menuPortal: StyleFn
    multiValue: StyleFn
    multiValueLabel: StyleFn
    multiValueRemove: StyleFn
    noOptionsMessage: StyleFn
    option: StyleFn
    placeholder: StyleFn
    singleValue: StyleFn
    valueContainer: StyleFn
}

export type GetSelectStyles = (options: GetSelectStylesOptions) => AllSelectStyles

/* Style the select to match Bootstrap form-control inputs. */
export const getSelectStyles: GetSelectStyles = (options: GetSelectStylesOptions) => {
    const { valid, showValidation, themeColors, width, formControlSize } = options

    const disabledDarkenBy = 0.15

    const indicatorPaddingSmY = '4px'
    const indicatorPaddingSmAll = `${indicatorPaddingSmY} 6px`

    const multiValueMarginLgX = '4px'

    const noStyles = (base: EmotionCSS): EmotionCSS => base

    function getSvgStyles(defaultDim: number): { width?: number; height?: number } {
        if (formControlSize === 'lg') {
            // Scale up SVG icons to match the larger control

            const scaleFactor = 1.25 // = $font-size-lg / $font-size-base
            const scaledDim = scaleFactor * defaultDim

            return { width: scaledDim, height: scaledDim }
        }

        return {}
    }

    return {
        control: (base, state): EmotionCSS => {
            const styles: EmotionCSS = { ...base }

            if (typeof width === 'number') styles.width = width

            styles.borderColor = '#ced4da' // $gray-400

            if (state.isDisabled) {
                styles.backgroundColor = '#e9ecef' // $gray-200
            } else {
                styles.backgroundColor = 'white'
            }

            const primaryColor = new Color(themeColors.primary)
            const dangerColor = new Color(themeColors.danger)
            const successColor = new Color(themeColors.success)

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
        placeholder: (base, state): EmotionCSS => {
            if (state.isDisabled) return base

            return {
                ...base,
                color: themeColors.inputPlaceholder,
            }
        },
        dropdownIndicator: (base, state): EmotionCSS => {
            const styles: EmotionCSS = { ...base }

            if (state.isDisabled) {
                styles.color = new Color(base.color).darken(disabledDarkenBy).toString()
            }

            styles.svg = getSvgStyles(20)
            if (formControlSize === 'sm') styles.padding = indicatorPaddingSmAll

            return styles
        },
        clearIndicator: (base): EmotionCSS => {
            const styles: EmotionCSS = { ...base }

            styles.svg = getSvgStyles(20)
            if (formControlSize === 'sm') styles.padding = indicatorPaddingSmAll

            return styles
        },
        loadingIndicator: (base): EmotionCSS => {
            const styles: EmotionCSS = { ...base }

            styles.svg = getSvgStyles(20)
            if (formControlSize === 'sm') styles.padding = indicatorPaddingSmAll

            return styles
        },
        indicatorSeparator: (base, state): EmotionCSS => {
            const styles = { ...base }

            if (!(state.hasValue && state.selectProps.isClearable)) {
                styles.display = 'none'
            }

            if (state.isDisabled) {
                styles.backgroundColor = new Color(base.backgroundColor)
                    .darken(disabledDarkenBy)
                    .toString()
            }

            if (formControlSize === 'sm') {
                styles.marginTop = indicatorPaddingSmY
                styles.marginBottom = indicatorPaddingSmY
            }

            return styles
        },
        menu: (base): EmotionCSS => ({
            ...base,
            zIndex: 1000, // Value of $zindex-dropdown in the Bootstrap z-index master list
        }),
        valueContainer: (base, state): EmotionCSS => {
            const styles = { ...base }

            if (formControlSize === 'sm') {
                styles.height = '1.8125rem'

                let paddingY = '0.25rem'
                if (state.isMulti) paddingY = '0'

                // -2px because placeholder/option has 2px horiziontal margin
                styles.padding = `${paddingY} calc(0.5rem - 2px)`
            } else if (formControlSize === 'lg') {
                styles.height = '2.875rem'

                let paddingY = '0.5rem'
                let optionMarginX = '2px'

                if (state.isMulti) {
                    paddingY = '0'
                    optionMarginX = multiValueMarginLgX
                }

                // -2px because placeholder/option has 2px horiziontal margin
                styles.padding = `${paddingY} calc(1rem - ${optionMarginX})`
            }

            return styles
        },
        input: (base, state): EmotionCSS => {
            const styles = { ...base }

            // Remove input's vertical margin and padding since we have already added padding to the valueContainer
            if (
                !state.isMulti &&
                (formControlSize === 'sm' || formControlSize === 'lg')
            ) {
                styles.marginTop = '0'
                styles.marginBottom = '0'
                styles.paddingTop = '0'
                styles.paddingBottom = '0'
            }

            return styles
        },
        multiValue: (base, state): EmotionCSS => {
            const styles = { ...base }

            if (formControlSize === 'lg') {
                styles.marginLeft = multiValueMarginLgX
                styles.marginRight = multiValueMarginLgX
            }

            if (state.data.isFixed) styles.backgroundColor = 'gray'

            return styles
        },
        multiValueLabel: (base, state): EmotionCSS => {
            const styles = { ...base }

            if (state.data.isFixed) {
                styles.color = 'white'
                styles.paddingRight = 6
            }

            return styles
        },
        multiValueRemove: (base, state): EmotionCSS => {
            const styles: EmotionCSS = { ...base }

            styles.svg = getSvgStyles(14)
            if (state.data.isFixed) styles.display = 'none'

            return styles
        },
        singleValue: (base, state): EmotionCSS => {
            const styles = { ...base }

            if (state.isDisabled) {
                styles.color = '#495057' // $input-color == $gray-700
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
        loadingMessage: noStyles,
        menuList: noStyles,
        noOptionsMessage: noStyles,
        option: noStyles,
        menuPortal: noStyles,
    }
}
