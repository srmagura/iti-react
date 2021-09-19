# 3.0.0

- Lots of core changes
- Replace `moment` with `dayjs`  
- Replace `react-hint` with `@tippyjs/react`
- `DateInput`:
    - `DateInputValue` changed from `{ moment: moment.Moment | undefined, raw: string }` to simply `dayjs.Dayjs | null`
    - Remove `dateInputValueFromMoment`