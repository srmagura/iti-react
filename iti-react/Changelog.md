\*\*\* = breaking change

# 1.0.1

-   Export TimeInputValue, timeInputFormat
-   Add function timeInputValueFromMoment
-   \*\*\* Rename dateFormat to dateInputFormat

# 1.0.2

-   Fix TimeInput when it's used as a controlled component

# 1.0.3

-   \*\*\* iti-react is now an npm package
-   Add dateInputValueFromMoment

# 1.1.0

-   Add ValidatedSelect and ValidatedMultiSelect
-   \*\*\* Add themeColors to ITIReactContext

# 1.1.1

-   ValidatedSelect, ValidatedMultiSelect: add className prop

# 1.1.2

-   Fix AsyncRouter not responding to changes in `location.search`

# 1.1.3

-   Fix setting state after unmount in WithValidation

# 1.1.4

-   Finally fix warnings about redirecting to the current location. Added NoWarnRedirect
    which should be used in place of react-router Redirect.

# 1.1.5

-   Add .npmignore to prevent NotejsTools DLL from being publish.

# 1.2.0

-   Add TdLink
-   Add utility functions: PaginationHelpers, FormUtil, UrlUtil

# 1.2.1

-   Add required validator to ValidatedMultiSelect

# 1.3.0

-   Add RadioInput and BooleanRadioInput
-   \*\*\* `requiredTimeValidator => TimeValidators.required`

    `requiredDateValidator => DateValidators.required`

# 1.3.1

-   DateInput: add ability to select the time
-   \*\*\* Add includesTime property to DateInputValue

# 1.3.2

-   Add TimeZone input
-   Fix ValidatedSelect not handling backspace properly

# 1.3.3

-   Add class names to make it easy to style RadioInput

# 1.3.4

-   \*\*\* Rename PaginationHelpers to PaginationUtil
-   \*\*\* Change getTotalPages signature to accept itemCount instead of the items themselves

# 1.3.5

-   ValidatedSelect: fix bug when an option had a value of 0

# 1.3.6

-   Add radio-button-container class to allow styling RadioInput using CSS grid

# 1.4.0

-   Add AddressInput
-   \*\*\* Add field to IITIReactContextData: fieldLengths, themeColors.inputPlaceholder
-   ValidatedSelect / ValidatedMultiSelect:
    -   Make gray colors consistent with Bootstrap
    -   Add width prop as a convenience

# 1.4.1

-   Add more entries to .npmignore

# 1.4.2

-   AddressInput: make line 2 optional

# 1.4.3

-   \*\*\* Remove export timeFormat (use timeInputFormat instead)
-   Add export dateTimeFormat, to be used with showTimeSelect

# 1.4.4

