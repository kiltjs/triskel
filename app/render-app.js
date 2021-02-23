
import { firstIn } from '../_common/list'
import { extend } from '../_common/object'
import renderNodes from './render'

import { alwaysFunction, detachQueue, nodeMethods } from './render-utils'

/**
 * @class
 * 
 * @param {*} [options] 
 */
export function RenderApp (options = {}) {
  this.with_node_queue = []
  this.options = options
  
  if (options.withNode) this.with_node_queue.push(options.withNode)
}

RenderApp.prototype = {
  constructor: RenderApp,

  render (parent_el, nodes, render_options = {}) {
    if (nodes instanceof Array === false) throw new TypeError('render nodes should be an Array')
  
    const with_node_queue = this.with_node_queue.slice(0)
    if (render_options.withNode) with_node_queue.unshift(alwaysFunction(render_options.withNode))
    
    const detach_queue = detachQueue(parent_el)
    const data_listeners = []
    var { data = {} } = render_options

    const inserted_nodes = (render_options.renderFn || renderNodes)(parent_el, nodes, {
      withNode (node) {
        const node_methods = nodeMethods(['onCreate', 'initNode'])

        for (var i = 0, n = with_node_queue.length, _result ; i < n ; i++) {
          _result = with_node_queue[i](node, render_options)
          if (_result) {
            if (_result.replace_by_comment) return _result

            node_methods.addWithNode(_result)
          }
        }

        return node_methods.generateInitNode(function _nodeThis (node_el) {
          const _data_listeners = []
          var _data = data

          function _updateData (new_data) {
            _data = new_data || _data
            _data_listeners.forEach( (_onData) => _onData(_data) )
          }

          return {
            get data () {
              return _data
            },
            set data (new_data) {
              _updateData(new_data)
            },
            watchData (onData) {
              if (typeof onData !== 'function') throw new TypeError('watchData handler should be a Function')

              _data_listeners.push(onData)

              if (!_data_listeners.length) {
                const _onData = () => _updateData()
                data_listeners.push(_onData)
              }
            },
            updateData: _updateData,
            onDetach: detach_queue.onDetach.bind(node_el),
          }
        })

      },
    })

    function updateData (new_data) {
      data = new_data || data
      data_listeners.forEach( (_onData) => _onData(data) )
    }

    return {
      inserted_nodes,
      updateData,
      get data () {
        return data
      },
      set data (new_data) {
        updateData(new_data)
      },
    }
  },

  withNode (withNode) {
    this.with_node_queue.push(withNode)
    return this
  },

  component (tag_name, options, template_options) {
    var render_app = this
  
    if( options instanceof Function ) options = { controller: options }
    else if( !options || typeof options !== 'object' ) {
      throw new TypeError('options should be a plain object (or a controller function)')
    }
  
    template_options = template_options ? Object.create(template_options) : {}
    if( !template_options.data && options.data ) template_options.data = options.data
    
    render_app.withNode(function (node) {
  
      if( node.tag !== tag_name ) return
  
      var _with_node = options.withNode && options.withNode.apply(render_app, arguments) || {},
          _initNode = _with_node.initNode
  
      return extend( _with_node, {
        initNode: options.controller && options.template ? function (node_el, _node, render_options) {
          var _this = Object.create(this), _args = arguments
  
          if( !template_options.data && render_options.data ) template_options.data = render_options.data
          var template_ctrl = render_app.render(node_el, options.template, template_options)
  
          _this.updateData = template_ctrl.updateData
          _this.watchData(function () {
            template_ctrl.updateData()
          })
  
          if( _initNode instanceof Function ) _initNode.apply(_this, arguments)
          options.controller.apply(_this, _args)
        } : function (node_el, _node, render_options) {
          var _this = Object.create(this),
              _template_ctrl
          
          if( options.template ) {
            if( !template_options.data && render_options.data ) template_options.data = render_options.data
            _template_ctrl = render_app.render(node_el, options.template, template_options)
            _this.updateData = _template_ctrl.updateData
            _this.watchData(function () {
              _template_ctrl.updateData()
            })
          }
  
          if( _initNode instanceof Function ) _initNode.apply(_this, arguments)
          if( options.controller instanceof Function ) options.controller.apply(_this, arguments)
        },
      })
  
    })
  
    return this
  },
  
  directive (directive, initNode, withNode) {
  
    if( directive instanceof RegExp ) directive = '^' + directive.source.replace(/^\^|\$$/g, '') + '$'
    directive = '^' + directive.replace(/^\^|\$$/, '') + '$'
  
    var matchRE = new RegExp(directive),
        matchAttr = function (attr) {
          return matchRE.test(attr)
        },
        _withNode = alwaysFunction(withNode)
  
    this.withNode(function (node, _render_options) {
      var _attrs = node.attrs || {},
          attr_key = _attrs && firstIn( Object.keys(_attrs), matchAttr)
  
      if( !attr_key ) return
      if( node._using_directive === attr_key ) return
  
      var this_app = Object.create(this)
  
      this_app.attr_key = attr_key
      this_app.attr_value = _attrs[attr_key]
  
      return extend( _withNode && _withNode.apply(this_app, arguments) || {}, {
        initNode: function (node_el, _node, render_options, _with_node) {
          if( _with_node.replace_by_comment ) {
            _node = Object.create(_node)
            _node._using_directive = attr_key
          }
  
          initNode.call(this_app, node_el, _node, render_options, _with_node )
        },
      })
  
    })
  
    return this
  },

}

const RENDER_APP = new RenderApp()

export default RENDER_APP