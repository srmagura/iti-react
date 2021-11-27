@@@ = breaking change

## 4.0.0

-   @@@ Remove `formatUrlParams`. Use `new URLSearchParams({ }).toString()` instead.
-   Deprecate `useSimpleQuery` and friends

## 3.1.7

-   Add `ITIAction` and `ITIDispatch` types

## 3.1.0

-   Publish as plain JavaScript (CommonJS)

## 3.0.0

Virtually all of these changes are breaking.

### General

-   Replace `CancellablePromise` with `real-cancellable-promise` (same API but
    better)
-   Rename query hooks to avoid name collision with `react-query`:
    -   `useQuery` -> `useSimpleQuery`
    -   `useParameterlessQuery` -> `useSimpleParameterlessQuery`
    -   `useAutoRefreshQuery` -> `useSimpleAutoRefreshQuery`
    -   `useParameterlessAutoRefreshQuery` ->
        `useSimpleParameterlessAutoRefreshQuery`
-   Remove separate `TestHelpers` entry point. `waitForReactUpdatesFactory` can
    now be imported directly from `@interface-technologies/iti-react-core`.
-   Remove `nullToEmpty`. Use `??` instead.
-   Remove `selectFiltersByExcludingProperties`. Use Lodash `omit` instead.

### Validation

-   Change the `ValidatorOutput` type, which is returned by `Validator<T>` and
    `AsyncValidator<T>`.
    -   Now, `ValidatorOutput = string | undefined | null | React.ReactNode`,
        whereas before it was `{ valid: boolean; invalidFeedback: string | undefined }`.
    -   If the `ValidatorOutput` is **falsy**, e.g. `undefined`, that means the
        value is **valid**.
    -   If the `ValidatorOutput` is **truthy**, e.g. `'This field is required.'`, that means the value is **invalid**.
    -   All "custom" validators (validators not imported from `iti-react`) need
        to be tweaked as a result of this change.
-   `useFieldValidity` now returns on object which contains an additional
    property called `allFieldsValid`.
-   `isFieldValidityValid` has been removed as it is no longer necessary.
-   The concept of "async validation in progress" has been redesigned.
    -   The `onAsyncValidationInProgressChange` prop has been removed from
        `useValidation` and all input components.
    -   `useValidationInProgressMonitor` has been removed.
    -   If a component is invalid because async validation is in progress, the
        `ValidatorOutput` will be `ASYNC_VALIDATION_PENDING`.
-   Add function `getSubmitEnabled(formIsValid, showValidation)` which
    enables the submit button only if the form is valid or validation is not being
    shown.
