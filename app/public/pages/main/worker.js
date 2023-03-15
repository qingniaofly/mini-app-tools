/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/history/index.js":
/*!***************************************!*\
  !*** ./node_modules/history/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Action": () => (/* binding */ Action),
/* harmony export */   "createBrowserHistory": () => (/* binding */ createBrowserHistory),
/* harmony export */   "createHashHistory": () => (/* binding */ createHashHistory),
/* harmony export */   "createMemoryHistory": () => (/* binding */ createMemoryHistory),
/* harmony export */   "createPath": () => (/* binding */ createPath),
/* harmony export */   "parsePath": () => (/* binding */ parsePath)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");

/**
 * Actions represent the type of change to a location value.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#action
 */

var Action;

(function (Action) {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Action["Pop"] = "POP";
  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */

  Action["Push"] = "PUSH";
  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */

  Action["Replace"] = "REPLACE";
})(Action || (Action = {}));

var readOnly =  true ? function (obj) {
  return Object.freeze(obj);
} : 0;

function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message);

    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message); // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

var BeforeUnloadEventType = 'beforeunload';
var HashChangeEventType = 'hashchange';
var PopStateEventType = 'popstate';
/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */

function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$window = _options.window,
      window = _options$window === void 0 ? document.defaultView : _options$window;
  var globalHistory = window.history;

  function getIndexAndLocation() {
    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var state = globalHistory.state || {};
    return [state.idx, readOnly({
      pathname: pathname,
      search: search,
      hash: hash,
      state: state.usr || null,
      key: state.key || 'default'
    })];
  }

  var blockedPopTx = null;

  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      var nextAction = Action.Pop;

      var _getIndexAndLocation = getIndexAndLocation(),
          nextIndex = _getIndexAndLocation[0],
          nextLocation = _getIndexAndLocation[1];

      if (blockers.length) {
        if (nextIndex != null) {
          var delta = index - nextIndex;

          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
           true ? warning(false, // TODO: Write up a doc that explains our blocking strategy in
          // detail and link to it here so people can understand better what
          // is going on and how to avoid it.
          "You are trying to block a POP navigation to a location that was not " + "created by the history library. The block will fail silently in " + "production, but in general you should do all navigation with the " + "history library (instead of using window.history.pushState directly) " + "to avoid this situation.") : 0;
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop);
  var action = Action.Pop;

  var _getIndexAndLocation2 = getIndexAndLocation(),
      index = _getIndexAndLocation2[0],
      location = _getIndexAndLocation2[1];

  var listeners = createEvents();
  var blockers = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, globalHistory.state, {
      idx: index
    }), '');
  }

  function createHref(to) {
    return typeof to === 'string' ? to : createPath(to);
  } // state defaults to `null` because `window.history.state` does


  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }

    return readOnly((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      pathname: location.pathname,
      hash: '',
      search: ''
    }, typeof to === 'string' ? parsePath(to) : to, {
      state: state,
      key: createKey()
    }));
  }

  function getHistoryStateAndUrl(nextLocation, index) {
    return [{
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index
    }, createHref(nextLocation)];
  }

  function allowTx(action, location, retry) {
    return !blockers.length || (blockers.call({
      action: action,
      location: location,
      retry: retry
    }), false);
  }

  function applyTx(nextAction) {
    action = nextAction;

    var _getIndexAndLocation3 = getIndexAndLocation();

    index = _getIndexAndLocation3[0];
    location = _getIndexAndLocation3[1];
    listeners.call({
      action: action,
      location: location
    });
  }

  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      push(to, state);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr = getHistoryStateAndUrl(nextLocation, index + 1),
          historyState = _getHistoryStateAndUr[0],
          url = _getHistoryStateAndUr[1]; // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/


      try {
        globalHistory.pushState(historyState, '', url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      replace(to, state);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr2 = getHistoryStateAndUrl(nextLocation, index),
          historyState = _getHistoryStateAndUr2[0],
          url = _getHistoryStateAndUr2[1]; // TODO: Support forced reloading


      globalHistory.replaceState(historyState, '', url);
      applyTx(nextAction);
    }
  }

  function go(delta) {
    globalHistory.go(delta);
  }

  var history = {
    get action() {
      return action;
    },

    get location() {
      return location;
    },

    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        unblock(); // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents

        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };
  return history;
}
/**
 * Hash history stores the location in window.location.hash. This makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the URL space is
 * reserved for something else.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
 */


function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }

  var _options2 = options,
      _options2$window = _options2.window,
      window = _options2$window === void 0 ? document.defaultView : _options2$window;
  var globalHistory = window.history;

  function getIndexAndLocation() {
    var _parsePath = parsePath(window.location.hash.substr(1)),
        _parsePath$pathname = _parsePath.pathname,
        pathname = _parsePath$pathname === void 0 ? '/' : _parsePath$pathname,
        _parsePath$search = _parsePath.search,
        search = _parsePath$search === void 0 ? '' : _parsePath$search,
        _parsePath$hash = _parsePath.hash,
        hash = _parsePath$hash === void 0 ? '' : _parsePath$hash;

    var state = globalHistory.state || {};
    return [state.idx, readOnly({
      pathname: pathname,
      search: search,
      hash: hash,
      state: state.usr || null,
      key: state.key || 'default'
    })];
  }

  var blockedPopTx = null;

  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      var nextAction = Action.Pop;

      var _getIndexAndLocation4 = getIndexAndLocation(),
          nextIndex = _getIndexAndLocation4[0],
          nextLocation = _getIndexAndLocation4[1];

      if (blockers.length) {
        if (nextIndex != null) {
          var delta = index - nextIndex;

          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
           true ? warning(false, // TODO: Write up a doc that explains our blocking strategy in
          // detail and link to it here so people can understand better
          // what is going on and how to avoid it.
          "You are trying to block a POP navigation to a location that was not " + "created by the history library. The block will fail silently in " + "production, but in general you should do all navigation with the " + "history library (instead of using window.history.pushState directly) " + "to avoid this situation.") : 0;
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop); // popstate does not fire on hashchange in IE 11 and old (trident) Edge
  // https://developer.mozilla.org/de/docs/Web/API/Window/popstate_event

  window.addEventListener(HashChangeEventType, function () {
    var _getIndexAndLocation5 = getIndexAndLocation(),
        nextLocation = _getIndexAndLocation5[1]; // Ignore extraneous hashchange events.


    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });
  var action = Action.Pop;

  var _getIndexAndLocation6 = getIndexAndLocation(),
      index = _getIndexAndLocation6[0],
      location = _getIndexAndLocation6[1];

  var listeners = createEvents();
  var blockers = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, globalHistory.state, {
      idx: index
    }), '');
  }

  function getBaseHref() {
    var base = document.querySelector('base');
    var href = '';

    if (base && base.getAttribute('href')) {
      var url = window.location.href;
      var hashIndex = url.indexOf('#');
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href;
  }

  function createHref(to) {
    return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to));
  }

  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }

    return readOnly((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      pathname: location.pathname,
      hash: '',
      search: ''
    }, typeof to === 'string' ? parsePath(to) : to, {
      state: state,
      key: createKey()
    }));
  }

  function getHistoryStateAndUrl(nextLocation, index) {
    return [{
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index
    }, createHref(nextLocation)];
  }

  function allowTx(action, location, retry) {
    return !blockers.length || (blockers.call({
      action: action,
      location: location,
      retry: retry
    }), false);
  }

  function applyTx(nextAction) {
    action = nextAction;

    var _getIndexAndLocation7 = getIndexAndLocation();

    index = _getIndexAndLocation7[0];
    location = _getIndexAndLocation7[1];
    listeners.call({
      action: action,
      location: location
    });
  }

  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      push(to, state);
    }

     true ? warning(nextLocation.pathname.charAt(0) === '/', "Relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")") : 0;

    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr3 = getHistoryStateAndUrl(nextLocation, index + 1),
          historyState = _getHistoryStateAndUr3[0],
          url = _getHistoryStateAndUr3[1]; // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/


      try {
        globalHistory.pushState(historyState, '', url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      replace(to, state);
    }

     true ? warning(nextLocation.pathname.charAt(0) === '/', "Relative pathnames are not supported in hash history.replace(" + JSON.stringify(to) + ")") : 0;

    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr4 = getHistoryStateAndUrl(nextLocation, index),
          historyState = _getHistoryStateAndUr4[0],
          url = _getHistoryStateAndUr4[1]; // TODO: Support forced reloading


      globalHistory.replaceState(historyState, '', url);
      applyTx(nextAction);
    }
  }

  function go(delta) {
    globalHistory.go(delta);
  }

  var history = {
    get action() {
      return action;
    },

    get location() {
      return location;
    },

    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        unblock(); // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents

        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };
  return history;
}
/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#creatememoryhistory
 */


function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }

  var _options3 = options,
      _options3$initialEntr = _options3.initialEntries,
      initialEntries = _options3$initialEntr === void 0 ? ['/'] : _options3$initialEntr,
      initialIndex = _options3.initialIndex;
  var entries = initialEntries.map(function (entry) {
    var location = readOnly((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: createKey()
    }, typeof entry === 'string' ? parsePath(entry) : entry));
     true ? warning(location.pathname.charAt(0) === '/', "Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: " + JSON.stringify(entry) + ")") : 0;
    return location;
  });
  var index = clamp(initialIndex == null ? entries.length - 1 : initialIndex, 0, entries.length - 1);
  var action = Action.Pop;
  var location = entries[index];
  var listeners = createEvents();
  var blockers = createEvents();

  function createHref(to) {
    return typeof to === 'string' ? to : createPath(to);
  }

  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }

    return readOnly((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      pathname: location.pathname,
      search: '',
      hash: ''
    }, typeof to === 'string' ? parsePath(to) : to, {
      state: state,
      key: createKey()
    }));
  }

  function allowTx(action, location, retry) {
    return !blockers.length || (blockers.call({
      action: action,
      location: location,
      retry: retry
    }), false);
  }

  function applyTx(nextAction, nextLocation) {
    action = nextAction;
    location = nextLocation;
    listeners.call({
      action: action,
      location: location
    });
  }

  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      push(to, state);
    }

     true ? warning(location.pathname.charAt(0) === '/', "Relative pathnames are not supported in memory history.push(" + JSON.stringify(to) + ")") : 0;

    if (allowTx(nextAction, nextLocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  }

  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      replace(to, state);
    }

     true ? warning(location.pathname.charAt(0) === '/', "Relative pathnames are not supported in memory history.replace(" + JSON.stringify(to) + ")") : 0;

    if (allowTx(nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  }

  function go(delta) {
    var nextIndex = clamp(index + delta, 0, entries.length - 1);
    var nextAction = Action.Pop;
    var nextLocation = entries[nextIndex];

    function retry() {
      go(delta);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }

  var history = {
    get index() {
      return index;
    },

    get action() {
      return action;
    },

    get location() {
      return location;
    },

    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      return blockers.push(blocker);
    }
  };
  return history;
} ////////////////////////////////////////////////////////////////////////////////
// UTILS
////////////////////////////////////////////////////////////////////////////////


function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}

function promptBeforeUnload(event) {
  // Cancel the event.
  event.preventDefault(); // Chrome (and legacy IE) requires returnValue to be set.

  event.returnValue = '';
}

function createEvents() {
  var handlers = [];
  return {
    get length() {
      return handlers.length;
    },

    push: function push(fn) {
      handlers.push(fn);
      return function () {
        handlers = handlers.filter(function (handler) {
          return handler !== fn;
        });
      };
    },
    call: function call(arg) {
      handlers.forEach(function (fn) {
        return fn && fn(arg);
      });
    }
  };
}

function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
/**
 * Creates a string URL path from the given pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createpath
 */


function createPath(_ref) {
  var _ref$pathname = _ref.pathname,
      pathname = _ref$pathname === void 0 ? '/' : _ref$pathname,
      _ref$search = _ref.search,
      search = _ref$search === void 0 ? '' : _ref$search,
      _ref$hash = _ref.hash,
      hash = _ref$hash === void 0 ? '' : _ref$hash;
  if (search && search !== '?') pathname += search.charAt(0) === '?' ? search : '?' + search;
  if (hash && hash !== '#') pathname += hash.charAt(0) === '#' ? hash : '#' + hash;
  return pathname;
}
/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#parsepath
 */


function parsePath(path) {
  var parsedPath = {};

  if (path) {
    var hashIndex = path.indexOf('#');

    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    var searchIndex = path.indexOf('?');

    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      parsedPath.pathname = path;
    }
  }

  return parsedPath;
}



/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ ((module) => {

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};

/***/ }),

