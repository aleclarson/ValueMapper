
{frozen, hidden, reactive} = require "Property"

NamedFunction = require "NamedFunction"
assertTypes = require "assertTypes"
assertType = require "assertType"
setType = require "setType"
isType = require "isType"
Typle = require "Typle"
Void = require "Void"

configTypes =
  values: Typle [ Object, Function ]
  define: Typle [ Function, Void ]

ValueMapper = NamedFunction "ValueMapper", (config) ->
  assertTypes config, configTypes

  unless isType config.define, Function
    for key, preset of ValueMapper.presets
      if config[key] is yes
        config.define = preset
        break

  self =
    _values: config.values
    _define: config.define

  if isType config.values, Function
    self.define = defineAll
  else self.define = defineEach

  return setType self, ValueMapper

module.exports = ValueMapper

ValueMapper.presets =

  mutable: (obj, key, value) ->
    if value isnt undefined
      if key.startsWith "_"
        define obj, key, {value, writable: yes, configurable: yes}
      else obj[key] = value
    return

  frozen: (obj, key, value) ->
    if value isnt undefined
      frozen.define obj, key, { value }
    return

  reactive: (obj, key, value) ->
    if value isnt undefined
      reactive.define obj, key, { value }
    return

#
# Helpers
#

define = Object.defineProperty

defineEach = (obj, args) ->
  for key, value of @_values
    if isType value, Function
      if value.length
        value = value.apply obj, args
      else value = value.call obj
    @_define obj, key, value
  return

defineAll = (obj, args) ->
  values = @_values.apply obj, args
  if not isType values, Object
    throw TypeError "Must return an Object!"
  for key, value of values
    @_define obj, key, value
  return
