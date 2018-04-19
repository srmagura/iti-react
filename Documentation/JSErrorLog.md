Whenever a JavaScript error occurs on the client, the client POSTs the error details to
Log/Error, which then logs them to the database. The line and column numbers in these
log messages refer to the bundled & minified JavaScript, not the original source.

If it's not already obvious where the error is occurring, we should write a script using
https://github.com/mozilla/source-map so that we can type in the line and column numbers
from the log message and get out the line/column in the original source.