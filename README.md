# broccoli-testem-plugin

Plugin for Broccoli that runs tests with [Testem](https://github.com/airportyh/testem).

# Install

```sh
npm install broccoli-testem-plugin
```

# Usage

```js
// Brocfile.js
var broccoliTestem = require('broccoli-testem-plugin')

var runTests = broccoliTestem('inputTree/', {
  src_files: ['**/*.js'] // Files paths are relative to input tree
  // Here any testem options
})

module.exports = runTests
```

## TDD mode

Use plugin with `broccoli serve`.
Then on first build plugin will start testem server,
and on rebuild file changes will be watched by testem.

## Continious integration mode

Use with `broccoli build`, and set option `ci: true`.<br>
With this option testem starts server, runs tests and exits.
Plugin will wait until testem exits, and if some test will fail, task will return an error.

# License

Public domain, see the `LICENCE.md` file.

