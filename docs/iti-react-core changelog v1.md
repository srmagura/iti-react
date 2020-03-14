﻿\*\*\* = breaking change

# 1.0.0

-   Initial version

# 1.8.9

-   Add pseudoCancellable

# 1.8.13

-   Fix typo in a method name

# 1.9.2

-   PaginationUtil:
    -   Bring in resetPageIfFiltersChanged
    -   Bring in an improved version of preventNonExistentPage
-   Export Omit type. It can be removed from your .d.ts file and imported from iti-react-core instead
-   Bring in PhoneNumberUtil from iti-react and export formatPhoneNumber

# 1.12.3

-   Add `buildCancellablePromise(innerFunc)`
-   \*\*\* Rename `PSEUDO_PROMISE_CANCELLED` to `PSEUDO_PROMISE_CANCELED`

# 1.12.4

-   `buildCancellablePromise`: correctly handle capturing multiple promises that run in parallel

# 1.13.6

-   Change argument of `pseudoCancellable` from `Promise<T>` to `PromiseLike<T>` to allow objects that
    are thenable but not promises

# 1.14.1

-   `resetPageIfFiltersChanged`: add optional `selectFilters` argument to allow customizing which properties of `QueryParams` are compared

# 1.15.8

-   `preventNonExistentPage`: change argument `items: any[]` to `pageHasItems: boolean` to make it more clear what the function depends on

# 1.16.0

-   \*\*\* Convert to Babel-style imports
-   \*\*\* Remove `Omit` type since it is a built-in now

# 1.16.2

-   Move `useCancellablePromiseCleanup`, `useFieldValidity`, and `usePrevious` from `iti-react` to `iti-react-core`

# 1.17.0

-   Move `useQuery` and related hooks from `iti-react` to `iti-react-core`
-   Move `useValidation`, `Validator`, and `useControlledValue` from `iti-react` to `iti-react-core`
-   Change return type of `getGuid` from `any` to `string`

# 1.17.1

-   Bring in `AddressUtil` from `iti-react`

# 1.17.2

-   `Validators.money`: fix values with more than three digits after the decimal being considered valid

# 1.17.5

-   `useValidation`: Fix infinite loop when the `onAsyncValidationInProgressChange` did not have a stable identity

# 1.17.8

-   `formatPhoneNumber`: allow the argument to be `null` or `undefined`

# 1.18.0

-   Add `useValidationInProgressMonitor` hook, along with `areAnyInProgress` function

# 1.18.2

-   `useValidationInProgressMonitor` fixes

# 1.18.3

-   `Validators.money`: fix regression that caused it to return false for negative numbers even when `allowNegative` was `true`

# 1.18.4

-   Export `normalizePhoneNumber`

# 2.0.0

- \*\*\* `useValidation`: `onValidChange` and `onAsyncValidationInProgressChange` must be referentially stable to avoid an infinite `useEffect` loop  
    - All places where these functions are defined in each need to be addressed. One fix is to wrap it in `useMemo`.  
    - `onChildValidChange` from `useFieldValidity` and `onChildProgressChange` from `useValidationInProgressMonitor` are guaranteed to be stable
- \*\*\* `useParameterized(AutoRefresh)Query`:
    - `queryParams` MUST BE REFERENTIALLY STABLE
    - switch the order of the arguments of `shouldQueryImmediately`. The order is now `shouldQueryImmediately(prev, cur)`.
- \*\*\* `useParameterizedQuery`:  
    - remove the `queryOnMount` option
- \*\*\* `useParameterizedAutoRefreshQuery`:
    - remove `startAutoRefresh` from the return value. The timer now starts automatically.
- \*\*\* `pseudoCancellable`: before, the returned promise threw the string `PSEUDO_PROMISE_CANCELED`. Now it throws an `Error` such that `Error.message === PSEUDO_PROMISE_CANCELED`.  
    - This can be fixed in existing code by searching for all uses of `PSEUDO_PROMISE_CANCELED`.
- Add `CancellablePromise.delay(ms)`
- Move code into `src` folder
- LOTS of small changes to fix eslint errors