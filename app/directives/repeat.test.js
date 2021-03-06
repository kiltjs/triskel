/* global global, document */

import assert from 'assert'
import { createApp } from '../app'
import { JSDOM } from 'jsdom'

/** define-property */
describe(__filename.substr(process.cwd().length), function () {
// --------------------------------------

function _runTestCase (testRunner) {
  return function (args) {
    testRunner.apply(null, args)
  }
}

function _resultRepeat (repeat_expression, text_expression, expected_items) {
  return `<!-- : data-repeat : ${ repeat_expression.trim() } -->` +
      expected_items.map( (item) =>
        `<div data-repeat=" ${ repeat_expression.trim() } "><!-- text: {{ ${ text_expression.trim() } }} -->${ item }</div>`,
      ).join('') + `<!-- / data-repeat -->`
}

describe('directive [data-bind]', function () {

  beforeEach(function () {
    const { window } = new JSDOM()

    global.window = window
    global.document = window.document
    global.MutationObserver = window.MutationObserver
  })

  var _APP = createApp()
  _APP.defineFilter('bar', function (text) {
    return text + 'bar'
  })

  it('render error expression', function () {

    assert.throws( function () {

      _APP.render(document.body, [{
        tag: 'div',
        attrs: {
          'data-repeat': ' foo bar ',
        },
      }])

    }, Error )

  })

  it('render error missing list', function () {

    assert.throws( function () {

      _APP.render(document.body, [{
        tag: 'div',
        attrs: {
          'data-repeat': ' item in list ',
        },
      }])

    }, TypeError )

  })

  ;[
    // [ repeat_expression, text_expression, data_set, expected_items ],
    [' item in list ', ' item ', [1,2,3,4,5,6], [1,2,3,4,5,6] ],
    [' item, $index in list ', ' item ', [1,2,3,4,5,6], [1,2,3,4,5,6] ],
    [' item, $index in list ', ' $index ', [1,2,3,4,5,6], [0,1,2,3,4,5] ],
    [' item, item_key in list ', ' item ', [1,2,3,4,5,6], [1,2,3,4,5,6] ],
    [' item, item_key in list ', ' item_key ', [1,2,3,4,5,6], [0,1,2,3,4,5] ],
  ].forEach(_runTestCase(function testRunner (repeat_expression, text_expression, data_set, expected_items) {

    it(`[data-repeat=${ repeat_expression }]/{text: ${ text_expression } } (${ data_set.join(',') }) => ${ expected_items.join(',') }`, function () {

      var _view = _APP.render(document.body, [{
        tag: 'div',
        attrs: {
          'data-repeat': repeat_expression,
        },
        content: ['{{' + text_expression + '}}'],
      }], {
        data: {
          list: data_set,
        },
      })
  
      assert.strictEqual(document.body.innerHTML,
        _resultRepeat( repeat_expression, text_expression, expected_items ),
      )

      var inserted_nodes = [].map.call(document.body.children, function (el) {
        return el
      })

      _view.updateData()

      ;[].forEach.call(document.body.children, function (el, i) {
        assert.strictEqual(el, inserted_nodes[i])
      })
  
    })

  }))

  ;[
    // [ repeat_expression, text_expression, data_set, expected_items ],
    [' item in list ', ' item ', [1,2,3,4,5,6], [1,2,3,4,5,6], [6,5,4,3,2,1], [6,5,4,3,2,1] ],
    [' item, $index in list ', ' item ', [1,2,3,4,5,6], [1,2,3,4,5,6], [6,5,4,3,2,1], [6,5,4,3,2,1] ],
    [' item, $index in list ', ' $index ', [1,2,3,4,5,6], [0,1,2,3,4,5], [6,5,4,3,2,1], [0,1,2,3,4,5] ],
    [' item, item_key in list ', ' item ', [1,2,3,4,5,6], [1,2,3,4,5,6], [6,5,4,3,2,1], [6,5,4,3,2,1] ],
    [' item, item_key in list ', ' item_key ', [1,2,3,4,5,6], [0,1,2,3,4,5], [6,5,4,3,2,1], [0,1,2,3,4,5] ],
    [' item, item_key in list ', ' item ', [1,2,3,4,5,6], [1,2,3,4,5,6], [3,4,5,6,7,8], [3,4,5,6,7,8] ],
    [' item, item_key in list ', ' item_key ', [1,2,3,4,5,6], [0,1,2,3,4,5], [3,4,5,6,7,8], [0,1,2,3,4,5] ],
    [' item, item_key in list ', ' item ', [1,2,3,4,5,6], [1,2,3,4,5,6], [7,8,9,0], [7,8,9,0] ],
    [' item, item_key in list ', ' item_key ', [1,2,3,4,5,6], [0,1,2,3,4,5], [7,8,9,0], [0,1,2,3] ],
  ].forEach(_runTestCase(function testRunner (repeat_expression, text_expression, data_set, expected_items, new_data_set, new_expected_items) {

    it(`[data-repeat=${ repeat_expression }]/{text: ${ text_expression } } (${ data_set.join(',') }) => ${ expected_items.join(',') }; (${ new_data_set.join(',') }) => ${ new_expected_items.join(',') }`, function () {

      var _view = _APP.render(document.body, [{
        tag: 'div',
        attrs: {
          'data-repeat': repeat_expression,
        },
        content: ['{{' + text_expression + '}}'],
      }], {
        data: {
          list: data_set,
        },
      })
  
      assert.strictEqual(document.body.innerHTML,
        _resultRepeat( repeat_expression, text_expression, expected_items )
      , 'data_set')

      _view.updateData({
        list: new_data_set,
      })
  
      assert.strictEqual(document.body.innerHTML,
        _resultRepeat(repeat_expression, text_expression, new_expected_items)
      , 'new_data_set')
  
    })

  }))

})

/** */
})
/** */
