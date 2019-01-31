module.exports = {
  verbose: false,
  sourceDir: 'ext',
  artifactsDir: `web-ext-artifacts`,
  run: {
    keepProfileChanges: true,
    firefoxProfile: './web-ext-profile',
    startUrl: [
      'about:debugging#addons',
      'https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/web-ext_command_reference'
    ],
    browserConsole: true,
    noReload: false
  },
  build: {
    overwriteDest: true
  },
  ignoreFiles: [
    'js/**/*-legacy.*'
  ]
}
