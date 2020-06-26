\*\*\* = breaking change

# 2.0.3

- \*\*\* LOTS of core changes
- \*\*\* Remove `DataUpdater`, `IDataUpdater`, and `AutoRefreshDataUpdater`.  
    - They can now be found in `@interface-technologies/iti-react-v1-legacy`
- \*\*\* Remove `childValidChange` and `onChildReady`
    - They can now be found in `@interface-technologies/iti-react-v1-legacy`
    - Instead, use `useFieldValidity` or `useReadiness` respectively
- \*\*\* Remove `withValidation`. Converted `PersonNameInput`, `TimeInput`, `DateInput`, and `PhoneInput` to `useValidation`.
- \*\*\* `PersonNameInput`: `disabled` is no longer allowed in `inputAttributes`. Use the `enabledInputs` prop instead.
- \*\*\* Move source code into `src` directory - deep imports will need to be changed.
- \*\*\* Remove `CustomLoadable` - use `React.lazy` instead. Recommended migration:   
    1. Use `export default` for all `Page` components
    2. Replace all calls to `CustomLoadable` with `React.lazy`
    3. Wrap the React Router `<Switch />` with `<Suspense fallback={null} />`
- \*\*\* Remove export `formToObject`
- \*\*\* `SubmitButton`: change `disabled-link` class to `disabled`. Add CSS rule to set `pointer-events: none` on links with the class `disabled`.  
- `EasyFormDialog`: using `formData` in `onSubmit` has been deprecated.
- Add function `getGenericEasyFormDialog<TResponseData>()`
- Add `TestHelpers` module that exports a function called `waitForReactUpdates`
- LOTS of small changes to fix eslint errors

## v2 Migration Plan
See `iti-react-core` migration plan too.  

These changes can be made gradually:  
1. Change all imports of `DataUpdater`, `IDataUpdater`, `AutoRefreshDataUpdater`, `childValidChange`, and `onChildReady` to be from `@interface-technologies/iti-react-v1-legacy`
2. Use `React.lazy` to import pages instead of `CustomLoadable`. Update the page modules to default export the page.
3. If `formToObject` is used, copy it into your codebase and update the imports.

Then:
4. Update `iti-react` to `2.0.0`.
5. Fix any deep imports that where broken by moving the `iti-react` code into a `src` folder.
6. Update usages of `PersonNameInput` where `disabled` is passed in `inputAttributes`. Use the `enabledInputs` prop instead.
7. Update any styles or JSX that refers to the old `disabled-link` class.

# 2.0.4

- \*\*\* Rename query hooks:  
    - `useParameterizedQuery` -> `useQuery`
    - `useParameterizedAutoRefreshQuery` -> `useAutoRefreshQuery`
    - `useQuery` -> `useParameterlessQuery`
    - `useAutoRefreshQuery` -> `useParameterlessQuery`
- `useAsyncValidator`: don't asynchronously update the component if `asyncValidator` is `undefined`.  

# 2.0.5

- CSS fix: prevent disabled links that have a text color class (e.g. `text-danger`) from 
  retaining their original color when disabled (red in the case of `text-danger`)

# 2.0.6 

- Core changes only

# 2.0.7

- Update packages

# 2.0.8

- \*\*\* Remove `easyFormDialog` key from `ItiReactContextData`. `ItiReactCoreContextData.onError` is used instead.
- Core changes

# 2.0.9

- `Dialog`: don't add multiple event listeners if `onClose` changes

# 2.0.10

- Core changes only

# 2.0.11

- Core changes only

# 2.0.12

- `Select` components: only search the `label` when filtering

# 2.0.13

- CSS fix: Disabled link color was incorrectly being applied to disabled buttons
- Core changes

# 2.1.0

- Update dependencies. You now need to add `declare module 'input-format/react'` to your `.d.ts` file.

# 2.1.1

- Fix providing the same prop twice in a few places to prevent TS 3.9 compile error

# 2.1.3

- Core changes only

# 2.1.4

- Core changes
- \*\*\* `Dialog`: rename `modalClassName` prop to `modalClass`

# 2.1.5

- `AddressInput`: Add `<div className="state-select">` around state Select to support Cypress tests

# 2.1.6

- `Pager`: use `React.memo`
- `ValidatedAsyncSelect`: allow `loadOptions` to return `GroupType<SelectOption>[]`

# 2.1.7

- `confirm`, `alert`: Add `modalClass` option

# 2.1.8

- `ValidatedSelect`, `ValidatedAsyncSelect`: fix uncontrolled->controlled warning that occurred when the value of a disabled select was changed