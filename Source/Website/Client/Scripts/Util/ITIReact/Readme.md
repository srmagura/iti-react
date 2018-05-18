# ITI React

A collection of utilities and React components covering:

* Form validation
* Form inputs for time, date, and phone number 
* DataUpdater classes that handle querying for data when the query parameters (e.g. filters and page number) change
* Commonly-used components: Bootstrap modal dialog, confirmation dialog, pager, submit button with loading indicator

## Usage
 To use ITI React in your project:
1. Copy paste the ITIReact folder from ReactSpaTemplate into your code.
2. Copy iti-react.scss into your stylesheet folder. You can customize this stylesheet to fit your project. 
 
This is primitive but it seems easier than private npm packages. You should not make any local modifications to ITIReact in your project - these changes should be made and tested in the ReactSpaTemplate repository in the ITI BitBucket, and then copied over to your project. 

## Dependencies
Don't worry about these dependencies increasing your bundle sizes - Webpack production build won't include any libraries you aren't using (based on which modules you import).

"bootstrap": "^4.1.1"  
"input-format": "^0.2.3"    
"lodash": "^4.17.10"   
"moment": "^2.22.1"    
"popper.js": "^1.14.3"    
"react": "^16.3.2"   
"react-confirm": "^0.1.17"   
"react-datepicker": "^1.4.1"   
"react-dom": "^16.3.2"   
"react-router-dom": "^4.2.2"   
"typescript": "^2.8.3"   

The Bootstrap dependency is a weak dependency that could be broken for some parts of ITI React like Validation.

## Developing
The ReactSpaTemplate project in the ITI BitBucket is the "central repository" for the code 
that should always have the latest version. 

When you make a change, rename the version-x.x.x file so we'll be able to easily tell
which version of ITI React different projects are using. The versioning should follow semver, but with breaking changes
allowed on minor releases.