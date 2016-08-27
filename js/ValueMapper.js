var NamedFunction, Typle, ValueMapper, Void, assertType, assertTypes, configTypes, define, defineAll, defineEach, frozen, hidden, isType, reactive, ref, setType;

ref = require("Property"), frozen = ref.frozen, hidden = ref.hidden, reactive = ref.reactive;

NamedFunction = require("NamedFunction");

assertTypes = require("assertTypes");

assertType = require("assertType");

setType = require("setType");

isType = require("isType");

Typle = require("Typle");

Void = require("Void");

configTypes = {
  values: Typle([Object, Function]),
  define: Typle([Function, Void])
};

ValueMapper = NamedFunction("ValueMapper", function(config) {
  var key, preset, ref1, self;
  assertTypes(config, configTypes);
  if (!isType(config.define, Function)) {
    ref1 = ValueMapper.presets;
    for (key in ref1) {
      preset = ref1[key];
      if (config[key] === true) {
        config.define = preset;
        break;
      }
    }
  }
  self = {
    _values: config.values,
    _define: config.define
  };
  if (isType(config.values, Function)) {
    self.define = defineAll;
  } else {
    self.define = defineEach;
  }
  return setType(self, ValueMapper);
});

module.exports = ValueMapper;

ValueMapper.presets = {
  mutable: function(obj, key, value) {
    if (value !== void 0) {
      if (key.startsWith("_")) {
        define(obj, key, {
          value: value,
          writable: true,
          configurable: true
        });
      } else {
        obj[key] = value;
      }
    }
  },
  frozen: function(obj, key, value) {
    if (value !== void 0) {
      frozen.define(obj, key, {
        value: value
      });
    }
  },
  reactive: function(obj, key, value) {
    if (value !== void 0) {
      reactive.define(obj, key, {
        value: value
      });
    }
  }
};

define = Object.defineProperty;

defineEach = function(obj, args) {
  var key, ref1, value;
  ref1 = this._values;
  for (key in ref1) {
    value = ref1[key];
    if (isType(value, Function)) {
      if (value.length) {
        value = value.apply(obj, args);
      } else {
        value = value.call(obj);
      }
    }
    this._define(obj, key, value);
  }
};

defineAll = function(obj, args) {
  var key, value, values;
  values = this._values.apply(obj, args);
  if (!isType(values, Object)) {
    throw TypeError("Must return an Object!");
  }
  for (key in values) {
    value = values[key];
    this._define(obj, key, value);
  }
};

//# sourceMappingURL=map/ValueMapper.map