/***/ "./node_modules/scheduler/cjs/scheduler.development.js":
/*!*************************************************************!*\
  !*** ./node_modules/scheduler/cjs/scheduler.development.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

if (true) {
  (function () {
    'use strict';
    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */

    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === 'function') {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    }

    var enableSchedulerDebugging = false;
    var enableProfiling = false;
    var frameYieldMs = 5;

    function push(heap, node) {
      var index = heap.length;
      heap.push(node);
      siftUp(heap, node, index);
    }

    function peek(heap) {
      return heap.length === 0 ? null : heap[0];
    }

    function pop(heap) {
      if (heap.length === 0) {
        return null;
      }

      var first = heap[0];
      var last = heap.pop();

      if (last !== first) {
        heap[0] = last;
        siftDown(heap, last, 0);
      }

      return first;
    }

    function siftUp(heap, node, i) {
      var index = i;

      while (index > 0) {
        var parentIndex = index - 1 >>> 1;
        var parent = heap[parentIndex];

        if (compare(parent, node) > 0) {
          // The parent is larger. Swap positions.
          heap[parentIndex] = node;
          heap[index] = parent;
          index = parentIndex;
        } else {
          // The parent is smaller. Exit.
          return;
        }
      }
    }

    function siftDown(heap, node, i) {
      var index = i;
      var length = heap.length;
      var halfLength = length >>> 1;

      while (index < halfLength) {
        var leftIndex = (index + 1) * 2 - 1;
        var left = heap[leftIndex];
        var rightIndex = leftIndex + 1;
        var right = heap[rightIndex]; // If the left or right node is smaller, swap with the smaller of those.

        if (compare(left, node) < 0) {
          if (rightIndex < length && compare(right, left) < 0) {
            heap[index] = right;
            heap[rightIndex] = node;
            index = rightIndex;
          } else {
            heap[index] = left;
            heap[leftIndex] = node;
            index = leftIndex;
          }
        } else if (rightIndex < length && compare(right, node) < 0) {
          heap[index] = right;
          heap[rightIndex] = node;
          index = rightIndex;
        } else {
          // Neither child is smaller. Exit.
          return;
        }
      }
    }

    function compare(a, b) {
      // Compare sort index first, then task id.
      var diff = a.sortIndex - b.sortIndex;
      return diff !== 0 ? diff : a.id - b.id;
    } // TODO: Use symbols?


    var ImmediatePriority = 1;
    var UserBlockingPriority = 2;
    var NormalPriority = 3;
    var LowPriority = 4;
    var IdlePriority = 5;

    function markTaskErrored(task, ms) {}
    /* eslint-disable no-var */


    var hasPerformanceNow = (typeof performance === "undefined" ? "undefined" : _typeof(performance)) === 'object' && typeof performance.now === 'function';

    if (hasPerformanceNow) {
      var localPerformance = performance;

      exports.unstable_now = function () {
        return localPerformance.now();
      };
    } else {
      var localDate = Date;
      var initialTime = localDate.now();

      exports.unstable_now = function () {
        return localDate.now() - initialTime;
      };
    } // Max 31 bit integer. The max integer size in V8 for 32-bit systems.
    // Math.pow(2, 30) - 1
    // 0b111111111111111111111111111111


    var maxSigned31BitInt = 1073741823; // Times out immediately

    var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out

    var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
    var NORMAL_PRIORITY_TIMEOUT = 5000;
    var LOW_PRIORITY_TIMEOUT = 10000; // Never times out

    var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt; // Tasks are stored on a min heap

    var taskQueue = [];
    var timerQueue = []; // Incrementing id counter. Used to maintain insertion order.

    var taskIdCounter = 1; // Pausing the scheduler is useful for debugging.

    var currentTask = null;
    var currentPriorityLevel = NormalPriority; // This is set while performing work, to prevent re-entrance.

    var isPerformingWork = false;
    var isHostCallbackScheduled = false;
    var isHostTimeoutScheduled = false; // Capture local references to native APIs, in case a polyfill overrides them.

    var localSetTimeout = typeof setTimeout === 'function' ? setTimeout : null;
    var localClearTimeout = typeof clearTimeout === 'function' ? clearTimeout : null;
    var localSetImmediate = typeof setImmediate !== 'undefined' ? setImmediate : null; // IE and Node.js + jsdom

    var isInputPending = typeof navigator !== 'undefined' && navigator.scheduling !== undefined && navigator.scheduling.isInputPending !== undefined ? navigator.scheduling.isInputPending.bind(navigator.scheduling) : null;

    function advanceTimers(currentTime) {
      // Check for tasks that are no longer delayed and add them to the queue.
      var timer = peek(timerQueue);

      while (timer !== null) {
        if (timer.callback === null) {
          // Timer was cancelled.
          pop(timerQueue);
        } else if (timer.startTime <= currentTime) {
          // Timer fired. Transfer to the task queue.
          pop(timerQueue);
          timer.sortIndex = timer.expirationTime;
          push(taskQueue, timer);
        } else {
          // Remaining timers are pending.
          return;
        }

        timer = peek(timerQueue);
      }
    }

    function handleTimeout(currentTime) {
      isHostTimeoutScheduled = false;
      advanceTimers(currentTime);

      if (!isHostCallbackScheduled) {
        if (peek(taskQueue) !== null) {
          isHostCallbackScheduled = true;
          requestHostCallback(flushWork);
        } else {
          var firstTimer = peek(timerQueue);

          if (firstTimer !== null) {
            requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
          }
        }
      }
    }

    function flushWork(hasTimeRemaining, initialTime) {
      isHostCallbackScheduled = false;

      if (isHostTimeoutScheduled) {
        // We scheduled a timeout but it's no longer needed. Cancel it.
        isHostTimeoutScheduled = false;
        cancelHostTimeout();
      }

      isPerformingWork = true;
      var previousPriorityLevel = currentPriorityLevel;

      try {
        if (enableProfiling) {
          try {
            return workLoop(hasTimeRemaining, initialTime);
          } catch (error) {
            if (currentTask !== null) {
              var currentTime = exports.unstable_now();
              markTaskErrored(currentTask, currentTime);
              currentTask.isQueued = false;
            }

            throw error;
          }
        } else {
          // No catch in prod code path.
          return workLoop(hasTimeRemaining, initialTime);
        }
      } finally {
        currentTask = null;
        currentPriorityLevel = previousPriorityLevel;
        isPerformingWork = false;
      }
    }

    function workLoop(hasTimeRemaining, initialTime) {
      var currentTime = initialTime;
      advanceTimers(currentTime);
      currentTask = peek(taskQueue);

      while (currentTask !== null && !enableSchedulerDebugging) {
        if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
          // This currentTask hasn't expired, and we've reached the deadline.
          break;
        }

        var callback = currentTask.callback;

        if (typeof callback === 'function') {
          currentTask.callback = null;
          currentPriorityLevel = currentTask.priorityLevel;
          var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
          var continuationCallback = callback(didUserCallbackTimeout);
          currentTime = exports.unstable_now();

          if (typeof continuationCallback === 'function') {
            currentTask.callback = continuationCallback;
          } else {
            if (currentTask === peek(taskQueue)) {
              pop(taskQueue);
            }
          }

          advanceTimers(currentTime);
        } else {
          pop(taskQueue);
        }

        currentTask = peek(taskQueue);
      } // Return whether there's additional work


      if (currentTask !== null) {
        return true;
      } else {
        var firstTimer = peek(timerQueue);

        if (firstTimer !== null) {
          requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }

        return false;
      }
    }

    function unstable_runWithPriority(priorityLevel, eventHandler) {
      switch (priorityLevel) {
        case ImmediatePriority:
        case UserBlockingPriority:
        case NormalPriority:
        case LowPriority:
        case IdlePriority:
          break;

        default:
          priorityLevel = NormalPriority;
      }

      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;

      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    }

    function unstable_next(eventHandler) {
      var priorityLevel;

      switch (currentPriorityLevel) {
        case ImmediatePriority:
        case UserBlockingPriority:
        case NormalPriority:
          // Shift down to normal priority
          priorityLevel = NormalPriority;
          break;

        default:
          // Anything lower than normal priority should remain at the current level.
          priorityLevel = currentPriorityLevel;
          break;
      }

      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;

      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    }

    function unstable_wrapCallback(callback) {
      var parentPriorityLevel = currentPriorityLevel;
      return function () {
        // This is a fork of runWithPriority, inlined for performance.
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = parentPriorityLevel;

        try {
          return callback.apply(this, arguments);
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
    }

    function unstable_scheduleCallback(priorityLevel, callback, options) {
      var currentTime = exports.unstable_now();
      var startTime;

      if (_typeof(options) === 'object' && options !== null) {
        var delay = options.delay;

        if (typeof delay === 'number' && delay > 0) {
          startTime = currentTime + delay;
        } else {
          startTime = currentTime;
        }
      } else {
        startTime = currentTime;
      }

      var timeout;

      switch (priorityLevel) {
        case ImmediatePriority:
          timeout = IMMEDIATE_PRIORITY_TIMEOUT;
          break;

        case UserBlockingPriority:
          timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
          break;

        case IdlePriority:
          timeout = IDLE_PRIORITY_TIMEOUT;
          break;

        case LowPriority:
          timeout = LOW_PRIORITY_TIMEOUT;
          break;

        case NormalPriority:
        default:
          timeout = NORMAL_PRIORITY_TIMEOUT;
          break;
      }

      var expirationTime = startTime + timeout;
      var newTask = {
        id: taskIdCounter++,
        callback: callback,
        priorityLevel: priorityLevel,
        startTime: startTime,
        expirationTime: expirationTime,
        sortIndex: -1
      };

      if (startTime > currentTime) {
        // This is a delayed task.
        newTask.sortIndex = startTime;
        push(timerQueue, newTask);

        if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
          // All tasks are delayed, and this is the task with the earliest delay.
          if (isHostTimeoutScheduled) {
            // Cancel an existing timeout.
            cancelHostTimeout();
          } else {
            isHostTimeoutScheduled = true;
          } // Schedule a timeout.


          requestHostTimeout(handleTimeout, startTime - currentTime);
        }
      } else {
        newTask.sortIndex = expirationTime;
        push(taskQueue, newTask); // wait until the next time we yield.

        if (!isHostCallbackScheduled && !isPerformingWork) {
          isHostCallbackScheduled = true;
          requestHostCallback(flushWork);
        }
      }

      return newTask;
    }

    function unstable_pauseExecution() {}

    function unstable_continueExecution() {
      if (!isHostCallbackScheduled && !isPerformingWork) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      }
    }

    function unstable_getFirstCallbackNode() {
      return peek(taskQueue);
    }

    function unstable_cancelCallback(task) {
      // remove from the queue because you can't remove arbitrary nodes from an
      // array based heap, only the first one.)
      task.callback = null;
    }

    function unstable_getCurrentPriorityLevel() {
      return currentPriorityLevel;
    }

    var isMessageLoopRunning = false;
    var scheduledHostCallback = null;
    var taskTimeoutID = -1; // Scheduler periodically yields in case there is other work on the main
    // thread, like user events. By default, it yields multiple times per frame.
    // It does not attempt to align with frame boundaries, since most tasks don't
    // need to be frame aligned; for those that do, use requestAnimationFrame.

    var frameInterval = frameYieldMs;
    var startTime = -1;

    function shouldYieldToHost() {
      var timeElapsed = exports.unstable_now() - startTime;

      if (timeElapsed < frameInterval) {
        // The main thread has only been blocked for a really short amount of time;
        // smaller than a single frame. Don't yield yet.
        return false;
      } // The main thread has been blocked for a non-negligible amount of time. We


      return true;
    }

    function requestPaint() {}

    function forceFrameRate(fps) {
      if (fps < 0 || fps > 125) {
        // Using console['error'] to evade Babel and ESLint
        console['error']('forceFrameRate takes a positive int between 0 and 125, ' + 'forcing frame rates higher than 125 fps is not supported');
        return;
      }

      if (fps > 0) {
        frameInterval = Math.floor(1000 / fps);
      } else {
        // reset the framerate
        frameInterval = frameYieldMs;
      }
    }

    var performWorkUntilDeadline = function performWorkUntilDeadline() {
      if (scheduledHostCallback !== null) {
        var currentTime = exports.unstable_now(); // Keep track of the start time so we can measure how long the main thread
        // has been blocked.

        startTime = currentTime;
        var hasTimeRemaining = true; // If a scheduler task throws, exit the current browser task so the
        // error can be observed.
        //
        // Intentionally not using a try-catch, since that makes some debugging
        // techniques harder. Instead, if `scheduledHostCallback` errors, then
        // `hasMoreWork` will remain true, and we'll continue the work loop.

        var hasMoreWork = true;

        try {
          hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
        } finally {
          if (hasMoreWork) {
            // If there's more work, schedule the next message event at the end
            // of the preceding one.
            schedulePerformWorkUntilDeadline();
          } else {
            isMessageLoopRunning = false;
            scheduledHostCallback = null;
          }
        }
      } else {
        isMessageLoopRunning = false;
      } // Yielding to the browser will give it a chance to paint, so we can

    };

    var schedulePerformWorkUntilDeadline;

    if (typeof localSetImmediate === 'function') {
      // Node.js and old IE.
      // There's a few reasons for why we prefer setImmediate.
      //
      // Unlike MessageChannel, it doesn't prevent a Node.js process from exiting.
      // (Even though this is a DOM fork of the Scheduler, you could get here
      // with a mix of Node.js 15+, which has a MessageChannel, and jsdom.)
      // https://github.com/facebook/react/issues/20756
      //
      // But also, it runs earlier which is the semantic we want.
      // If other browsers ever implement it, it's better to use it.
      // Although both of these would be inferior to native scheduling.
      schedulePerformWorkUntilDeadline = function schedulePerformWorkUntilDeadline() {
        localSetImmediate(performWorkUntilDeadline);
      };
    } else if (typeof MessageChannel !== 'undefined') {
      // DOM and Worker environments.
      // We prefer MessageChannel because of the 4ms setTimeout clamping.
      var channel = new MessageChannel();
      var port = channel.port2;
      channel.port1.onmessage = performWorkUntilDeadline;

      schedulePerformWorkUntilDeadline = function schedulePerformWorkUntilDeadline() {
        port.postMessage(null);
      };
    } else {
      // We should only fallback here in non-browser environments.
      schedulePerformWorkUntilDeadline = function schedulePerformWorkUntilDeadline() {
        localSetTimeout(performWorkUntilDeadline, 0);
      };
    }

    function requestHostCallback(callback) {
      scheduledHostCallback = callback;

      if (!isMessageLoopRunning) {
        isMessageLoopRunning = true;
        schedulePerformWorkUntilDeadline();
      }
    }

    function requestHostTimeout(callback, ms) {
      taskTimeoutID = localSetTimeout(function () {
        callback(exports.unstable_now());
      }, ms);
    }

    function cancelHostTimeout() {
      localClearTimeout(taskTimeoutID);
      taskTimeoutID = -1;
    }

    var unstable_requestPaint = requestPaint;
    var unstable_Profiling = null;
    exports.unstable_IdlePriority = IdlePriority;
    exports.unstable_ImmediatePriority = ImmediatePriority;
    exports.unstable_LowPriority = LowPriority;
    exports.unstable_NormalPriority = NormalPriority;
    exports.unstable_Profiling = unstable_Profiling;
    exports.unstable_UserBlockingPriority = UserBlockingPriority;
    exports.unstable_cancelCallback = unstable_cancelCallback;
    exports.unstable_continueExecution = unstable_continueExecution;
    exports.unstable_forceFrameRate = forceFrameRate;
    exports.unstable_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
    exports.unstable_getFirstCallbackNode = unstable_getFirstCallbackNode;
    exports.unstable_next = unstable_next;
    exports.unstable_pauseExecution = unstable_pauseExecution;
    exports.unstable_requestPaint = unstable_requestPaint;
    exports.unstable_runWithPriority = unstable_runWithPriority;
    exports.unstable_scheduleCallback = unstable_scheduleCallback;
    exports.unstable_shouldYield = shouldYieldToHost;
    exports.unstable_wrapCallback = unstable_wrapCallback;
    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */

    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === 'function') {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }
  })();
}

