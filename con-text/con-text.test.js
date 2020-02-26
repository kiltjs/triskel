
import assert from 'assert'
import sinon from 'sinon'
import { runErrorCase } from '../_common/test.helpers'

import {
  ConText,
} from './con-text'

/** define-property */
describe(__filename.substr(process.cwd().length), function () {
  // --------------------------------------

  describe('ConText', function () {

    it('new', function () {

      assert(new ConText() instanceof ConText)

    })

    it('target', function () {

      const target = {}

      assert.strictEqual(ConText(target), target)

    })

  })


  describe('TEXT.parseExpression', function () {

    function _runTestCase(expression, expected_result) {

      it(`${expression}, ${JSON.stringify(expected_result)}`, () => {

        const result = new ConText().parseExpression(expression)

        assert.strictEqual(result.expression, expected_result.expression, 'expression')
        assert.strictEqual(result.filters.length, expected_result.has_filters, 'has_filters')

      })

    }

    [

      ['foo', { expression: 'foo', has_filters: 0 }],
      ['foo | bar', { expression: 'foo ', has_filters: 1 }],
      ['foo | bar | foobar', { expression: 'foo ', has_filters: 2 }],

    ].forEach((test_case) => _runTestCase.apply(null, test_case))

  })

  describe('TEXT.parseExpression::processFilters()', function () {

    [
      [() => {
        new ConText().parseExpression(' foo | bar ').processFilters()
      }, Error, /filter 'bar' is not defined/],

    ].forEach((test_case) => runErrorCase.apply(null, test_case))


    function _runTestCase(expression, data, expected_result, filter_definitions) {

      it(`${expression}, ${JSON.stringify(expected_result)}`, () => {

        const TEXT = new ConText()

        if (filter_definitions) TEXT.defineFilter(filter_definitions)

        assert.deepStrictEqual(
          TEXT.parseExpression(expression).processFilters(data),
          expected_result,
        )

      })

    }

    [

      ['foo', 123, 123],
      ['foo | bar', 123, 'bar:123', { bar: (input) => 'bar:' + input }],

      ['foobar | bar | foo', 123, 'foo:bar:123', { foo: (input) => 'foo:' + input, bar: (input) => 'bar:' + input }],
      ['foobar | foo | bar', 123, '123:foo:bar', { foo: (input) => input + ':foo', bar: (input) => input + ':bar' }],

    ].forEach((test_case) => _runTestCase.apply(null, test_case))

  })

  describe('TEXT.parseExpression::processFilters(spy)', function () {

    function _runTestCase(expression, data, filter_data = {}) {

      it(`${expression}, ${JSON.stringify(data)}`, () => {

        const TEXT = new ConText()
        const parsed = TEXT.parseExpression(expression)
        const filter_definitions = parsed.filters
          .reduce(function (definitions, filter) {
            definitions[filter.name] = sinon.fake( (input) => input )
            return definitions
          }, {})

        TEXT.defineFilter(filter_definitions)

        parsed.processFilters(data, data)

        for (let key in filter_definitions) {
          assert.strictEqual( filter_definitions[key].callCount, 1, 'callCount')
          assert.deepStrictEqual( filter_definitions[key].getCall(0).args[0], data, 'data')
          assert.deepStrictEqual( filter_definitions[key].getCall(0).args[1], filter_data[key] || data, 'filter_data')
        }

      })

    }

    [

      ['bar | foobar: { foo }', { foo: 'bar' }],
      ['bar | foobar: { foo }', { foo: 'bar' }, { foobar: { foo: 'bar' } }],
      ['bar | foobar: { foo } | 123: { num }', { foo: 'bar', num: 123 }, { foobar: { foo: 'bar' }, '123': { num: 123 } }],

    ].forEach((test_case) => _runTestCase.apply(null, test_case))

  })

})