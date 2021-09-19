# 3.0.0

- Lots of core changes
- Replace `moment` with `dayjs`  
- Replace `react-hint` with `@tippyjs/react`
- `DateInput`:
    - `DateInputValue` changed from `{ moment: moment.Moment | undefined, raw: string }` to simply `dayjs.Dayjs | null`
    - Remove `defaultDateInputValue` since it's just `null` now
    - Remove `dateInputValueFromMoment`
    - Remove `noPicker` prop
- `DateInputNoPicker`: 
    - New component which has the same functionality as the old `DateInput` with `noPicker=true`
    - It's value is just a `string`. Use `parseDateInputNoPickerValue` to get a `dayjs` object from the string.