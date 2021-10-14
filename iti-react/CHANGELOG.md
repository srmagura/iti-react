@@@ = breaking change

# 3.1.2

-   Publish as plain JavaScript (CommonJS)
-   @@@ Change Sass import to `@import '~@interface-technologies/iti-react/dist/iti-react';`

# 3.0.0

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