/***/ }),

/***/ "./node_modules/scheduler/index.js":
/*!*****************************************!*\
  !*** ./node_modules/scheduler/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/scheduler.development.js */ "./node_modules/scheduler/cjs/scheduler.development.js");
}

/***/ }),

/***/ "./src/hooks/useKeyboardEvent.ts":
/*!***************************************!*\
  !*** ./src/hooks/useKeyboardEvent.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


function useKeyboardEvent() {
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {// function parseEventParams(e) {
    //     const { type, key, keyCode, which } = e
    //     const params = { type, key, keyCode, which }
    //     return JSON.stringify(params)
    // }
    // const listener = (e) => {
    //     // 键盘事件
    //     if (e.type === 'keydown' || e.type === 'keyup') {
    //         ElectronBox.get().eventService.sendSync('Events_Keyboard', parseEventParams(e))
    //     }
    // }
    // document.addEventListener('keydown', listener)
    // document.addEventListener('keyup', listener)
    // return () => {
    //     document.removeEventListener('keydown', listener)
    //     document.removeEventListener('keyup', listener)
    // }
  }, []);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useKeyboardEvent);

/***/ }),

/***/ "./src/store/actions.ts":
/*!******************************!*\
  !*** ./src/store/actions.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E_ACTION_TYPE": () => (/* binding */ E_ACTION_TYPE),
/* harmony export */   "storeAction": () => (/* binding */ storeAction)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/store/base.ts");

var E_ACTION_TYPE;

(function (E_ACTION_TYPE) {
  E_ACTION_TYPE["TEST_ACTION"] = "testAction";
})(E_ACTION_TYPE || (E_ACTION_TYPE = {}));

var storeAction = {
  test: function test(_test) {
    return (0,_base__WEBPACK_IMPORTED_MODULE_0__.createAction)(E_ACTION_TYPE.TEST_ACTION, _test);
  }
};

/***/ }),

/***/ "./src/store/base.ts":
/*!***************************!*\
  !*** ./src/store/base.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createAction": () => (/* binding */ createAction),
/* harmony export */   "createStoreWithReducers": () => (/* binding */ createStoreWithReducers)
/* harmony export */ });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");

function createAction(type, payLoad) {
  var other = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  return {
    type: type,
    payLoad: payLoad,
    other: other
  };
}
function createStoreWithReducers(reducers, initStore) {
  var reducer = function reducer(state, action) {
    action.payLoad = action.payLoad === undefined ? {} : action.payLoad;

    if (reducers[action.type]) {
      return reducers[action.type](state, action);
    }

    return state;
  };

  return (0,redux__WEBPACK_IMPORTED_MODULE_0__.createStore)(reducer, initStore);
}

/***/ }),

/***/ "./src/store/index.ts":
/*!****************************!*\
  !*** ./src/store/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "store": () => (/* binding */ store)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/store/base.ts");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reducers */ "./src/store/reducers.ts");


var initialState = {
  test: '',
  cacheRoute: new Map()
};
var store = (0,_base__WEBPACK_IMPORTED_MODULE_0__.createStoreWithReducers)(_reducers__WEBPACK_IMPORTED_MODULE_1__.reducers, initialState);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (store);

/***/ }),

/***/ "./src/store/reducers.ts":
/*!*******************************!*\
  !*** ./src/store/reducers.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reducers": () => (/* binding */ reducers)
/* harmony export */ });
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions */ "./src/store/actions.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var reducers = _defineProperty({}, _actions__WEBPACK_IMPORTED_MODULE_0__.E_ACTION_TYPE.TEST_ACTION, function (state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    test: action.payLoad
  });
});

/***/ }),

/***/ "./src/worker.tsx":
/*!************************!*\
  !*** ./src/worker.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store */ "./src/store/index.ts");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/index.js");
/* harmony import */ var _style_common_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style/common.scss */ "./src/style/common.scss");
/* harmony import */ var _worker_less__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./worker.less */ "./src/worker.less");
/* harmony import */ var _hooks_useKeyboardEvent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hooks/useKeyboardEvent */ "./src/hooks/useKeyboardEvent.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var _window$require = window.require('electron'),
    ipcRenderer = _window$require.ipcRenderer;





function Task() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      inputMessageList = _useState2[0],
      setInputMessageList = _useState2[1];

  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      outputMessageList = _useState4[0],
      setOutputMessageList = _useState4[1];

  (0,_hooks_useKeyboardEvent__WEBPACK_IMPORTED_MODULE_6__["default"])();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    ipcRenderer.on('message-from-main', function (event, args) {
      console.info('worker:', args);
      setInputMessageList(function (list) {
        return list.concat([args]);
      });
      setTimeout(function () {
        var res = _objectSpread({
          timestamp: new Date().getTime()
        }, args);

        ipcRenderer.send('message-from-worker', res);
        setOutputMessageList(function (list) {
          return list.concat([args]);
        });
      }, 3000);
    });
    ipcRenderer.on('begain-task', function (event, arg) {
      // 根据tag判断任务类型
      if (arg.tag === 'xxxx') {
        console.log(arg.dataSource); //任务处理TODO
        // xxxx()
        //以下代码可根据需要放在合适的位置
        //如果处理状态有变化则发送变化通知

        ipcRenderer.send('change-task-status', {
          data: 'change-task-status'
        }); //如果任务处理完成，则发送完成通知

        ipcRenderer.send('task-complete', {
          data: ''
        });
      }
    });
    ipcRenderer.send('window-load-success', true);
    return function () {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "worker-container allow-select-text"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "message-list"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "left"
  }, inputMessageList.map(function (r, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      key: i,
      className: "message"
    }, "req:", JSON.stringify(r));
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "right"
  }, outputMessageList.map(function (r, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      key: i,
      className: "message"
    }, "res:", JSON.stringify(r));
  }))));
}

var container = document.getElementById('root');
var root = react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot(container);

var render = function render(Component) {
  root.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Provider, {
    store: _store__WEBPACK_IMPORTED_MODULE_3__["default"]
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_7__.HashRouter, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Component, null))));
};

render(Task);

/***/ }),

/***/ "./src/worker.less":
/*!*************************!*\
  !*** ./src/worker.less ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style/common.scss":
/*!*******************************!*\
  !*** ./src/style/common.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectSpread2)
/* harmony export */ });
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defineProperty.js */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");


