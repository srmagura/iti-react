# 3.0.0

-   Replace `moment` with `dayjs`
-   Replace `CancellablePromise` with `real-cancellable-promise` (same API but better)
-   Rename query hooks to avoid name collision with `react-query`:
    -   `useQuery` -> `useSimpleQuery`
    -   `useParameterlessQuery` -> `useSimpleParameterlessQuery`
    -   `useAutoRefreshQuery` -> `useSimpleAutoRefreshQuery`
    -   `useParameterlessAutoRefreshQuery` -> `useSimpleParameterlessAutoRefreshQuery`
-   Remove separate `TestHelpers` entry point. `waitForReactUpdatesFactory` can now be imported directly from `@interface-technologies/iti-react-core`.
-   Remove `nullToEmpty`. Use `??` instead.
-   Remove `selectFiltersByExcludingProperties`. Use Lodash `omit` instead.
