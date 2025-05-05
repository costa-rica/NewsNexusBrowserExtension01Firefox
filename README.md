# NewsNexusBrowserExtension01Firefox

This app is for firefox and it is a sidebar that shows the URL of the current page.

- this replaces the old NewsNexus07BrowserExtension app for Firefox

## Setup

This was created using:
`npm create vite@latest NewsNexusBrowserExtension01Firefox -- --template react`
`npm install webextension-polyfill`

## public/background.js

This is important for making the sidebar open up when the user clicks the extension icon.

## Install in Firefox Browser

1. Open Firefox
2. Go to `about:debugging`
3. Click on `This Firefox`
4. Click on `Load Temporary Add-on`
5. Select the `manifest.json` file

OR `about:debugging#/runtime/this-firefox`
and select the manifest.json file