function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectWithoutPropertiesLoose)
/* harmony export */ });
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"worker": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkmain"] = self["webpackChunkmain"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/worker.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVh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O1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFpbi8uL25vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwid2VicGFjazovL21haW4vLi9ub2RlX21vZHVsZXMvc2NoZWR1bGVyL2Nqcy9zY2hlZHVsZXIuZGV2ZWxvcG1lbnQuanMiLCJ3ZWJwYWNrOi8vbWFpbi8uL25vZGVfbW9kdWxlcy9zY2hlZHVsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWFpbi8uL3NyYy9ob29rcy91c2VLZXlib2FyZEV2ZW50LnRzIiwid2VicGFjazovL21haW4vLi9zcmMvc3RvcmUvYWN0aW9ucy50cyIsIndlYnBhY2s6Ly9tYWluLy4vc3JjL3N0b3JlL2Jhc2UudHMiLCJ3ZWJwYWNrOi8vbWFpbi8uL3NyYy9zdG9yZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tYWluLy4vc3JjL3N0b3JlL3JlZHVjZXJzLnRzIiwid2VicGFjazovL21haW4vLi9zcmMvd29ya2VyLnRzeCIsIndlYnBhY2s6Ly9tYWluLy4vc3JjL3dvcmtlci5sZXNzPzE2YzgiLCJ3ZWJwYWNrOi8vbWFpbi8uL3NyYy9zdHlsZS9jb21tb24uc2Nzcz84MGRhIiwid2VicGFjazovL21haW4vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZGVmaW5lUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vbWFpbi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9leHRlbmRzLmpzIiwid2VicGFjazovL21haW4vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vb2JqZWN0U3ByZWFkMi5qcyIsIndlYnBhY2s6Ly9tYWluLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UuanMiLCJ3ZWJwYWNrOi8vbWFpbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tYWluL3dlYnBhY2svcnVudGltZS9hbWQgb3B0aW9ucyIsIndlYnBhY2s6Ly9tYWluL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vbWFpbi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9tYWluL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tYWluL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vbWFpbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21haW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tYWluL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vbWFpbi93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9tYWluL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vbWFpbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vbWFpbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIi8qKlxuICogQGxpY2Vuc2UgUmVhY3RcbiAqIHNjaGVkdWxlci5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAndXNlIHN0cmljdCc7XG5cbi8qIGdsb2JhbCBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gKi9cbmlmIChcbiAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RhcnQgPT09XG4gICAgJ2Z1bmN0aW9uJ1xuKSB7XG4gIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RhcnQobmV3IEVycm9yKCkpO1xufVxuICAgICAgICAgIHZhciBlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmcgPSBmYWxzZTtcbnZhciBlbmFibGVQcm9maWxpbmcgPSBmYWxzZTtcbnZhciBmcmFtZVlpZWxkTXMgPSA1O1xuXG5mdW5jdGlvbiBwdXNoKGhlYXAsIG5vZGUpIHtcbiAgdmFyIGluZGV4ID0gaGVhcC5sZW5ndGg7XG4gIGhlYXAucHVzaChub2RlKTtcbiAgc2lmdFVwKGhlYXAsIG5vZGUsIGluZGV4KTtcbn1cbmZ1bmN0aW9uIHBlZWsoaGVhcCkge1xuICByZXR1cm4gaGVhcC5sZW5ndGggPT09IDAgPyBudWxsIDogaGVhcFswXTtcbn1cbmZ1bmN0aW9uIHBvcChoZWFwKSB7XG4gIGlmIChoZWFwLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIGZpcnN0ID0gaGVhcFswXTtcbiAgdmFyIGxhc3QgPSBoZWFwLnBvcCgpO1xuXG4gIGlmIChsYXN0ICE9PSBmaXJzdCkge1xuICAgIGhlYXBbMF0gPSBsYXN0O1xuICAgIHNpZnREb3duKGhlYXAsIGxhc3QsIDApO1xuICB9XG5cbiAgcmV0dXJuIGZpcnN0O1xufVxuXG5mdW5jdGlvbiBzaWZ0VXAoaGVhcCwgbm9kZSwgaSkge1xuICB2YXIgaW5kZXggPSBpO1xuXG4gIHdoaWxlIChpbmRleCA+IDApIHtcbiAgICB2YXIgcGFyZW50SW5kZXggPSBpbmRleCAtIDEgPj4+IDE7XG4gICAgdmFyIHBhcmVudCA9IGhlYXBbcGFyZW50SW5kZXhdO1xuXG4gICAgaWYgKGNvbXBhcmUocGFyZW50LCBub2RlKSA+IDApIHtcbiAgICAgIC8vIFRoZSBwYXJlbnQgaXMgbGFyZ2VyLiBTd2FwIHBvc2l0aW9ucy5cbiAgICAgIGhlYXBbcGFyZW50SW5kZXhdID0gbm9kZTtcbiAgICAgIGhlYXBbaW5kZXhdID0gcGFyZW50O1xuICAgICAgaW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHBhcmVudCBpcyBzbWFsbGVyLiBFeGl0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzaWZ0RG93bihoZWFwLCBub2RlLCBpKSB7XG4gIHZhciBpbmRleCA9IGk7XG4gIHZhciBsZW5ndGggPSBoZWFwLmxlbmd0aDtcbiAgdmFyIGhhbGZMZW5ndGggPSBsZW5ndGggPj4+IDE7XG5cbiAgd2hpbGUgKGluZGV4IDwgaGFsZkxlbmd0aCkge1xuICAgIHZhciBsZWZ0SW5kZXggPSAoaW5kZXggKyAxKSAqIDIgLSAxO1xuICAgIHZhciBsZWZ0ID0gaGVhcFtsZWZ0SW5kZXhdO1xuICAgIHZhciByaWdodEluZGV4ID0gbGVmdEluZGV4ICsgMTtcbiAgICB2YXIgcmlnaHQgPSBoZWFwW3JpZ2h0SW5kZXhdOyAvLyBJZiB0aGUgbGVmdCBvciByaWdodCBub2RlIGlzIHNtYWxsZXIsIHN3YXAgd2l0aCB0aGUgc21hbGxlciBvZiB0aG9zZS5cblxuICAgIGlmIChjb21wYXJlKGxlZnQsIG5vZGUpIDwgMCkge1xuICAgICAgaWYgKHJpZ2h0SW5kZXggPCBsZW5ndGggJiYgY29tcGFyZShyaWdodCwgbGVmdCkgPCAwKSB7XG4gICAgICAgIGhlYXBbaW5kZXhdID0gcmlnaHQ7XG4gICAgICAgIGhlYXBbcmlnaHRJbmRleF0gPSBub2RlO1xuICAgICAgICBpbmRleCA9IHJpZ2h0SW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWFwW2luZGV4XSA9IGxlZnQ7XG4gICAgICAgIGhlYXBbbGVmdEluZGV4XSA9IG5vZGU7XG4gICAgICAgIGluZGV4ID0gbGVmdEluZGV4O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmlnaHRJbmRleCA8IGxlbmd0aCAmJiBjb21wYXJlKHJpZ2h0LCBub2RlKSA8IDApIHtcbiAgICAgIGhlYXBbaW5kZXhdID0gcmlnaHQ7XG4gICAgICBoZWFwW3JpZ2h0SW5kZXhdID0gbm9kZTtcbiAgICAgIGluZGV4ID0gcmlnaHRJbmRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTmVpdGhlciBjaGlsZCBpcyBzbWFsbGVyLiBFeGl0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgLy8gQ29tcGFyZSBzb3J0IGluZGV4IGZpcnN0LCB0aGVuIHRhc2sgaWQuXG4gIHZhciBkaWZmID0gYS5zb3J0SW5kZXggLSBiLnNvcnRJbmRleDtcbiAgcmV0dXJuIGRpZmYgIT09IDAgPyBkaWZmIDogYS5pZCAtIGIuaWQ7XG59XG5cbi8vIFRPRE86IFVzZSBzeW1ib2xzP1xudmFyIEltbWVkaWF0ZVByaW9yaXR5ID0gMTtcbnZhciBVc2VyQmxvY2tpbmdQcmlvcml0eSA9IDI7XG52YXIgTm9ybWFsUHJpb3JpdHkgPSAzO1xudmFyIExvd1ByaW9yaXR5ID0gNDtcbnZhciBJZGxlUHJpb3JpdHkgPSA1O1xuXG5mdW5jdGlvbiBtYXJrVGFza0Vycm9yZWQodGFzaywgbXMpIHtcbn1cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5cbnZhciBoYXNQZXJmb3JtYW5jZU5vdyA9IHR5cGVvZiBwZXJmb3JtYW5jZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gJ2Z1bmN0aW9uJztcblxuaWYgKGhhc1BlcmZvcm1hbmNlTm93KSB7XG4gIHZhciBsb2NhbFBlcmZvcm1hbmNlID0gcGVyZm9ybWFuY2U7XG5cbiAgZXhwb3J0cy51bnN0YWJsZV9ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxvY2FsUGVyZm9ybWFuY2Uubm93KCk7XG4gIH07XG59IGVsc2Uge1xuICB2YXIgbG9jYWxEYXRlID0gRGF0ZTtcbiAgdmFyIGluaXRpYWxUaW1lID0gbG9jYWxEYXRlLm5vdygpO1xuXG4gIGV4cG9ydHMudW5zdGFibGVfbm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsb2NhbERhdGUubm93KCkgLSBpbml0aWFsVGltZTtcbiAgfTtcbn0gLy8gTWF4IDMxIGJpdCBpbnRlZ2VyLiBUaGUgbWF4IGludGVnZXIgc2l6ZSBpbiBWOCBmb3IgMzItYml0IHN5c3RlbXMuXG4vLyBNYXRoLnBvdygyLCAzMCkgLSAxXG4vLyAwYjExMTExMTExMTExMTExMTExMTExMTExMTExMTExMVxuXG5cbnZhciBtYXhTaWduZWQzMUJpdEludCA9IDEwNzM3NDE4MjM7IC8vIFRpbWVzIG91dCBpbW1lZGlhdGVseVxuXG52YXIgSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQgPSAtMTsgLy8gRXZlbnR1YWxseSB0aW1lcyBvdXRcblxudmFyIFVTRVJfQkxPQ0tJTkdfUFJJT1JJVFlfVElNRU9VVCA9IDI1MDtcbnZhciBOT1JNQUxfUFJJT1JJVFlfVElNRU9VVCA9IDUwMDA7XG52YXIgTE9XX1BSSU9SSVRZX1RJTUVPVVQgPSAxMDAwMDsgLy8gTmV2ZXIgdGltZXMgb3V0XG5cbnZhciBJRExFX1BSSU9SSVRZX1RJTUVPVVQgPSBtYXhTaWduZWQzMUJpdEludDsgLy8gVGFza3MgYXJlIHN0b3JlZCBvbiBhIG1pbiBoZWFwXG5cbnZhciB0YXNrUXVldWUgPSBbXTtcbnZhciB0aW1lclF1ZXVlID0gW107IC8vIEluY3JlbWVudGluZyBpZCBjb3VudGVyLiBVc2VkIHRvIG1haW50YWluIGluc2VydGlvbiBvcmRlci5cblxudmFyIHRhc2tJZENvdW50ZXIgPSAxOyAvLyBQYXVzaW5nIHRoZSBzY2hlZHVsZXIgaXMgdXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG52YXIgY3VycmVudFRhc2sgPSBudWxsO1xudmFyIGN1cnJlbnRQcmlvcml0eUxldmVsID0gTm9ybWFsUHJpb3JpdHk7IC8vIFRoaXMgaXMgc2V0IHdoaWxlIHBlcmZvcm1pbmcgd29yaywgdG8gcHJldmVudCByZS1lbnRyYW5jZS5cblxudmFyIGlzUGVyZm9ybWluZ1dvcmsgPSBmYWxzZTtcbnZhciBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IGZhbHNlO1xudmFyIGlzSG9zdFRpbWVvdXRTY2hlZHVsZWQgPSBmYWxzZTsgLy8gQ2FwdHVyZSBsb2NhbCByZWZlcmVuY2VzIHRvIG5hdGl2ZSBBUElzLCBpbiBjYXNlIGEgcG9seWZpbGwgb3ZlcnJpZGVzIHRoZW0uXG5cbnZhciBsb2NhbFNldFRpbWVvdXQgPSB0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJyA/IHNldFRpbWVvdXQgOiBudWxsO1xudmFyIGxvY2FsQ2xlYXJUaW1lb3V0ID0gdHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJyA/IGNsZWFyVGltZW91dCA6IG51bGw7XG52YXIgbG9jYWxTZXRJbW1lZGlhdGUgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJyA/IHNldEltbWVkaWF0ZSA6IG51bGw7IC8vIElFIGFuZCBOb2RlLmpzICsganNkb21cblxudmFyIGlzSW5wdXRQZW5kaW5nID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnNjaGVkdWxpbmcgIT09IHVuZGVmaW5lZCAmJiBuYXZpZ2F0b3Iuc2NoZWR1bGluZy5pc0lucHV0UGVuZGluZyAhPT0gdW5kZWZpbmVkID8gbmF2aWdhdG9yLnNjaGVkdWxpbmcuaXNJbnB1dFBlbmRpbmcuYmluZChuYXZpZ2F0b3Iuc2NoZWR1bGluZykgOiBudWxsO1xuXG5mdW5jdGlvbiBhZHZhbmNlVGltZXJzKGN1cnJlbnRUaW1lKSB7XG4gIC8vIENoZWNrIGZvciB0YXNrcyB0aGF0IGFyZSBubyBsb25nZXIgZGVsYXllZCBhbmQgYWRkIHRoZW0gdG8gdGhlIHF1ZXVlLlxuICB2YXIgdGltZXIgPSBwZWVrKHRpbWVyUXVldWUpO1xuXG4gIHdoaWxlICh0aW1lciAhPT0gbnVsbCkge1xuICAgIGlmICh0aW1lci5jYWxsYmFjayA9PT0gbnVsbCkge1xuICAgICAgLy8gVGltZXIgd2FzIGNhbmNlbGxlZC5cbiAgICAgIHBvcCh0aW1lclF1ZXVlKTtcbiAgICB9IGVsc2UgaWYgKHRpbWVyLnN0YXJ0VGltZSA8PSBjdXJyZW50VGltZSkge1xuICAgICAgLy8gVGltZXIgZmlyZWQuIFRyYW5zZmVyIHRvIHRoZSB0YXNrIHF1ZXVlLlxuICAgICAgcG9wKHRpbWVyUXVldWUpO1xuICAgICAgdGltZXIuc29ydEluZGV4ID0gdGltZXIuZXhwaXJhdGlvblRpbWU7XG4gICAgICBwdXNoKHRhc2tRdWV1ZSwgdGltZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZW1haW5pbmcgdGltZXJzIGFyZSBwZW5kaW5nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRpbWVyID0gcGVlayh0aW1lclF1ZXVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVUaW1lb3V0KGN1cnJlbnRUaW1lKSB7XG4gIGlzSG9zdFRpbWVvdXRTY2hlZHVsZWQgPSBmYWxzZTtcbiAgYWR2YW5jZVRpbWVycyhjdXJyZW50VGltZSk7XG5cbiAgaWYgKCFpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCkge1xuICAgIGlmIChwZWVrKHRhc2tRdWV1ZSkgIT09IG51bGwpIHtcbiAgICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3RIb3N0Q2FsbGJhY2soZmx1c2hXb3JrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZpcnN0VGltZXIgPSBwZWVrKHRpbWVyUXVldWUpO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lciAhPT0gbnVsbCkge1xuICAgICAgICByZXF1ZXN0SG9zdFRpbWVvdXQoaGFuZGxlVGltZW91dCwgZmlyc3RUaW1lci5zdGFydFRpbWUgLSBjdXJyZW50VGltZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsdXNoV29yayhoYXNUaW1lUmVtYWluaW5nLCBpbml0aWFsVGltZSkge1xuXG5cbiAgaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgPSBmYWxzZTtcblxuICBpZiAoaXNIb3N0VGltZW91dFNjaGVkdWxlZCkge1xuICAgIC8vIFdlIHNjaGVkdWxlZCBhIHRpbWVvdXQgYnV0IGl0J3Mgbm8gbG9uZ2VyIG5lZWRlZC4gQ2FuY2VsIGl0LlxuICAgIGlzSG9zdFRpbWVvdXRTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBjYW5jZWxIb3N0VGltZW91dCgpO1xuICB9XG5cbiAgaXNQZXJmb3JtaW5nV29yayA9IHRydWU7XG4gIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcblxuICB0cnkge1xuICAgIGlmIChlbmFibGVQcm9maWxpbmcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB3b3JrTG9vcChoYXNUaW1lUmVtYWluaW5nLCBpbml0aWFsVGltZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoY3VycmVudFRhc2sgIT09IG51bGwpIHtcbiAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBleHBvcnRzLnVuc3RhYmxlX25vdygpO1xuICAgICAgICAgIG1hcmtUYXNrRXJyb3JlZChjdXJyZW50VGFzaywgY3VycmVudFRpbWUpO1xuICAgICAgICAgIGN1cnJlbnRUYXNrLmlzUXVldWVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gY2F0Y2ggaW4gcHJvZCBjb2RlIHBhdGguXG4gICAgICByZXR1cm4gd29ya0xvb3AoaGFzVGltZVJlbWFpbmluZywgaW5pdGlhbFRpbWUpO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBjdXJyZW50VGFzayA9IG51bGw7XG4gICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmV2aW91c1ByaW9yaXR5TGV2ZWw7XG4gICAgaXNQZXJmb3JtaW5nV29yayA9IGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdvcmtMb29wKGhhc1RpbWVSZW1haW5pbmcsIGluaXRpYWxUaW1lKSB7XG4gIHZhciBjdXJyZW50VGltZSA9IGluaXRpYWxUaW1lO1xuICBhZHZhbmNlVGltZXJzKGN1cnJlbnRUaW1lKTtcbiAgY3VycmVudFRhc2sgPSBwZWVrKHRhc2tRdWV1ZSk7XG5cbiAgd2hpbGUgKGN1cnJlbnRUYXNrICE9PSBudWxsICYmICEoZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nICkpIHtcbiAgICBpZiAoY3VycmVudFRhc2suZXhwaXJhdGlvblRpbWUgPiBjdXJyZW50VGltZSAmJiAoIWhhc1RpbWVSZW1haW5pbmcgfHwgc2hvdWxkWWllbGRUb0hvc3QoKSkpIHtcbiAgICAgIC8vIFRoaXMgY3VycmVudFRhc2sgaGFzbid0IGV4cGlyZWQsIGFuZCB3ZSd2ZSByZWFjaGVkIHRoZSBkZWFkbGluZS5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBjYWxsYmFjayA9IGN1cnJlbnRUYXNrLmNhbGxiYWNrO1xuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY3VycmVudFRhc2suY2FsbGJhY2sgPSBudWxsO1xuICAgICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBjdXJyZW50VGFzay5wcmlvcml0eUxldmVsO1xuICAgICAgdmFyIGRpZFVzZXJDYWxsYmFja1RpbWVvdXQgPSBjdXJyZW50VGFzay5leHBpcmF0aW9uVGltZSA8PSBjdXJyZW50VGltZTtcblxuICAgICAgdmFyIGNvbnRpbnVhdGlvbkNhbGxiYWNrID0gY2FsbGJhY2soZGlkVXNlckNhbGxiYWNrVGltZW91dCk7XG4gICAgICBjdXJyZW50VGltZSA9IGV4cG9ydHMudW5zdGFibGVfbm93KCk7XG5cbiAgICAgIGlmICh0eXBlb2YgY29udGludWF0aW9uQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY3VycmVudFRhc2suY2FsbGJhY2sgPSBjb250aW51YXRpb25DYWxsYmFjaztcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRUYXNrID09PSBwZWVrKHRhc2tRdWV1ZSkpIHtcbiAgICAgICAgICBwb3AodGFza1F1ZXVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhZHZhbmNlVGltZXJzKGN1cnJlbnRUaW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9wKHRhc2tRdWV1ZSk7XG4gICAgfVxuXG4gICAgY3VycmVudFRhc2sgPSBwZWVrKHRhc2tRdWV1ZSk7XG4gIH0gLy8gUmV0dXJuIHdoZXRoZXIgdGhlcmUncyBhZGRpdGlvbmFsIHdvcmtcblxuXG4gIGlmIChjdXJyZW50VGFzayAhPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBmaXJzdFRpbWVyID0gcGVlayh0aW1lclF1ZXVlKTtcblxuICAgIGlmIChmaXJzdFRpbWVyICE9PSBudWxsKSB7XG4gICAgICByZXF1ZXN0SG9zdFRpbWVvdXQoaGFuZGxlVGltZW91dCwgZmlyc3RUaW1lci5zdGFydFRpbWUgLSBjdXJyZW50VGltZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3J1bldpdGhQcmlvcml0eShwcmlvcml0eUxldmVsLCBldmVudEhhbmRsZXIpIHtcbiAgc3dpdGNoIChwcmlvcml0eUxldmVsKSB7XG4gICAgY2FzZSBJbW1lZGlhdGVQcmlvcml0eTpcbiAgICBjYXNlIFVzZXJCbG9ja2luZ1ByaW9yaXR5OlxuICAgIGNhc2UgTm9ybWFsUHJpb3JpdHk6XG4gICAgY2FzZSBMb3dQcmlvcml0eTpcbiAgICBjYXNlIElkbGVQcmlvcml0eTpcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHByaW9yaXR5TGV2ZWwgPSBOb3JtYWxQcmlvcml0eTtcbiAgfVxuXG4gIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmlvcml0eUxldmVsO1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGV2ZW50SGFuZGxlcigpO1xuICB9IGZpbmFsbHkge1xuICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX25leHQoZXZlbnRIYW5kbGVyKSB7XG4gIHZhciBwcmlvcml0eUxldmVsO1xuXG4gIHN3aXRjaCAoY3VycmVudFByaW9yaXR5TGV2ZWwpIHtcbiAgICBjYXNlIEltbWVkaWF0ZVByaW9yaXR5OlxuICAgIGNhc2UgVXNlckJsb2NraW5nUHJpb3JpdHk6XG4gICAgY2FzZSBOb3JtYWxQcmlvcml0eTpcbiAgICAgIC8vIFNoaWZ0IGRvd24gdG8gbm9ybWFsIHByaW9yaXR5XG4gICAgICBwcmlvcml0eUxldmVsID0gTm9ybWFsUHJpb3JpdHk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBBbnl0aGluZyBsb3dlciB0aGFuIG5vcm1hbCBwcmlvcml0eSBzaG91bGQgcmVtYWluIGF0IHRoZSBjdXJyZW50IGxldmVsLlxuICAgICAgcHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgcHJldmlvdXNQcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG4gIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJpb3JpdHlMZXZlbDtcblxuICB0cnkge1xuICAgIHJldHVybiBldmVudEhhbmRsZXIoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByZXZpb3VzUHJpb3JpdHlMZXZlbDtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV93cmFwQ2FsbGJhY2soY2FsbGJhY2spIHtcbiAgdmFyIHBhcmVudFByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUaGlzIGlzIGEgZm9yayBvZiBydW5XaXRoUHJpb3JpdHksIGlubGluZWQgZm9yIHBlcmZvcm1hbmNlLlxuICAgIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHBhcmVudFByaW9yaXR5TGV2ZWw7XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayhwcmlvcml0eUxldmVsLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICB2YXIgY3VycmVudFRpbWUgPSBleHBvcnRzLnVuc3RhYmxlX25vdygpO1xuICB2YXIgc3RhcnRUaW1lO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucyAhPT0gbnVsbCkge1xuICAgIHZhciBkZWxheSA9IG9wdGlvbnMuZGVsYXk7XG5cbiAgICBpZiAodHlwZW9mIGRlbGF5ID09PSAnbnVtYmVyJyAmJiBkZWxheSA+IDApIHtcbiAgICAgIHN0YXJ0VGltZSA9IGN1cnJlbnRUaW1lICsgZGVsYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzdGFydFRpbWUgPSBjdXJyZW50VGltZTtcbiAgfVxuXG4gIHZhciB0aW1lb3V0O1xuXG4gIHN3aXRjaCAocHJpb3JpdHlMZXZlbCkge1xuICAgIGNhc2UgSW1tZWRpYXRlUHJpb3JpdHk6XG4gICAgICB0aW1lb3V0ID0gSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQ7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgVXNlckJsb2NraW5nUHJpb3JpdHk6XG4gICAgICB0aW1lb3V0ID0gVVNFUl9CTE9DS0lOR19QUklPUklUWV9USU1FT1VUO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIElkbGVQcmlvcml0eTpcbiAgICAgIHRpbWVvdXQgPSBJRExFX1BSSU9SSVRZX1RJTUVPVVQ7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgTG93UHJpb3JpdHk6XG4gICAgICB0aW1lb3V0ID0gTE9XX1BSSU9SSVRZX1RJTUVPVVQ7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgTm9ybWFsUHJpb3JpdHk6XG4gICAgZGVmYXVsdDpcbiAgICAgIHRpbWVvdXQgPSBOT1JNQUxfUFJJT1JJVFlfVElNRU9VVDtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGV4cGlyYXRpb25UaW1lID0gc3RhcnRUaW1lICsgdGltZW91dDtcbiAgdmFyIG5ld1Rhc2sgPSB7XG4gICAgaWQ6IHRhc2tJZENvdW50ZXIrKyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgcHJpb3JpdHlMZXZlbDogcHJpb3JpdHlMZXZlbCxcbiAgICBzdGFydFRpbWU6IHN0YXJ0VGltZSxcbiAgICBleHBpcmF0aW9uVGltZTogZXhwaXJhdGlvblRpbWUsXG4gICAgc29ydEluZGV4OiAtMVxuICB9O1xuXG4gIGlmIChzdGFydFRpbWUgPiBjdXJyZW50VGltZSkge1xuICAgIC8vIFRoaXMgaXMgYSBkZWxheWVkIHRhc2suXG4gICAgbmV3VGFzay5zb3J0SW5kZXggPSBzdGFydFRpbWU7XG4gICAgcHVzaCh0aW1lclF1ZXVlLCBuZXdUYXNrKTtcblxuICAgIGlmIChwZWVrKHRhc2tRdWV1ZSkgPT09IG51bGwgJiYgbmV3VGFzayA9PT0gcGVlayh0aW1lclF1ZXVlKSkge1xuICAgICAgLy8gQWxsIHRhc2tzIGFyZSBkZWxheWVkLCBhbmQgdGhpcyBpcyB0aGUgdGFzayB3aXRoIHRoZSBlYXJsaWVzdCBkZWxheS5cbiAgICAgIGlmIChpc0hvc3RUaW1lb3V0U2NoZWR1bGVkKSB7XG4gICAgICAgIC8vIENhbmNlbCBhbiBleGlzdGluZyB0aW1lb3V0LlxuICAgICAgICBjYW5jZWxIb3N0VGltZW91dCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNIb3N0VGltZW91dFNjaGVkdWxlZCA9IHRydWU7XG4gICAgICB9IC8vIFNjaGVkdWxlIGEgdGltZW91dC5cblxuXG4gICAgICByZXF1ZXN0SG9zdFRpbWVvdXQoaGFuZGxlVGltZW91dCwgc3RhcnRUaW1lIC0gY3VycmVudFRpbWUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuZXdUYXNrLnNvcnRJbmRleCA9IGV4cGlyYXRpb25UaW1lO1xuICAgIHB1c2godGFza1F1ZXVlLCBuZXdUYXNrKTtcbiAgICAvLyB3YWl0IHVudGlsIHRoZSBuZXh0IHRpbWUgd2UgeWllbGQuXG5cblxuICAgIGlmICghaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgJiYgIWlzUGVyZm9ybWluZ1dvcmspIHtcbiAgICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3RIb3N0Q2FsbGJhY2soZmx1c2hXb3JrKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3VGFzaztcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfcGF1c2VFeGVjdXRpb24oKSB7XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uKCkge1xuXG4gIGlmICghaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgJiYgIWlzUGVyZm9ybWluZ1dvcmspIHtcbiAgICBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IHRydWU7XG4gICAgcmVxdWVzdEhvc3RDYWxsYmFjayhmbHVzaFdvcmspO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlKCkge1xuICByZXR1cm4gcGVlayh0YXNrUXVldWUpO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9jYW5jZWxDYWxsYmFjayh0YXNrKSB7XG4gIC8vIHJlbW92ZSBmcm9tIHRoZSBxdWV1ZSBiZWNhdXNlIHlvdSBjYW4ndCByZW1vdmUgYXJiaXRyYXJ5IG5vZGVzIGZyb20gYW5cbiAgLy8gYXJyYXkgYmFzZWQgaGVhcCwgb25seSB0aGUgZmlyc3Qgb25lLilcblxuXG4gIHRhc2suY2FsbGJhY2sgPSBudWxsO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbCgpIHtcbiAgcmV0dXJuIGN1cnJlbnRQcmlvcml0eUxldmVsO1xufVxuXG52YXIgaXNNZXNzYWdlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbnZhciBzY2hlZHVsZWRIb3N0Q2FsbGJhY2sgPSBudWxsO1xudmFyIHRhc2tUaW1lb3V0SUQgPSAtMTsgLy8gU2NoZWR1bGVyIHBlcmlvZGljYWxseSB5aWVsZHMgaW4gY2FzZSB0aGVyZSBpcyBvdGhlciB3b3JrIG9uIHRoZSBtYWluXG4vLyB0aHJlYWQsIGxpa2UgdXNlciBldmVudHMuIEJ5IGRlZmF1bHQsIGl0IHlpZWxkcyBtdWx0aXBsZSB0aW1lcyBwZXIgZnJhbWUuXG4vLyBJdCBkb2VzIG5vdCBhdHRlbXB0IHRvIGFsaWduIHdpdGggZnJhbWUgYm91bmRhcmllcywgc2luY2UgbW9zdCB0YXNrcyBkb24ndFxuLy8gbmVlZCB0byBiZSBmcmFtZSBhbGlnbmVkOyBmb3IgdGhvc2UgdGhhdCBkbywgdXNlIHJlcXVlc3RBbmltYXRpb25GcmFtZS5cblxudmFyIGZyYW1lSW50ZXJ2YWwgPSBmcmFtZVlpZWxkTXM7XG52YXIgc3RhcnRUaW1lID0gLTE7XG5cbmZ1bmN0aW9uIHNob3VsZFlpZWxkVG9Ib3N0KCkge1xuICB2YXIgdGltZUVsYXBzZWQgPSBleHBvcnRzLnVuc3RhYmxlX25vdygpIC0gc3RhcnRUaW1lO1xuXG4gIGlmICh0aW1lRWxhcHNlZCA8IGZyYW1lSW50ZXJ2YWwpIHtcbiAgICAvLyBUaGUgbWFpbiB0aHJlYWQgaGFzIG9ubHkgYmVlbiBibG9ja2VkIGZvciBhIHJlYWxseSBzaG9ydCBhbW91bnQgb2YgdGltZTtcbiAgICAvLyBzbWFsbGVyIHRoYW4gYSBzaW5nbGUgZnJhbWUuIERvbid0IHlpZWxkIHlldC5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gLy8gVGhlIG1haW4gdGhyZWFkIGhhcyBiZWVuIGJsb2NrZWQgZm9yIGEgbm9uLW5lZ2xpZ2libGUgYW1vdW50IG9mIHRpbWUuIFdlXG5cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdFBhaW50KCkge1xuXG59XG5cbmZ1bmN0aW9uIGZvcmNlRnJhbWVSYXRlKGZwcykge1xuICBpZiAoZnBzIDwgMCB8fCBmcHMgPiAxMjUpIHtcbiAgICAvLyBVc2luZyBjb25zb2xlWydlcnJvciddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcbiAgICBjb25zb2xlWydlcnJvciddKCdmb3JjZUZyYW1lUmF0ZSB0YWtlcyBhIHBvc2l0aXZlIGludCBiZXR3ZWVuIDAgYW5kIDEyNSwgJyArICdmb3JjaW5nIGZyYW1lIHJhdGVzIGhpZ2hlciB0aGFuIDEyNSBmcHMgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChmcHMgPiAwKSB7XG4gICAgZnJhbWVJbnRlcnZhbCA9IE1hdGguZmxvb3IoMTAwMCAvIGZwcyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gcmVzZXQgdGhlIGZyYW1lcmF0ZVxuICAgIGZyYW1lSW50ZXJ2YWwgPSBmcmFtZVlpZWxkTXM7XG4gIH1cbn1cblxudmFyIHBlcmZvcm1Xb3JrVW50aWxEZWFkbGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHNjaGVkdWxlZEhvc3RDYWxsYmFjayAhPT0gbnVsbCkge1xuICAgIHZhciBjdXJyZW50VGltZSA9IGV4cG9ydHMudW5zdGFibGVfbm93KCk7IC8vIEtlZXAgdHJhY2sgb2YgdGhlIHN0YXJ0IHRpbWUgc28gd2UgY2FuIG1lYXN1cmUgaG93IGxvbmcgdGhlIG1haW4gdGhyZWFkXG4gICAgLy8gaGFzIGJlZW4gYmxvY2tlZC5cblxuICAgIHN0YXJ0VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgIHZhciBoYXNUaW1lUmVtYWluaW5nID0gdHJ1ZTsgLy8gSWYgYSBzY2hlZHVsZXIgdGFzayB0aHJvd3MsIGV4aXQgdGhlIGN1cnJlbnQgYnJvd3NlciB0YXNrIHNvIHRoZVxuICAgIC8vIGVycm9yIGNhbiBiZSBvYnNlcnZlZC5cbiAgICAvL1xuICAgIC8vIEludGVudGlvbmFsbHkgbm90IHVzaW5nIGEgdHJ5LWNhdGNoLCBzaW5jZSB0aGF0IG1ha2VzIHNvbWUgZGVidWdnaW5nXG4gICAgLy8gdGVjaG5pcXVlcyBoYXJkZXIuIEluc3RlYWQsIGlmIGBzY2hlZHVsZWRIb3N0Q2FsbGJhY2tgIGVycm9ycywgdGhlblxuICAgIC8vIGBoYXNNb3JlV29ya2Agd2lsbCByZW1haW4gdHJ1ZSwgYW5kIHdlJ2xsIGNvbnRpbnVlIHRoZSB3b3JrIGxvb3AuXG5cbiAgICB2YXIgaGFzTW9yZVdvcmsgPSB0cnVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGhhc01vcmVXb3JrID0gc2NoZWR1bGVkSG9zdENhbGxiYWNrKGhhc1RpbWVSZW1haW5pbmcsIGN1cnJlbnRUaW1lKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGhhc01vcmVXb3JrKSB7XG4gICAgICAgIC8vIElmIHRoZXJlJ3MgbW9yZSB3b3JrLCBzY2hlZHVsZSB0aGUgbmV4dCBtZXNzYWdlIGV2ZW50IGF0IHRoZSBlbmRcbiAgICAgICAgLy8gb2YgdGhlIHByZWNlZGluZyBvbmUuXG4gICAgICAgIHNjaGVkdWxlUGVyZm9ybVdvcmtVbnRpbERlYWRsaW5lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc01lc3NhZ2VMb29wUnVubmluZyA9IGZhbHNlO1xuICAgICAgICBzY2hlZHVsZWRIb3N0Q2FsbGJhY2sgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpc01lc3NhZ2VMb29wUnVubmluZyA9IGZhbHNlO1xuICB9IC8vIFlpZWxkaW5nIHRvIHRoZSBicm93c2VyIHdpbGwgZ2l2ZSBpdCBhIGNoYW5jZSB0byBwYWludCwgc28gd2UgY2FuXG59O1xuXG52YXIgc2NoZWR1bGVQZXJmb3JtV29ya1VudGlsRGVhZGxpbmU7XG5cbmlmICh0eXBlb2YgbG9jYWxTZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gTm9kZS5qcyBhbmQgb2xkIElFLlxuICAvLyBUaGVyZSdzIGEgZmV3IHJlYXNvbnMgZm9yIHdoeSB3ZSBwcmVmZXIgc2V0SW1tZWRpYXRlLlxuICAvL1xuICAvLyBVbmxpa2UgTWVzc2FnZUNoYW5uZWwsIGl0IGRvZXNuJ3QgcHJldmVudCBhIE5vZGUuanMgcHJvY2VzcyBmcm9tIGV4aXRpbmcuXG4gIC8vIChFdmVuIHRob3VnaCB0aGlzIGlzIGEgRE9NIGZvcmsgb2YgdGhlIFNjaGVkdWxlciwgeW91IGNvdWxkIGdldCBoZXJlXG4gIC8vIHdpdGggYSBtaXggb2YgTm9kZS5qcyAxNSssIHdoaWNoIGhhcyBhIE1lc3NhZ2VDaGFubmVsLCBhbmQganNkb20uKVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzIwNzU2XG4gIC8vXG4gIC8vIEJ1dCBhbHNvLCBpdCBydW5zIGVhcmxpZXIgd2hpY2ggaXMgdGhlIHNlbWFudGljIHdlIHdhbnQuXG4gIC8vIElmIG90aGVyIGJyb3dzZXJzIGV2ZXIgaW1wbGVtZW50IGl0LCBpdCdzIGJldHRlciB0byB1c2UgaXQuXG4gIC8vIEFsdGhvdWdoIGJvdGggb2YgdGhlc2Ugd291bGQgYmUgaW5mZXJpb3IgdG8gbmF0aXZlIHNjaGVkdWxpbmcuXG4gIHNjaGVkdWxlUGVyZm9ybVdvcmtVbnRpbERlYWRsaW5lID0gZnVuY3Rpb24gKCkge1xuICAgIGxvY2FsU2V0SW1tZWRpYXRlKHBlcmZvcm1Xb3JrVW50aWxEZWFkbGluZSk7XG4gIH07XG59IGVsc2UgaWYgKHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgLy8gRE9NIGFuZCBXb3JrZXIgZW52aXJvbm1lbnRzLlxuICAvLyBXZSBwcmVmZXIgTWVzc2FnZUNoYW5uZWwgYmVjYXVzZSBvZiB0aGUgNG1zIHNldFRpbWVvdXQgY2xhbXBpbmcuXG4gIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gIHZhciBwb3J0ID0gY2hhbm5lbC5wb3J0MjtcbiAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBwZXJmb3JtV29ya1VudGlsRGVhZGxpbmU7XG5cbiAgc2NoZWR1bGVQZXJmb3JtV29ya1VudGlsRGVhZGxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcG9ydC5wb3N0TWVzc2FnZShudWxsKTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIFdlIHNob3VsZCBvbmx5IGZhbGxiYWNrIGhlcmUgaW4gbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRzLlxuICBzY2hlZHVsZVBlcmZvcm1Xb3JrVW50aWxEZWFkbGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBsb2NhbFNldFRpbWVvdXQocGVyZm9ybVdvcmtVbnRpbERlYWRsaW5lLCAwKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdEhvc3RDYWxsYmFjayhjYWxsYmFjaykge1xuICBzY2hlZHVsZWRIb3N0Q2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICBpZiAoIWlzTWVzc2FnZUxvb3BSdW5uaW5nKSB7XG4gICAgaXNNZXNzYWdlTG9vcFJ1bm5pbmcgPSB0cnVlO1xuICAgIHNjaGVkdWxlUGVyZm9ybVdvcmtVbnRpbERlYWRsaW5lKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVxdWVzdEhvc3RUaW1lb3V0KGNhbGxiYWNrLCBtcykge1xuICB0YXNrVGltZW91dElEID0gbG9jYWxTZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBjYWxsYmFjayhleHBvcnRzLnVuc3RhYmxlX25vdygpKTtcbiAgfSwgbXMpO1xufVxuXG5mdW5jdGlvbiBjYW5jZWxIb3N0VGltZW91dCgpIHtcbiAgbG9jYWxDbGVhclRpbWVvdXQodGFza1RpbWVvdXRJRCk7XG4gIHRhc2tUaW1lb3V0SUQgPSAtMTtcbn1cblxudmFyIHVuc3RhYmxlX3JlcXVlc3RQYWludCA9IHJlcXVlc3RQYWludDtcbnZhciB1bnN0YWJsZV9Qcm9maWxpbmcgPSAgbnVsbDtcblxuZXhwb3J0cy51bnN0YWJsZV9JZGxlUHJpb3JpdHkgPSBJZGxlUHJpb3JpdHk7XG5leHBvcnRzLnVuc3RhYmxlX0ltbWVkaWF0ZVByaW9yaXR5ID0gSW1tZWRpYXRlUHJpb3JpdHk7XG5leHBvcnRzLnVuc3RhYmxlX0xvd1ByaW9yaXR5ID0gTG93UHJpb3JpdHk7XG5leHBvcnRzLnVuc3RhYmxlX05vcm1hbFByaW9yaXR5ID0gTm9ybWFsUHJpb3JpdHk7XG5leHBvcnRzLnVuc3RhYmxlX1Byb2ZpbGluZyA9IHVuc3RhYmxlX1Byb2ZpbGluZztcbmV4cG9ydHMudW5zdGFibGVfVXNlckJsb2NraW5nUHJpb3JpdHkgPSBVc2VyQmxvY2tpbmdQcmlvcml0eTtcbmV4cG9ydHMudW5zdGFibGVfY2FuY2VsQ2FsbGJhY2sgPSB1bnN0YWJsZV9jYW5jZWxDYWxsYmFjaztcbmV4cG9ydHMudW5zdGFibGVfY29udGludWVFeGVjdXRpb24gPSB1bnN0YWJsZV9jb250aW51ZUV4ZWN1dGlvbjtcbmV4cG9ydHMudW5zdGFibGVfZm9yY2VGcmFtZVJhdGUgPSBmb3JjZUZyYW1lUmF0ZTtcbmV4cG9ydHMudW5zdGFibGVfZ2V0Q3VycmVudFByaW9yaXR5TGV2ZWwgPSB1bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbDtcbmV4cG9ydHMudW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGUgPSB1bnN0YWJsZV9nZXRGaXJzdENhbGxiYWNrTm9kZTtcbmV4cG9ydHMudW5zdGFibGVfbmV4dCA9IHVuc3RhYmxlX25leHQ7XG5leHBvcnRzLnVuc3RhYmxlX3BhdXNlRXhlY3V0aW9uID0gdW5zdGFibGVfcGF1c2VFeGVjdXRpb247XG5leHBvcnRzLnVuc3RhYmxlX3JlcXVlc3RQYWludCA9IHVuc3RhYmxlX3JlcXVlc3RQYWludDtcbmV4cG9ydHMudW5zdGFibGVfcnVuV2l0aFByaW9yaXR5ID0gdW5zdGFibGVfcnVuV2l0aFByaW9yaXR5O1xuZXhwb3J0cy51bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrID0gdW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjaztcbmV4cG9ydHMudW5zdGFibGVfc2hvdWxkWWllbGQgPSBzaG91bGRZaWVsZFRvSG9zdDtcbmV4cG9ydHMudW5zdGFibGVfd3JhcENhbGxiYWNrID0gdW5zdGFibGVfd3JhcENhbGxiYWNrO1xuICAgICAgICAgIC8qIGdsb2JhbCBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gKi9cbmlmIChcbiAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RvcCA9PT1cbiAgICAnZnVuY3Rpb24nXG4pIHtcbiAgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLnJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdG9wKG5ldyBFcnJvcigpKTtcbn1cbiAgICAgICAgXG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3NjaGVkdWxlci5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBFbGVjdHJvbkJveCB9IGZyb20gJy4uL1NESydcclxuXHJcbmZ1bmN0aW9uIHVzZUtleWJvYXJkRXZlbnQoKSB7XHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIC8vIGZ1bmN0aW9uIHBhcnNlRXZlbnRQYXJhbXMoZSkge1xyXG4gICAgICAgIC8vICAgICBjb25zdCB7IHR5cGUsIGtleSwga2V5Q29kZSwgd2hpY2ggfSA9IGVcclxuICAgICAgICAvLyAgICAgY29uc3QgcGFyYW1zID0geyB0eXBlLCBrZXksIGtleUNvZGUsIHdoaWNoIH1cclxuICAgICAgICAvLyAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBhcmFtcylcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gY29uc3QgbGlzdGVuZXIgPSAoZSkgPT4ge1xyXG4gICAgICAgIC8vICAgICAvLyDplK7nm5jkuovku7ZcclxuICAgICAgICAvLyAgICAgaWYgKGUudHlwZSA9PT0gJ2tleWRvd24nIHx8IGUudHlwZSA9PT0gJ2tleXVwJykge1xyXG4gICAgICAgIC8vICAgICAgICAgRWxlY3Ryb25Cb3guZ2V0KCkuZXZlbnRTZXJ2aWNlLnNlbmRTeW5jKCdFdmVudHNfS2V5Ym9hcmQnLCBwYXJzZUV2ZW50UGFyYW1zKGUpKVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBsaXN0ZW5lcilcclxuICAgICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGxpc3RlbmVyKVxyXG4gICAgICAgIC8vIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgLy8gICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBsaXN0ZW5lcilcclxuICAgICAgICAvLyAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBsaXN0ZW5lcilcclxuICAgICAgICAvLyB9XHJcbiAgICB9LCBbXSlcclxufVxyXG5leHBvcnQgZGVmYXVsdCB1c2VLZXlib2FyZEV2ZW50XHJcbiIsImltcG9ydCB7IGNyZWF0ZUFjdGlvbiB9IGZyb20gXCIuL2Jhc2VcIlxyXG5cclxuZXhwb3J0IGVudW0gRV9BQ1RJT05fVFlQRSB7XHJcbiAgICBURVNUX0FDVElPTiA9ICd0ZXN0QWN0aW9uJ1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc3RvcmVBY3Rpb24gPSB7XHJcbiAgICB0ZXN0KHRlc3Q6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVBY3Rpb24oRV9BQ1RJT05fVFlQRS5URVNUX0FDVElPTiwgdGVzdClcclxuICAgIH0sXHJcbn0iLCJpbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gXCJyZWR1eFwiXHJcbmltcG9ydCB7IElBY3Rpb24gfSBmcm9tIFwiLi90eXBlXCJcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWN0aW9uPFQgPSB7fT4odHlwZTogc3RyaW5nLCBwYXlMb2FkOiBULCBvdGhlciA9IHVuZGVmaW5lZCk6IElBY3Rpb248VD4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlLFxyXG4gICAgICAgIHBheUxvYWQsXHJcbiAgICAgICAgb3RoZXJcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0b3JlV2l0aFJlZHVjZXJzKHJlZHVjZXJzOiBhbnksIGluaXRTdG9yZTogYW55KSB7XHJcbiAgICBjb25zdCByZWR1Y2VyID0gZnVuY3Rpb24gKHN0YXRlOiBhbnksIGFjdGlvbjogSUFjdGlvbjxhbnk+KSB7XHJcbiAgICAgICAgYWN0aW9uLnBheUxvYWQgPSBhY3Rpb24ucGF5TG9hZCA9PT0gdW5kZWZpbmVkID8ge30gOiBhY3Rpb24ucGF5TG9hZFxyXG4gICAgICAgIGlmIChyZWR1Y2Vyc1thY3Rpb24udHlwZV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlZHVjZXJzW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgIH1cclxuICAgIHJldHVybiBjcmVhdGVTdG9yZShyZWR1Y2VyLCBpbml0U3RvcmUpXHJcbn0iLCJpbXBvcnQgeyBjcmVhdGVTdG9yZVdpdGhSZWR1Y2VycyB9IGZyb20gXCIuL2Jhc2VcIlxyXG5pbXBvcnQgeyByZWR1Y2VycyB9IGZyb20gXCIuL3JlZHVjZXJzXCJcclxuaW1wb3J0IHsgSVJvb3RTdGF0ZSB9IGZyb20gXCIuL3R5cGVcIlxyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlOiBJUm9vdFN0YXRlID0ge1xyXG4gICAgdGVzdDogJycsXHJcbiAgICBjYWNoZVJvdXRlOiBuZXcgTWFwKClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmVXaXRoUmVkdWNlcnMocmVkdWNlcnMsIGluaXRpYWxTdGF0ZSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0b3JlXHJcbiIsImltcG9ydCB7IEVfQUNUSU9OX1RZUEUgfSBmcm9tIFwiLi9hY3Rpb25zXCJcclxuaW1wb3J0IHsgSUFjdGlvbiwgSVJvb3RTdGF0ZSB9IGZyb20gXCIuL3R5cGVcIlxyXG5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXJzID0ge1xyXG4gICAgW0VfQUNUSU9OX1RZUEUuVEVTVF9BQ1RJT05dKHN0YXRlOiBJUm9vdFN0YXRlLCBhY3Rpb246IElBY3Rpb248c3RyaW5nPikge1xyXG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0ZXN0OiBhY3Rpb24ucGF5TG9hZCB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tL2NsaWVudCdcclxuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHN0b3JlIGZyb20gJy4vc3RvcmUnXHJcbmltcG9ydCB7IEhhc2hSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJ1xyXG5jb25zdCB7IGlwY1JlbmRlcmVyIH0gPSB3aW5kb3cucmVxdWlyZSgnZWxlY3Ryb24nKVxyXG5pbXBvcnQgJy4vc3R5bGUvY29tbW9uLnNjc3MnXHJcbmltcG9ydCAnLi93b3JrZXIubGVzcydcclxuaW1wb3J0IHVzZUtleWJvYXJkRXZlbnQgZnJvbSAnLi9ob29rcy91c2VLZXlib2FyZEV2ZW50J1xyXG5cclxuZnVuY3Rpb24gVGFzaygpIHtcclxuICAgIGNvbnN0IFtpbnB1dE1lc3NhZ2VMaXN0LCBzZXRJbnB1dE1lc3NhZ2VMaXN0XSA9IHVzZVN0YXRlKFtdKVxyXG4gICAgY29uc3QgW291dHB1dE1lc3NhZ2VMaXN0LCBzZXRPdXRwdXRNZXNzYWdlTGlzdF0gPSB1c2VTdGF0ZShbXSlcclxuICAgIHVzZUtleWJvYXJkRXZlbnQoKVxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpcGNSZW5kZXJlci5vbignbWVzc2FnZS1mcm9tLW1haW4nLCAoZXZlbnQsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5pbmZvKCd3b3JrZXI6JywgYXJncylcclxuICAgICAgICAgICAgc2V0SW5wdXRNZXNzYWdlTGlzdCgobGlzdCkgPT4gbGlzdC5jb25jYXQoW2FyZ3NdKSlcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB7IHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCksIC4uLmFyZ3MgfVxyXG4gICAgICAgICAgICAgICAgaXBjUmVuZGVyZXIuc2VuZCgnbWVzc2FnZS1mcm9tLXdvcmtlcicsIHJlcylcclxuICAgICAgICAgICAgICAgIHNldE91dHB1dE1lc3NhZ2VMaXN0KChsaXN0KSA9PiBsaXN0LmNvbmNhdChbYXJnc10pKVxyXG4gICAgICAgICAgICB9LCAzMDAwKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaXBjUmVuZGVyZXIub24oJ2JlZ2Fpbi10YXNrJywgKGV2ZW50LCBhcmcpID0+IHtcclxuICAgICAgICAgICAgLy8g5qC55o2udGFn5Yik5pat5Lu75Yqh57G75Z6LXHJcbiAgICAgICAgICAgIGlmIChhcmcudGFnID09PSAneHh4eCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZy5kYXRhU291cmNlKVxyXG4gICAgICAgICAgICAgICAgLy/ku7vliqHlpITnkIZUT0RPXHJcbiAgICAgICAgICAgICAgICAvLyB4eHh4KClcclxuICAgICAgICAgICAgICAgIC8v5Lul5LiL5Luj56CB5Y+v5qC55o2u6ZyA6KaB5pS+5Zyo5ZCI6YCC55qE5L2N572uXHJcbiAgICAgICAgICAgICAgICAvL+WmguaenOWkhOeQhueKtuaAgeacieWPmOWMluWImeWPkemAgeWPmOWMlumAmuefpVxyXG4gICAgICAgICAgICAgICAgaXBjUmVuZGVyZXIuc2VuZCgnY2hhbmdlLXRhc2stc3RhdHVzJywgeyBkYXRhOiAnY2hhbmdlLXRhc2stc3RhdHVzJyB9KVxyXG5cclxuICAgICAgICAgICAgICAgIC8v5aaC5p6c5Lu75Yqh5aSE55CG5a6M5oiQ77yM5YiZ5Y+R6YCB5a6M5oiQ6YCa55+lXHJcbiAgICAgICAgICAgICAgICBpcGNSZW5kZXJlci5zZW5kKCd0YXNrLWNvbXBsZXRlJywgeyBkYXRhOiAnJyB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKCd3aW5kb3ctbG9hZC1zdWNjZXNzJywgdHJ1ZSlcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKVxyXG4gICAgICAgIH1cclxuICAgIH0sIFtdKVxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndvcmtlci1jb250YWluZXIgYWxsb3ctc2VsZWN0LXRleHRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXNzYWdlLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtpbnB1dE1lc3NhZ2VMaXN0Lm1hcCgociwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT1cIm1lc3NhZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXE6e0pTT04uc3RyaW5naWZ5KHIpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtvdXRwdXRNZXNzYWdlTGlzdC5tYXAoKHIsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfSBjbGFzc05hbWU9XCJtZXNzYWdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzOntKU09OLnN0cmluZ2lmeShyKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApXHJcbn1cclxuXHJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykgYXMgSFRNTERpdkVsZW1lbnRcclxuY29uc3Qgcm9vdCA9IFJlYWN0RE9NLmNyZWF0ZVJvb3QoY29udGFpbmVyKVxyXG5jb25zdCByZW5kZXIgPSAoQ29tcG9uZW50OiBSZWFjdC5GQyk6IHZvaWQgPT4ge1xyXG4gICAgcm9vdC5yZW5kZXIoXHJcbiAgICAgICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICAgICAgICAgIDxIYXNoUm91dGVyPlxyXG4gICAgICAgICAgICAgICAgPENvbXBvbmVudCAvPlxyXG4gICAgICAgICAgICA8L0hhc2hSb3V0ZXI+XHJcbiAgICAgICAgPC9Qcm92aWRlcj5cclxuICAgIClcclxufVxyXG5yZW5kZXIoVGFzaylcclxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn0iLCJpbXBvcnQgZGVmaW5lUHJvcGVydHkgZnJvbSBcIi4vZGVmaW5lUHJvcGVydHkuanNcIjtcblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGVudW1lcmFibGVPbmx5ICYmIChzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7XG4gICAgfSkpLCBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX29iamVjdFNwcmVhZDIodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IG51bGwgIT0gYXJndW1lbnRzW2ldID8gYXJndW1lbnRzW2ldIDoge307XG4gICAgaSAlIDIgPyBvd25LZXlzKE9iamVjdChzb3VyY2UpLCAhMCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgIH0pIDogT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpIDogb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkge1xuICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTtcbiAgdmFyIHRhcmdldCA9IHt9O1xuICB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gIHZhciBrZXksIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBrZXkgPSBzb3VyY2VLZXlzW2ldO1xuICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18uYW1kTyA9IHt9OyIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIndvcmtlclwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmttYWluXCJdID0gc2VsZltcIndlYnBhY2tDaHVua21haW5cIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy93b3JrZXIudHN4XCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOlsiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwiT2JqZWN0IiwiaGFzT3duUHJvcGVydHkiLCJwcm90b3R5cGUiLCJwcm9wSXNFbnVtZXJhYmxlIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJ0b09iamVjdCIsInZhbCIsInVuZGVmaW5lZCIsIlR5cGVFcnJvciIsInNob3VsZFVzZU5hdGl2ZSIsImFzc2lnbiIsInRlc3QxIiwiU3RyaW5nIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsInRlc3QyIiwiaSIsImZyb21DaGFyQ29kZSIsIm9yZGVyMiIsIm1hcCIsIm4iLCJqb2luIiwidGVzdDMiLCJzcGxpdCIsImZvckVhY2giLCJsZXR0ZXIiLCJrZXlzIiwiZXJyIiwibW9kdWxlIiwiZXhwb3J0cyIsInRhcmdldCIsInNvdXJjZSIsImZyb20iLCJ0byIsInN5bWJvbHMiLCJzIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwia2V5IiwiY2FsbCIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsIl9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyIsInJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdGFydCIsIkVycm9yIiwiZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nIiwiZW5hYmxlUHJvZmlsaW5nIiwiZnJhbWVZaWVsZE1zIiwicHVzaCIsImhlYXAiLCJub2RlIiwiaW5kZXgiLCJzaWZ0VXAiLCJwZWVrIiwicG9wIiwiZmlyc3QiLCJsYXN0Iiwic2lmdERvd24iLCJwYXJlbnRJbmRleCIsInBhcmVudCIsImNvbXBhcmUiLCJoYWxmTGVuZ3RoIiwibGVmdEluZGV4IiwibGVmdCIsInJpZ2h0SW5kZXgiLCJyaWdodCIsImEiLCJiIiwiZGlmZiIsInNvcnRJbmRleCIsImlkIiwiSW1tZWRpYXRlUHJpb3JpdHkiLCJVc2VyQmxvY2tpbmdQcmlvcml0eSIsIk5vcm1hbFByaW9yaXR5IiwiTG93UHJpb3JpdHkiLCJJZGxlUHJpb3JpdHkiLCJtYXJrVGFza0Vycm9yZWQiLCJ0YXNrIiwibXMiLCJoYXNQZXJmb3JtYW5jZU5vdyIsInBlcmZvcm1hbmNlIiwibm93IiwibG9jYWxQZXJmb3JtYW5jZSIsInVuc3RhYmxlX25vdyIsImxvY2FsRGF0ZSIsIkRhdGUiLCJpbml0aWFsVGltZSIsIm1heFNpZ25lZDMxQml0SW50IiwiSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQiLCJVU0VSX0JMT0NLSU5HX1BSSU9SSVRZX1RJTUVPVVQiLCJOT1JNQUxfUFJJT1JJVFlfVElNRU9VVCIsIkxPV19QUklPUklUWV9USU1FT1VUIiwiSURMRV9QUklPUklUWV9USU1FT1VUIiwidGFza1F1ZXVlIiwidGltZXJRdWV1ZSIsInRhc2tJZENvdW50ZXIiLCJjdXJyZW50VGFzayIsImN1cnJlbnRQcmlvcml0eUxldmVsIiwiaXNQZXJmb3JtaW5nV29yayIsImlzSG9zdENhbGxiYWNrU2NoZWR1bGVkIiwiaXNIb3N0VGltZW91dFNjaGVkdWxlZCIsImxvY2FsU2V0VGltZW91dCIsInNldFRpbWVvdXQiLCJsb2NhbENsZWFyVGltZW91dCIsImNsZWFyVGltZW91dCIsImxvY2FsU2V0SW1tZWRpYXRlIiwic2V0SW1tZWRpYXRlIiwiaXNJbnB1dFBlbmRpbmciLCJuYXZpZ2F0b3IiLCJzY2hlZHVsaW5nIiwiYmluZCIsImFkdmFuY2VUaW1lcnMiLCJjdXJyZW50VGltZSIsInRpbWVyIiwiY2FsbGJhY2siLCJzdGFydFRpbWUiLCJleHBpcmF0aW9uVGltZSIsImhhbmRsZVRpbWVvdXQiLCJyZXF1ZXN0SG9zdENhbGxiYWNrIiwiZmx1c2hXb3JrIiwiZmlyc3RUaW1lciIsInJlcXVlc3RIb3N0VGltZW91dCIsImhhc1RpbWVSZW1haW5pbmciLCJjYW5jZWxIb3N0VGltZW91dCIsInByZXZpb3VzUHJpb3JpdHlMZXZlbCIsIndvcmtMb29wIiwiZXJyb3IiLCJpc1F1ZXVlZCIsInNob3VsZFlpZWxkVG9Ib3N0IiwicHJpb3JpdHlMZXZlbCIsImRpZFVzZXJDYWxsYmFja1RpbWVvdXQiLCJjb250aW51YXRpb25DYWxsYmFjayIsInVuc3RhYmxlX3J1bldpdGhQcmlvcml0eSIsImV2ZW50SGFuZGxlciIsInVuc3RhYmxlX25leHQiLCJ1bnN0YWJsZV93cmFwQ2FsbGJhY2siLCJwYXJlbnRQcmlvcml0eUxldmVsIiwiYXBwbHkiLCJ1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrIiwib3B0aW9ucyIsImRlbGF5IiwidGltZW91dCIsIm5ld1Rhc2siLCJ1bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbiIsInVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uIiwidW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGUiLCJ1bnN0YWJsZV9jYW5jZWxDYWxsYmFjayIsInVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsIiwiaXNNZXNzYWdlTG9vcFJ1bm5pbmciLCJzY2hlZHVsZWRIb3N0Q2FsbGJhY2siLCJ0YXNrVGltZW91dElEIiwiZnJhbWVJbnRlcnZhbCIsInRpbWVFbGFwc2VkIiwicmVxdWVzdFBhaW50IiwiZm9yY2VGcmFtZVJhdGUiLCJmcHMiLCJjb25zb2xlIiwiTWF0aCIsImZsb29yIiwicGVyZm9ybVdvcmtVbnRpbERlYWRsaW5lIiwiaGFzTW9yZVdvcmsiLCJzY2hlZHVsZVBlcmZvcm1Xb3JrVW50aWxEZWFkbGluZSIsIk1lc3NhZ2VDaGFubmVsIiwiY2hhbm5lbCIsInBvcnQiLCJwb3J0MiIsInBvcnQxIiwib25tZXNzYWdlIiwicG9zdE1lc3NhZ2UiLCJ1bnN0YWJsZV9yZXF1ZXN0UGFpbnQiLCJ1bnN0YWJsZV9Qcm9maWxpbmciLCJ1bnN0YWJsZV9JZGxlUHJpb3JpdHkiLCJ1bnN0YWJsZV9JbW1lZGlhdGVQcmlvcml0eSIsInVuc3RhYmxlX0xvd1ByaW9yaXR5IiwidW5zdGFibGVfTm9ybWFsUHJpb3JpdHkiLCJ1bnN0YWJsZV9Vc2VyQmxvY2tpbmdQcmlvcml0eSIsInVuc3RhYmxlX2ZvcmNlRnJhbWVSYXRlIiwidW5zdGFibGVfc2hvdWxkWWllbGQiLCJyZWdpc3RlckludGVybmFsTW9kdWxlU3RvcCIsInJlcXVpcmUiLCJ1c2VFZmZlY3QiLCJ1c2VLZXlib2FyZEV2ZW50IiwiY3JlYXRlQWN0aW9uIiwiRV9BQ1RJT05fVFlQRSIsInN0b3JlQWN0aW9uIiwidGVzdCIsIlRFU1RfQUNUSU9OIiwiY3JlYXRlU3RvcmUiLCJ0eXBlIiwicGF5TG9hZCIsIm90aGVyIiwiY3JlYXRlU3RvcmVXaXRoUmVkdWNlcnMiLCJyZWR1Y2VycyIsImluaXRTdG9yZSIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsImluaXRpYWxTdGF0ZSIsImNhY2hlUm91dGUiLCJNYXAiLCJzdG9yZSIsIlJlYWN0IiwidXNlU3RhdGUiLCJSZWFjdERPTSIsIlByb3ZpZGVyIiwiSGFzaFJvdXRlciIsIndpbmRvdyIsImlwY1JlbmRlcmVyIiwiVGFzayIsImlucHV0TWVzc2FnZUxpc3QiLCJzZXRJbnB1dE1lc3NhZ2VMaXN0Iiwib3V0cHV0TWVzc2FnZUxpc3QiLCJzZXRPdXRwdXRNZXNzYWdlTGlzdCIsIm9uIiwiZXZlbnQiLCJhcmdzIiwiaW5mbyIsImxpc3QiLCJjb25jYXQiLCJyZXMiLCJ0aW1lc3RhbXAiLCJnZXRUaW1lIiwic2VuZCIsImFyZyIsInRhZyIsImxvZyIsImRhdGFTb3VyY2UiLCJkYXRhIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwiciIsIkpTT04iLCJzdHJpbmdpZnkiLCJjb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicm9vdCIsImNyZWF0ZVJvb3QiLCJyZW5kZXIiLCJDb21wb25lbnQiLCJfZGVmaW5lUHJvcGVydHkiLCJvYmoiLCJ2YWx1ZSIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiX2V4dGVuZHMiLCJvd25LZXlzIiwib2JqZWN0IiwiZW51bWVyYWJsZU9ubHkiLCJmaWx0ZXIiLCJzeW0iLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJfb2JqZWN0U3ByZWFkMiIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UiLCJleGNsdWRlZCIsInNvdXJjZUtleXMiLCJpbmRleE9mIl0sInNvdXJjZVJvb3QiOiIifQ==