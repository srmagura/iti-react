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

# 2.2.0

- Update dependencies

# 2.2.4
- Make `AddressUtil` functions tolerant to null/undefined address properties

# 2.2.6

- \*\*\* `TestHelpers`: export `waitForReactUpdatesFactory` instead of the "magic" thing it did before

# 2.3.1

- Add `isRunningAsJestTest` and `formatDateTimeConfigurable`

# 2.3.4

- Fix `formatDollars` returning '?' instead of unicode minus sign

# 2.3.5

- `onError` is now optional when calling `useQuery` and its variants. `onError` from the `ItiReactCoreContext` is used by default.

# 2.3.6

- \*\*\* `CancellablePromise.delay` now rejects with `PROMISE_CANCELED` instead of `undefined` when it is canceled. `pseudoCancellable` also rejects with `PROMISE_CANCELED` now instead of `PSEUDO_PROMISE_CANCELED`.

# 2.3.9

- Add class `IError`

# 2.4.1

- Update packages

# 2.4.3

- Fix `isRunningAsJestTest` for Webpack 5

# 2.4.16

- `Validators.minLength` trim input

# 2.5.1

- `Validators.email`: use Regex from HTML5 spec

# 2.5.11

- `useAutoRefreshQuery`: `enableAutoRefresh` prop

# 2.6.0

- Update packages