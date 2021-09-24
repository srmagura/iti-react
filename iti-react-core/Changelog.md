@@@ = breaking change

# 3.0.0

Virtually all of these changes are breaking.

-   Replace `CancellablePromise` with `real-cancellable-promise` (same API but better)
-   Rename query hooks to avoid name collision with `react-query`:
    -   `useQuery` -> `useSimpleQuery`
    -   `useParameterlessQuery` -> `useSimpleParameterlessQuery`
    -   `useAutoRefreshQuery` -> `useSimpleAutoRefreshQuery`
    -   `useParameterlessAutoRefreshQuery` -> `useSimpleParameterlessAutoRefreshQuery`
-   Remove separate `TestHelpers` entry point. `waitForReactUpdatesFactory` can now be imported directly from `@interface-technologies/iti-react-core`.
-   Remove `nullToEmpty`. Use `??` instead.
-   Remove `selectFiltersByExcludingProperties`. Use Lodash `omit` instead.
-   `useFieldValidity` now returns on object which contains a property `allFieldsValid`.
-   `isFieldValidityValid` has been removed as it is no longer necessary.
-   `useValidationInProgressMonitor` has been renamed to `useValidationProgress`
    and now returns an object which contains a property `anyValidationInProgress`.
