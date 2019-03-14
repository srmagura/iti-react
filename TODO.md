TabManager:

- remove exception when tabs array is empty - just dont render anything

# Backlog

- Remove "as any" in render method of DateInput when @types/react-datepicker 2.0.0 becomes available
- Known issue: ValidatedSelect text overflow when typing a long search string  
  https://github.com/JedWatson/react-select/issues/2774
- Figure out why absolute imports don't work in the iti-react project
- switch TimeInput back to using native select for easier keyboard navigation?
- "..." positioned off by a few pixels with .form-control-sm ValidatedSelect, with selected option truncated
- low priority: convert CancellablePromise test to use jest
