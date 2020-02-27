
# @triskel

[Documentation](https://kiltjs.github.io/triskel/)

[![ᴋɪʟᴛ ᴊs](https://kiltjs.github.io/assets/images/badge-kiltjs.svg)](https://github.com/kiltjs)
![Node.js CI](https://github.com/kiltjs/triskel/workflows/Node.js%20CI/badge.svg?branch=master)
[![Build Status](https://cloud.drone.io/api/badges/kiltjs/triskel/status.svg)](https://cloud.drone.io/kiltjs/triskel)
[![codecov](https://codecov.io/gh/kiltjs/triskel/branch/master/graph/badge.svg)](https://codecov.io/gh/kiltjs/triskel)
[![dependencies free](https://kiltjs.github.io/assets/images/badge-dependencies-free.svg)](https://www.npmjs.com/package/@kilt/triskel)
[![GitHub license](https://kiltjs.github.io/assets/images/badge-license-mit.svg)](LICENSE)

### Installation

``` sh
npm install -D @triskel/app

# includes:

# @triskel/loader
# @triskel/render
#   - @triskel/con-text
```

#### packages included

| package | dependencies | size | description |
| -- | -- | -- | -- |  
| `@triskel/con-text` | - | [![minzip-con-text]](https://bundlephobia.com/result?p=@triskel/con-text) | Provides tools for eval and interpolate text and also pipe evaluated expressions across shared filters |
| `@triskel/parser` | - | [![minzip-parser]](https://bundlephobia.com/result?p=@triskel/parser) | Parses HTML into [@triskelAST] |
| `@triskel/loader` | `@triskel/parser` | [![minzip-loader]](https://bundlephobia.com/result?p=@triskel/loader) | Parses and load HTML as stringified [@triskelAST] for webpack and rollup (`@triskel/loader/rollup`) |
| `@triskel/render` | `@triskel/con-text` | [![minzip-render]](https://bundlephobia.com/result?p=@triskel/app) | Renders [@triskelAST] into the DOM |
| `@triskel/stringify` | - | [![minzip-stringify]](https://bundlephobia.com/result?p=@triskel/stringify) | Serializes [@triskelAST] into a String |
| `@triskel/tinyhtml` | `@triskel/parser`<br>`@triskel/stringify` | [![minzip-tinyhtml]](https://bundlephobia.com/result?p=@triskel/tinyhtml) | Parses into [@triskelAST] and serializes back minifying the resulting HTML |

| package | dependencies | size | description |
| -- | -- | -- | -- |
| @triskel/template | `@triskel/con-text` | [![minzip-template]](https://bundlephobia.com/result?p=@triskel/template) | This is a regular template engine to interpolate and render Strings |


#### @triskelAST

| HTML | @triskelAST |
| -- | -- |
| `<h1>Title 1</h1>` | <code>{<br>&nbsp;$: 'h1',<br>&nbsp;_: 'Title 1',<br>} </code> |



[@triskelAST]: #@triskelAST

[minzip-con-text]: https://badgen.net/bundlephobia/minzip/@triskel/con-text
[minzip-parser]: https://badgen.net/bundlephobia/minzip/@triskel/parser
[minzip-loader]: https://badgen.net/bundlephobia/minzip/@triskel/loader
[minzip-render]: https://badgen.net/bundlephobia/minzip/@triskel/app
[minzip-stringify]: https://badgen.net/bundlephobia/minzip/@triskel/stringify
[minzip-tinyhtml]: https://badgen.net/bundlephobia/minzip/@triskel/tinyhtml
[minzip-template]: https://badgen.net/bundlephobia/minzip/@triskel/template
