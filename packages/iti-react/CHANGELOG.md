@@@ = breaking change

## 4.3.3

-   Core changes
-   Update all packages

## 4.3.2

-   `EasyFormDialog`: Fix invisible submit button taking up space and being able
    to be tabbed to

## 4.3.1

-   `LinkButton`: Use `forwardRef`

## 4.3.0

-   @@@ `usePopoverClickListener`: change default value of `popoverSelector` to
    `.popover-with-click-listener`
-   Add `EasyFormPopover` and `EasyFormPopoverManager`

## 4.2.2

-   Add `useCtrlEnterListener` hook that also works with Command+Enter on Mac
-   `EasyFormDialog`:
    -   Fix Enter not submitting form in Safari
    -   Fix Command+Enter not submitting form on Mac

## 4.2.1

-   `FileInput`:
    -   Fix validation class not being applied
    -   Fix `inputAttributes` having no effect
-   Add Sass variables: `$tab-content-padding`, `$tab-content-padding-lg`

## 4.2.0

-   @@@ BIG POTENTIAL FOR BREAKAGE: `ValidatedInput`, `DateInput`,
    `ValidatedSelect` (including multi and async): `className` now goes to the
    `ValidationFeedback`. `inputClassName` or `inputAttributes.className` now goes
    to the `<input>` or `<Select>`.

## 4.1.4

-   `TabManager`: Add `tabContentClassName`

## 4.1.3

-   Export `ReadyContext` so it the provider can be used in tests

## 4.1.2

-   `EasyFormDialog`: Fix dialog not closing

## 4.1.0

-   @@@ `Dialog`: Refactor it to use `react-bootstrap`
-   @@@ Remove `cleanupImproperlyClosedDialog` since it is no longer necessary
-   `FileInput`: setting `value` to `null` now clears the input

## 4.0.5

-   @@@ `AsyncRouter`: `renderRoutes` -> `routesElement`

## 4.0.4

-   Core changes

## 4.0.1

-   @@@ Fix `parseDateTimeNoPickerValue` and `formatDateTimeNoPickerValue` when
    `includesTime=false`
-   @@@ `cleanupImproperlyClosedDialog` -> `cleanUpImproperlyClosedDialog`
-   Set `line-height: 1` on `ClickToCopy` so the tooltip isn't so far from the icon

## 4.0.0

-   @@@ Upgrade to React Router 6
    -   Add `useReadyCore` for accessing `ready`, `onReady`, and `location` from
        page components
-   Core changes

# 3.1.11

-   Core changes only

# 3.1.10

-   Fix `ConfigurablePager` select being too narrow in some cases

## 3.1.9

-   @@@ Fix `parseDateTimeNoPickerValue` and `formatDateTimeNoPickerValue` when
    `includesTime=false`

## 3.1.8

-   Style changes to FileInput

## 3.1.7

-   Core changes only

## 3.1.6

-   @@@ `AsyncRouter`: Add `onInitialPageReady` callback

## 3.1.5

-   Export `focusFirstInput`

## 3.1.4

-   Fix `TimeInput` selects not being wide enough
-   Fix `AddressInput` state select not being wide enough
-   Fix `postalCodeValidator` returning invalid when the postal code was an
    empty string

## 3.1.3

-   Fix `DateInput` not displaying invalid feedback

## 3.1.2

-   Publish as plain JavaScript (CommonJS)
-   @@@ Change Sass import to `@import '~@interface-technologies/iti-react/dist/iti-react';`

## 3.0.0

Virtually all of these changes are breaking.

-   Lots of core changes
-   Switch from `react-hint` to `@tippyjs/react`
-   `DateInput`:
    -   `DateInputValue` changed from `{ moment: moment.Moment | undefined, raw: string }` to simply `moment.Moment | null`
    -   Remove `defaultDateInputValue` since it's just `null` now
    -   Remove `dateInputValueFromMoment`
    -   Remove `noPicker` prop
-   `DateInputNoPicker`:
    -   New component which has the same functionality as the old `DateInput`
        with `noPicker=true`
    -   It's value is just a `string`.
    -   Use `formatDateInputNoPickerValue` to get the initial string value from
        a `moment`.
    -   Use `parseDateInputNoPickerValue` to get a `moment` object from the
        string.
-   Upgrade to `react-select` v5. `@types/react-select` is no longer required.
-   `ValidatedInput`:
    -   No longer supports `type="select"`.
    -   Remove unused `validationFeedbackComponent` prop.
-   `TimeInput`: removed the hidden input that allowed the component to work
    with `formData`.
-   `PersonNameInput`: remove `prefix` from `PersonNameInputValue`.
-   `SavedMessage`: rename classes `saved-message-ml` and `save-message-mr` to
    `saved-message-ms` and `saved-message-me`.
-   `EasyFormDialog`:
    -   `actionButtonText` -> `submitButtonText`
    -   `actionButtonClass` -> `submitButtonClass`
    -   `actionButtonEnabled` -> `submitEnabled` (and now prevents submitting
        the form with Enter or Ctrl+Enter when false).
    -   Add required `showValidation` prop. `EasyFormDialog` uses
        `getSubmitEnabled` and the `submitEnabled` prop to determine if
        the form can be submitted.
    -   Remove `getGenericEasyFormDialog` — I don't think it was used anywhere.