-   You can now pass in arrays to formatUrlParams, e.g. formatUrlParams({ ids: [1,2,3 })
-   \*\*\* Provide stricter type for formatUrlParams argument

# 1.4.5

-   Add width prop (with default) to TimeZoneInput

# 1.4.6

-   AddressInput: increate State select width to prevent display issues in Firefox

# 1.4.7

-   DateInput: date being interpreted as invalid when there was trailing whitespace

# 1.4.8

-   DateInput: add enabled prop

# 1.4.9

-   ValidatedSelect & ValidatedMultiSelect: add enabled prop
-   ValidatedSelect: prevent backspace from clearing selection when isClearable is false
-   RadioInput: use Bootstrap form-check styles

# 1.4.10

-   \*\*\* childValidChange / childProgressChange fix: pass the callback function to setState() as a callback, instead of doing setState(s => { callback() }), which is bad! - To make your code compile replace-all: "f => setState(f)" to "x => setState(...x)".

# 1.4.11

-   \*\*\* DateInputValue no longer has includesTime property, and no longer calls onChange when in componentDidMount(). When using time selection, you need to pass includesTime=true to the DateInput validators.

# 1.4.12

-   AddressInput: state comparison is now case-insensitive
-   Bring in getRandomId and make the returned IDs look cooler
-   Make form-control and ValidatedSelect have the same colors when disabled
-   Add >= and <= validators

# 1.4.13

-   Prevent integer() and number() validators from accepting numbers with trailing letters, e.g. '12abc'

# 1.4.14

-   Add hidden JSON `<input>` to ValidatedMultiSelect

# 1.4.15

-   Allow passing JSX element to confirm()

# 1.5.0

\*\*\* Rewrite of CancellablePromise.

-   No changes to the functionality, just to the interface.
-   CancellablePromise is now a class.
-   Added a much-needed CancellablePromise.all().
-   The rest of the interface was changed to be more similar to be analogous to normal Promises.

Migration path:

-   ICancellablePromise -> CancellablePromise (using replace all is recommended)
-   withCancel(promise, cancel) -> new CancellablePromise(promise, cancel)
-   cancellableThen(promise, onFulfilled) -> promise.then(onFulfilled)
-   cancellableResolve(value) -> CancellablePromise.resolve(value)

# 1.6.0

-   \*\*\* Rewrite of TimeInput

    -   Now using react-select
    -   The hidden inputs now contains the JSON of the TimeInputValue rather than a formatted time string
    -   Add props: enabled, ClearButtonComponent
    -   Replace timeInputValueFromMoment with timeInputValueFromDecimalHours
    -   Add timeInputValueToDecimalHours
    -   Export toDecimalHours() and toHoursAndMinutes()

-   \*\*\* iti-react.scss

    -   Change to TimeInput styles.
    -   Add .no-link to TdLink CSS, which should have already been there
    -   Fix AddressInput styles on mobile

-   ValidatedSelect

    -   Hide react-select indicator separator unless clear icon is shown
    -   Render a hidden input when enabled=false (since React Select will not render an input element in this case)
    -   getSelectStyles now returns a function for EVERY component that can be styled
    -   Increase menu z-index to match Bootstrap's \$zindex-dropdown
    -   Make it a PureComponent

-   DataUpdater

    -   \*\*\* Remove isCancelledQuery from DataUpdaterOptions because it is no longer needed
    -   Add argument changeLoading to handleQueryParamsChange
    -   Cancel delayed invocations of doQueryDebounced in componentWillUnmount. This was causing setState after unmount
    -   Fix doQueryAsync not throwing when request was cancelled. This could also cause setState after unmount

-   Dialog

    -   Make escape key close the dialog, but only when allowDismissable=true
    -   Fix setState after unmount that occurs when page is hot reloaded

-   Accessibility: added ID prop or aria-labels to all inputs
-   Fix withValidation equality comparison bug, which caused onValidChange to be called infinitely
-   Fix double-clicking a link cancelling navigation
-   \*\*\* Remove second type argument from IDataUpdater<>
-   ThemeColors now includes all theme colors rather than just a few
-   Make InputWithFeedback, ValidatedSelect, and ValidatedMultiSelect PureComponents

# 1.6.1

-   DateInput: add showPicker prop to allow hiding the picker
-   \*\*\* Remove TResult type parameter from AutoRefreshUpdater
-   DataUpadater / AutoRefreshUpdater: make onLoadingChange and onRefreshingChange optional

# 1.6.2

-   Create TabManager - a tab layout that keeps track of which tabs are mounted and handles displaying the correct tab, or a loading indicator if the isn't ready yet
-   Bring in onChildReady
-   DateInput: Fix the enter key selecting the current date when showPicker=false
-   Export module RoutingUtil with function locationsAreEqualIgnoringKey
-   \*\*\* ITIReactContext(Data) -> ItiReactContext(Data)
-   \*\*\* loadingIndicatorComponent -> renderLoadingIndicator and change type to () => React.ReactNode
-   Rename iti-react.scss to index.scss

# 1.6.3

-   Fix file capitalization issue that was causing webpack-dev-server to update the iti-react files every time
-   Add TabManager displaySingleTab prop

# 1.6.4

-   Make DateInput width consisent regardless of whether showPicker=true or false

# 1.6.5

-   DateInput
    -   Upgrade to react-datepicker 2
    -   Previously, if a user typed an incomplete date or date time and clicked away, the text they entered would disappear. DateInput now accepts partial dates so that the user's input is not erased.
-   Upgrade to TS 3.2

# 1.6.6

-   \*\*\* Add includesTime argument to dateInputValueFromMoment. It was not setting raw correctly when the DateInput had showTimeSelect=true

# 1.6.7 - DON'T USE

# 1.6.8

-   Add overload to allow the syntax CancellablePromise.resolve(), i.e. no type argument and no argument

# 1.6.9

-   \*\*\* Replace getRandomId() with getGuid(). To migrate, just replace-all "getRandomId" with "getGuid".

# 1.6.10

-   \*\*\* Change Tab type from { name: string; displayName: string } to [string, string] i.e. [tabId, tabName].

# 1.6.11

-   Fix blatant bug with the last change

# 1.6.12

-   \*\*\* Change meaning of TabManager children argument. It's type is [string, boolean, React.ReactNode].
    Previously, the boolean represented showLoadingIndicator. Now it represents tabIsReady. So the meaning of the boolean was flipped.

# 1.6.13

-   SubmitButton: add support for displaying a disabled link

# 1.7.0

-   Changes to enable using using form-control-sm and form-control-lg:

    -   ValidatedInput, DateInput: add className prop
    -   ValidatedSelect: add formControlSize prop
    -   \*\*\* getSelectStyles(): take a single options object instead of 4 positional arguments, and add option formControlSize

-   ValidatedSelect / ValidatedMultiSelect improvements:

    -   Use @types/react-select.

        -   \*\*\* SelectGroupOption has been removed. Use `GroupType<SelectOption>` instead.
        -   Users of iti-react should remove the line "declare module 'react-select'" from their .d.ts files.

    -   Move getSelectStyles() to its own file. Not a breaking change, assuming you were importing from the index.
    -   Add components prop to allow passing custom components

-   AsyncRouter: make it work properly when the URL search params are factored into the location key
-   Bring in arePathsEqual()

# 1.7.1

-   \*\*\* Rename locationsAreEqualIgnoringKey to areLocationsEqualIgnoringKey
-   Change Validated(Multi)Select props to allow using option types that extend SelectOption

# 1.7.2

-   Make DataUpdater properly handle null and undefined queryParams

# 1.7.3

-   Redo smelly implementation of previous change

# 1.7.4

-   TabManager: while tab is not ready, wrap the tab contents in a display:none div.

# 1.7.5

-   (Boolean)RadioInput: Add buttonOptions prop that allows you to enable/disable use of form-check-inline. Allow passing React.ReactNode for option labels.

# 1.7.6

-   \*\*\* AutoRefreshUpdater: added props isConnectionError, connectionErrorTreshold, and onConnectionError to avoid displaying errors on transient connection errors.

# 1.7.7

-   \*\*\* Remove WithValidationInjectedProps.inputAttributes, since inputAttributes is really only relevant to ValidatedInput
-   Add enabled prop to ValidatedInput for consister

# 1.7.8

-   ValidatedSelect and ValidatedMultiSelect: add getStyles prop to allow customizing styles
-   AddressInput: add getStateSelectStyles prop

# 1.7.9

-   Fix the changes from version 1.7.7 mutating the value of the inputAttributes prop

# 1.7.10

-   Add enabled prop to Pager

# 1.7.11

-   Export type TabManagerRenderTab

# 1.7.12

-   onChildReady: use lodash.merge() internally to support deep updates

# 1.7.13

-   Fix various Validated(Multi)Select paddings when formControlSize is 'sm' or 'lg'.

# 1.7.14

-   SubmitButton: fix loading indicator vertical align for btn-sm and btn-lg

# 1.8.0

-   Bring in AddressDisplay

# 1.8.1

-   Use window.setTimeout instead of setTimeout to resolve compile errors when @types/node is installed

# 1.8.2

-   Switch from moment to moment-timezone
-   Add user-select-none to radio button labels
-   SubmitButton style fix: use disabled attribute rather than disabled CSS class
-   Tab Manager - \*\*\* Change default of displaySingleTab from false to true
    -   Add margin-bottom

# 1.8.3

-   \*\*\* Validators.required() - call trim on value before checking if length === 0
    -   Bring in CustomLoadable
-   Add title and cancelButtonText to options for confirm()
-   Add cancelButtonText prop to ActionDialog
-   Add readOnly prop to DateInput
-   Remove dependency on the now-removed history/PathUtils. RouteUtil now exports stripTrailingSlash
-   Upgrade to @types/react-datepicker v2
-   Add aria-disabled to disabled SubmitButton `<a>`
-   SubmitButton - disallow disabled prop

# 1.8.4

-   Remove typescript peer dependency

# 1.8.5 (DON'T USE)

-   \*\*\* Upgrade to react-router-dom 5 to fix error caused by iti-react and the application using different react-router versions
-   Upgarde other yarn packages

# 1.8.6

-   Pin react-router-dom to 4.3.1 to avoid the context errors we get when upgrading to react-router 5

# 1.8.7

-   DateInput: fix readOnly prop having no effect if showPicker=false

# 1.8.8

-   Start referencing iti-react-core

# 1.8.9

-   Core changes only

# 1.8.10

-   Forgot to increase the version number of the iti-react-core dependency in package.json

# 1.8.11

-   Move import react-datepicker.css to iti-react so that projects that use iti-react don't have to import it

# 1.8.12

-   Successfully fix the problem that 1.8.11 was trying to fix

# 1.8.13

-   Core changes only

# 1.9.0 (DON'T USE)

# 1.9.1

-   TabManager: When defining tabs, you can now specify the className for the `<a>` element like this:

```
const myTab: Tab = ['tabName', 'Tab Label', { className: 'my-tab' }]
```

# 1.9.2

-   Core changes
-   \*\*\* onChildReady:
    -   Deprecate the old onChildReady
    -   Add onChildReady2 that only executes callback if readiness actually changed.
        See OnChildReady.ts for the migration path
-   \*\*\* rename ActionDialogProps.loading to actionInProgress
-   Bring in FormCheck
-   Add replacement for window.alert(): `alert(content: string | React.ReactElement<any>, options?: { title?: string }): Promise<void>`
-   Add `validated-input` class to the `<div>` that wraps ValidatedInput, .etc
-   Move formatPhoneNumber to iti-react-core

# 1.9.3

-   ActionDialog: add showFooter prop that defaults to true

# 1.9.4

-   \*\*\* Add react-datepicker as a peer dependency to fix missing react-datepicker.css in production build

# 1.9.5

-   ActionDialog: add onCancel prop that is optional

# 1.9.6

-   CustomLoadable: Call console.error() for errors

# 1.9.7

-   \*\*\* Validators.email() now allows empty strings. Use Validators.required() to make a required email field

# 1.9.8

-   Core changes
-   \*\*\* DateValidators.required change argument from boolean to { includesTime: boolean } to improve readability

# 1.9.9

-   Export new functions: isPostalCodeValid, postalCodeValidator
-   Add real postal code validation to AddressInput
-   \*\*\* Remove zip property from ItiReactContextData.fieldLengths.address.

# 1.9.10

-   Fix significant AddressInput validation issues:
    -   Invalid zip did not make the AddressInput itself invalid
    -   If no required() validator, partial addresses were considered valid

# 1.10.0 (DON'T USE)

# 1.10.1 (DON'T USE)

# 1.10.2

-   Add hook version of `childValidChange`: `useFieldValidity`
-   Make react and react-dom peer dependencies to fix invalid hooks warning

# 1.10.3

-   Add hook version of `onChildReady`: `useReadiness`
-   Now recommending that `useFieldValidity` be used as the hook version of `childProgresChange`

# 1.10.4

-   Export phoneInputValidator

# 1.10.5

-   `getSelectStyles()`: prevent disabled styles from overriding other styles, e.g. border color

# 1.10.6

-   \*\*\* Remove the deprecated `onChildReady` and rename `onChildReady2` to `onChildReady`
-   Change return value of `useFieldValidity` from `childValidChange` to `[childValidChange, fieldValidity]`

# 1.10.7

-   Comment out "Unexpected call to onReady" warning

# 1.10.8

-   OnChildReady properly merges readiness

# 1.10.9

-   Fix `AddressDisplay` props to allow undefined and null

# 1.10.10

-   Fix SubmitButton submitting form when submitting=true and type="submit"
-   Export type `AddressDisplayAddress`

# 1.11.0

-   Add `ErrorRouteSynchronizer`
-   Add `defaultTabName` option to `getTabFromLocation` and `TabManager`

# 1.11.1

-   Bring in `useCancellablePromiseCleanup`
-   Make options object optional for `useFieldValidity`

# 1.11.2 (DON'T USE)

# 1.11.3

-   \*\*\* `States.ts` overhaul. Now exports `usStates`, `canadianProvinces`,
    `getStates()`, and `getStateOptions()`
-   `AddressInput` now supports Canadian addresses - `AddressInput` has an `allowCanadian` prop. You can either set the prop
    directly on each `AddressInput` or set the `allowCandianAddresses` property
    in `ItiReactContext`

# 1.12.0

-   \*\*\* iti-react now requires `typescript@^3.5.0`
-   Add query hooks: `UseParameterizedQuery`, `UseParameterizedAutoRefreshQuery`, `UseQuery`, `UseAutoRefeshQuery`, `UsePagination`
-   Add `PersonNameInput`
-   Fix `AddressInput` bug - changing the state would reset the other fields to their initial values
-   \*\*\* `ValidatedInput`: change type of `inputAttributes` from `any` to `React.DetailedHTMLProps<any, any>`

# 1.12.1

-   Forgot to export `UseQuery` and `UseAutoRefreshQuery`

# 1.12.2

-   Bring in `SavedMessage`
-   \*\*\* Remove `addressInput` from `defaultItiReactContextData` to force setting `allowCanadian` explicitly
-   Remove `debounceDelay` from `UseQuery` and `UseAutoRefreshQuery` options

# 1.12.3

-   Core changes

# 1.12.4

-   Core changes

# 1.12.5

-   \*\*\* Update to react-select 3

# 1.12.6

-   Rewrite AsyncRouter to use hooks. Fixed a bug that occurred when a page called onReady on every update
-   Add UsePrevious hook

# 1.12.7

-   Add `isLoading` prop to Validated(Multi)Select

# 1.12.8

-   `TabManager`: make transition between tabs more smooth. tab-content height no longer changes when the loading indicator is displayed

# 1.13.0

-   Add `useValidation` hook to replace `withValidation` HOC
-   Add `useControlledValue` hook
-   `AddressInput` - Convert to using `withValidation`
    -   \*\*\* Change `zip` property of `AddressInputValue` to `postalCode`
    -   \*\*\* make `individualInputsRequired` a required prop
    -   Export `InternalAddressValidators`
-   `AddressDisplay`: Change `zip` to `postalCode`
-   \*\*\* `ValidationFeedback`: make `asyncValidationInProgress` a required prop
-   \*\*\* `formatZip` renamed to `formatPostalCode`. Functionality is the same.

# 1.13.1

-   Forgot to export `InternalAddressValidators`

# 1.13.2

-   Fix an issue with `TabManager`'s `useSmoothTransitionHook`

# 1.13.3

-   `AutoRefreshUpdater` / `UseParameterizedAutoRefreshQuery`: increase initial `consecutiveErrorCount` to
    `connectionErrorThreshold - 1` so that `onConnectionError` is called immediately if the initial query fails

# 1.13.4 (DON'T USE)

# 1.13.5

-   `Dialog`, `ActionDialog`:
    -   \*\*\* Remove `id` prop
    -   Add `closeRef` prop
    -   \*\*\* Rename `modalClass` prop to `modalClassName`
-   Add property `ItiReactContextData.dialog.closeOnEscapeKeyPress` of type `() => boolean`
-   \*\*\* `SavedMessage`: replace `functionRef` prop with `showSavedMessageRef` which is actually a ref
-   Convert `Dialog` and `Alert` to hooks

# 1.13.6

-   Core changes only

# 1.13.7

-   Upgrade to react 16.9 and typescript 3.6

# 1.13.8

-   Change two imports from 'react-router' to 'react-router-dom'

# 1.14.0 (DON'T USE)

# 1.14.1

-   Support configurable `pageSize`:
    -   iti-react-core: `resetPageIfFiltersChanged`: add optional `selectFilters` argument to allow customizing which properties of `QueryParams` are compared
    -   `usePagination`: rename `pageSize` to `pageSizeWhenItemsRetrieved`, to support configurable page size
-   Upgrade to react-router 5 to fix deprecated lifecycle method warnings
-   \*\*\* Remove `NoWarnRedirect` - it doesn't seem necessary anymore
-   Fix `alert` and `confirm` dialogs not fading out when the OK/confirm button was clicked
-   Pressing the Enter key now closes alerts

# 1.14.2

-   Add US Virgin Islands, Micronesia, and Northern Mariana Islands to list of states

# 1.14.3

-   Fix type of `onClick` in `LinkButtonProps`, to allow click handlers to access the event

# 1.14.4

-   Wrap `AddressInput` with `React.memo()`

# 1.14.5

-   Optimize `AddressInput` so that the `ValidatedSelect` does not rerender when other fields are changed

# 1.14.6 (DON'T USE)

# 1.14.7

-   Convert `ValidatedInput` to use `useValidation`
-   `useValidation`: implement AsyncValidation
-   `ValidationFeedback` now does its own debouncing for `asyncValidationInProgress`
-   Flatten `useAutoRefreshQuery` and `useParameterizedAutoRefreshQuery` options

# 1.14.8

-   Fix `useAsyncValidator` setting `valid = false` for inputs that only had synchronous validators

# 1.14.9

-   `useValidation`: Fix infinite setState loop when `onValidChange` is not referentially stable

# 1.14.10

-   `ErrorRouteSynchronizer`: Fix error page not being shown when AppState.error is already set

# 1.15.0

-   `ValidatedSelect`, `ValidatedMultiSelect`:
    -   Convert to using `useValidation`
    -   Add `isOptionEnabled` prop
    -   Add `aria-labelledby` prop

# 1.15.1 (DON'T USE)

# 1.15.2

-   `ValidatedSelect`, `ValidatedMultiSelect`: add a type annotation to fix a really weird typescript error that only occurs when iti-react is unused in other projects

# 1.15.3

-   `useControlledValue`: correctly handle the case when `value` and `onChange` are provided, but `value` starts as undefined
-   `ValidatedSelect`: fix vertical placement of `<input>` when `formControlSize` is set

# 1.15.4

-   `SelectOption`: add optional boolean properties `isDisabled` and `isFixed`
    -   `isFixed` only applies to multiselect

# 1.15.5

-   `ValidatedMultiSelect`: selected options are now displayed in the order they were added

# 1.15.6

-   \*\*\* Convert `RadioInput` and `BooleanRadioInput` to hooks & `useValidation`.
    -   Some validation-related props may have changed
    -   `BooleanRadioInput` now accepts an optional boolean prop `trueFirst` that allows controlling the order of the options

# 1.15.7

-   `useAsyncValidator`: don't execute the query method on mount if `asyncValidator` is undefined
-   `useParameterizedQuery`: remove unnecessary debounced callback cancellation code

# 1.15.8

-   \*\*\* Rename `usePagination` to `usePaginationHelpers` to better reflect its functionality
-   `confirm` / `alert`: Focus the first button on mount
-   Add `focusFirstOptions` prop to `Dialog`. The only option right now is `additionalTagNames`.
-   Core changes

# 1.15.9

-   `Validators.number`: fractional number that start with a decimal e.g. `.1` are now valid
-   `Validators.money`: make the validator less strict about the format of the number

# 1.15.10 (DON'T USE)

# 1.15.11

-   \*\*\* Fixed `DateInput` handling datetime entry in non-local time zones completely wrong
    -   Add `timeZone` prop
        -   This makes time zone of `value.moment` is now irrelevant. For example the moment can be in UTC.
    -   Rename prop: `showTimeSelect` -> `includesTime`
    -   `dateInputValueFromMoment` now accepts an options argument with keys `includesTime` and `timeZone`

# 1.16.0

-   \*\*\* Convert to Babel-style imports

# 1.16.1

-   Add `ClickToCopy` component

# 1.16.2

-   `Validated(Multi)Select`
    -   Add `menuIsOpen`, `onMenuOpen`, `onMenuClose` props
    -   Change the disabled text color to match Bootstrap `form-control`
-   Move `useCancellablePromiseCleanup`, `useFieldValidity`, and `usePrevious` from `iti-react` to `iti-react-core`-

# 1.17.0

-   Move `useQuery` and related hooks from `iti-react` to `iti-react-core`
-   Move `useValidation`, `Validator`, and `useControlledValue` from `iti-react` to `iti-react-core`
-   Fix `DateInput` race condition that could cause the input to register as invalid when a date was chosen from the picker
-   Change return type of `getGuid` from `any` to `string`

# 1.17.1

-   Move utility functions from `AddressDisplay.tsx` to `iti-react-core`

# 1.17.2

-   Core changes only

# 1.17.3

-   Forgot to remove `useAutoRefreshQuery` options from `ItiReactContextData`. Those options are now part of `ItiReactCoreContextData`.

# 1.17.4

-   Bring in `EasyFormDialog`

# 1.17.5

-   Core changes only

# 1.17.6

-   Allow JSX elements for dialog titles

# 1.17.7

-   `TimeInput`: For the hour select, make 12 the last option instead of the first option

# 1.17.8

-   Core changes only

# 1.17.9

-   Add `ValidatedAsyncSelect` component and `AsyncSelectUtil`

# 1.18.0

-   Remove `AsyncProgress` and `childProgressChange`
-   Core change: add `useValidationInProgressMonitor`
