
NamedFunction = require "NamedFunction"
assertType = require "assertType"
Either = require "Either"
isType = require "isType"

ValueMapper = NamedFunction "ValueMapper", (values, defineValue) ->
  assertType values, Either(Object, Function)
  assertType defineValue, Function
  if isType values, Function
  then defineAll values, defineValue
  else defineEach values, defineValue

defineAll = (createValues, defineValue) -> (obj, args) ->
  values = createValues.apply obj, args
  if not isType values, Object
    throw TypeError "Must return an Object!"
  for key, value of values
    defineValue obj, key, value
  return

defineEach = (values, defineValue) -> (obj, args) ->
  for key, value of values
    if isType value, Function
      if value.length
        value = value.apply obj, args
      else value = value.call obj
    defineValue obj, key, value
  return

module.exports = ValueMapper
