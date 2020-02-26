
import tinyHTML from './tinyhtml'
import assert from 'assert'

/** define-property */
describe(__filename.substr(process.cwd().length), function () {
// --------------------------------------

describe('minifier', function () {

  it('html', function () {

    var snippet = `
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>
    `

    assert.strictEqual( tinyHTML(snippet), '<!DOCTYPE html><html><head></head><body></body></html>' )

  })

  it('code', function () {

    var snippet = `
<pre><code class="language-html">
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>
</code></pre>
    `

    assert.strictEqual( tinyHTML(snippet), snippet.trim() )

  })

})

/** */
})
/** */
