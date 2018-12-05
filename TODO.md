- Add overload to allow CancellablePromise.resolve() without any argument or type argument

# Backlog

- Update usage instructions in Readme for yarn
- Use react-select types
- Remove "as any" in render method of DateInput when @types/react-datepicker 2.0.0 becomes available
- Apparently, I onced observed a setState after unmount in AsyncRouter, but after reviewing the code, I can't see how one could possibly happen. See if this ever comes up again / find a way to reproduce
- Known issue: ValidatedSelect text overflow when typing a long search string  
  https://github.com/JedWatson/react-select/issues/2774
- Figure out why absolute imports don't work in the iti-react project
