/* global require */

var benchmark = require('htmlparser-benchmark')
var parseHTML = require('posthtml-parser')

var bench = benchmark(function (html, callback) {
  try {
    parseHTML(html, {
      ignore_bad_closed: true,
      ignore_unclosed: true,
    })
    callback()
  } catch(err) {
    callback(err)
  }
})

bench.on('progress', function (key) {
	console.log('finished parsing ' + key + '.html')
})

bench.on('result', function (stat) {
	console.log(stat.mean().toPrecision(6) + ' ms/file ± ' + stat.sd().toPrecision(6))
})
