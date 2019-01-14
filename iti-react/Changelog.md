﻿\*\*\* = breaking change

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