# 3.0.0

-   Lots of core changes
-   Switch from `react-hint` to `@tippyjs/react`
-   `DateInput`:
    -   `DateInputValue` changed from `{ moment: moment.Moment | undefined, raw: string }` to simply `moment.Moment | null`
    -   Remove `defaultDateInputValue` since it's just `null` now
    -   Remove `dateInputValueFromMoment`
    -   Remove `noPicker` prop
-   `DateInputNoPicker`:
    -   New component which has the same functionality as the old `DateInput` with `noPicker=true`
    -   It's value is just a `string`.
    -   Use `formatDateInputNoPickerValue` to get the initial string value from a `moment`.
    -   Use `parseDateInputNoPickerValue` to get a `moment` object from the string.
-   `ValidatedInput` no longer supports `type="select"`
-   `PersonNameInput`: remove `prefix` from `PersonNameInputValue`
-   `SavedMessage`: rename classes `saved-message-ml` and `save-message-mr` to `saved-message-ms` and `saved-message-me`
