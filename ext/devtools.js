chrome.devtools.inspectedWindow.eval(JSON.parse('"(function() {\\n\\n/**\\n * Export for testing.\\n */\\n\\nvar exports = {\\n  $duv: $duv,\\n  $duvl: $duvl,\\n  $duvr: $duvr,\\n  $dum: $dum,\\n  $duml: $duml,\\n  $dumr: $dumr,\\n  $dug: $dug,\\n  $dugl: $dugl,\\n  $dugr: $dugr,\\n  $dus: $dus,\\n  $dusl: $dusl,\\n  $dusr: $dusr,\\n  $dugs: $dugs,\\n  $dugsl: $dugsl,\\n  $dugsr: $dugsr,\\n};\\n\\nif (typeof module === \'object\' && typeof exports === \'object\') {\\n  module.exports = exports;\\n} else if (typeof console === \'object\' && console._commandLineAPI) {\\n  var proto = console._commandLineAPI.__proto__;\\n  for (var prop in exports) {\\n    proto[prop] = exports[prop];\\n  }\\n} else {\\n  this.debugUtils = exports;\\n}\\n\\n/**\\n *\\n * Event debugging\\n * ---------------\\n *\\n */\\n\\nvar listenMethods = [\\n  \'addEventListener\',\\n  \'addListener\',\\n  \'attachEvent\',\\n  \'on\'\\n];\\n\\nvar removeListenerMethods = [\\n  \'removeEventListener\',\\n  \'removeListener\',\\n  \'off\'\\n];\\n\\nvar dontKnowHowToListenMsg = \'Don\\\\\'t how to listen to your object, please \' +\\n  \'open an issue if you think we should be able to.\';\\n\\nvar listeners = {};\\n\\n/**\\n * Adds a debugger or logger `event` handler to `object.\\n *\\n * @param {object} object\\n * @param {string} event\\n * @param {boolean} isLog\\n * @private\\n * @return {*} Whatever is returned from the event listener method.\\n */\\n\\nfunction debugEvent(object, event, isLog) {\\n  assert(\\n    object && typeof object === \'object\' && typeof event === \'string\',\\n    \'Need an object to listen to and an event to listen on.\'\\n  );\\n\\n  var ret, handler;\\n\\n  if (isLog) {\\n    handler = function() {\\n      console.log(\\n        \'Event %s fired on object %O with arguments\',\\n        event, object, arguments\\n      );\\n    };\\n  } else {\\n    handler = function() {\\n      debugger;\\n    };\\n  }\\n\\n  ret = applyOne(\\n    object,\\n    listenMethods,\\n    [event, handler],\\n    dontKnowHowToListenMsg\\n  );\\n\\n  if (!listeners[event]) listeners[event] = [];\\n  listeners[event].push({\\n    object: object,\\n    handler: handler\\n  });\\n\\n  return ret;\\n}\\n\\n/**\\n * Adds a debugger `event` handler to `object\\n *\\n * @param {object} object\\n * @param {string} event\\n * @public\\n * @return {*} Whatever is returned from the event listener method.\\n */\\n\\nfunction $duv(object, event) {\\n  return debugEvent(object, event, false);\\n}\\n\\n/**\\n * Adds a logger `event` handler to `object\\n *\\n * @param {object} object\\n * @param {string} event\\n * @public\\n * @return {*} Whatever is returned from the event listener method.\\n */\\n\\nfunction $duvl(object, event) {\\n  return debugEvent(object, event, true);\\n}\\n\\n/**\\n * Removes previously set `event` handler by `$duv` or `$duvl` from `object`.\\n *\\n * @param {object} object\\n * @param {string} event\\n * @public\\n */\\n\\nfunction $duvr(object, event) {\\n  listeners[event].filter(function(desc) {\\n    return desc.object === object;\\n  }).forEach(function(desc) {\\n    applyOne(\\n      object,\\n      removeListenerMethods,\\n      [event, desc.handler],\\n      dontKnowHowToListenMsg\\n    );\\n  });\\n}\\n\\n/**\\n *\\n * Method Debugging\\n * ----------------\\n *\\n */\\n\\nvar wrappedMethods = [];\\n\\nfunction wrapMethod(object, methodName, isLog) {\\n  assert(\\n    typeof object === \'object\' &&\\n      object && typeof object[methodName] === \'function\',\\n    \'Illegal object or failed to find method.\'\\n  );\\n\\n  var method = object[methodName];\\n\\n  wrappedMethods.push({\\n    object: object,\\n    method: method\\n  });\\n\\n  var slice = [].slice;\\n  var replacement;\\n\\n  if (isLog) {\\n    replacement = function() {\\n      console.log(arguments);\\n      return method.apply(object, slice.call(arguments));\\n    };\\n  } else {\\n    replacement = function() {\\n      debugger;\\n      return method.apply(object, slice.call(arguments));\\n    };\\n  }\\n\\n  object[methodName] = replacement;\\n}\\n\\nfunction $dum(object, method) {\\n  wrapMethod(object, method);\\n}\\n\\nfunction $duml(object, method) {\\n  wrapMethod(object, method, true);\\n}\\n\\nfunction $dumr(object, method) {\\n  for (var i = 0; i < wrappedMethods.length; i++) {\\n    var item = wrappedMethods[i];\\n    if (item.object === object) {\\n      object[method] = item.method;\\n      wrappedMethods.splice(i, 1);\\n      return true;\\n    }\\n  }\\n  return false;\\n}\\n\\n/**\\n *\\n * Accessor debugging\\n * ------------------\\n *\\n */\\n\\nvar descriptors = [];\\n\\nfunction debugAccessor(object, prop, options) {\\n  var desc = Object.getOwnPropertyDescriptor(object, prop);\\n\\n  if (desc.get || desc.set) {\\n    throw new Error(\\n      \'$dug doesn\\\\\'t currently support properties with accessors.\'\\n    );\\n  }\\n\\n  var val = desc.value;\\n\\n  descriptors.push({\\n    object: object,\\n    desc: desc,\\n    getVal: function() { return val }\\n  });\\n\\n  var newDesc = {\\n    configurable: false,\\n    enumerable: desc.enumerable,\\n    set: function(v) {\\n      return val = v;\\n    },\\n    get: function() {\\n      return val;\\n    }\\n  };\\n\\n  if (options.log) {\\n    if (options.getter) {\\n      newDesc.get = function() {\\n        console.log(\'About to get property %s from object %O\', prop, object);\\n        return val;\\n      };\\n    }\\n    if (options.setter) {\\n      newDesc.set = function(v) {\\n        console.log(\'About to set property %s from object %O\', prop, object);\\n        return val = v;\\n      };\\n    }\\n  } else {\\n    if (options.getter) {\\n      newDesc.get = function() {\\n        debugger;\\n        return val;\\n      };\\n    }\\n    if (options.setter) {\\n      newDesc.set = function(v) {\\n        debugger;\\n        return val = v;\\n      };\\n    }\\n  }\\n\\n  Object.defineProperty(object, prop, newDesc);\\n}\\n\\nfunction removeAccessors(object, prop) {\\n  for (var i = 0; i < descriptors.length; i++) {\\n    var item = descriptors[i];\\n    if (item.object === object) {\\n      item.desc.val = item.getVal();\\n      object.defineProperty(object, prop, item.desc);\\n      return true;\\n    }\\n  }\\n  return false;\\n}\\n\\nfunction $dug(object, prop) {\\n  return debugAccessor(object, prop, { getter: true });\\n}\\n\\nfunction $dugl(object, prop) {\\n  return debugAccessor(object, prop, { getter: true, log: true });\\n}\\n\\nfunction $dugr(object, prop) {\\n  return removeAccessors(object, prop);\\n}\\n\\nfunction $dus(object, prop) {\\n  return debugAccessor(object, prop, { setter: true });\\n}\\n\\nfunction $dusl(object, prop) {\\n  return debugAccessor(object, prop, { setter: true, log: true});\\n}\\n\\nfunction $dusr(object, prop) {\\n  return removeAccessors(object, prop);\\n}\\n\\nfunction $dugs(object, prop) {\\n  return debugAccessor(object, prop, {\\n    setter: true,\\n    getter: true\\n  });\\n}\\n\\nfunction $dugsl(object, prop) {\\n  return debugAccessor(object, prop, {\\n    setter: true,\\n    getter: true,\\n    log: true\\n  });\\n}\\n\\nfunction $dugsr(object, prop) {\\n  return removeAccessors(object, prop);\\n}\\n\\n/**\\n * Utils.\\n */\\n\\nfunction assert(condition, message) {\\n  if (!condition) throw new Error(message);\\n}\\n\\nfunction applyOne(object, methods, args, message) {\\n  for (var i = 0; i < methods.length; i++) {\\n    var fn = object[methods[i]];\\n    if (typeof fn === \'function\') {\\n      return fn.apply(object, args);\\n    }\\n  }\\n  if (message) {\\n    throw new Error(message);\\n  }\\n}\\n\\nfunction uid(len) {\\n  len = len || 7;\\n  return Math.random().toString(35).substr(2, len);\\n}\\n\\n}).call(this);\\n"'));