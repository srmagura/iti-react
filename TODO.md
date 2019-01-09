- Validated(Multi)Select: allow passing custom components (pass through prop)
- Use react-select types
- AsycRouter: make it

# Backlog

- Put all code in src directory in iti-react, and set "main" in package.json (is there actually any benefit to this?)
- Remove "as any" in render method of DateInput when @types/react-datepicker 2.0.0 becomes available
- Apparently, I onced observed a setState after unmount in AsyncRouter, but after reviewing the code, I can't see how one could possibly happen. See if this ever comes up again / find a way to reproduce
- Known issue: ValidatedSelect text overflow when typing a long search string  
  https://github.com/JedWatson/react-select/issues/2774
- Figure out why absolute imports don't work in the iti-react project
