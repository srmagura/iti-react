# 2.0.3

- \*\*\* `useParameterized(AutoRefresh)Query`:
    - `queryParams` MUST BE REFERENTIALLY STABLE
    - switch the order of the arguments of `shouldQueryImmediately`. The order is now `shouldQueryImmediately(prev, cur)`.
- \*\*\* `useParameterizedQuery`:  
    - remove the `queryOnMount` option
- \*\*\* `useParameterizedAutoRefreshQuery`:
    - remove `startAutoRefresh` from the return value. The timer now starts automatically.
- \*\*\* `pseudoCancellable`: before, the returned promise threw the string `PSEUDO_PROMISE_CANCELED`. Now it throws an `Error` such that `Error.message === PSEUDO_PROMISE_CANCELED`.  
    - This can be fixed in existing code by searching for all uses of .
- Add `CancellablePromise.delay(ms)`
- Add `TestHelpers` module that exports a function called `waitForReactUpdates`
- Move code into `src` folder
- LOTS of small changes to fix eslint errors

## v2 Migration Plan

These changes can be made gradually:  
1. Use `useMemo` to make all query params objects referentially stable
2. Search for all usages of `PSEUDO_PROMISE_CANCELED` and update the code to expect an `Error` object

Then:
3. Update `iti-react-core` to `2.0.0`.
4. Fix any deep imports that where broken by moving the `iti-react-core` code into a `src` folder.

# 2.0.6

- `useValidation`: allow `validationKey` to be `boolean`

# 2.0.7

- Update packages

# 2.0.8

- \*\*\* Add `onError` to `ItiReactCoreContextData`
- `useQuery`: bugfix - did not catch the error when the `query` threw synchronously instead of returning a rejected promise
- `useAsyncValidator`: use `onError` from context if `onError` prop is undefined

# 2.0.10

- `useControlledValue`: fix it from acting as an uncontrolled component when `value` was passed and `onChange` was not

# 2.0.11

- `Validators.number`, `Validators.integer`: Numbers that outside the range of the int32 and double data types are now considered invalid

# 2.0.13

- `useAsyncValidator`: Never return `validationInProgress=true` when a synchronous validator is false

# 2.1.0

- Update dependencies

# 2.1.3

- `selectFiltersByExcludingProperties` now returns `Partial<TQueryParams>` instead of an array of key-value pairs  
    - This change affects the `selectFilters` argument of `resetPageIfFiltersChanged` too

# 2.1.4

- `resetPageIfFiltersChanged` now excludes `pageSize` from the query params by default
