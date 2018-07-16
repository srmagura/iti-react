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
