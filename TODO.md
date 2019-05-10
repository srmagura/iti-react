- I think preventNonExistentPage needs to be used for DataUpdatereven when AutoRefreshUpdater is not used. Confirm this and update documentation.
- Move FormCheck to iti-react?
- Give WithValidationFeedback (the wrapping div) the class "validated-input" ... must be that exact class
- rename ActionDialog.loading to performingAction
- make onChildReady do nothing if value is already true

# Backlog

- bring in pseudoCancellable from VendorRateTool?
- Known issue: ValidatedSelect text overflow when typing a long search string  
  https://github.com/JedWatson/react-select/issues/2774
