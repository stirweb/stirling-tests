function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 * what-input - A global utility for tracking the current input method (mouse, keyboard or touch).
 * @version v5.2.1
 * @link https://github.com/ten1seven/what-input
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define("whatInput", [], factory);else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') exports["whatInput"] = factory();else root["whatInput"] = factory();
})(this, function () {
  return (
    /******/
    function (modules) {
      // webpackBootstrap

      /******/
      // The module cache

      /******/
      var installedModules = {};
      /******/
      // The require function

      /******/

      function __webpack_require__(moduleId) {
        /******/
        // Check if module is in cache

        /******/
        if (installedModules[moduleId])
          /******/
          return installedModules[moduleId].exports;
        /******/
        // Create a new module (and put it into the cache)

        /******/

        var module = installedModules[moduleId] = {
          /******/
          exports: {},

          /******/
          id: moduleId,

          /******/
          loaded: false
          /******/

        };
        /******/
        // Execute the module function

        /******/

        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        // Flag the module as loaded

        /******/

        module.loaded = true;
        /******/
        // Return the exports of the module

        /******/

        return module.exports;
        /******/
      }
      /******/
      // expose the modules object (__webpack_modules__)

      /******/


      __webpack_require__.m = modules;
      /******/
      // expose the module cache

      /******/

      __webpack_require__.c = installedModules;
      /******/
      // __webpack_public_path__

      /******/

      __webpack_require__.p = "";
      /******/
      // Load entry module and return exports

      /******/

      return __webpack_require__(0);
      /******/
    }
    /************************************************************************/

    /******/
    ([
    /* 0 */

    /***/
    function (module, exports) {
      'use strict';

      module.exports = function () {
        /*
         * bail out if there is no document or window
         * (i.e. in a node/non-DOM environment)
         *
         * Return a stubbed API instead
         */
        if (typeof document === 'undefined' || typeof window === 'undefined') {
          return {
            // always return "initial" because no interaction will ever be detected
            ask: function ask() {
              return 'initial';
            },
            // always return null
            element: function element() {
              return null;
            },
            // no-op
            ignoreKeys: function ignoreKeys() {},
            // no-op
            specificKeys: function specificKeys() {},
            // no-op
            registerOnChange: function registerOnChange() {},
            // no-op
            unRegisterOnChange: function unRegisterOnChange() {}
          };
        }
        /*
         * variables
         */
        // cache document.documentElement


        var docElem = document.documentElement; // currently focused dom element

        var currentElement = null; // last used input type

        var currentInput = 'initial'; // last used input intent

        var currentIntent = currentInput; // UNIX timestamp of current event

        var currentTimestamp = Date.now(); // check for sessionStorage support
        // then check for session variables and use if available

        try {
          if (window.sessionStorage.getItem('what-input')) {
            currentInput = window.sessionStorage.getItem('what-input');
          }

          if (window.sessionStorage.getItem('what-intent')) {
            currentIntent = window.sessionStorage.getItem('what-intent');
          }
        } catch (e) {} // form input types


        var formInputs = ['button', 'input', 'select', 'textarea']; // empty array for holding callback functions

        var functionList = []; // list of modifier keys commonly used with the mouse and
        // can be safely ignored to prevent false keyboard detection

        var ignoreMap = [16, // shift
        17, // control
        18, // alt
        91, // Windows key / left Apple cmd
        93 // Windows menu / right Apple cmd
        ];
        var specificMap = []; // mapping of events to input types

        var inputMap = {
          keydown: 'keyboard',
          keyup: 'keyboard',
          mousedown: 'mouse',
          mousemove: 'mouse',
          MSPointerDown: 'pointer',
          MSPointerMove: 'pointer',
          pointerdown: 'pointer',
          pointermove: 'pointer',
          touchstart: 'touch',
          touchend: 'touch' // boolean: true if the page is being scrolled

        };
        var isScrolling = false; // store current mouse position

        var mousePos = {
          x: null,
          y: null // map of IE 10 pointer events

        };
        var pointerMap = {
          2: 'touch',
          3: 'touch',
          // treat pen like touch
          4: 'mouse' // check support for passive event listeners

        };
        var supportsPassive = false;

        try {
          var opts = Object.defineProperty({}, 'passive', {
            get: function get() {
              supportsPassive = true;
            }
          });
          window.addEventListener('test', null, opts);
        } catch (e) {}
        /*
         * set up
         */


        var setUp = function setUp() {
          // add correct mouse wheel event mapping to `inputMap`
          inputMap[detectWheel()] = 'mouse';
          addListeners();
          doUpdate('input');
          doUpdate('intent');
        };
        /*
         * events
         */


        var addListeners = function addListeners() {
          // `pointermove`, `MSPointerMove`, `mousemove` and mouse wheel event binding
          // can only demonstrate potential, but not actual, interaction
          // and are treated separately
          var options = supportsPassive ? {
            passive: true
          } : false; // pointer events (mouse, pen, touch)

          if (window.PointerEvent) {
            window.addEventListener('pointerdown', setInput);
            window.addEventListener('pointermove', setIntent);
          } else if (window.MSPointerEvent) {
            window.addEventListener('MSPointerDown', setInput);
            window.addEventListener('MSPointerMove', setIntent);
          } else {
            // mouse events
            window.addEventListener('mousedown', setInput);
            window.addEventListener('mousemove', setIntent); // touch events

            if ('ontouchstart' in window) {
              window.addEventListener('touchstart', setInput, options);
              window.addEventListener('touchend', setInput);
            }
          } // mouse wheel


          window.addEventListener(detectWheel(), setIntent, options); // keyboard events

          window.addEventListener('keydown', setInput);
          window.addEventListener('keyup', setInput); // focus events

          window.addEventListener('focusin', setElement);
          window.addEventListener('focusout', clearElement);
        }; // checks conditions before updating new input


        var setInput = function setInput(event) {
          var eventKey = event.which;
          var value = inputMap[event.type];

          if (value === 'pointer') {
            value = pointerType(event);
          }

          var ignoreMatch = !specificMap.length && ignoreMap.indexOf(eventKey) === -1;
          var specificMatch = specificMap.length && specificMap.indexOf(eventKey) !== -1;
          var shouldUpdate = value === 'keyboard' && eventKey && (ignoreMatch || specificMatch) || value === 'mouse' || value === 'touch'; // prevent touch detection from being overridden by event execution order

          if (validateTouch(value)) {
            shouldUpdate = false;
          }

          if (shouldUpdate && currentInput !== value) {
            currentInput = value;

            try {
              window.sessionStorage.setItem('what-input', currentInput);
            } catch (e) {}

            doUpdate('input');
          }

          if (shouldUpdate && currentIntent !== value) {
            // preserve intent for keyboard interaction with form fields
            var activeElem = document.activeElement;
            var notFormInput = activeElem && activeElem.nodeName && formInputs.indexOf(activeElem.nodeName.toLowerCase()) === -1 || activeElem.nodeName.toLowerCase() === 'button' && !checkClosest(activeElem, 'form');

            if (notFormInput) {
              currentIntent = value;

              try {
                window.sessionStorage.setItem('what-intent', currentIntent);
              } catch (e) {}

              doUpdate('intent');
            }
          }
        }; // updates the doc and `inputTypes` array with new input


        var doUpdate = function doUpdate(which) {
          docElem.setAttribute('data-what' + which, which === 'input' ? currentInput : currentIntent);
          fireFunctions(which);
        }; // updates input intent for `mousemove` and `pointermove`


        var setIntent = function setIntent(event) {
          var value = inputMap[event.type];

          if (value === 'pointer') {
            value = pointerType(event);
          } // test to see if `mousemove` happened relative to the screen to detect scrolling versus mousemove


          detectScrolling(event); // only execute if scrolling isn't happening

          if (!isScrolling && !validateTouch(value) && currentIntent !== value) {
            currentIntent = value;

            try {
              window.sessionStorage.setItem('what-intent', currentIntent);
            } catch (e) {}

            doUpdate('intent');
          }
        };

        var setElement = function setElement(event) {
          if (!event.target.nodeName) {
            // If nodeName is undefined, clear the element
            // This can happen if click inside an <svg> element.
            clearElement();
            return;
          }

          currentElement = event.target.nodeName.toLowerCase();
          docElem.setAttribute('data-whatelement', currentElement);

          if (event.target.classList && event.target.classList.length) {
            docElem.setAttribute('data-whatclasses', event.target.classList.toString().replace(' ', ','));
          }
        };

        var clearElement = function clearElement() {
          currentElement = null;
          docElem.removeAttribute('data-whatelement');
          docElem.removeAttribute('data-whatclasses');
        };
        /*
         * utilities
         */


        var pointerType = function pointerType(event) {
          if (typeof event.pointerType === 'number') {
            return pointerMap[event.pointerType];
          } else {
            // treat pen like touch
            return event.pointerType === 'pen' ? 'touch' : event.pointerType;
          }
        }; // prevent touch detection from being overridden by event execution order


        var validateTouch = function validateTouch(value) {
          var timestamp = Date.now();
          var touchIsValid = value === 'mouse' && currentInput === 'touch' && timestamp - currentTimestamp < 200;
          currentTimestamp = timestamp;
          return touchIsValid;
        }; // detect version of mouse wheel event to use
        // via https://developer.mozilla.org/en-US/docs/Web/Events/wheel


        var detectWheel = function detectWheel() {
          var wheelType = void 0; // Modern browsers support "wheel"

          if ('onwheel' in document.createElement('div')) {
            wheelType = 'wheel';
          } else {
            // Webkit and IE support at least "mousewheel"
            // or assume that remaining browsers are older Firefox
            wheelType = document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
          }

          return wheelType;
        }; // runs callback functions


        var fireFunctions = function fireFunctions(type) {
          for (var i = 0, len = functionList.length; i < len; i++) {
            if (functionList[i].type === type) {
              functionList[i].fn.call(undefined, type === 'input' ? currentInput : currentIntent);
            }
          }
        }; // finds matching element in an object


        var objPos = function objPos(match) {
          for (var i = 0, len = functionList.length; i < len; i++) {
            if (functionList[i].fn === match) {
              return i;
            }
          }
        };

        var detectScrolling = function detectScrolling(event) {
          if (mousePos['x'] !== event.screenX || mousePos['y'] !== event.screenY) {
            isScrolling = false;
            mousePos['x'] = event.screenX;
            mousePos['y'] = event.screenY;
          } else {
            isScrolling = true;
          }
        }; // manual version of `closest()`


        var checkClosest = function checkClosest(elem, tag) {
          var ElementPrototype = window.Element.prototype;

          if (!ElementPrototype.matches) {
            ElementPrototype.matches = ElementPrototype.msMatchesSelector || ElementPrototype.webkitMatchesSelector;
          }

          if (!ElementPrototype.closest) {
            do {
              if (elem.matches(tag)) {
                return elem;
              }

              elem = elem.parentElement || elem.parentNode;
            } while (elem !== null && elem.nodeType === 1);

            return null;
          } else {
            return elem.closest(tag);
          }
        };
        /*
         * init
         */
        // don't start script unless browser cuts the mustard
        // (also passes if polyfills are used)


        if ('addEventListener' in window && Array.prototype.indexOf) {
          setUp();
        }
        /*
         * api
         */


        return {
          // returns string: the current input type
          // opt: 'intent'|'input'
          // 'input' (default): returns the same value as the `data-whatinput` attribute
          // 'intent': includes `data-whatintent` value if it's different than `data-whatinput`
          ask: function ask(opt) {
            return opt === 'intent' ? currentIntent : currentInput;
          },
          // returns string: the currently focused element or null
          element: function element() {
            return currentElement;
          },
          // overwrites ignored keys with provided array
          ignoreKeys: function ignoreKeys(arr) {
            ignoreMap = arr;
          },
          // overwrites specific char keys to update on
          specificKeys: function specificKeys(arr) {
            specificMap = arr;
          },
          // attach functions to input and intent "events"
          // funct: function to fire on change
          // eventType: 'input'|'intent'
          registerOnChange: function registerOnChange(fn, eventType) {
            functionList.push({
              fn: fn,
              type: eventType || 'input'
            });
          },
          unRegisterOnChange: function unRegisterOnChange(fn) {
            var position = objPos(fn);

            if (position || position === 0) {
              functionList.splice(position, 1);
            }
          }
        };
      }();
      /***/

    }
    /******/
    ])
  );
});

;

var tns = function () {
  var t = window,
      Ai = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.msRequestAnimationFrame || function (t) {
    return setTimeout(t, 16);
  },
      e = window,
      Ni = e.cancelAnimationFrame || e.mozCancelAnimationFrame || function (t) {
    clearTimeout(t);
  };

  function Li() {
    for (var t, e, n, i = arguments[0] || {}, a = 1, r = arguments.length; a < r; a++) {
      if (null !== (t = arguments[a])) for (e in t) {
        i !== (n = t[e]) && void 0 !== n && (i[e] = n);
      }
    }

    return i;
  }

  function Bi(t) {
    return 0 <= ["true", "false"].indexOf(t) ? JSON.parse(t) : t;
  }

  function Si(t, e, n, i) {
    if (i) try {
      t.setItem(e, n);
    } catch (t) {}
    return n;
  }

  function Hi() {
    var t = document,
        e = t.body;
    return e || ((e = t.createElement("body")).fake = !0), e;
  }

  var n = document.documentElement;

  function Oi(t) {
    var e = "";
    return t.fake && (e = n.style.overflow, t.style.background = "", t.style.overflow = n.style.overflow = "hidden", n.appendChild(t)), e;
  }

  function Di(t, e) {
    t.fake && (t.remove(), n.style.overflow = e, n.offsetHeight);
  }

  function ki(t, e, n, i) {
    "insertRule" in t ? t.insertRule(e + "{" + n + "}", i) : t.addRule(e, n, i);
  }

  function Ri(t) {
    return ("insertRule" in t ? t.cssRules : t.rules).length;
  }

  function Ii(t, e, n) {
    for (var i = 0, a = t.length; i < a; i++) {
      e.call(n, t[i], i);
    }
  }

  var i = ("classList" in document.createElement("_")),
      Pi = i ? function (t, e) {
    return t.classList.contains(e);
  } : function (t, e) {
    return 0 <= t.className.indexOf(e);
  },
      zi = i ? function (t, e) {
    Pi(t, e) || t.classList.add(e);
  } : function (t, e) {
    Pi(t, e) || (t.className += " " + e);
  },
      Wi = i ? function (t, e) {
    Pi(t, e) && t.classList.remove(e);
  } : function (t, e) {
    Pi(t, e) && (t.className = t.className.replace(e, ""));
  };

  function qi(t, e) {
    return t.hasAttribute(e);
  }

  function Fi(t, e) {
    return t.getAttribute(e);
  }

  function r(t) {
    return void 0 !== t.item;
  }

  function ji(t, e) {
    if (t = r(t) || t instanceof Array ? t : [t], "[object Object]" === Object.prototype.toString.call(e)) for (var n = t.length; n--;) {
      for (var i in e) {
        t[n].setAttribute(i, e[i]);
      }
    }
  }

  function Vi(t, e) {
    t = r(t) || t instanceof Array ? t : [t];

    for (var n = (e = e instanceof Array ? e : [e]).length, i = t.length; i--;) {
      for (var a = n; a--;) {
        t[i].removeAttribute(e[a]);
      }
    }
  }

  function Gi(t) {
    for (var e = [], n = 0, i = t.length; n < i; n++) {
      e.push(t[n]);
    }

    return e;
  }

  function Qi(t, e) {
    "none" !== t.style.display && (t.style.display = "none");
  }

  function Xi(t, e) {
    "none" === t.style.display && (t.style.display = "");
  }

  function Yi(t) {
    return "none" !== window.getComputedStyle(t).display;
  }

  function Ki(e) {
    if ("string" == typeof e) {
      var n = [e],
          i = e.charAt(0).toUpperCase() + e.substr(1);
      ["Webkit", "Moz", "ms", "O"].forEach(function (t) {
        "ms" === t && "transform" !== e || n.push(t + i);
      }), e = n;
    }

    for (var t = document.createElement("fakeelement"), a = (e.length, 0); a < e.length; a++) {
      var r = e[a];
      if (void 0 !== t.style[r]) return r;
    }

    return !1;
  }

  function Ji(t, e) {
    var n = !1;
    return /^Webkit/.test(t) ? n = "webkit" + e + "End" : /^O/.test(t) ? n = "o" + e + "End" : t && (n = e.toLowerCase() + "end"), n;
  }

  var a = !1;

  try {
    var o = Object.defineProperty({}, "passive", {
      get: function get() {
        a = !0;
      }
    });
    window.addEventListener("test", null, o);
  } catch (t) {}

  var u = !!a && {
    passive: !0
  };

  function Ui(t, e, n) {
    for (var i in e) {
      var a = 0 <= ["touchstart", "touchmove"].indexOf(i) && !n && u;
      t.addEventListener(i, e[i], a);
    }
  }

  function _i(t, e) {
    for (var n in e) {
      var i = 0 <= ["touchstart", "touchmove"].indexOf(n) && u;
      t.removeEventListener(n, e[n], i);
    }
  }

  function Zi() {
    return {
      topics: {},
      on: function on(t, e) {
        this.topics[t] = this.topics[t] || [], this.topics[t].push(e);
      },
      off: function off(t, e) {
        if (this.topics[t]) for (var n = 0; n < this.topics[t].length; n++) {
          if (this.topics[t][n] === e) {
            this.topics[t].splice(n, 1);
            break;
          }
        }
      },
      emit: function emit(e, n) {
        n.type = e, this.topics[e] && this.topics[e].forEach(function (t) {
          t(n, e);
        });
      }
    };
  }

  Object.keys || (Object.keys = function (t) {
    var e = [];

    for (var n in t) {
      Object.prototype.hasOwnProperty.call(t, n) && e.push(n);
    }

    return e;
  }), "remove" in Element.prototype || (Element.prototype.remove = function () {
    this.parentNode && this.parentNode.removeChild(this);
  });

  var $i = function $i(H) {
    H = Li({
      container: ".slider",
      mode: "carousel",
      axis: "horizontal",
      items: 1,
      gutter: 0,
      edgePadding: 0,
      fixedWidth: !1,
      autoWidth: !1,
      viewportMax: !1,
      slideBy: 1,
      center: !1,
      controls: !0,
      controlsPosition: "top",
      controlsText: ["prev", "next"],
      controlsContainer: !1,
      prevButton: !1,
      nextButton: !1,
      nav: !0,
      navPosition: "top",
      navContainer: !1,
      navAsThumbnails: !1,
      arrowKeys: !1,
      speed: 300,
      autoplay: !1,
      autoplayPosition: "top",
      autoplayTimeout: 5e3,
      autoplayDirection: "forward",
      autoplayText: ["start", "stop"],
      autoplayHoverPause: !1,
      autoplayButton: !1,
      autoplayButtonOutput: !0,
      autoplayResetOnVisibility: !0,
      animateIn: "tns-fadeIn",
      animateOut: "tns-fadeOut",
      animateNormal: "tns-normal",
      animateDelay: !1,
      loop: !0,
      rewind: !1,
      autoHeight: !1,
      responsive: !1,
      lazyload: !1,
      lazyloadSelector: ".tns-lazy-img",
      touch: !0,
      mouseDrag: !1,
      swipeAngle: 15,
      nested: !1,
      preventActionWhenRunning: !1,
      preventScrollOnTouch: !1,
      freezable: !0,
      onInit: !1,
      useLocalStorage: !0,
      nonce: !1
    }, H || {});
    var O = document,
        m = window,
        a = {
      ENTER: 13,
      SPACE: 32,
      LEFT: 37,
      RIGHT: 39
    },
        e = {},
        n = H.useLocalStorage;

    if (n) {
      var t = navigator.userAgent,
          i = new Date();

      try {
        (e = m.localStorage) ? (e.setItem(i, i), n = e.getItem(i) == i, e.removeItem(i)) : n = !1, n || (e = {});
      } catch (t) {
        n = !1;
      }

      n && (e.tnsApp && e.tnsApp !== t && ["tC", "tPL", "tMQ", "tTf", "t3D", "tTDu", "tTDe", "tADu", "tADe", "tTE", "tAE"].forEach(function (t) {
        e.removeItem(t);
      }), localStorage.tnsApp = t);
    }

    var y = e.tC ? Bi(e.tC) : Si(e, "tC", function () {
      var t = document,
          e = Hi(),
          n = Oi(e),
          i = t.createElement("div"),
          a = !1;
      e.appendChild(i);

      try {
        for (var r, o = "(10px * 10)", u = ["calc" + o, "-moz-calc" + o, "-webkit-calc" + o], l = 0; l < 3; l++) {
          if (r = u[l], i.style.width = r, 100 === i.offsetWidth) {
            a = r.replace(o, "");
            break;
          }
        }
      } catch (t) {}

      return e.fake ? Di(e, n) : i.remove(), a;
    }(), n),
        g = e.tPL ? Bi(e.tPL) : Si(e, "tPL", function () {
      var t,
          e = document,
          n = Hi(),
          i = Oi(n),
          a = e.createElement("div"),
          r = e.createElement("div"),
          o = "";
      a.className = "tns-t-subp2", r.className = "tns-t-ct";

      for (var u = 0; u < 70; u++) {
        o += "<div></div>";
      }

      return r.innerHTML = o, a.appendChild(r), n.appendChild(a), t = Math.abs(a.getBoundingClientRect().left - r.children[67].getBoundingClientRect().left) < 2, n.fake ? Di(n, i) : a.remove(), t;
    }(), n),
        D = e.tMQ ? Bi(e.tMQ) : Si(e, "tMQ", function () {
      if (window.matchMedia || window.msMatchMedia) return !0;
      var t,
          e = document,
          n = Hi(),
          i = Oi(n),
          a = e.createElement("div"),
          r = e.createElement("style"),
          o = "@media all and (min-width:1px){.tns-mq-test{position:absolute}}";
      return r.type = "text/css", a.className = "tns-mq-test", n.appendChild(r), n.appendChild(a), r.styleSheet ? r.styleSheet.cssText = o : r.appendChild(e.createTextNode(o)), t = window.getComputedStyle ? window.getComputedStyle(a).position : a.currentStyle.position, n.fake ? Di(n, i) : a.remove(), "absolute" === t;
    }(), n),
        r = e.tTf ? Bi(e.tTf) : Si(e, "tTf", Ki("transform"), n),
        o = e.t3D ? Bi(e.t3D) : Si(e, "t3D", function (t) {
      if (!t) return !1;
      if (!window.getComputedStyle) return !1;
      var e,
          n = document,
          i = Hi(),
          a = Oi(i),
          r = n.createElement("p"),
          o = 9 < t.length ? "-" + t.slice(0, -9).toLowerCase() + "-" : "";
      return o += "transform", i.insertBefore(r, null), r.style[t] = "translate3d(1px,1px,1px)", e = window.getComputedStyle(r).getPropertyValue(o), i.fake ? Di(i, a) : r.remove(), void 0 !== e && 0 < e.length && "none" !== e;
    }(r), n),
        x = e.tTDu ? Bi(e.tTDu) : Si(e, "tTDu", Ki("transitionDuration"), n),
        u = e.tTDe ? Bi(e.tTDe) : Si(e, "tTDe", Ki("transitionDelay"), n),
        b = e.tADu ? Bi(e.tADu) : Si(e, "tADu", Ki("animationDuration"), n),
        l = e.tADe ? Bi(e.tADe) : Si(e, "tADe", Ki("animationDelay"), n),
        s = e.tTE ? Bi(e.tTE) : Si(e, "tTE", Ji(x, "Transition"), n),
        c = e.tAE ? Bi(e.tAE) : Si(e, "tAE", Ji(b, "Animation"), n),
        f = m.console && "function" == typeof m.console.warn,
        d = ["container", "controlsContainer", "prevButton", "nextButton", "navContainer", "autoplayButton"],
        v = {};

    if (d.forEach(function (t) {
      if ("string" == typeof H[t]) {
        var e = H[t],
            n = O.querySelector(e);
        if (v[t] = e, !n || !n.nodeName) return void (f && console.warn("Can't find", H[t]));
        H[t] = n;
      }
    }), !(H.container.children.length < 1)) {
      var k = H.responsive,
          R = H.nested,
          I = "carousel" === H.mode;

      if (k) {
        0 in k && (H = Li(H, k[0]), delete k[0]);
        var p = {};

        for (var h in k) {
          var w = k[h];
          w = "number" == typeof w ? {
            items: w
          } : w, p[h] = w;
        }

        k = p, p = null;
      }

      if (I || function t(e) {
        for (var n in e) {
          I || ("slideBy" === n && (e[n] = "page"), "edgePadding" === n && (e[n] = !1), "autoHeight" === n && (e[n] = !1)), "responsive" === n && t(e[n]);
        }
      }(H), !I) {
        H.axis = "horizontal", H.slideBy = "page", H.edgePadding = !1;
        var P = H.animateIn,
            z = H.animateOut,
            C = H.animateDelay,
            W = H.animateNormal;
      }

      var M,
          q,
          F = "horizontal" === H.axis,
          T = O.createElement("div"),
          j = O.createElement("div"),
          V = H.container,
          E = V.parentNode,
          A = V.outerHTML,
          G = V.children,
          Q = G.length,
          X = rn(),
          Y = !1;
      k && En(), I && (V.className += " tns-vpfix");

      var N,
          L,
          B,
          S,
          K,
          J,
          U,
          _,
          Z,
          $ = H.autoWidth,
          tt = sn("fixedWidth"),
          et = sn("edgePadding"),
          nt = sn("gutter"),
          it = un(),
          at = sn("center"),
          rt = $ ? 1 : Math.floor(sn("items")),
          ot = sn("slideBy"),
          ut = H.viewportMax || H.fixedWidthViewportWidth,
          lt = sn("arrowKeys"),
          st = sn("speed"),
          ct = H.rewind,
          ft = !ct && H.loop,
          dt = sn("autoHeight"),
          vt = sn("controls"),
          pt = sn("controlsText"),
          ht = sn("nav"),
          mt = sn("touch"),
          yt = sn("mouseDrag"),
          gt = sn("autoplay"),
          xt = sn("autoplayTimeout"),
          bt = sn("autoplayText"),
          wt = sn("autoplayHoverPause"),
          Ct = sn("autoplayResetOnVisibility"),
          Mt = (U = null, _ = sn("nonce"), Z = document.createElement("style"), U && Z.setAttribute("media", U), _ && Z.setAttribute("nonce", _), document.querySelector("head").appendChild(Z), Z.sheet ? Z.sheet : Z.styleSheet),
          Tt = H.lazyload,
          Et = H.lazyloadSelector,
          At = [],
          Nt = ft ? (K = function () {
        {
          if ($ || tt && !ut) return Q - 1;
          var t = tt ? "fixedWidth" : "items",
              e = [];
          if ((tt || H[t] < Q) && e.push(H[t]), k) for (var n in k) {
            var i = k[n][t];
            i && (tt || i < Q) && e.push(i);
          }
          return e.length || e.push(0), Math.ceil(tt ? ut / Math.min.apply(null, e) : Math.max.apply(null, e));
        }
      }(), J = I ? Math.ceil((5 * K - Q) / 2) : 4 * K - Q, J = Math.max(K, J), ln("edgePadding") ? J + 1 : J) : 0,
          Lt = I ? Q + 2 * Nt : Q + Nt,
          Bt = !(!tt && !$ || ft),
          St = tt ? _n() : null,
          Ht = !I || !ft,
          Ot = F ? "left" : "top",
          Dt = "",
          kt = "",
          Rt = tt ? function () {
        return at && !ft ? Q - 1 : Math.ceil(-St / (tt + nt));
      } : $ ? function () {
        for (var t = 0; t < Lt; t++) {
          if (N[t] >= -St) return t;
        }
      } : function () {
        return at && I && !ft ? Q - 1 : ft || I ? Math.max(0, Lt - Math.ceil(rt)) : Lt - 1;
      },
          It = en(sn("startIndex")),
          Pt = It,
          zt = (tn(), 0),
          Wt = $ ? null : Rt(),
          qt = H.preventActionWhenRunning,
          Ft = H.swipeAngle,
          jt = !Ft || "?",
          Vt = !1,
          Gt = H.onInit,
          Qt = new Zi(),
          Xt = " tns-slider tns-" + H.mode,
          Yt = V.id || (S = window.tnsId, window.tnsId = S ? S + 1 : 1, "tns" + window.tnsId),
          Kt = sn("disable"),
          Jt = !1,
          Ut = H.freezable,
          _t = !(!Ut || $) && Tn(),
          Zt = !1,
          $t = {
        click: oi,
        keydown: function keydown(t) {
          t = pi(t);
          var e = [a.LEFT, a.RIGHT].indexOf(t.keyCode);
          0 <= e && (0 === e ? we.disabled || oi(t, -1) : Ce.disabled || oi(t, 1));
        }
      },
          te = {
        click: function click(t) {
          if (Vt) {
            if (qt) return;
            ai();
          }

          var e = hi(t = pi(t));

          for (; e !== Ae && !qi(e, "data-nav");) {
            e = e.parentNode;
          }

          if (qi(e, "data-nav")) {
            var n = Se = Number(Fi(e, "data-nav")),
                i = tt || $ ? n * Q / Le : n * rt,
                a = le ? n : Math.min(Math.ceil(i), Q - 1);
            ri(a, t), He === n && (Pe && fi(), Se = -1);
          }
        },
        keydown: function keydown(t) {
          t = pi(t);
          var e = O.activeElement;
          if (!qi(e, "data-nav")) return;
          var n = [a.LEFT, a.RIGHT, a.ENTER, a.SPACE].indexOf(t.keyCode),
              i = Number(Fi(e, "data-nav"));
          0 <= n && (0 === n ? 0 < i && vi(Ee[i - 1]) : 1 === n ? i < Le - 1 && vi(Ee[i + 1]) : ri(Se = i, t));
        }
      },
          ee = {
        mouseover: function mouseover() {
          Pe && (li(), ze = !0);
        },
        mouseout: function mouseout() {
          ze && (ui(), ze = !1);
        }
      },
          ne = {
        visibilitychange: function visibilitychange() {
          O.hidden ? Pe && (li(), qe = !0) : qe && (ui(), qe = !1);
        }
      },
          ie = {
        keydown: function keydown(t) {
          t = pi(t);
          var e = [a.LEFT, a.RIGHT].indexOf(t.keyCode);
          0 <= e && oi(t, 0 === e ? -1 : 1);
        }
      },
          ae = {
        touchstart: xi,
        touchmove: bi,
        touchend: wi,
        touchcancel: wi
      },
          re = {
        mousedown: xi,
        mousemove: bi,
        mouseup: wi,
        mouseleave: wi
      },
          oe = ln("controls"),
          ue = ln("nav"),
          le = !!$ || H.navAsThumbnails,
          se = ln("autoplay"),
          ce = ln("touch"),
          fe = ln("mouseDrag"),
          de = "tns-slide-active",
          ve = "tns-slide-cloned",
          pe = "tns-complete",
          he = {
        load: function load(t) {
          kn(hi(t));
        },
        error: function error(t) {
          e = hi(t), zi(e, "failed"), Rn(e);
          var e;
        }
      },
          me = "force" === H.preventScrollOnTouch;

      if (oe) var ye,
          ge,
          xe = H.controlsContainer,
          be = H.controlsContainer ? H.controlsContainer.outerHTML : "",
          we = H.prevButton,
          Ce = H.nextButton,
          Me = H.prevButton ? H.prevButton.outerHTML : "",
          Te = H.nextButton ? H.nextButton.outerHTML : "";
      if (ue) var Ee,
          Ae = H.navContainer,
          Ne = H.navContainer ? H.navContainer.outerHTML : "",
          Le = $ ? Q : Mi(),
          Be = 0,
          Se = -1,
          He = an(),
          Oe = He,
          De = "tns-nav-active",
          ke = "Carousel Page ",
          Re = " (Current Slide)";
      if (se) var Ie,
          Pe,
          ze,
          We,
          qe,
          Fe = "forward" === H.autoplayDirection ? 1 : -1,
          je = H.autoplayButton,
          Ve = H.autoplayButton ? H.autoplayButton.outerHTML : "",
          Ge = ["<span class='tns-visually-hidden'>", " animation</span>"];
      if (ce || fe) var Qe,
          Xe,
          Ye = {},
          Ke = {},
          Je = !1,
          Ue = F ? function (t, e) {
        return t.x - e.x;
      } : function (t, e) {
        return t.y - e.y;
      };
      $ || $e(Kt || _t), r && (Ot = r, Dt = "translate", o ? (Dt += F ? "3d(" : "3d(0px, ", kt = F ? ", 0px, 0px)" : ", 0px)") : (Dt += F ? "X(" : "Y(", kt = ")")), I && (V.className = V.className.replace("tns-vpfix", "")), function () {
        ln("gutter");
        T.className = "tns-outer", j.className = "tns-inner", T.id = Yt + "-ow", j.id = Yt + "-iw", "" === V.id && (V.id = Yt);
        Xt += g || $ ? " tns-subpixel" : " tns-no-subpixel", Xt += y ? " tns-calc" : " tns-no-calc", $ && (Xt += " tns-autowidth");
        Xt += " tns-" + H.axis, V.className += Xt, I ? ((M = O.createElement("div")).id = Yt + "-mw", M.className = "tns-ovh", T.appendChild(M), M.appendChild(j)) : T.appendChild(j);

        if (dt) {
          var t = M || j;
          t.className += " tns-ah";
        }

        if (E.insertBefore(T, V), j.appendChild(V), Ii(G, function (t, e) {
          zi(t, "tns-item"), t.id || (t.id = Yt + "-item" + e), !I && W && zi(t, W), ji(t, {
            "aria-hidden": "true",
            tabindex: "-1"
          });
        }), Nt) {
          for (var e = O.createDocumentFragment(), n = O.createDocumentFragment(), i = Nt; i--;) {
            var a = i % Q,
                r = G[a].cloneNode(!0);

            if (zi(r, ve), Vi(r, "id"), n.insertBefore(r, n.firstChild), I) {
              var o = G[Q - 1 - a].cloneNode(!0);
              zi(o, ve), Vi(o, "id"), e.appendChild(o);
            }
          }

          V.insertBefore(e, V.firstChild), V.appendChild(n), G = V.children;
        }
      }(), function () {
        if (!I) for (var t = It, e = It + Math.min(Q, rt); t < e; t++) {
          var n = G[t];
          n.style.left = 100 * (t - It) / rt + "%", zi(n, P), Wi(n, W);
        }
        F && (g || $ ? (ki(Mt, "#" + Yt + " > .tns-item", "font-size:" + m.getComputedStyle(G[0]).fontSize + ";", Ri(Mt)), ki(Mt, "#" + Yt, "font-size:0;", Ri(Mt))) : I && Ii(G, function (t, e) {
          var n;
          t.style.marginLeft = (n = e, y ? y + "(" + 100 * n + "% / " + Lt + ")" : 100 * n / Lt + "%");
        }));

        if (D) {
          if (x) {
            var i = M && H.autoHeight ? hn(H.speed) : "";
            ki(Mt, "#" + Yt + "-mw", i, Ri(Mt));
          }

          i = cn(H.edgePadding, H.gutter, H.fixedWidth, H.speed, H.autoHeight), ki(Mt, "#" + Yt + "-iw", i, Ri(Mt)), I && (i = F && !$ ? "width:" + fn(H.fixedWidth, H.gutter, H.items) + ";" : "", x && (i += hn(st)), ki(Mt, "#" + Yt, i, Ri(Mt))), i = F && !$ ? dn(H.fixedWidth, H.gutter, H.items) : "", H.gutter && (i += vn(H.gutter)), I || (x && (i += hn(st)), b && (i += mn(st))), i && ki(Mt, "#" + Yt + " > .tns-item", i, Ri(Mt));
        } else {
          I && dt && (M.style[x] = st / 1e3 + "s"), j.style.cssText = cn(et, nt, tt, dt), I && F && !$ && (V.style.width = fn(tt, nt, rt));
          var i = F && !$ ? dn(tt, nt, rt) : "";
          nt && (i += vn(nt)), i && ki(Mt, "#" + Yt + " > .tns-item", i, Ri(Mt));
        }

        if (k && D) for (var a in k) {
          a = parseInt(a);
          var r = k[a],
              i = "",
              o = "",
              u = "",
              l = "",
              s = "",
              c = $ ? null : sn("items", a),
              f = sn("fixedWidth", a),
              d = sn("speed", a),
              v = sn("edgePadding", a),
              p = sn("autoHeight", a),
              h = sn("gutter", a);
          x && M && sn("autoHeight", a) && "speed" in r && (o = "#" + Yt + "-mw{" + hn(d) + "}"), ("edgePadding" in r || "gutter" in r) && (u = "#" + Yt + "-iw{" + cn(v, h, f, d, p) + "}"), I && F && !$ && ("fixedWidth" in r || "items" in r || tt && "gutter" in r) && (l = "width:" + fn(f, h, c) + ";"), x && "speed" in r && (l += hn(d)), l && (l = "#" + Yt + "{" + l + "}"), ("fixedWidth" in r || tt && "gutter" in r || !I && "items" in r) && (s += dn(f, h, c)), "gutter" in r && (s += vn(h)), !I && "speed" in r && (x && (s += hn(d)), b && (s += mn(d))), s && (s = "#" + Yt + " > .tns-item{" + s + "}"), (i = o + u + l + s) && Mt.insertRule("@media (min-width: " + a / 16 + "em) {" + i + "}", Mt.cssRules.length);
        }
      }(), yn();

      var _e = ft ? I ? function () {
        var t = zt,
            e = Wt;
        t += ot, e -= ot, et ? (t += 1, e -= 1) : tt && (it + nt) % (tt + nt) && (e -= 1), Nt && (e < It ? It -= Q : It < t && (It += Q));
      } : function () {
        if (Wt < It) for (; zt + Q <= It;) {
          It -= Q;
        } else if (It < zt) for (; It <= Wt - Q;) {
          It += Q;
        }
      } : function () {
        It = Math.max(zt, Math.min(Wt, It));
      },
          Ze = I ? function () {
        var e, n, i, a, t, r, o, u, l, s, c;
        Jn(V, ""), x || !st ? (ti(), st && Yi(V) || ai()) : (e = V, n = Ot, i = Dt, a = kt, t = Zn(), r = st, o = ai, u = Math.min(r, 10), l = 0 <= t.indexOf("%") ? "%" : "px", t = t.replace(l, ""), s = Number(e.style[n].replace(i, "").replace(a, "").replace(l, "")), c = (t - s) / r * u, setTimeout(function t() {
          r -= u, s += c, e.style[n] = i + s + l + a, 0 < r ? setTimeout(t, u) : o();
        }, u)), F || Ci();
      } : function () {
        At = [];
        var t = {};
        t[s] = t[c] = ai, _i(G[Pt], t), Ui(G[It], t), ei(Pt, P, z, !0), ei(It, W, P), s && c && st && Yi(V) || ai();
      };

      return {
        version: "2.9.3",
        getInfo: Ei,
        events: Qt,
        goTo: ri,
        play: function play() {
          gt && !Pe && (ci(), We = !1);
        },
        pause: function pause() {
          Pe && (fi(), We = !0);
        },
        isOn: Y,
        updateSliderHeight: Fn,
        refresh: yn,
        destroy: function destroy() {
          if (Mt.disabled = !0, Mt.ownerNode && Mt.ownerNode.remove(), _i(m, {
            resize: Cn
          }), lt && _i(O, ie), xe && _i(xe, $t), Ae && _i(Ae, te), _i(V, ee), _i(V, ne), je && _i(je, {
            click: di
          }), gt && clearInterval(Ie), I && s) {
            var t = {};
            t[s] = ai, _i(V, t);
          }

          mt && _i(V, ae), yt && _i(V, re);
          var r = [A, be, Me, Te, Ne, Ve];

          for (var e in d.forEach(function (t, e) {
            var n = "container" === t ? T : H[t];

            if ("object" == _typeof(n) && n) {
              var i = !!n.previousElementSibling && n.previousElementSibling,
                  a = n.parentNode;
              n.outerHTML = r[e], H[t] = i ? i.nextElementSibling : a.firstElementChild;
            }
          }), d = P = z = C = W = F = T = j = V = E = A = G = Q = q = X = $ = tt = et = nt = it = rt = ot = ut = lt = st = ct = ft = dt = Mt = Tt = N = At = Nt = Lt = Bt = St = Ht = Ot = Dt = kt = Rt = It = Pt = zt = Wt = Ft = jt = Vt = Gt = Qt = Xt = Yt = Kt = Jt = Ut = _t = Zt = $t = te = ee = ne = ie = ae = re = oe = ue = le = se = ce = fe = de = pe = he = L = vt = pt = xe = be = we = Ce = ye = ge = ht = Ae = Ne = Ee = Le = Be = Se = He = Oe = De = ke = Re = gt = xt = Fe = bt = wt = je = Ve = Ct = Ge = Ie = Pe = ze = We = qe = Ye = Ke = Qe = Je = Xe = Ue = mt = yt = null, this) {
            "rebuild" !== e && (this[e] = null);
          }

          Y = !1;
        },
        rebuild: function rebuild() {
          return $i(Li(H, v));
        }
      };
    }

    function $e(t) {
      t && (vt = ht = mt = yt = lt = gt = wt = Ct = !1);
    }

    function tn() {
      for (var t = I ? It - Nt : It; t < 0;) {
        t += Q;
      }

      return t % Q + 1;
    }

    function en(t) {
      return t = t ? Math.max(0, Math.min(ft ? Q - 1 : Q - rt, t)) : 0, I ? t + Nt : t;
    }

    function nn(t) {
      for (null == t && (t = It), I && (t -= Nt); t < 0;) {
        t += Q;
      }

      return Math.floor(t % Q);
    }

    function an() {
      var t,
          e = nn();
      return t = le ? e : tt || $ ? Math.ceil((e + 1) * Le / Q - 1) : Math.floor(e / rt), !ft && I && It === Wt && (t = Le - 1), t;
    }

    function rn() {
      return m.innerWidth || O.documentElement.clientWidth || O.body.clientWidth;
    }

    function on(t) {
      return "top" === t ? "afterbegin" : "beforeend";
    }

    function un() {
      var t = et ? 2 * et - nt : 0;
      return function t(e) {
        if (null != e) {
          var n,
              i,
              a = O.createElement("div");
          return e.appendChild(a), i = (n = a.getBoundingClientRect()).right - n.left, a.remove(), i || t(e.parentNode);
        }
      }(E) - t;
    }

    function ln(t) {
      if (H[t]) return !0;
      if (k) for (var e in k) {
        if (k[e][t]) return !0;
      }
      return !1;
    }

    function sn(t, e) {
      if (null == e && (e = X), "items" === t && tt) return Math.floor((it + nt) / (tt + nt)) || 1;
      var n = H[t];
      if (k) for (var i in k) {
        e >= parseInt(i) && t in k[i] && (n = k[i][t]);
      }
      return "slideBy" === t && "page" === n && (n = sn("items")), I || "slideBy" !== t && "items" !== t || (n = Math.floor(n)), n;
    }

    function cn(t, e, n, i, a) {
      var r = "";

      if (void 0 !== t) {
        var o = t;
        e && (o -= e), r = F ? "margin: 0 " + o + "px 0 " + t + "px;" : "margin: " + t + "px 0 " + o + "px 0;";
      } else if (e && !n) {
        var u = "-" + e + "px";
        r = "margin: 0 " + (F ? u + " 0 0" : "0 " + u + " 0") + ";";
      }

      return !I && a && x && i && (r += hn(i)), r;
    }

    function fn(t, e, n) {
      return t ? (t + e) * Lt + "px" : y ? y + "(" + 100 * Lt + "% / " + n + ")" : 100 * Lt / n + "%";
    }

    function dn(t, e, n) {
      var i;
      if (t) i = t + e + "px";else {
        I || (n = Math.floor(n));
        var a = I ? Lt : n;
        i = y ? y + "(100% / " + a + ")" : 100 / a + "%";
      }
      return i = "width:" + i, "inner" !== R ? i + ";" : i + " !important;";
    }

    function vn(t) {
      var e = "";
      !1 !== t && (e = (F ? "padding-" : "margin-") + (F ? "right" : "bottom") + ": " + t + "px;");
      return e;
    }

    function pn(t, e) {
      var n = t.substring(0, t.length - e).toLowerCase();
      return n && (n = "-" + n + "-"), n;
    }

    function hn(t) {
      return pn(x, 18) + "transition-duration:" + t / 1e3 + "s;";
    }

    function mn(t) {
      return pn(b, 17) + "animation-duration:" + t / 1e3 + "s;";
    }

    function yn() {
      if (ln("autoHeight") || $ || !F) {
        var t = V.querySelectorAll("img");
        Ii(t, function (t) {
          var e = t.src;
          Tt || (e && e.indexOf("data:image") < 0 ? (t.src = "", Ui(t, he), zi(t, "loading"), t.src = e) : kn(t));
        }), Ai(function () {
          zn(Gi(t), function () {
            L = !0;
          });
        }), ln("autoHeight") && (t = In(It, Math.min(It + rt - 1, Lt - 1))), Tt ? gn() : Ai(function () {
          zn(Gi(t), gn);
        });
      } else I && $n(), bn(), wn();
    }

    function gn() {
      if ($ && 1 < Q) {
        var i = ft ? It : Q - 1;
        !function t() {
          var e = G[i].getBoundingClientRect().left,
              n = G[i - 1].getBoundingClientRect().right;
          Math.abs(e - n) <= 1 ? xn() : setTimeout(function () {
            t();
          }, 16);
        }();
      } else xn();
    }

    function xn() {
      F && !$ || (jn(), $ ? (St = _n(), Ut && (_t = Tn()), Wt = Rt(), $e(Kt || _t)) : Ci()), I && $n(), bn(), wn();
    }

    function bn() {
      if (Vn(), T.insertAdjacentHTML("afterbegin", '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + Hn() + "</span>  of " + Q + "</div>"), B = T.querySelector(".tns-liveregion .current"), se) {
        var t = gt ? "stop" : "start";
        je ? ji(je, {
          "data-action": t
        }) : H.autoplayButtonOutput && (T.insertAdjacentHTML(on(H.autoplayPosition), '<button type="button" data-action="' + t + '">' + Ge[0] + t + Ge[1] + bt[0] + "</button>"), je = T.querySelector("[data-action]")), je && Ui(je, {
          click: di
        }), gt && (ci(), wt && Ui(V, ee), Ct && Ui(V, ne));
      }

      if (ue) {
        if (Ae) ji(Ae, {
          "aria-label": "Carousel Pagination"
        }), Ii(Ee = Ae.children, function (t, e) {
          ji(t, {
            "data-nav": e,
            tabindex: "-1",
            "aria-label": ke + (e + 1),
            "aria-controls": Yt
          });
        });else {
          for (var e = "", n = le ? "" : 'style="display:none"', i = 0; i < Q; i++) {
            e += '<button type="button" data-nav="' + i + '" tabindex="-1" aria-controls="' + Yt + '" ' + n + ' aria-label="' + ke + (i + 1) + '"></button>';
          }

          e = '<div class="tns-nav" aria-label="Carousel Pagination">' + e + "</div>", T.insertAdjacentHTML(on(H.navPosition), e), Ae = T.querySelector(".tns-nav"), Ee = Ae.children;
        }

        if (Ti(), x) {
          var a = x.substring(0, x.length - 18).toLowerCase(),
              r = "transition: all " + st / 1e3 + "s";
          a && (r = "-" + a + "-" + r), ki(Mt, "[aria-controls^=" + Yt + "-item]", r, Ri(Mt));
        }

        ji(Ee[He], {
          "aria-label": ke + (He + 1) + Re
        }), Vi(Ee[He], "tabindex"), zi(Ee[He], De), Ui(Ae, te);
      }

      oe && (xe || we && Ce || (T.insertAdjacentHTML(on(H.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button type="button" data-controls="prev" tabindex="-1" aria-controls="' + Yt + '">' + pt[0] + '</button><button type="button" data-controls="next" tabindex="-1" aria-controls="' + Yt + '">' + pt[1] + "</button></div>"), xe = T.querySelector(".tns-controls")), we && Ce || (we = xe.children[0], Ce = xe.children[1]), H.controlsContainer && ji(xe, {
        "aria-label": "Carousel Navigation",
        tabindex: "0"
      }), (H.controlsContainer || H.prevButton && H.nextButton) && ji([we, Ce], {
        "aria-controls": Yt,
        tabindex: "-1"
      }), (H.controlsContainer || H.prevButton && H.nextButton) && (ji(we, {
        "data-controls": "prev"
      }), ji(Ce, {
        "data-controls": "next"
      })), ye = Qn(we), ge = Qn(Ce), Kn(), xe ? Ui(xe, $t) : (Ui(we, $t), Ui(Ce, $t))), An();
    }

    function wn() {
      if (I && s) {
        var t = {};
        t[s] = ai, Ui(V, t);
      }

      mt && Ui(V, ae, H.preventScrollOnTouch), yt && Ui(V, re), lt && Ui(O, ie), "inner" === R ? Qt.on("outerResized", function () {
        Mn(), Qt.emit("innerLoaded", Ei());
      }) : (k || tt || $ || dt || !F) && Ui(m, {
        resize: Cn
      }), dt && ("outer" === R ? Qt.on("innerLoaded", Pn) : Kt || Pn()), Dn(), Kt ? Bn() : _t && Ln(), Qt.on("indexChanged", Wn), "inner" === R && Qt.emit("innerLoaded", Ei()), "function" == typeof Gt && Gt(Ei()), Y = !0;
    }

    function Cn(t) {
      Ai(function () {
        Mn(pi(t));
      });
    }

    function Mn(t) {
      if (Y) {
        "outer" === R && Qt.emit("outerResized", Ei(t)), X = rn();
        var e,
            n = q,
            i = !1;
        k && (En(), (e = n !== q) && Qt.emit("newBreakpointStart", Ei(t)));
        var a,
            r,
            o,
            u,
            l = rt,
            s = Kt,
            c = _t,
            f = lt,
            d = vt,
            v = ht,
            p = mt,
            h = yt,
            m = gt,
            y = wt,
            g = Ct,
            x = It;

        if (e) {
          var b = tt,
              w = dt,
              C = pt,
              M = at,
              T = bt;
          if (!D) var E = nt,
              A = et;
        }

        if (lt = sn("arrowKeys"), vt = sn("controls"), ht = sn("nav"), mt = sn("touch"), at = sn("center"), yt = sn("mouseDrag"), gt = sn("autoplay"), wt = sn("autoplayHoverPause"), Ct = sn("autoplayResetOnVisibility"), e && (Kt = sn("disable"), tt = sn("fixedWidth"), st = sn("speed"), dt = sn("autoHeight"), pt = sn("controlsText"), bt = sn("autoplayText"), xt = sn("autoplayTimeout"), D || (et = sn("edgePadding"), nt = sn("gutter"))), $e(Kt), it = un(), F && !$ || Kt || (jn(), F || (Ci(), i = !0)), (tt || $) && (St = _n(), Wt = Rt()), (e || tt) && (rt = sn("items"), ot = sn("slideBy"), (r = rt !== l) && (tt || $ || (Wt = Rt()), _e())), e && Kt !== s && (Kt ? Bn() : function () {
          if (!Jt) return;
          if (Mt.disabled = !1, V.className += Xt, $n(), ft) for (var t = Nt; t--;) {
            I && Xi(G[t]), Xi(G[Lt - t - 1]);
          }
          if (!I) for (var e = It, n = It + Q; e < n; e++) {
            var i = G[e],
                a = e < It + rt ? P : W;
            i.style.left = 100 * (e - It) / rt + "%", zi(i, a);
          }
          Nn(), Jt = !1;
        }()), Ut && (e || tt || $) && (_t = Tn()) !== c && (_t ? (ti(Zn(en(0))), Ln()) : (!function () {
          if (!Zt) return;
          et && D && (j.style.margin = "");
          if (Nt) for (var t = "tns-transparent", e = Nt; e--;) {
            I && Wi(G[e], t), Wi(G[Lt - e - 1], t);
          }
          Nn(), Zt = !1;
        }(), i = !0)), $e(Kt || _t), gt || (wt = Ct = !1), lt !== f && (lt ? Ui(O, ie) : _i(O, ie)), vt !== d && (vt ? xe ? Xi(xe) : (we && Xi(we), Ce && Xi(Ce)) : xe ? Qi(xe) : (we && Qi(we), Ce && Qi(Ce))), ht !== v && (ht ? (Xi(Ae), Ti()) : Qi(Ae)), mt !== p && (mt ? Ui(V, ae, H.preventScrollOnTouch) : _i(V, ae)), yt !== h && (yt ? Ui(V, re) : _i(V, re)), gt !== m && (gt ? (je && Xi(je), Pe || We || ci()) : (je && Qi(je), Pe && fi())), wt !== y && (wt ? Ui(V, ee) : _i(V, ee)), Ct !== g && (Ct ? Ui(O, ne) : _i(O, ne)), e) {
          if (tt === b && at === M || (i = !0), dt !== w && (dt || (j.style.height = "")), vt && pt !== C && (we.innerHTML = pt[0], Ce.innerHTML = pt[1]), je && bt !== T) {
            var N = gt ? 1 : 0,
                L = je.innerHTML,
                B = L.length - T[N].length;
            L.substring(B) === T[N] && (je.innerHTML = L.substring(0, B) + bt[N]);
          }
        } else at && (tt || $) && (i = !0);

        if ((r || tt && !$) && (Le = Mi(), Ti()), (a = It !== x) ? (Qt.emit("indexChanged", Ei()), i = !0) : r ? a || Wn() : (tt || $) && (Dn(), Vn(), Sn()), r && !I && function () {
          for (var t = It + Math.min(Q, rt), e = Lt; e--;) {
            var n = G[e];
            It <= e && e < t ? (zi(n, "tns-moving"), n.style.left = 100 * (e - It) / rt + "%", zi(n, P), Wi(n, W)) : n.style.left && (n.style.left = "", zi(n, W), Wi(n, P)), Wi(n, z);
          }

          setTimeout(function () {
            Ii(G, function (t) {
              Wi(t, "tns-moving");
            });
          }, 300);
        }(), !Kt && !_t) {
          if (e && !D && (et === A && nt === E || (j.style.cssText = cn(et, nt, tt, st, dt)), F)) {
            I && (V.style.width = fn(tt, nt, rt));
            var S = dn(tt, nt, rt) + vn(nt);
            u = Ri(o = Mt) - 1, "deleteRule" in o ? o.deleteRule(u) : o.removeRule(u), ki(Mt, "#" + Yt + " > .tns-item", S, Ri(Mt));
          }

          dt && Pn(), i && ($n(), Pt = It);
        }

        e && Qt.emit("newBreakpointEnd", Ei(t));
      }
    }

    function Tn() {
      if (!tt && !$) return Q <= (at ? rt - (rt - 1) / 2 : rt);
      var t = tt ? (tt + nt) * Q : N[Q],
          e = et ? it + 2 * et : it + nt;
      return at && (e -= tt ? (it - tt) / 2 : (it - (N[It + 1] - N[It] - nt)) / 2), t <= e;
    }

    function En() {
      for (var t in q = 0, k) {
        (t = parseInt(t)) <= X && (q = t);
      }
    }

    function An() {
      !gt && je && Qi(je), !ht && Ae && Qi(Ae), vt || (xe ? Qi(xe) : (we && Qi(we), Ce && Qi(Ce)));
    }

    function Nn() {
      gt && je && Xi(je), ht && Ae && Xi(Ae), vt && (xe ? Xi(xe) : (we && Xi(we), Ce && Xi(Ce)));
    }

    function Ln() {
      if (!Zt) {
        if (et && (j.style.margin = "0px"), Nt) for (var t = "tns-transparent", e = Nt; e--;) {
          I && zi(G[e], t), zi(G[Lt - e - 1], t);
        }
        An(), Zt = !0;
      }
    }

    function Bn() {
      if (!Jt) {
        if (Mt.disabled = !0, V.className = V.className.replace(Xt.substring(1), ""), Vi(V, ["style"]), ft) for (var t = Nt; t--;) {
          I && Qi(G[t]), Qi(G[Lt - t - 1]);
        }
        if (F && I || Vi(j, ["style"]), !I) for (var e = It, n = It + Q; e < n; e++) {
          var i = G[e];
          Vi(i, ["style"]), Wi(i, P), Wi(i, W);
        }
        An(), Jt = !0;
      }
    }

    function Sn() {
      var t = Hn();
      B.innerHTML !== t && (B.innerHTML = t);
    }

    function Hn() {
      var t = On(),
          e = t[0] + 1,
          n = t[1] + 1;
      return e === n ? e + "" : e + " to " + n;
    }

    function On(t) {
      null == t && (t = Zn());
      var n,
          i,
          a,
          r = It;
      if (at || et ? ($ || tt) && (i = -(parseFloat(t) + et), a = i + it + 2 * et) : $ && (i = N[It], a = i + it), $) N.forEach(function (t, e) {
        e < Lt && ((at || et) && t <= i + .5 && (r = e), .5 <= a - t && (n = e));
      });else {
        if (tt) {
          var e = tt + nt;
          at || et ? (r = Math.floor(i / e), n = Math.ceil(a / e - 1)) : n = r + Math.ceil(it / e) - 1;
        } else if (at || et) {
          var o = rt - 1;

          if (at ? (r -= o / 2, n = It + o / 2) : n = It + o, et) {
            var u = et * rt / it;
            r -= u, n += u;
          }

          r = Math.floor(r), n = Math.ceil(n);
        } else n = r + rt - 1;

        r = Math.max(r, 0), n = Math.min(n, Lt - 1);
      }
      return [r, n];
    }

    function Dn() {
      if (Tt && !Kt) {
        var t = On();
        t.push(Et), In.apply(null, t).forEach(function (t) {
          if (!Pi(t, pe)) {
            var e = {};
            e[s] = function (t) {
              t.stopPropagation();
            }, Ui(t, e), Ui(t, he), t.src = Fi(t, "data-src");
            var n = Fi(t, "data-srcset");
            n && (t.srcset = n), zi(t, "loading");
          }
        });
      }
    }

    function kn(t) {
      zi(t, "loaded"), Rn(t);
    }

    function Rn(t) {
      zi(t, pe), Wi(t, "loading"), _i(t, he);
    }

    function In(t, e, n) {
      var i = [];

      for (n || (n = "img"); t <= e;) {
        Ii(G[t].querySelectorAll(n), function (t) {
          i.push(t);
        }), t++;
      }

      return i;
    }

    function Pn() {
      var t = In.apply(null, On());
      Ai(function () {
        zn(t, Fn);
      });
    }

    function zn(n, t) {
      return L ? t() : (n.forEach(function (t, e) {
        !Tt && t.complete && Rn(t), Pi(t, pe) && n.splice(e, 1);
      }), n.length ? void Ai(function () {
        zn(n, t);
      }) : t());
    }

    function Wn() {
      Dn(), Vn(), Sn(), Kn(), function () {
        if (ht && (He = 0 <= Se ? Se : an(), Se = -1, He !== Oe)) {
          var t = Ee[Oe],
              e = Ee[He];
          ji(t, {
            tabindex: "-1",
            "aria-label": ke + (Oe + 1)
          }), Wi(t, De), ji(e, {
            "aria-label": ke + (He + 1) + Re
          }), Vi(e, "tabindex"), zi(e, De), Oe = He;
        }
      }();
    }

    function qn(t, e) {
      for (var n = [], i = t, a = Math.min(t + e, Lt); i < a; i++) {
        n.push(G[i].offsetHeight);
      }

      return Math.max.apply(null, n);
    }

    function Fn() {
      var t = dt ? qn(It, rt) : qn(Nt, Q),
          e = M || j;
      e.style.height !== t && (e.style.height = t + "px");
    }

    function jn() {
      N = [0];
      var n = F ? "left" : "top",
          i = F ? "right" : "bottom",
          a = G[0].getBoundingClientRect()[n];
      Ii(G, function (t, e) {
        e && N.push(t.getBoundingClientRect()[n] - a), e === Lt - 1 && N.push(t.getBoundingClientRect()[i] - a);
      });
    }

    function Vn() {
      var t = On(),
          n = t[0],
          i = t[1];
      Ii(G, function (t, e) {
        n <= e && e <= i ? qi(t, "aria-hidden") && (Vi(t, ["aria-hidden", "tabindex"]), zi(t, de)) : qi(t, "aria-hidden") || (ji(t, {
          "aria-hidden": "true",
          tabindex: "-1"
        }), Wi(t, de));
      });
    }

    function Gn(t) {
      return t.nodeName.toLowerCase();
    }

    function Qn(t) {
      return "button" === Gn(t);
    }

    function Xn(t) {
      return "true" === t.getAttribute("aria-disabled");
    }

    function Yn(t, e, n) {
      t ? e.disabled = n : e.setAttribute("aria-disabled", n.toString());
    }

    function Kn() {
      if (vt && !ct && !ft) {
        var t = ye ? we.disabled : Xn(we),
            e = ge ? Ce.disabled : Xn(Ce),
            n = It <= zt,
            i = !ct && Wt <= It;
        n && !t && Yn(ye, we, !0), !n && t && Yn(ye, we, !1), i && !e && Yn(ge, Ce, !0), !i && e && Yn(ge, Ce, !1);
      }
    }

    function Jn(t, e) {
      x && (t.style[x] = e);
    }

    function Un(t) {
      return null == t && (t = It), $ ? (it - (et ? nt : 0) - (N[t + 1] - N[t] - nt)) / 2 : tt ? (it - tt) / 2 : (rt - 1) / 2;
    }

    function _n() {
      var t = it + (et ? nt : 0) - (tt ? (tt + nt) * Lt : N[Lt]);
      return at && !ft && (t = tt ? -(tt + nt) * (Lt - 1) - Un() : Un(Lt - 1) - N[Lt - 1]), 0 < t && (t = 0), t;
    }

    function Zn(t) {
      var e;
      if (null == t && (t = It), F && !$) {
        if (tt) e = -(tt + nt) * t, at && (e += Un());else {
          var n = r ? Lt : rt;
          at && (t -= Un()), e = 100 * -t / n;
        }
      } else e = -N[t], at && $ && (e += Un());
      return Bt && (e = Math.max(e, St)), e += !F || $ || tt ? "px" : "%";
    }

    function $n(t) {
      Jn(V, "0s"), ti(t);
    }

    function ti(t) {
      null == t && (t = Zn()), V.style[Ot] = Dt + t + kt;
    }

    function ei(t, e, n, i) {
      var a = t + rt;
      ft || (a = Math.min(a, Lt));

      for (var r = t; r < a; r++) {
        var o = G[r];
        i || (o.style.left = 100 * (r - It) / rt + "%"), C && u && (o.style[u] = o.style[l] = C * (r - t) / 1e3 + "s"), Wi(o, e), zi(o, n), i && At.push(o);
      }
    }

    function ni(t, e) {
      Ht && _e(), (It !== Pt || e) && (Qt.emit("indexChanged", Ei()), Qt.emit("transitionStart", Ei()), dt && Pn(), Pe && t && 0 <= ["click", "keydown"].indexOf(t.type) && fi(), Vt = !0, Ze());
    }

    function ii(t) {
      return t.toLowerCase().replace(/-/g, "");
    }

    function ai(t) {
      if (I || Vt) {
        if (Qt.emit("transitionEnd", Ei(t)), !I && 0 < At.length) for (var e = 0; e < At.length; e++) {
          var n = At[e];
          n.style.left = "", l && u && (n.style[l] = "", n.style[u] = ""), Wi(n, z), zi(n, W);
        }

        if (!t || !I && t.target.parentNode === V || t.target === V && ii(t.propertyName) === ii(Ot)) {
          if (!Ht) {
            var i = It;
            _e(), It !== i && (Qt.emit("indexChanged", Ei()), $n());
          }

          "inner" === R && Qt.emit("innerLoaded", Ei()), Vt = !1, Pt = It;
        }
      }
    }

    function ri(t, e) {
      if (!_t) if ("prev" === t) oi(e, -1);else if ("next" === t) oi(e, 1);else {
        if (Vt) {
          if (qt) return;
          ai();
        }

        var n = nn(),
            i = 0;

        if ("first" === t ? i = -n : "last" === t ? i = I ? Q - rt - n : Q - 1 - n : ("number" != typeof t && (t = parseInt(t)), isNaN(t) || (e || (t = Math.max(0, Math.min(Q - 1, t))), i = t - n)), !I && i && Math.abs(i) < rt) {
          var a = 0 < i ? 1 : -1;
          i += zt <= It + i - Q ? Q * a : 2 * Q * a * -1;
        }

        It += i, I && ft && (It < zt && (It += Q), Wt < It && (It -= Q)), nn(It) !== nn(Pt) && ni(e);
      }
    }

    function oi(t, e) {
      if (Vt) {
        if (qt) return;
        ai();
      }

      var n;

      if (!e) {
        for (var i = hi(t = pi(t)); i !== xe && [we, Ce].indexOf(i) < 0;) {
          i = i.parentNode;
        }

        var a = [we, Ce].indexOf(i);
        0 <= a && (n = !0, e = 0 === a ? -1 : 1);
      }

      if (ct) {
        if (It === zt && -1 === e) return void ri("last", t);
        if (It === Wt && 1 === e) return void ri("first", t);
      }

      e && (It += ot * e, $ && (It = Math.floor(It)), ni(n || t && "keydown" === t.type ? t : null));
    }

    function ui() {
      Ie = setInterval(function () {
        oi(null, Fe);
      }, xt), Pe = !0;
    }

    function li() {
      clearInterval(Ie), Pe = !1;
    }

    function si(t, e) {
      ji(je, {
        "data-action": t
      }), je.innerHTML = Ge[0] + t + Ge[1] + e;
    }

    function ci() {
      ui(), je && si("stop", bt[1]);
    }

    function fi() {
      li(), je && si("start", bt[0]);
    }

    function di() {
      Pe ? (fi(), We = !0) : (ci(), We = !1);
    }

    function vi(t) {
      t.focus();
    }

    function pi(t) {
      return mi(t = t || m.event) ? t.changedTouches[0] : t;
    }

    function hi(t) {
      return t.target || m.event.srcElement;
    }

    function mi(t) {
      return 0 <= t.type.indexOf("touch");
    }

    function yi(t) {
      t.preventDefault ? t.preventDefault() : t.returnValue = !1;
    }

    function gi() {
      return a = Ke.y - Ye.y, r = Ke.x - Ye.x, t = Math.atan2(a, r) * (180 / Math.PI), e = Ft, n = !1, i = Math.abs(90 - Math.abs(t)), 90 - e <= i ? n = "horizontal" : i <= e && (n = "vertical"), n === H.axis;
      var t, e, n, i, a, r;
    }

    function xi(t) {
      if (Vt) {
        if (qt) return;
        ai();
      }

      gt && Pe && li(), Je = !0, Xe && (Ni(Xe), Xe = null);
      var e = pi(t);
      Qt.emit(mi(t) ? "touchStart" : "dragStart", Ei(t)), !mi(t) && 0 <= ["img", "a"].indexOf(Gn(hi(t))) && yi(t), Ke.x = Ye.x = e.clientX, Ke.y = Ye.y = e.clientY, I && (Qe = parseFloat(V.style[Ot].replace(Dt, "")), Jn(V, "0s"));
    }

    function bi(t) {
      if (Je) {
        var e = pi(t);
        Ke.x = e.clientX, Ke.y = e.clientY, I ? Xe || (Xe = Ai(function () {
          !function t(e) {
            if (!jt) return void (Je = !1);
            Ni(Xe);
            Je && (Xe = Ai(function () {
              t(e);
            }));
            "?" === jt && (jt = gi());

            if (jt) {
              !me && mi(e) && (me = !0);

              try {
                e.type && Qt.emit(mi(e) ? "touchMove" : "dragMove", Ei(e));
              } catch (t) {}

              var n = Qe,
                  i = Ue(Ke, Ye);
              if (!F || tt || $) n += i, n += "px";else {
                var a = r ? i * rt * 100 / ((it + nt) * Lt) : 100 * i / (it + nt);
                n += a, n += "%";
              }
              V.style[Ot] = Dt + n + kt;
            }
          }(t);
        })) : ("?" === jt && (jt = gi()), jt && (me = !0)), ("boolean" != typeof t.cancelable || t.cancelable) && me && t.preventDefault();
      }
    }

    function wi(i) {
      if (Je) {
        Xe && (Ni(Xe), Xe = null), I && Jn(V, ""), Je = !1;
        var t = pi(i);
        Ke.x = t.clientX, Ke.y = t.clientY;
        var a = Ue(Ke, Ye);

        if (Math.abs(a)) {
          if (!mi(i)) {
            var n = hi(i);
            Ui(n, {
              click: function t(e) {
                yi(e), _i(n, {
                  click: t
                });
              }
            });
          }

          I ? Xe = Ai(function () {
            if (F && !$) {
              var t = -a * rt / (it + nt);
              t = 0 < a ? Math.floor(t) : Math.ceil(t), It += t;
            } else {
              var e = -(Qe + a);
              if (e <= 0) It = zt;else if (e >= N[Lt - 1]) It = Wt;else for (var n = 0; n < Lt && e >= N[n];) {
                e > N[It = n] && a < 0 && (It += 1), n++;
              }
            }

            ni(i, a), Qt.emit(mi(i) ? "touchEnd" : "dragEnd", Ei(i));
          }) : jt && oi(i, 0 < a ? -1 : 1);
        }
      }

      "auto" === H.preventScrollOnTouch && (me = !1), Ft && (jt = "?"), gt && !Pe && ui();
    }

    function Ci() {
      (M || j).style.height = N[It + rt] - N[It] + "px";
    }

    function Mi() {
      var t = tt ? (tt + nt) * Q / it : Q / rt;
      return Math.min(Math.ceil(t), Q);
    }

    function Ti() {
      if (ht && !le && Le !== Be) {
        var t = Be,
            e = Le,
            n = Xi;

        for (Le < Be && (t = Le, e = Be, n = Qi); t < e;) {
          n(Ee[t]), t++;
        }

        Be = Le;
      }
    }

    function Ei(t) {
      return {
        container: V,
        slideItems: G,
        navContainer: Ae,
        navItems: Ee,
        controlsContainer: xe,
        hasControls: oe,
        prevButton: we,
        nextButton: Ce,
        items: rt,
        slideBy: ot,
        cloneCount: Nt,
        slideCount: Q,
        slideCountNew: Lt,
        index: It,
        indexCached: Pt,
        displayIndex: tn(),
        navCurrentIndex: He,
        navCurrentIndexCached: Oe,
        pages: Le,
        pagesCached: Be,
        sheet: Mt,
        isOn: Y,
        event: t || {}
      };
    }

    f && console.warn("No slides found in", H.container);
  };

  return $i;
}();

!function (e, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.AOS = t() : e.AOS = t();
}(this, function () {
  return function (e) {
    function t(o) {
      if (n[o]) return n[o].exports;
      var i = n[o] = {
        exports: {},
        id: o,
        loaded: !1
      };
      return e[o].call(i.exports, i, i.exports, t), i.loaded = !0, i.exports;
    }

    var n = {};
    return t.m = e, t.c = n, t.p = "dist/", t(0);
  }([function (e, t, n) {
    "use strict";

    function o(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    var i = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];

        for (var o in n) {
          Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
        }
      }

      return e;
    },
        r = n(1),
        a = (o(r), n(6)),
        u = o(a),
        c = n(7),
        s = o(c),
        f = n(8),
        d = o(f),
        l = n(9),
        p = o(l),
        m = n(10),
        b = o(m),
        v = n(11),
        y = o(v),
        g = n(14),
        h = o(g),
        w = [],
        k = !1,
        x = {
      offset: 120,
      delay: 0,
      easing: "ease",
      duration: 400,
      disable: !1,
      once: !1,
      startEvent: "DOMContentLoaded",
      throttleDelay: 99,
      debounceDelay: 50,
      disableMutationObserver: !1
    },
        j = function j() {
      var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      if (e && (k = !0), k) return w = (0, y.default)(w, x), (0, b.default)(w, x.once), w;
    },
        O = function O() {
      w = (0, h.default)(), j();
    },
        M = function M() {
      w.forEach(function (e, t) {
        e.node.removeAttribute("data-aos"), e.node.removeAttribute("data-aos-easing"), e.node.removeAttribute("data-aos-duration"), e.node.removeAttribute("data-aos-delay");
      });
    },
        S = function S(e) {
      return e === !0 || "mobile" === e && p.default.mobile() || "phone" === e && p.default.phone() || "tablet" === e && p.default.tablet() || "function" == typeof e && e() === !0;
    },
        _ = function _(e) {
      x = i(x, e), w = (0, h.default)();
      var t = document.all && !window.atob;
      return S(x.disable) || t ? M() : (x.disableMutationObserver || d.default.isSupported() || (console.info('\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '), x.disableMutationObserver = !0), document.querySelector("body").setAttribute("data-aos-easing", x.easing), document.querySelector("body").setAttribute("data-aos-duration", x.duration), document.querySelector("body").setAttribute("data-aos-delay", x.delay), "DOMContentLoaded" === x.startEvent && ["complete", "interactive"].indexOf(document.readyState) > -1 ? j(!0) : "load" === x.startEvent ? window.addEventListener(x.startEvent, function () {
        j(!0);
      }) : document.addEventListener(x.startEvent, function () {
        j(!0);
      }), window.addEventListener("resize", (0, s.default)(j, x.debounceDelay, !0)), window.addEventListener("orientationchange", (0, s.default)(j, x.debounceDelay, !0)), window.addEventListener("scroll", (0, u.default)(function () {
        (0, b.default)(w, x.once);
      }, x.throttleDelay)), x.disableMutationObserver || d.default.ready("[data-aos]", O), w);
    };

    e.exports = {
      init: _,
      refresh: j,
      refreshHard: O
    };
  }, function (e, t) {},,,,, function (e, t) {
    (function (t) {
      "use strict";

      function n(e, t, n) {
        function o(t) {
          var n = b,
              o = v;
          return b = v = void 0, k = t, g = e.apply(o, n);
        }

        function r(e) {
          return k = e, h = setTimeout(f, t), M ? o(e) : g;
        }

        function a(e) {
          var n = e - w,
              o = e - k,
              i = t - n;
          return S ? j(i, y - o) : i;
        }

        function c(e) {
          var n = e - w,
              o = e - k;
          return void 0 === w || n >= t || n < 0 || S && o >= y;
        }

        function f() {
          var e = O();
          return c(e) ? d(e) : void (h = setTimeout(f, a(e)));
        }

        function d(e) {
          return h = void 0, _ && b ? o(e) : (b = v = void 0, g);
        }

        function l() {
          void 0 !== h && clearTimeout(h), k = 0, b = w = v = h = void 0;
        }

        function p() {
          return void 0 === h ? g : d(O());
        }

        function m() {
          var e = O(),
              n = c(e);

          if (b = arguments, v = this, w = e, n) {
            if (void 0 === h) return r(w);
            if (S) return h = setTimeout(f, t), o(w);
          }

          return void 0 === h && (h = setTimeout(f, t)), g;
        }

        var b,
            v,
            y,
            g,
            h,
            w,
            k = 0,
            M = !1,
            S = !1,
            _ = !0;

        if ("function" != typeof e) throw new TypeError(s);
        return t = u(t) || 0, i(n) && (M = !!n.leading, S = "maxWait" in n, y = S ? x(u(n.maxWait) || 0, t) : y, _ = "trailing" in n ? !!n.trailing : _), m.cancel = l, m.flush = p, m;
      }

      function o(e, t, o) {
        var r = !0,
            a = !0;
        if ("function" != typeof e) throw new TypeError(s);
        return i(o) && (r = "leading" in o ? !!o.leading : r, a = "trailing" in o ? !!o.trailing : a), n(e, t, {
          leading: r,
          maxWait: t,
          trailing: a
        });
      }

      function i(e) {
        var t = "undefined" == typeof e ? "undefined" : c(e);
        return !!e && ("object" == t || "function" == t);
      }

      function r(e) {
        return !!e && "object" == ("undefined" == typeof e ? "undefined" : c(e));
      }

      function a(e) {
        return "symbol" == ("undefined" == typeof e ? "undefined" : c(e)) || r(e) && k.call(e) == d;
      }

      function u(e) {
        if ("number" == typeof e) return e;
        if (a(e)) return f;

        if (i(e)) {
          var t = "function" == typeof e.valueOf ? e.valueOf() : e;
          e = i(t) ? t + "" : t;
        }

        if ("string" != typeof e) return 0 === e ? e : +e;
        e = e.replace(l, "");
        var n = m.test(e);
        return n || b.test(e) ? v(e.slice(2), n ? 2 : 8) : p.test(e) ? f : +e;
      }

      var c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
      },
          s = "Expected a function",
          f = NaN,
          d = "[object Symbol]",
          l = /^\s+|\s+$/g,
          p = /^[-+]0x[0-9a-f]+$/i,
          m = /^0b[01]+$/i,
          b = /^0o[0-7]+$/i,
          v = parseInt,
          y = "object" == ("undefined" == typeof t ? "undefined" : c(t)) && t && t.Object === Object && t,
          g = "object" == ("undefined" == typeof self ? "undefined" : c(self)) && self && self.Object === Object && self,
          h = y || g || Function("return this")(),
          w = Object.prototype,
          k = w.toString,
          x = Math.max,
          j = Math.min,
          O = function O() {
        return h.Date.now();
      };

      e.exports = o;
    }).call(t, function () {
      return this;
    }());
  }, function (e, t) {
    (function (t) {
      "use strict";

      function n(e, t, n) {
        function i(t) {
          var n = b,
              o = v;
          return b = v = void 0, O = t, g = e.apply(o, n);
        }

        function r(e) {
          return O = e, h = setTimeout(f, t), M ? i(e) : g;
        }

        function u(e) {
          var n = e - w,
              o = e - O,
              i = t - n;
          return S ? x(i, y - o) : i;
        }

        function s(e) {
          var n = e - w,
              o = e - O;
          return void 0 === w || n >= t || n < 0 || S && o >= y;
        }

        function f() {
          var e = j();
          return s(e) ? d(e) : void (h = setTimeout(f, u(e)));
        }

        function d(e) {
          return h = void 0, _ && b ? i(e) : (b = v = void 0, g);
        }

        function l() {
          void 0 !== h && clearTimeout(h), O = 0, b = w = v = h = void 0;
        }

        function p() {
          return void 0 === h ? g : d(j());
        }

        function m() {
          var e = j(),
              n = s(e);

          if (b = arguments, v = this, w = e, n) {
            if (void 0 === h) return r(w);
            if (S) return h = setTimeout(f, t), i(w);
          }

          return void 0 === h && (h = setTimeout(f, t)), g;
        }

        var b,
            v,
            y,
            g,
            h,
            w,
            O = 0,
            M = !1,
            S = !1,
            _ = !0;

        if ("function" != typeof e) throw new TypeError(c);
        return t = a(t) || 0, o(n) && (M = !!n.leading, S = "maxWait" in n, y = S ? k(a(n.maxWait) || 0, t) : y, _ = "trailing" in n ? !!n.trailing : _), m.cancel = l, m.flush = p, m;
      }

      function o(e) {
        var t = "undefined" == typeof e ? "undefined" : u(e);
        return !!e && ("object" == t || "function" == t);
      }

      function i(e) {
        return !!e && "object" == ("undefined" == typeof e ? "undefined" : u(e));
      }

      function r(e) {
        return "symbol" == ("undefined" == typeof e ? "undefined" : u(e)) || i(e) && w.call(e) == f;
      }

      function a(e) {
        if ("number" == typeof e) return e;
        if (r(e)) return s;

        if (o(e)) {
          var t = "function" == typeof e.valueOf ? e.valueOf() : e;
          e = o(t) ? t + "" : t;
        }

        if ("string" != typeof e) return 0 === e ? e : +e;
        e = e.replace(d, "");
        var n = p.test(e);
        return n || m.test(e) ? b(e.slice(2), n ? 2 : 8) : l.test(e) ? s : +e;
      }

      var u = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
      },
          c = "Expected a function",
          s = NaN,
          f = "[object Symbol]",
          d = /^\s+|\s+$/g,
          l = /^[-+]0x[0-9a-f]+$/i,
          p = /^0b[01]+$/i,
          m = /^0o[0-7]+$/i,
          b = parseInt,
          v = "object" == ("undefined" == typeof t ? "undefined" : u(t)) && t && t.Object === Object && t,
          y = "object" == ("undefined" == typeof self ? "undefined" : u(self)) && self && self.Object === Object && self,
          g = v || y || Function("return this")(),
          h = Object.prototype,
          w = h.toString,
          k = Math.max,
          x = Math.min,
          j = function j() {
        return g.Date.now();
      };

      e.exports = n;
    }).call(t, function () {
      return this;
    }());
  }, function (e, t) {
    "use strict";

    function n(e) {
      var t = void 0,
          o = void 0,
          i = void 0;

      for (t = 0; t < e.length; t += 1) {
        if (o = e[t], o.dataset && o.dataset.aos) return !0;
        if (i = o.children && n(o.children)) return !0;
      }

      return !1;
    }

    function o() {
      return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    }

    function i() {
      return !!o();
    }

    function r(e, t) {
      var n = window.document,
          i = o(),
          r = new i(a);
      u = t, r.observe(n.documentElement, {
        childList: !0,
        subtree: !0,
        removedNodes: !0
      });
    }

    function a(e) {
      e && e.forEach(function (e) {
        var t = Array.prototype.slice.call(e.addedNodes),
            o = Array.prototype.slice.call(e.removedNodes),
            i = t.concat(o);
        if (n(i)) return u();
      });
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var u = function u() {};

    t.default = {
      isSupported: i,
      ready: r
    };
  }, function (e, t) {
    "use strict";

    function n(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    function o() {
      return navigator.userAgent || navigator.vendor || window.opera || "";
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var i = function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var o = t[n];
          o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
        }
      }

      return function (t, n, o) {
        return n && e(t.prototype, n), o && e(t, o), t;
      };
    }(),
        r = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
        a = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        u = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,
        c = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        s = function () {
      function e() {
        n(this, e);
      }

      return i(e, [{
        key: "phone",
        value: function value() {
          var e = o();
          return !(!r.test(e) && !a.test(e.substr(0, 4)));
        }
      }, {
        key: "mobile",
        value: function value() {
          var e = o();
          return !(!u.test(e) && !c.test(e.substr(0, 4)));
        }
      }, {
        key: "tablet",
        value: function value() {
          return this.mobile() && !this.phone();
        }
      }]), e;
    }();

    t.default = new s();
  }, function (e, t) {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var n = function n(e, t, _n2) {
      var o = e.node.getAttribute("data-aos-once");
      t > e.position ? e.node.classList.add("aos-animate") : "undefined" != typeof o && ("false" === o || !_n2 && "true" !== o) && e.node.classList.remove("aos-animate");
    },
        o = function o(e, t) {
      var o = window.pageYOffset,
          i = window.innerHeight;
      e.forEach(function (e, r) {
        n(e, i + o, t);
      });
    };

    t.default = o;
  }, function (e, t, n) {
    "use strict";

    function o(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var i = n(12),
        r = o(i),
        a = function a(e, t) {
      return e.forEach(function (e, n) {
        e.node.classList.add("aos-init"), e.position = (0, r.default)(e.node, t.offset);
      }), e;
    };

    t.default = a;
  }, function (e, t, n) {
    "use strict";

    function o(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var i = n(13),
        r = o(i),
        a = function a(e, t) {
      var n = 0,
          o = 0,
          i = window.innerHeight,
          a = {
        offset: e.getAttribute("data-aos-offset"),
        anchor: e.getAttribute("data-aos-anchor"),
        anchorPlacement: e.getAttribute("data-aos-anchor-placement")
      };

      switch (a.offset && !isNaN(a.offset) && (o = parseInt(a.offset)), a.anchor && document.querySelectorAll(a.anchor) && (e = document.querySelectorAll(a.anchor)[0]), n = (0, r.default)(e).top, a.anchorPlacement) {
        case "top-bottom":
          break;

        case "center-bottom":
          n += e.offsetHeight / 2;
          break;

        case "bottom-bottom":
          n += e.offsetHeight;
          break;

        case "top-center":
          n += i / 2;
          break;

        case "bottom-center":
          n += i / 2 + e.offsetHeight;
          break;

        case "center-center":
          n += i / 2 + e.offsetHeight / 2;
          break;

        case "top-top":
          n += i;
          break;

        case "bottom-top":
          n += e.offsetHeight + i;
          break;

        case "center-top":
          n += e.offsetHeight / 2 + i;
      }

      return a.anchorPlacement || a.offset || isNaN(t) || (o = t), n + o;
    };

    t.default = a;
  }, function (e, t) {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var n = function n(e) {
      for (var t = 0, n = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop);) {
        t += e.offsetLeft - ("BODY" != e.tagName ? e.scrollLeft : 0), n += e.offsetTop - ("BODY" != e.tagName ? e.scrollTop : 0), e = e.offsetParent;
      }

      return {
        top: n,
        left: t
      };
    };

    t.default = n;
  }, function (e, t) {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var n = function n(e) {
      return e = e || document.querySelectorAll("[data-aos]"), Array.prototype.map.call(e, function (e) {
        return {
          node: e
        };
      });
    };

    t.default = n;
  }]);
});
/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */

;

(function (factory) {
  var registeredInModuleLoader = false;

  if (typeof define === 'function' && define.amd) {
    define(factory);
    registeredInModuleLoader = true;
  }

  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
    registeredInModuleLoader = true;
  }

  if (!registeredInModuleLoader) {
    var OldCookies = window.Cookies;
    var api = window.Cookies = factory();

    api.noConflict = function () {
      window.Cookies = OldCookies;
      return api;
    };
  }
})(function () {
  function extend() {
    var i = 0;
    var result = {};

    for (; i < arguments.length; i++) {
      var attributes = arguments[i];

      for (var key in attributes) {
        result[key] = attributes[key];
      }
    }

    return result;
  }

  function init(converter) {
    function api(key, value, attributes) {
      var result;

      if (typeof document === 'undefined') {
        return;
      } // Write


      if (arguments.length > 1) {
        attributes = extend({
          path: '/'
        }, api.defaults, attributes);

        if (typeof attributes.expires === 'number') {
          var expires = new Date();
          expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
          attributes.expires = expires;
        } // We're using "expires" because "max-age" is not supported by IE


        attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

        try {
          result = JSON.stringify(value);

          if (/^[\{\[]/.test(result)) {
            value = result;
          }
        } catch (e) {}

        if (!converter.write) {
          value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
        } else {
          value = converter.write(value, key);
        }

        key = encodeURIComponent(String(key));
        key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
        key = key.replace(/[\(\)]/g, escape);
        var stringifiedAttributes = '';

        for (var attributeName in attributes) {
          if (!attributes[attributeName]) {
            continue;
          }

          stringifiedAttributes += '; ' + attributeName;

          if (attributes[attributeName] === true) {
            continue;
          }

          stringifiedAttributes += '=' + attributes[attributeName];
        }

        return document.cookie = key + '=' + value + stringifiedAttributes;
      } // Read


      if (!key) {
        result = {};
      } // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all. Also prevents odd result when
      // calling "get()"


      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var rdecode = /(%[0-9A-Z]{2})+/g;
      var i = 0;

      for (; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var cookie = parts.slice(1).join('=');

        if (!this.json && cookie.charAt(0) === '"') {
          cookie = cookie.slice(1, -1);
        }

        try {
          var name = parts[0].replace(rdecode, decodeURIComponent);
          cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);

          if (this.json) {
            try {
              cookie = JSON.parse(cookie);
            } catch (e) {}
          }

          if (key === name) {
            result = cookie;
            break;
          }

          if (!key) {
            result[name] = cookie;
          }
        } catch (e) {}
      }

      return result;
    }

    api.set = api;

    api.get = function (key) {
      return api.call(api, key);
    };

    api.getJSON = function () {
      return api.apply({
        json: true
      }, [].slice.call(arguments));
    };

    api.defaults = {};

    api.remove = function (key, attributes) {
      api(key, '', extend(attributes, {
        expires: -1
      }));
    };

    api.withConverter = init;
    return api;
  }

  return init(function () {});
});
/*!
 * imagesLoaded PACKAGED v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */


(function (global, factory) {
  // universal module definition

  /* jshint strict: false */

  /* globals define, module, window */
  if (typeof define == 'function' && define.amd) {
    // AMD - RequireJS
    define('ev-emitter/ev-emitter', factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module.exports) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }
})(typeof window != 'undefined' ? window : this, function () {
  function EvEmitter() {}

  var proto = EvEmitter.prototype;

  proto.on = function (eventName, listener) {
    if (!eventName || !listener) {
      return;
    } // set events hash


    var events = this._events = this._events || {}; // set listeners array

    var listeners = events[eventName] = events[eventName] || []; // only add once

    if (listeners.indexOf(listener) == -1) {
      listeners.push(listener);
    }

    return this;
  };

  proto.once = function (eventName, listener) {
    if (!eventName || !listener) {
      return;
    } // add event


    this.on(eventName, listener); // set once flag
    // set onceEvents hash

    var onceEvents = this._onceEvents = this._onceEvents || {}; // set onceListeners object

    var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {}; // set flag

    onceListeners[listener] = true;
    return this;
  };

  proto.off = function (eventName, listener) {
    var listeners = this._events && this._events[eventName];

    if (!listeners || !listeners.length) {
      return;
    }

    var index = listeners.indexOf(listener);

    if (index != -1) {
      listeners.splice(index, 1);
    }

    return this;
  };

  proto.emitEvent = function (eventName, args) {
    var listeners = this._events && this._events[eventName];

    if (!listeners || !listeners.length) {
      return;
    } // copy over to avoid interference if .off() in listener


    listeners = listeners.slice(0);
    args = args || []; // once stuff

    var onceListeners = this._onceEvents && this._onceEvents[eventName];

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      var isOnce = onceListeners && onceListeners[listener];

      if (isOnce) {
        // remove listener
        // remove before trigger to prevent recursion
        this.off(eventName, listener); // unset once flag

        delete onceListeners[listener];
      } // trigger listener


      listener.apply(this, args);
    }

    return this;
  };

  proto.allOff = function () {
    delete this._events;
    delete this._onceEvents;
  };

  return EvEmitter;
});
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */


(function (window, factory) {
  'use strict'; // universal module definition

  /*global define: false, module: false, require: false */

  if (typeof define == 'function' && define.amd) {
    // AMD
    define(['ev-emitter/ev-emitter'], function (EvEmitter) {
      return factory(window, EvEmitter);
    });
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module.exports) {
    // CommonJS
    module.exports = factory(window, require('ev-emitter'));
  } else {
    // browser global
    window.imagesLoaded = factory(window, window.EvEmitter);
  }
})(typeof window !== 'undefined' ? window : this, // --------------------------  factory -------------------------- //
function factory(window, EvEmitter) {
  var $ = window.jQuery;
  var console = window.console; // -------------------------- helpers -------------------------- //
  // extend objects

  function extend(a, b) {
    for (var prop in b) {
      a[prop] = b[prop];
    }

    return a;
  }

  var arraySlice = Array.prototype.slice; // turn element or nodeList into an array

  function makeArray(obj) {
    if (Array.isArray(obj)) {
      // use object if already an array
      return obj;
    }

    var isArrayLike = _typeof(obj) == 'object' && typeof obj.length == 'number';

    if (isArrayLike) {
      // convert nodeList to array
      return arraySlice.call(obj);
    } // array of single index


    return [obj];
  } // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */


  function ImagesLoaded(elem, options, onAlways) {
    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
    if (!(this instanceof ImagesLoaded)) {
      return new ImagesLoaded(elem, options, onAlways);
    } // use elem as selector string


    var queryElem = elem;

    if (typeof elem == 'string') {
      queryElem = document.querySelectorAll(elem);
    } // bail if bad element


    if (!queryElem) {
      console.error('Bad element for imagesLoaded ' + (queryElem || elem));
      return;
    }

    this.elements = makeArray(queryElem);
    this.options = extend({}, this.options); // shift arguments if no options set

    if (typeof options == 'function') {
      onAlways = options;
    } else {
      extend(this.options, options);
    }

    if (onAlways) {
      this.on('always', onAlways);
    }

    this.getImages();

    if ($) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    } // HACK check async to allow time to bind listeners


    setTimeout(this.check.bind(this));
  }

  ImagesLoaded.prototype = Object.create(EvEmitter.prototype);
  ImagesLoaded.prototype.options = {};

  ImagesLoaded.prototype.getImages = function () {
    this.images = []; // filter & find items if we have an item selector

    this.elements.forEach(this.addElementImages, this);
  };
  /**
   * @param {Node} element
   */


  ImagesLoaded.prototype.addElementImages = function (elem) {
    // filter siblings
    if (elem.nodeName == 'IMG') {
      this.addImage(elem);
    } // get background image on element


    if (this.options.background === true) {
      this.addElementBackgroundImages(elem);
    } // find children
    // no non-element nodes, #143


    var nodeType = elem.nodeType;

    if (!nodeType || !elementNodeTypes[nodeType]) {
      return;
    }

    var childImgs = elem.querySelectorAll('img'); // concat childElems to filterFound array

    for (var i = 0; i < childImgs.length; i++) {
      var img = childImgs[i];
      this.addImage(img);
    } // get child background images


    if (typeof this.options.background == 'string') {
      var children = elem.querySelectorAll(this.options.background);

      for (i = 0; i < children.length; i++) {
        var child = children[i];
        this.addElementBackgroundImages(child);
      }
    }
  };

  var elementNodeTypes = {
    1: true,
    9: true,
    11: true
  };

  ImagesLoaded.prototype.addElementBackgroundImages = function (elem) {
    var style = getComputedStyle(elem);

    if (!style) {
      // Firefox returns null if in a hidden iframe https://bugzil.la/548397
      return;
    } // get url inside url("...")


    var reURL = /url\((['"])?(.*?)\1\)/gi;
    var matches = reURL.exec(style.backgroundImage);

    while (matches !== null) {
      var url = matches && matches[2];

      if (url) {
        this.addBackground(url, elem);
      }

      matches = reURL.exec(style.backgroundImage);
    }
  };
  /**
   * @param {Image} img
   */


  ImagesLoaded.prototype.addImage = function (img) {
    var loadingImage = new LoadingImage(img);
    this.images.push(loadingImage);
  };

  ImagesLoaded.prototype.addBackground = function (url, elem) {
    var background = new Background(url, elem);
    this.images.push(background);
  };

  ImagesLoaded.prototype.check = function () {
    var _this = this;

    this.progressedCount = 0;
    this.hasAnyBroken = false; // complete if no images

    if (!this.images.length) {
      this.complete();
      return;
    }

    function onProgress(image, elem, message) {
      // HACK - Chrome triggers event before object properties have changed. #83
      setTimeout(function () {
        _this.progress(image, elem, message);
      });
    }

    this.images.forEach(function (loadingImage) {
      loadingImage.once('progress', onProgress);
      loadingImage.check();
    });
  };

  ImagesLoaded.prototype.progress = function (image, elem, message) {
    this.progressedCount++;
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded; // progress event

    this.emitEvent('progress', [this, image, elem]);

    if (this.jqDeferred && this.jqDeferred.notify) {
      this.jqDeferred.notify(this, image);
    } // check if completed


    if (this.progressedCount == this.images.length) {
      this.complete();
    }

    if (this.options.debug && console) {
      console.log('progress: ' + message, image, elem);
    }
  };

  ImagesLoaded.prototype.complete = function () {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    this.emitEvent(eventName, [this]);
    this.emitEvent('always', [this]);

    if (this.jqDeferred) {
      var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
      this.jqDeferred[jqMethod](this);
    }
  }; // --------------------------  -------------------------- //


  function LoadingImage(img) {
    this.img = img;
  }

  LoadingImage.prototype = Object.create(EvEmitter.prototype);

  LoadingImage.prototype.check = function () {
    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    var isComplete = this.getIsImageComplete();

    if (isComplete) {
      // report based on naturalWidth
      this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
      return;
    } // If none of the checks above matched, simulate loading on detached element.


    this.proxyImage = new Image();
    this.proxyImage.addEventListener('load', this);
    this.proxyImage.addEventListener('error', this); // bind to image as well for Firefox. #191

    this.img.addEventListener('load', this);
    this.img.addEventListener('error', this);
    this.proxyImage.src = this.img.src;
  };

  LoadingImage.prototype.getIsImageComplete = function () {
    // check for non-zero, non-undefined naturalWidth
    // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
    return this.img.complete && this.img.naturalWidth;
  };

  LoadingImage.prototype.confirm = function (isLoaded, message) {
    this.isLoaded = isLoaded;
    this.emitEvent('progress', [this, this.img, message]);
  }; // ----- events ----- //
  // trigger specified handler for event type


  LoadingImage.prototype.handleEvent = function (event) {
    var method = 'on' + event.type;

    if (this[method]) {
      this[method](event);
    }
  };

  LoadingImage.prototype.onload = function () {
    this.confirm(true, 'onload');
    this.unbindEvents();
  };

  LoadingImage.prototype.onerror = function () {
    this.confirm(false, 'onerror');
    this.unbindEvents();
  };

  LoadingImage.prototype.unbindEvents = function () {
    this.proxyImage.removeEventListener('load', this);
    this.proxyImage.removeEventListener('error', this);
    this.img.removeEventListener('load', this);
    this.img.removeEventListener('error', this);
  }; // -------------------------- Background -------------------------- //


  function Background(url, element) {
    this.url = url;
    this.element = element;
    this.img = new Image();
  } // inherit LoadingImage prototype


  Background.prototype = Object.create(LoadingImage.prototype);

  Background.prototype.check = function () {
    this.img.addEventListener('load', this);
    this.img.addEventListener('error', this);
    this.img.src = this.url; // check if image is already complete

    var isComplete = this.getIsImageComplete();

    if (isComplete) {
      this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
      this.unbindEvents();
    }
  };

  Background.prototype.unbindEvents = function () {
    this.img.removeEventListener('load', this);
    this.img.removeEventListener('error', this);
  };

  Background.prototype.confirm = function (isLoaded, message) {
    this.isLoaded = isLoaded;
    this.emitEvent('progress', [this, this.element, message]);
  }; // -------------------------- jQuery -------------------------- //


  ImagesLoaded.makeJQueryPlugin = function (jQuery) {
    jQuery = jQuery || window.jQuery;

    if (!jQuery) {
      return;
    } // set local variable


    $ = jQuery; // $().imagesLoaded()

    $.fn.imagesLoaded = function (options, callback) {
      var instance = new ImagesLoaded(this, options, callback);
      return instance.jqDeferred.promise($(this));
    };
  }; // try making plugin


  ImagesLoaded.makeJQueryPlugin(); // --------------------------  -------------------------- //

  return ImagesLoaded;
});
/*! @vimeo/player v2.6.5 | (c) 2018 Vimeo | MIT License | https://github.com/vimeo/player.js */


!function (e, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e.Vimeo = e.Vimeo || {}, e.Vimeo.Player = t());
}(this, function () {
  "use strict";

  function r(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
    }
  }

  var e = "undefined" != typeof global && "[object global]" === {}.toString.call(global);

  function i(e, t) {
    return 0 === e.indexOf(t.toLowerCase()) ? e : "".concat(t.toLowerCase()).concat(e.substr(0, 1).toUpperCase()).concat(e.substr(1));
  }

  function c(e) {
    return /^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(e);
  }

  function u() {
    var e,
        t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {},
        n = t.id,
        r = t.url,
        o = n || r;
    if (!o) throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");
    if (e = o, !isNaN(parseFloat(e)) && isFinite(e) && Math.floor(e) == e) return "https://vimeo.com/".concat(o);
    if (c(o)) return o.replace("http:", "https:");
    if (n) throw new TypeError("“".concat(n, "” is not a valid video id."));
    throw new TypeError("“".concat(o, "” is not a vimeo.com url."));
  }

  var t = void 0 !== Array.prototype.indexOf,
      n = "undefined" != typeof window && void 0 !== window.postMessage;
  if (!(e || t && n)) throw new Error("Sorry, the Vimeo Player API is not available in this browser.");
  var o = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
  !function (e) {
    if (!e.WeakMap) {
      var n = Object.prototype.hasOwnProperty,
          o = function o(e, t, n) {
        Object.defineProperty ? Object.defineProperty(e, t, {
          configurable: !0,
          writable: !0,
          value: n
        }) : e[t] = n;
      };

      e.WeakMap = function () {
        function e() {
          if (void 0 === this) throw new TypeError("Constructor WeakMap requires 'new'");
          if (o(this, "_id", "_WeakMap" + "_" + t() + "." + t()), 0 < arguments.length) throw new TypeError("WeakMap iterable is not supported");
        }

        function r(e, t) {
          if (!i(e) || !n.call(e, "_id")) throw new TypeError(t + " method called on incompatible receiver " + _typeof(e));
        }

        function t() {
          return Math.random().toString().substring(2);
        }

        return o(e.prototype, "delete", function (e) {
          if (r(this, "delete"), !i(e)) return !1;
          var t = e[this._id];
          return !(!t || t[0] !== e) && (delete e[this._id], !0);
        }), o(e.prototype, "get", function (e) {
          if (r(this, "get"), i(e)) {
            var t = e[this._id];
            return t && t[0] === e ? t[1] : void 0;
          }
        }), o(e.prototype, "has", function (e) {
          if (r(this, "has"), !i(e)) return !1;
          var t = e[this._id];
          return !(!t || t[0] !== e);
        }), o(e.prototype, "set", function (e, t) {
          if (r(this, "set"), !i(e)) throw new TypeError("Invalid value used as weak map key");
          var n = e[this._id];
          return n && n[0] === e ? n[1] = t : o(e, this._id, [e, t]), this;
        }), o(e, "_polyfill", !0), e;
      }();
    }

    function i(e) {
      return Object(e) === e;
    }
  }("undefined" != typeof self ? self : "undefined" != typeof window ? window : o);
  var a,
      s = (function (e) {
    var t, n, r;
    r = function r() {
      var t,
          a,
          n,
          e = Object.prototype.toString,
          r = "undefined" != typeof setImmediate ? function (e) {
        return setImmediate(e);
      } : setTimeout;

      try {
        Object.defineProperty({}, "x", {}), t = function t(e, _t2, n, r) {
          return Object.defineProperty(e, _t2, {
            value: n,
            writable: !0,
            configurable: !1 !== r
          });
        };
      } catch (e) {
        t = function t(e, _t3, n) {
          return e[_t3] = n, e;
        };
      }

      function i(e, t) {
        n.add(e, t), a || (a = r(n.drain));
      }

      function u(e) {
        var t,
            n = _typeof(e);

        return null == e || "object" != n && "function" != n || (t = e.then), "function" == typeof t && t;
      }

      function c() {
        for (var e = 0; e < this.chain.length; e++) {
          o(this, 1 === this.state ? this.chain[e].success : this.chain[e].failure, this.chain[e]);
        }

        this.chain.length = 0;
      }

      function o(e, t, n) {
        var r, o;

        try {
          !1 === t ? n.reject(e.msg) : (r = !0 === t ? e.msg : t.call(void 0, e.msg)) === n.promise ? n.reject(TypeError("Promise-chain cycle")) : (o = u(r)) ? o.call(r, n.resolve, n.reject) : n.resolve(r);
        } catch (e) {
          n.reject(e);
        }
      }

      function s(e) {
        var t = this;
        t.triggered || (t.triggered = !0, t.def && (t = t.def), t.msg = e, t.state = 2, 0 < t.chain.length && i(c, t));
      }

      function l(e, n, r, o) {
        for (var t = 0; t < n.length; t++) {
          !function (t) {
            e.resolve(n[t]).then(function (e) {
              r(t, e);
            }, o);
          }(t);
        }
      }

      function f(e) {
        this.def = e, this.triggered = !1;
      }

      function d(e) {
        this.promise = e, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0;
      }

      function h(e) {
        if ("function" != typeof e) throw TypeError("Not a function");
        if (0 !== this.__NPO__) throw TypeError("Not a promise");
        this.__NPO__ = 1;
        var r = new d(this);
        this.then = function (e, t) {
          var n = {
            success: "function" != typeof e || e,
            failure: "function" == typeof t && t
          };
          return n.promise = new this.constructor(function (e, t) {
            if ("function" != typeof e || "function" != typeof t) throw TypeError("Not a function");
            n.resolve = e, n.reject = t;
          }), r.chain.push(n), 0 !== r.state && i(c, r), n.promise;
        }, this.catch = function (e) {
          return this.then(void 0, e);
        };

        try {
          e.call(void 0, function (e) {
            (function e(n) {
              var r,
                  o = this;

              if (!o.triggered) {
                o.triggered = !0, o.def && (o = o.def);

                try {
                  (r = u(n)) ? i(function () {
                    var t = new f(o);

                    try {
                      r.call(n, function () {
                        e.apply(t, arguments);
                      }, function () {
                        s.apply(t, arguments);
                      });
                    } catch (e) {
                      s.call(t, e);
                    }
                  }) : (o.msg = n, o.state = 1, 0 < o.chain.length && i(c, o));
                } catch (e) {
                  s.call(new f(o), e);
                }
              }
            }).call(r, e);
          }, function (e) {
            s.call(r, e);
          });
        } catch (e) {
          s.call(r, e);
        }
      }

      n = function () {
        var n, r, o;

        function i(e, t) {
          this.fn = e, this.self = t, this.next = void 0;
        }

        return {
          add: function add(e, t) {
            o = new i(e, t), r ? r.next = o : n = o, r = o, o = void 0;
          },
          drain: function drain() {
            var e = n;

            for (n = r = a = void 0; e;) {
              e.fn.call(e.self), e = e.next;
            }
          }
        };
      }();

      var v = t({}, "constructor", h, !1);
      return t(h.prototype = v, "__NPO__", 0, !1), t(h, "resolve", function (n) {
        return n && "object" == _typeof(n) && 1 === n.__NPO__ ? n : new this(function (e, t) {
          if ("function" != typeof e || "function" != typeof t) throw TypeError("Not a function");
          e(n);
        });
      }), t(h, "reject", function (n) {
        return new this(function (e, t) {
          if ("function" != typeof e || "function" != typeof t) throw TypeError("Not a function");
          t(n);
        });
      }), t(h, "all", function (t) {
        var a = this;
        return "[object Array]" != e.call(t) ? a.reject(TypeError("Not an array")) : 0 === t.length ? a.resolve([]) : new a(function (n, e) {
          if ("function" != typeof n || "function" != typeof e) throw TypeError("Not a function");
          var r = t.length,
              o = Array(r),
              i = 0;
          l(a, t, function (e, t) {
            o[e] = t, ++i === r && n(o);
          }, e);
        });
      }), t(h, "race", function (t) {
        var r = this;
        return "[object Array]" != e.call(t) ? r.reject(TypeError("Not an array")) : new r(function (n, e) {
          if ("function" != typeof n || "function" != typeof e) throw TypeError("Not a function");
          l(r, t, function (e, t) {
            n(t);
          }, e);
        });
      }), h;
    }, (n = o)[t = "Promise"] = n[t] || r(), e.exports && (e.exports = n[t]);
  }(a = {
    exports: {}
  }, a.exports), a.exports),
      l = new WeakMap();

  function f(e, t, n) {
    var r = l.get(e.element) || {};
    t in r || (r[t] = []), r[t].push(n), l.set(e.element, r);
  }

  function d(e, t) {
    return (l.get(e.element) || {})[t] || [];
  }

  function h(e, t, n) {
    var r = l.get(e.element) || {};
    if (!r[t]) return !0;
    if (!n) return r[t] = [], l.set(e.element, r), !0;
    var o = r[t].indexOf(n);
    return -1 !== o && r[t].splice(o, 1), l.set(e.element, r), r[t] && 0 === r[t].length;
  }

  var v = ["autopause", "autoplay", "background", "byline", "color", "height", "id", "loop", "maxheight", "maxwidth", "muted", "playsinline", "portrait", "responsive", "speed", "title", "transparent", "url", "width"];

  function p(r) {
    var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
    return v.reduce(function (e, t) {
      var n = r.getAttribute("data-vimeo-".concat(t));
      return (n || "" === n) && (e[t] = "" === n ? 1 : n), e;
    }, e);
  }

  function m(e, t) {
    var n = e.html;
    if (!t) throw new TypeError("An element must be provided");
    if (null !== t.getAttribute("data-vimeo-initialized")) return t.querySelector("iframe");
    var r = document.createElement("div");
    return r.innerHTML = n, t.appendChild(r.firstChild), t.setAttribute("data-vimeo-initialized", "true"), t.querySelector("iframe");
  }

  function y(i) {
    var a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
        u = 2 < arguments.length ? arguments[2] : void 0;
    return new Promise(function (t, n) {
      if (!c(i)) throw new TypeError("“".concat(i, "” is not a vimeo.com url."));
      var e = "https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(i), "&domain=").concat(window.location.hostname);

      for (var r in a) {
        a.hasOwnProperty(r) && (e += "&".concat(r, "=").concat(encodeURIComponent(a[r])));
      }

      var o = "XDomainRequest" in window ? new XDomainRequest() : new XMLHttpRequest();
      o.open("GET", e, !0), o.onload = function () {
        if (404 !== o.status) {
          if (403 !== o.status) try {
            var e = JSON.parse(o.responseText);
            if (403 === e.domain_status_code) return m(e, u), void n(new Error("“".concat(i, "” is not embeddable.")));
            t(e);
          } catch (e) {
            n(e);
          } else n(new Error("“".concat(i, "” is not embeddable.")));
        } else n(new Error("“".concat(i, "” was not found.")));
      }, o.onerror = function () {
        var e = o.status ? " (".concat(o.status, ")") : "";
        n(new Error("There was an error fetching the embed code from Vimeo".concat(e, ".")));
      }, o.send();
    });
  }

  function w(e) {
    return "string" == typeof e && (e = JSON.parse(e)), e;
  }

  function g(e, t, n) {
    if (e.element.contentWindow && e.element.contentWindow.postMessage) {
      var r = {
        method: t
      };
      void 0 !== n && (r.value = n);
      var o = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, "$1"));
      8 <= o && o < 10 && (r = JSON.stringify(r)), e.element.contentWindow.postMessage(r, e.origin);
    }
  }

  function b(n, r) {
    var t,
        e = [];

    if ((r = w(r)).event) {
      if ("error" === r.event) d(n, r.data.method).forEach(function (e) {
        var t = new Error(r.data.message);
        t.name = r.data.name, e.reject(t), h(n, r.data.method, e);
      });
      e = d(n, "event:".concat(r.event)), t = r.data;
    } else if (r.method) {
      var o = function (e, t) {
        var n = d(e, t);
        if (n.length < 1) return !1;
        var r = n.shift();
        return h(e, t, r), r;
      }(n, r.method);

      o && (e.push(o), t = r.value);
    }

    e.forEach(function (e) {
      try {
        if ("function" == typeof e) return void e.call(n, t);
        e.resolve(t);
      } catch (e) {}
    });
  }

  var E = new WeakMap(),
      k = new WeakMap(),
      Player = function () {
    function Player(i) {
      var a = this,
          r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
      if (function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
      }(this, Player), window.jQuery && i instanceof jQuery && (1 < i.length && window.console && console.warn && console.warn("A jQuery object with multiple elements was passed, using the first element."), i = i[0]), "undefined" != typeof document && "string" == typeof i && (i = document.getElementById(i)), !(i instanceof window.HTMLElement)) throw new TypeError("You must pass either a valid element or a valid id.");

      if ("IFRAME" !== i.nodeName) {
        var e = i.querySelector("iframe");
        e && (i = e);
      }

      if ("IFRAME" === i.nodeName && !c(i.getAttribute("src") || "")) throw new Error("The player element passed isn’t a Vimeo embed.");
      if (E.has(i)) return E.get(i);
      this.element = i, this.origin = "*";
      var t = new s(function (o, t) {
        var e = function e(_e2) {
          if (c(_e2.origin) && a.element.contentWindow === _e2.source) {
            "*" === a.origin && (a.origin = _e2.origin);
            var t = w(_e2.data),
                n = "event" in t && "ready" === t.event,
                r = "method" in t && "ping" === t.method;
            if (n || r) return a.element.setAttribute("data-ready", "true"), void o();
            b(a, t);
          }
        };

        if (window.addEventListener ? window.addEventListener("message", e, !1) : window.attachEvent && window.attachEvent("onmessage", e), "IFRAME" !== a.element.nodeName) {
          var n = p(i, r);
          y(u(n), n, i).then(function (e) {
            var t,
                n,
                r,
                o = m(e, i);
            return a.element = o, a._originalElement = i, t = i, n = o, r = l.get(t), l.set(n, r), l.delete(t), E.set(a.element, a), e;
          }).catch(function (e) {
            return t(e);
          });
        }
      });
      return k.set(this, t), E.set(this.element, this), "IFRAME" === this.element.nodeName && g(this, "ping"), this;
    }

    var e, t, n;
    return e = Player, (t = [{
      key: "callMethod",
      value: function value(n) {
        var r = this,
            o = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
        return new s(function (e, t) {
          return r.ready().then(function () {
            f(r, n, {
              resolve: e,
              reject: t
            }), g(r, n, o);
          }).catch(function (e) {
            t(e);
          });
        });
      }
    }, {
      key: "get",
      value: function value(n) {
        var r = this;
        return new s(function (e, t) {
          return n = i(n, "get"), r.ready().then(function () {
            f(r, n, {
              resolve: e,
              reject: t
            }), g(r, n);
          });
        });
      }
    }, {
      key: "set",
      value: function value(r, e) {
        var o = this;
        return s.resolve(e).then(function (n) {
          if (r = i(r, "set"), null == n) throw new TypeError("There must be a value to set.");
          return o.ready().then(function () {
            return new s(function (e, t) {
              f(o, r, {
                resolve: e,
                reject: t
              }), g(o, r, n);
            });
          });
        });
      }
    }, {
      key: "on",
      value: function value(e, t) {
        if (!e) throw new TypeError("You must pass an event name.");
        if (!t) throw new TypeError("You must pass a callback function.");
        if ("function" != typeof t) throw new TypeError("The callback must be a function.");
        0 === d(this, "event:".concat(e)).length && this.callMethod("addEventListener", e).catch(function () {}), f(this, "event:".concat(e), t);
      }
    }, {
      key: "off",
      value: function value(e, t) {
        if (!e) throw new TypeError("You must pass an event name.");
        if (t && "function" != typeof t) throw new TypeError("The callback must be a function.");
        h(this, "event:".concat(e), t) && this.callMethod("removeEventListener", e).catch(function (e) {});
      }
    }, {
      key: "loadVideo",
      value: function value(e) {
        return this.callMethod("loadVideo", e);
      }
    }, {
      key: "ready",
      value: function value() {
        var e = k.get(this) || new s(function (e, t) {
          t(new Error("Unknown player. Probably unloaded."));
        });
        return s.resolve(e);
      }
    }, {
      key: "addCuePoint",
      value: function value(e) {
        var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
        return this.callMethod("addCuePoint", {
          time: e,
          data: t
        });
      }
    }, {
      key: "removeCuePoint",
      value: function value(e) {
        return this.callMethod("removeCuePoint", e);
      }
    }, {
      key: "enableTextTrack",
      value: function value(e, t) {
        if (!e) throw new TypeError("You must pass a language.");
        return this.callMethod("enableTextTrack", {
          language: e,
          kind: t
        });
      }
    }, {
      key: "disableTextTrack",
      value: function value() {
        return this.callMethod("disableTextTrack");
      }
    }, {
      key: "pause",
      value: function value() {
        return this.callMethod("pause");
      }
    }, {
      key: "play",
      value: function value() {
        return this.callMethod("play");
      }
    }, {
      key: "unload",
      value: function value() {
        return this.callMethod("unload");
      }
    }, {
      key: "destroy",
      value: function value() {
        var t = this;
        return new s(function (e) {
          k.delete(t), E.delete(t.element), t._originalElement && (E.delete(t._originalElement), t._originalElement.removeAttribute("data-vimeo-initialized")), t.element && "IFRAME" === t.element.nodeName && t.element.parentNode && t.element.parentNode.removeChild(t.element), e();
        });
      }
    }, {
      key: "getAutopause",
      value: function value() {
        return this.get("autopause");
      }
    }, {
      key: "setAutopause",
      value: function value(e) {
        return this.set("autopause", e);
      }
    }, {
      key: "getColor",
      value: function value() {
        return this.get("color");
      }
    }, {
      key: "setColor",
      value: function value(e) {
        return this.set("color", e);
      }
    }, {
      key: "getCuePoints",
      value: function value() {
        return this.get("cuePoints");
      }
    }, {
      key: "getCurrentTime",
      value: function value() {
        return this.get("currentTime");
      }
    }, {
      key: "setCurrentTime",
      value: function value(e) {
        return this.set("currentTime", e);
      }
    }, {
      key: "getDuration",
      value: function value() {
        return this.get("duration");
      }
    }, {
      key: "getEnded",
      value: function value() {
        return this.get("ended");
      }
    }, {
      key: "getLoop",
      value: function value() {
        return this.get("loop");
      }
    }, {
      key: "setLoop",
      value: function value(e) {
        return this.set("loop", e);
      }
    }, {
      key: "getPaused",
      value: function value() {
        return this.get("paused");
      }
    }, {
      key: "getPlaybackRate",
      value: function value() {
        return this.get("playbackRate");
      }
    }, {
      key: "setPlaybackRate",
      value: function value(e) {
        return this.set("playbackRate", e);
      }
    }, {
      key: "getTextTracks",
      value: function value() {
        return this.get("textTracks");
      }
    }, {
      key: "getVideoEmbedCode",
      value: function value() {
        return this.get("videoEmbedCode");
      }
    }, {
      key: "getVideoId",
      value: function value() {
        return this.get("videoId");
      }
    }, {
      key: "getVideoTitle",
      value: function value() {
        return this.get("videoTitle");
      }
    }, {
      key: "getVideoWidth",
      value: function value() {
        return this.get("videoWidth");
      }
    }, {
      key: "getVideoHeight",
      value: function value() {
        return this.get("videoHeight");
      }
    }, {
      key: "getVideoUrl",
      value: function value() {
        return this.get("videoUrl");
      }
    }, {
      key: "getVolume",
      value: function value() {
        return this.get("volume");
      }
    }, {
      key: "setVolume",
      value: function value(e) {
        return this.set("volume", e);
      }
    }]) && r(e.prototype, t), n && r(e, n), Player;
  }();

  return e || (function () {
    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : document,
        t = [].slice.call(e.querySelectorAll("[data-vimeo-id], [data-vimeo-url]")),
        n = function n(e) {
      "console" in window && console.error && console.error("There was an error creating an embed: ".concat(e));
    };

    t.forEach(function (t) {
      try {
        if (null !== t.getAttribute("data-vimeo-defer")) return;
        var e = p(t);
        y(u(e), e, t).then(function (e) {
          return m(e, t);
        }).catch(n);
      } catch (e) {
        n(e);
      }
    });
  }(), function () {
    var r = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : document;

    if (!window.VimeoPlayerResizeEmbeds_) {
      window.VimeoPlayerResizeEmbeds_ = !0;

      var e = function e(_e3) {
        if (c(_e3.origin) && _e3.data && "spacechange" === _e3.data.event) for (var t = r.querySelectorAll("iframe"), n = 0; n < t.length; n++) {
          if (t[n].contentWindow === _e3.source) {
            t[n].parentElement.style.paddingBottom = "".concat(_e3.data.data[0].bottom, "px");
            break;
          }
        }
      };

      window.addEventListener ? window.addEventListener("message", e, !1) : window.attachEvent && window.attachEvent("onmessage", e);
    }
  }()), Player;
});
/*
 * JavaScript Polyfills
 */

/*
 * element.closest()
 * For browsers that do not support Element.closest(),
 * but carry support for element.matches()
 * (or a prefixed equivalent, meaning IE9+)
 */

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}
/*
 * element.remove();
 * https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
 */


(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty("remove")) {
      return;
    }

    Object.defineProperty(item, "remove", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
/*
 * Array.includes()
 * https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js
 */


if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    value: function value(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);
      var len = o.length >>> 0;

      if (len === 0) {
        return false;
      }

      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y);
      }

      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }

        k++;
      }

      return false;
    }
  });
}
/*
 * String.includes()
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
 */


if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    "use strict";

    if (search instanceof RegExp) {
      throw TypeError("first argument must not be a RegExp");
    }

    if (start === undefined) {
      start = 0;
    }

    return this.indexOf(search, start) !== -1;
  };
}
/*
 * Object.entries()
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 */


if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array

    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
  };
}
/*
 * Object.values()
 */


if (!Object.values) {
  Object.values = function (obj) {
    var vals = Object.keys(obj).map(function (e) {
      return obj[e];
    });
    return vals;
  };
}
/**
 * Get a random value from an array [1,2,3,4] -> ?
 * return {mixed}
 */

/* Array.prototype.getRandomVal = function () {
    return this[Math.floor(Math.random() * this.length)];
};
 */
// String

/**
 * trim a string down and add ... to the end if exceeds max
 * return {string}
 */

/* String.prototype.trunc = String.prototype.trunc || function (maxChars, readMorePath) {
    return (this.length > maxChars) ?
        this.substr(0, maxChars - 1) + '&hellip; ' + ((readMorePath) ? ' <a href="' + readMorePath + '" class="more">Read more</a>' : '') :
        this.toString();
}; */

/**
 * Convert string to slugified version e.g. "Hello world!" -> "hello-world"
 * return {string}
 */

/* String.prototype.slugify = function () {
    var str = this;

    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
    return str;
}; */

/**
 * Will split a string and take the first element
 * e.g. "Fish bambinos | About | UoS" -> "Fish bambinos"
 * param delmiter {string} e.g. , or | or something else
 * return {string}
 */

/* String.prototype.getFirstFromSplit = function (delimiter) {
    if (this.indexOf(delimiter) > -1) {
        return this.split(delimiter)[0].trim();
    }
    return this;
}; */

/**
 * Remove html tags from a string
 * return {string}
 */

/* String.prototype.stripTags = function () {
    return this.replace(/(<([^>]+)>)/ig, "");
}; */
// Number

/** global prototype formatMoney function
 * param c {integer} count numbers of digits after sign
 * param d {string} decimals sign separator
 * param t {string} miles sign separator
 *
 *	example:
 *		(123456789.12345).formatMoney(2, ',', '.');
 *			=> "123.456.789,12" Latinoamerican moneyFormat
 */

/* Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}; */

/**
 * Generate an avatar image from letters
 */


(function (w, d) {
  function AvatarImage(letters, color, size) {
    var canvas = d.createElement('canvas');
    var context = canvas.getContext("2d");
    var size = size || 60; // // Generate a random color every time function is called
    // var color =  "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
    // Set canvas with & height

    canvas.width = size;
    canvas.height = size; // Select a font family to support different language characters
    // like Arial

    context.font = Math.round(canvas.width / 2) + "px Arial";
    context.textAlign = "center"; // Setup background and front color

    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFF";
    context.fillText(letters, size / 2, size / 1.5); // Set image representation in default format (png)

    dataURI = canvas.toDataURL(); // Dispose canvas element

    canvas = null;
    return dataURI;
  }

  w.AvatarImage = AvatarImage;
})(window, document);

(function (w, d) {
  function generateAvatars() {
    var images = d.querySelectorAll('img[data-letters]');

    for (var i = 0, len = images.length; i < len; i++) {
      var img = images[i];
      img.src = AvatarImage(img.getAttribute('data-letters'), img.getAttribute('data-color'), img.getAttribute('width'));
      img.removeAttribute('data-letters');
    }
  }

  d.addEventListener('DOMContentLoaded', function (event) {
    generateAvatars();
  });
})(window, document);
/**
 * Site wide tools
 */


var AvatarImageSVG = function () {
  // PRIVATE

  /**
   * Get initials from name E.g. "Robert Morrison" ( -> RM icon)
   * @param name {string}
   * @return string Initials e.g. RM
   */
  var _initials = function _initials(name) {
    if (typeof name == "undefined" || name == "Unknown name") return "";
    var nameChunk = name.split(" ");
    return nameChunk[0].charAt(0) + nameChunk[nameChunk.length - 1].charAt(0);
  };
  /**
   * Generate the html for svg initials icon from name
   * @param alpha {string}
   * @return integer
   */


  var _hue = function _hue(alpha) {
    if (typeof alpha == "undefined") return 0;
    return 360 * (1 / 26 * (alpha.toLowerCase().charCodeAt(0) - 96)) - 0.01;
  }; // PUBLIC

  /**
   * Generate the html for svg initials icon from name
   * @param id {string} ?
   * @param name {string} E.g. "Robert Morrison" ( -> RM icon)
   * @return string SVG HTML
   */


  var _generateIcon = function _generateIcon(id, name) {
    var hue = _hue(name);

    var initials = _initials(name);

    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" width="158" height="158">' + '<defs><style type="text/css">.st1{fill:#FFFFFF;}.st3{font-size:102.68px;}</style></defs>' + '<linearGradient id="SVGID_' + id + '_" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="300" y2="0">' + '	<stop offset="0" style="stop-color:#FFFFFF; stop-color:hsl(' + hue + ', 33%, 40%)"/>' + '	<stop offset="1" style="stop-color:#CCCCCC; stop-color:hsl(' + hue + ', 33%, 60%)"/>' + '</linearGradient>' + '<rect x="0" y="0" style="fill:url(#SVGID_' + id + '_);" width="300" height="300"/>' + '<title>' + name + '</title>' + '<text x="50%" y="50%" class="st1 st3" alignment-baseline="central" dominant-baseline="central" text-anchor="middle">' + initials + '</text>' + '</svg>';
  };

  return {
    generateIcon: _generateIcon
  };
}();
/**
 * useful function for getting/setting the query url params in the address bar
 * @author Martyn Bissett <martyn.bissett1@stir.ac.uk>
 * @author Robert Morrison <r.w.morrison@stir.ac.uk>
 * 
 * Updated 2022-02-14
 * - Fix unnecessary History API push-states (i.e. only push when the URL actually changes).
 * - Add URI encoding (e.g. if the user-submitted content contains `&` etc).
 * 
 */
// TODO reload is false by default? check other pages not dependant on this being true


var QueryParams = function () {
  /**
   * This can be replaced when running tests
   * @var {function}
   */
  var _pushStateHandler = function _pushStateHandler(url) {
    history.pushState(null, null, url);
  };
  /**
   * To swap _pushStateHandler when running tests
   * @var {function} handler Handler for mocking(?) push state
   */


  var _setPushStateHandler = function _setPushStateHandler(handler) {
    _pushStateHandler = handler;
  };
  /**
   * Get single query param from url
   * @param {string} name
   * @param {string} defaultValue
   * @param {string} url (optional)
   */


  function _get(name, defaultValue, url) {
    if (typeof url === "undefined") url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return defaultValue;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  /**
   * Get single query param from url
   * @param {string} url (optional)
   * @returns {object}
   */


  function _getAll(queryString) {
    if (typeof queryString === "undefined") queryString = window.location.search;
    var obj = {};
    queryString.substring(1).replace(/([^=&]+)=([^&]*)/g, function (m, key, value) {
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return obj;
  }
  /**
   * Same as _getAll but returns an array of objects rather than pure object
   * @param {string} url (optional)
   * @returns {object}
   */


  function _getAllArray(queryString) {
    if (typeof queryString === "undefined") queryString = window.location.search;
    var arr = [];
    queryString.substring(1).replace(/([^=&]+)=([^&]*)/g, function (m, key, value) {
      var obj = {
        name: decodeURIComponent(key),
        value: decodeURIComponent(value)
      };
      arr.push(obj);
    });
    return arr;
  }
  /**
   * Will update a param match from a given url
   * @param {string} url Url query string e,g, "path/to/res?name=value"
   * @param {string|object} name Name of param to update, or name/value pairs object for multiples
   * @param {string} value New value
   * @returns {string}
   */


  function _updateQueryStringParameter(url, name, value) {
    // we'll assume a name/value object for the rest of this script
    var values = {};

    if (typeof name === "string") {
      values[name] = value;
    } else {
      values = name;
    }

    for (var name in values) {
      if (values.hasOwnProperty(name)) {
        value = values[name];
        var re = new RegExp("([?&])" + name + "=.*?(&|#|$)(.*)", "gi"),
            hash;

        if (re.test(url)) {
          if (typeof value !== "undefined" && value !== null) url = url.replace(re, "$1" + name + "=" + encodeURIComponent(value) + "$2$3");else {
            hash = url.split("#");
            url = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
            if (typeof hash[1] !== "undefined" && hash[1] !== null) url += "#" + hash[1];
          }
        } else {
          if (typeof value !== "undefined" && value !== null) {
            var separator = url.indexOf("?") !== -1 ? "&" : "?";
            hash = url.split("#");
            url = hash[0] + separator + name + "=" + encodeURIComponent(value);
            if (typeof hash[1] !== "undefined" && hash[1] !== null) url += "#" + hash[1];
          }
        }
      }
    }

    return url;
  }
  /**
   * Set value in query string
   * @param {string} name Name of param to update
   * @param {string} value New value
   * @param {boolean} reload
   */


  function _set(name, value, reload, queryString) {
    if (typeof queryString === "undefined") queryString = document.location.search;

    var newQueryString = _updateQueryStringParameter(queryString, name, value);

    if (newQueryString !== queryString) _pushStateHandler(newQueryString);

    if (reload) {
      window.location.href = document.location.href;
    }
  }
  /**
   * Will remove a param match from a given url
   * @param {string} url Url query string e,g, "path/to/res?name=value"
   * @param {string} name Name of param to remove eg. name
   * @returns {string}
   */


  function _removeURLParameter(url, name) {
    // if (!url) url = window.location.href;
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split("?");

    if (urlparts.length >= 2) {
      var prefix = encodeURIComponent(name) + "=";
      var pars = urlparts[1].split(/[&;]/g); //reverse iteration as may be destructive

      for (var i = pars.length; i-- > 0;) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      url = urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
      return url;
    } else {
      return url;
    }
  }
  /**
   * Remove param by name
   * @param {string} name Name of param to update
   * @param {boolean} reload
   */
  // TODO use document..search? instead of href


  function _remove(name, reload, url) {
    if (typeof url === "undefined") url = window.location.href;

    var newUrl = _removeURLParameter(url, name);

    if (newUrl !== url) _pushStateHandler(newUrl);

    if (reload) {
      window.location.href = document.location.href;
    }
  }

  return {
    get: _get,
    getAll: _getAll,
    getAllArray: _getAllArray,
    set: _set,
    remove: _remove,
    setPushStateHandler: _setPushStateHandler
  };
}();
/**
 * Allows a single call to be made to fetch data and then that same data re-used
 * multiple times. Useful were we want to cut down on api calls due to usage restrictions
 */

/* var UoS_ServiceQ = (function() {

	var ServiceQ = function(options) {

		var _this = this;

		
		//@var {object} Set default options
		this.options = $.extend(true, {

			// method to get data, can be overwriten (e.g. fetch from cookie)
			getCacheData: function() {
				return _this.data;
			},

			// method to set data, can be overwriten (e.g. set to cookie)
			setCacheData: function(data) {
				_this.data = data;
			}

		}, options, {

			request: {

				// what to do with data when we receive it
				success: function( data ) {
					_this.readyState = 2;
					_this.options.setCacheData(data);
					_this.do();
				}

			}

		});
		
		//@var {object} This will store the cached info
		this.data = null;

		//@var {boolean} First call = 0; In progress = 1; Ready = 2
		this.readyState;

		//@var {boolean} If we have a load of requests, then we wanna queue success handlers
		this.queue = [];

		// make ajax call on instatiation here if required
		var data = this.options.getCacheData();
		if (data) {
			this.readyState = 2;
		} else {
			this.readyState = 1; // in progress
			$.ajax(this.options.request);
		}

	};

	ServiceQ.prototype.do = function(success) {

		// queue this handler
		if (typeof success === "function") this.queue.push(success);

		// only if status is complete will we proceed to call each in the queue
		if (this.readyState === 2) {
			var data = this.options.getCacheData();
			while (this.queue.length) {
				this.queue.shift()(data);
			};
		}

	};

	return ServiceQ;

})(); */

/**
 * ...
 */
//var UoS_AWD = (function() {
//var AWD = function(options) {

/**
 * @var {object} Set default options
 */
// object defaults

/* this.options = {
	breakpoints : ["small", "medium", "large"],
	getCurrent: function() { return undefined; },
	run_once: true
};
*/
// overwrite the defaults with any new vals

/* for(var index in options) 
	this.options[index] = options[index]; */

/*
// jQuery original (Martyn)
this.options = $.extend(true, {
		breakpoints: ["small", "medium", "large"],
		// method to get current breakpoint
    getCurrent: function() {
		return undefined;
	},
		// allows the handlers to be run multiple times
	run_once: true
	}, options);
*/
//};

/**
 * This is public so that we can test it
 */

/* AWD.prototype.compare = function(operator, current) {
		var opParts = operator.split(" ");
	var breakpoints = this.options.breakpoints;
		switch (opParts[1]) { // e.g. "up"
		case "only":
			return opParts[0] === current;
		case "up":
			return breakpoints.indexOf(opParts[0]) <= breakpoints.indexOf(current);
		case "down":
			return breakpoints.indexOf(opParts[0]) >= breakpoints.indexOf(current);
		default:
			console.log("AWD error: invalid operator");
	}
	};
	AWD.prototype.adaptTo = function(breakpoint, handler) {
	var _this = this;
	var options = this.options;
	    // load on page load
    if (_this.compare(breakpoint, options.getCurrent())) {
		if (!handler.__uos_awd__initialized || !options.run_once) {
			handler();
			handler.__uos_awd__initialized = true;
		}
	}
		// ...also on resize (if not already loaded)
	window.onresize = function(e){ 
		if (_this.compare(breakpoint, options.getCurrent())) {
				// if this handler has been run already, don't run again?
			if (!handler.__uos_awd__initialized || !options.run_once) {
				handler();
				handler.__uos_awd__initialized = true;
			}
		}
	};
	};
	return AWD; */
//})();

/**
 * Module for grouping util functions 
 * @author Martyn Bissett <martyn.bissett1@stir.ac.uk>
 */
// REMOVED 2020-11-11: not in use -- r.w.morrison@stir.ac.uk
//var UoS_Utils = (function () {

/**
 * Whitelist an object keys from a given array of keys
 * @param obj {Object} The object to build the new object from
 * @param whitelist {Array} e.g. [""]
 */

/* var _whitelistObjectKeys = function(obj, whitelist) {
	var newObj = {};
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && whitelist.indexOf(key) > -1) {
			newObj[key] = obj[key];
		}
	}
	return newObj;
} */

/**
 * Blacklist an object keys from a given array of keys
 * @param obj {Object} The object to build the new object from
 * @param blacklist {Array} e.g. [""]
 */

/* var _blacklistObjectKeys = function(obj, blacklist) {
	var newObj = {};
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && blacklist.indexOf(key) < 0) {
			newObj[key] = obj[key];
		}
	}
	return newObj;
} */

/* return {
	whitelistObjectKeys: _whitelistObjectKeys,
	blacklistObjectKeys: _blacklistObjectKeys
}; */
//}());


var UoS_StickyWidget = function () {
  var StickyWidget = function StickyWidget(element) {
    if (!element) return;
    this.element = element;
    this.offset = element.getAttribute("data-offset");
    this.trigger = this.setTrigger(element.getAttribute('data-observe'));
    this.offsetRatio = 0;
    this.controls = {
      close: element.querySelectorAll('[data-close]')
    };
    var that = this;
    this.offset && element.classList.add("offset" + this.offset);
    recentreOffset();

    this.callback = function (entry) {
      // entry.intersectionRatio -1 means intersection not supported (IE etc):
      if (entry.intersectionRatio < 0) return this.element.setAttribute("data-sticky-polyfill", true); // we're only interested in intersections above the viewport

      if (entry.boundingClientRect.y > entry.rootBounds.y) {
        this.element.classList.remove("stuck");
        /* this.element.classList.remove("flush"); */

        return;
      }

      if (entry.intersectionRatio >= 0 && entry.intersectionRatio <= this.offsetRatio) return this.element.classList.add("stuck");
      this.element.classList.remove("stuck");
    };

    this.observer = stir.createIntersectionObserver({
      element: this.trigger,
      threshold: [0, this.offsetRatio, 0.9],
      callback: this.callback.bind(this)
    });

    function getElementHeight() {
      var height;
      var display = element.style.display || ''; // temporarily make sure element is displayed:

      element.style.display = 'block'; // get the height value

      height = Number(element.clientHeight); // reset the style

      element.style.display = display;
      return height;
    }

    function recentreOffset(e) {
      if (!element.getAttribute("data-offset")) return;
      var height = getElementHeight();

      if (height > 0) {
        that.offsetRatio = height / 2 / height;
      } // set margins top and bottom to balance the overlap with the
      // button's actual height (except on mobile, no margin):


      if (window.stir && stir.MediaQuery && stir.MediaQuery.current !== "small") {
        element.style.marginTop = element.style.marginBottom = 0 - height / 2 + "px";
      } else {
        element.style.marginTop = element.style.marginBottom = 0;
      }
    }

    this.hideyslidey = function () {
      if ("IntersectionObserver" in window) this.element.style.marginBottom = (-1 * getElementHeight()).toString() + "px";
    };

    {
      // Init stuff:
      for (var closer in this.controls.close) {
        if (this.controls.close.hasOwnProperty(closer)) {
          this.controls.close[closer].addEventListener("click", function (event) {
            event.preventDefault();
            element.parentElement.removeChild(element);
          });
        }
      }

      if (this.element.classList.contains('u-hidey-slidey')) {
        var zIndex = Number(window.getComputedStyle(this.element).getPropertyValue("z-index"));
        this.trigger.style.zIndex = ++zIndex;
        this.hideyslidey();
      }

      element.setAttribute("data-initialised", true);
      window.addEventListener("resize", stir.debounce(recentreOffset, 400));
    }
  };
  /**
   * Sticky widgets can define the DOM element they want to observe to trigger sticky behaviour
   * or the previous sibling can be used as a default.
   * 
   * @param {String} observe selector that defines the DOM element to observe
   */


  StickyWidget.prototype.setTrigger = function setTrigger(observe) {
    var trigger;

    if (observe) {
      trigger = document.querySelector(observe);
    }

    trigger = trigger || this.element.previousElementSibling;

    if (trigger.clientHeight == 0) {
      // if the previous sibling has zero height, use the previous-previous one instead.
      trigger = trigger.previousElementSibling;
    }

    this.offset && trigger.setAttribute('data-has-overlapper', this.offset);
    return trigger;
  };

  return StickyWidget;
}();

var stir = stir || {};

stir.capitaliseFirst = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
/*
 * Function: Ajax Helper Function
 **/


stir.load = function (url, callback) {
  if (typeof url == "undefined") return;
  if (typeof callback != "function") callback = function callback() {};
  var request = new XMLHttpRequest();
  request.open("GET", url, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback.call(null, request.responseText);
    } else {
      callback.call(null, {
        error: {
          status: request.status,
          statusText: request.statusText
        }
      });
    }
  };

  request.onerror = function (event) {
    callback.call(null, {
      error: event
    });
  };

  request.ontimeout = function (event) {
    callback.call(null, {
      error: event
    });
  };

  request.send();
  return request;
};

stir.getJSONp = function (url, onload, onerror) {
  if (typeof url == "undefined") return;
  var script = document.createElement("script");
  if ("function" === typeof onload) script.onload = onload;
  if ("function" === typeof onerror) script.onerror = onerror;
  script.src = url;
  document.head.appendChild(script);
};

stir.loadAuthenticated = function (url, callback) {
  if (typeof url == "undefined") return;
  if (typeof callback != "function") callback = function callback() {};
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.withCredentials = true;

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback.call(null, request.responseText);
    } else {
      callback.call(null, {
        error: {
          status: request.status,
          statusText: request.statusText
        }
      });
    }
  };

  request.onerror = function (event) {
    callback.call(null, {
      error: event
    });
  };

  request.ontimeout = function (event) {
    callback.call(null, {
      error: event
    });
  };

  request.send();
  return request;
};

stir.getJSON = function (url, callback) {
  return stir.load(url, function (data) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      data = {
        error: error
      };
    }

    callback.call(null, data);
  });
};

stir.getJSONAuthenticated = function (url, callback) {
  stir.loadAuthenticated(url, function (data) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      data = {
        error: error
      };
    }

    callback.call(null, data);
  });
};

stir.Math = {
  fileSize: function fileSize(bytes, fixedPoint) {
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(isNaN(fixedPoint) ? 2 : fixedPoint) * 1 + ["B", "kB", "MB", "GB", "TB"][i];
  },
  random: function random(max) {
    return Math.floor(Math.random() * max);
  }
};
stir.Number = {
  clamp: function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  },
  formatMoney: function formatMoney(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }
};
stir.String = {
  rot: function rot(s, i) {
    // modified for general rot# from
    // http://stackoverflow.com/a/617685/987044
    return s.replace(/[a-zA-Z]/g, function (c) {
      return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + i) ? c : c - 26);
    });
  },
  slug: function slug(input) {
    return String(input).toLowerCase().replace(/[^a-z]+/g, "-");
  },
  embolden: function boldicise(haystack, needle) {
    return haystack.replace(new RegExp(needle, "gi"), "<b>" + needle + "</b>"); //legit use of <b> not <strong>
  },
  truncate: function truncate(n, useWordBoundary) {
    if (this.length <= n) {
      return this;
    }

    var subString = this.substr(0, n - 1);
    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "&hellip;";
  },
  htmlEntities: function htmlEntities(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  },
  stripHtml: function stripHtml(dirtyString) {
    var doc = new DOMParser().parseFromString(dirtyString, "text/html");
    return doc.body.textContent || "";
  },
  getFirstFromSplit: function getFirstFromSplit(delimiter) {
    if (this.indexOf(delimiter) > -1) {
      return this.split(delimiter)[0].trim();
    }

    return this;
  },
  fixHtml: function () {
    /**
     * fixHtml() is intended to fix broken/partial HTML strings coming from the
     * Degree Program Tables (SSoCI) and possibly other short snippets of HTML.
     * As a side-effect it could be used to strip out non-text content such as
     * <script> tags, for example. Relies on three internal helper functions,
     * domify(), wrapRawNodes() and removeEmptyElements().
     */

    /**
     * Use the browser's DOM parser to make sense of the HTMLString, but away from the
     * main DOM so we can make further adjustments. Returns an HTMLDocument's body element.
     */
    function domify(HTMLString) {
      return new DOMParser().parseFromString(HTMLString, "text/html").body;
    }
    /**
     * Wrap any raw (i.e. text content) nodes into <p> tags. This is immediate
     * children only, not recursive.
     */


    function wrapRawNodes(DomEl) {
      if (!DomEl || !DomEl.childNodes) return;
      Array.prototype.forEach.call(DomEl.childNodes, function (node) {
        if (3 === node.nodeType || "A" === node.nodeName) {
          var p = document.createElement("p");
          node.parentNode.insertBefore(p, node);
          p.appendChild(node);
        }
      });
      return DomEl;
    }
    /**
     * SSoCI entries tend to have mismatched </p> tags which leads to
     * empty <p></p> tag pairs. We'll strip them out:
     */


    function removeEmptyElements(DomEl) {
      if (!DomEl || !DomEl.childNodes) return;
      Array.prototype.forEach.call(DomEl.childNodes, function (node) {
        if (1 === node.nodeType && "" === node.innerText) {
          DomEl.removeChild(node);
        }
      });
      return DomEl;
    }
    /**
     * This is the only exposed function within fixHTML.
     * @param dirtyString {String} This is the input HTML in string format.
     * @param returnDomFrag {Boolean} return a DOM fragment instead of a string. Defaults to string.
     */


    return function fixHtml(dirtyString, returnDomFrag) {
      var domNodes = removeEmptyElements(wrapRawNodes(domify(dirtyString)));
      var frag = document.createDocumentFragment();

      while (domNodes.firstChild) {
        frag.appendChild(domNodes.firstChild);
      }

      domify();
      return returnDomFrag ? frag : frag.textContent;
    };
  }()
};
stir.Array = {
  oxfordComma: function oxfordComma(items, oxford, adjoiner) {
    var nonEmptyItems = items.filter(function (item) {
      return item;
    });
    return nonEmptyItems.length > 1 ? [nonEmptyItems.slice(0, -1).join(", "), nonEmptyItems.slice(-1)].join((oxford ? "," : "") + (adjoiner ? " " + adjoiner + " " : " and ")) : nonEmptyItems.slice(-1).toString();
  },
  getRandomVal: function getRandomVal() {
    return this[Math.floor(Math.random() * this.length)]; // example usage: var randomItem = stir.Array.getRandomVal.call( arrayOfItems );
  }
};
stir.Object = {
  extend: function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
      }
    }

    return out;
  }
}; // e.g. stir.Object.extend({}, objA, objB);

/**
 * DATE HANDLING
 */

stir.Date = function () {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; //const abrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var abrDay = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  var newsDate = function newsDate(date) {
    return "".concat(date.getDate(), " ").concat(months[date.getMonth()], " ").concat(date.getFullYear());
  };

  var galleryDate = function galleryDate(date) {
    return "".concat(abrDay[date.getDay()], " ").concat(date.getDate(), " ").concat(months[date.getMonth()].slice(0, 3), " ").concat(date.getFullYear());
  };

  var funnelbackDate = function funnelbackDate(date) {
    return "".concat(date.getDate()).concat(months[date.getMonth()].slice(0, 3)).concat(date.getFullYear());
  };

  var timeElementDatetime = function timeElementDatetime(date) {
    return "".concat(date.getFullYear(), "-").concat(("0" + (date.getMonth() + 1)).slice(-2), "-").concat(("0" + date.getDate()).slice(-2));
  };

  var time24 = function time24(date) {
    return "".concat(date.getHours(), ":").concat((date.getMinutes() + "0").slice(0, 2));
  };

  var swimTimetable = function swimTimetable(date) {
    return "".concat(days[date.getDay()], ": ").concat(date.getDate(), " ").concat(months[date.getMonth()]);
  };

  return {
    newsDate: newsDate,
    galleryDate: galleryDate,
    funnelbackDate: funnelbackDate,
    time24: time24,
    timeElementDatetime: timeElementDatetime,
    swimTimetable: swimTimetable
  };
}();

stir.formatStirDate = stir.Date.galleryDate;
/*
 * Function: Determine if a date is BST or GMT
 * Parameter should be a JavaScript Date Object
 */

stir.BSTorGMT = function (d) {
  var objBST = [{
    year: 2021,
    start: 20210328,
    end: 20211031
  }, {
    year: 2022,
    start: 20220327,
    end: 20221030
  }, {
    year: 2023,
    start: 20230326,
    end: 20231029
  }, {
    year: 2024,
    start: 20240331,
    end: 20241027
  }, {
    year: 2025,
    start: 20250330,
    end: 20251026
  }, {
    year: 2026,
    start: 20260329,
    end: 20261025
  }, {
    year: 2027,
    start: 20270328,
    end: 20271031
  }, {
    year: 2028,
    start: 20280326,
    end: 20281029
  }, {
    year: 2029,
    start: 20290325,
    end: 20291028
  }];

  if (Object.prototype.toString.call(d) === "[object Date]") {
    var start, end;
    var year = String(d.getFullYear());
    var month = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    var date = parseInt(year + month + day);

    for (var i = 0; i < objBST.length; i++) {
      item = objBST[i];

      if (item.year === parseInt(year)) {
        start = item.start;
        end = item.end;
        break;
      }
    }

    if (date >= start && date <= end) return "BST";
    return "GMT";
  }

  console.error("Parameter one of stir.BSTorGMT() should be a JavaScript Date Object");
  return "";
};

stir.createDOMFragment = function (htmlStr) {
  if (!htmlStr) return;
  return document.createRange().createContextualFragment(htmlStr); //var frag = document.createDocumentFragment();
  //var temp = document.createElement("div");
  //temp.innerHTML = htmlStr;
  // while (temp.firstChild) {
  //   frag.appendChild(temp.firstChild);
  // }
  //return frag;
};

stir.createDOMElement = function (htmlStr) {
  if (!htmlStr) {
    return;
  }

  var temp = document.createElement("div");
  temp.innerHTML = htmlStr;
  return temp;
};

stir.addScript = function (src) {
  var script = document.createElement("script");
  script.src = src;
  document.body.insertAdjacentElement("beforeend", script);
};

stir.addStyle = function (href) {
  var link = document.createElement("link");
  link.href = href;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.insertAdjacentElement("beforeend", link);
};

stir.animate = function (el, animation) {
  if (!el) return;
  if ("undefined" == el.classList) return;

  switch (animation) {
    case "slideDown":
      el.classList.add("animation__show");
      el.classList.add("animation__slidedown");
      el.classList.remove("animation__hide");
      break;
  }
};
/*
 * Observe a DOM element, and trigger a function when it
 * scrolls (past a given threshold) into view.
 *
 * @param options object properties:
 * element – the element we want to observe
 * threshold – how far into the viewport it must scroll to trigger the function
 * callback – the function to be triggered
 */


stir.createIntersectionObserver = function (options) {
  if (!options) return;
  var thresholds = options.threshold || [0.7]; //set a default threshold

  var callbacks = [];
  if (_typeof(thresholds) != "object") thresholds = [thresholds];

  if ("function" != typeof options.callback) {
    options.callback = function (intersectionObserverEntry) {
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(options.element, intersectionObserverEntry);
      }
    };
  } // just trigger the callback now if IntObs not available…


  if (!("IntersectionObserver" in window)) {
    return options.callback.call(options.element, {
      intersectionRatio: -1
    });
  } // …otherwise we'll queue it up to be triggered on-scroll:


  var observer = new IntersectionObserver(function (entries) {
    for (var id in entries) {
      if (entries.hasOwnProperty(id)) {
        options.callback.call(entries[id].target, entries[id]);
      }
    }
  }, {
    root: options.root || null,
    threshold: thresholds
  }); // attach the observer to the observee

  options.element && observer.observe(options.element);

  var _setClassAdd = function _setClassAdd(classname) {
    callbacks.push(function (intersectionObserverEntry) {
      for (var i = 0; i < thresholds.length; i++) {
        if (intersectionObserverEntry.intersectionRatio >= thresholds[i]) {
          options.element.classList.add(classname);
        }
      }
    });
    return this;
  };

  var _setClassRemove = function _setClassRemove(classname) {
    callbacks.push(function (intersectionObserverEntry) {
      for (var i = 0; i < thresholds.length; i++) {
        if (intersectionObserverEntry.intersectionRatio >= thresholds[i]) {
          options.element.classList.remove(classname);
        }
      }
    });
    return this;
  };

  var _setClassToggle = function _setClassToggle(classname) {
    callbacks.push(function () {
      if (options.element.classList.contains(classname)) {
        options.element.classList.remove(classname);
      } else {
        options.element.classList.add(classname);
      }
    });
    return this;
  }; // return a reference to the observer in case we want to
  // do something else with it, e.g. add more observees:


  return {
    observer: observer,
    setClassToggle: _setClassToggle,
    setClassAdd: _setClassAdd,
    setClassRemove: _setClassRemove
  };
};

stir.cardinal = function () {
  var numberWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return function cardinal(ordinal) {
    return numberWords[parseInt(ordinal)] || "";
  };
}(); // is an element currently visible or not


stir.elementIsHidden = function (el) {
  var style = window.getComputedStyle(el);
  return style.display === "none" || style.visibility === "hidden";
};
/* 
  Feedback message used by various scripts
*/


stir.getMaintenanceMsg = function () {
  var node = document.createElement("div");
  node.appendChild(stir.createDOMFragment("\n      <div class=\"callout\">\n        <h3 class=\"header-stripped\">Offline for maintenance</h3>\n        <p>We are carrying out some essential maintenance work on our website today, which means that \n        some of our web pages are currently unavailable. We&rsquo;re sorry for any inconvenience and we \n        hope to restore full service as soon as possible.</p>\n        <p>See how to <a href=\"https://www.stir.ac.uk/about/contact-us/\">contact us</a></p>\n      </div>"));
  return node.firstElementChild;
}; // Scroll the window to the element's position
// Offset is optional.


stir.scrollToElement = function (el, offsetUp) {
  offsetUp = offsetUp || 0;
  stir.scrollTo(el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offsetUp, 0);
}; // Detects browser then use the supported method of window.scroll()


stir.scroll = function () {
  if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident/7.0") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
    return function (y, x) {
      if (this.scroll) {
        this.scroll(x, y);
      } else {
        this.scrollLeft = x;
        this.scrollTop = y;
      }
    };
  }

  return function (top, left) {
    this.scroll({
      top: top,
      left: left,
      behavior: "smooth"
    });
  };
}();

stir.scrollTo = stir.scroll.bind(null);
stir.research = {
  hub: function () {
    var orgUnitFacultyMap = {
      "Faculty of Arts and Humanities": ["Arts", "Communications, Media and Culture", "English Studies", "History and Politics", "Literature and Languages", "Law and Philosophy", "Philosophy", "French", "History", "Law", "Politics", "Religion", "Spanish"],
      "Faculty of Health Sciences and Sport": ["Health Sciences Stirling", "Sport", "Institute for Social Marketing", "NMAHP"],
      "Faculty of Natural Sciences": ["Computing Science", "Institute of Aquaculture", "Biological and Environmental Sciences", "Psychology", "Computing Science and Mathematics", "Machrihanish"],
      "Faculty of Social Sciences": ["Education", "Sociology, Social Policy & Criminology", "Social Work", "Dementia and Ageing", "Dementia Services Development Centre"],
      "Stirling Management School": ["Accounting & Finance", "Economics", "Management, Work and Organisation", "Marketing & Retail"]
    };

    var getFacultyFromOrgUnitName = function getFacultyFromOrgUnitName(oUName) {
      var name = oUName.replace(" - Division", "");

      for (var faculty in orgUnitFacultyMap) {
        if (name == faculty || orgUnitFacultyMap[faculty].indexOf(name) >= 0) {
          return faculty;
        }
      }

      return "University of Stirling";
    };

    return {
      getFacultyFromOrgUnitName: getFacultyFromOrgUnitName
    };
  }()
};
/*
 * Manager class for loading activity indicator.
 */

stir.Spinner = function Spinner(el) {
  this.element = document.createElement("div");
  this.element.classList.add("c-search-loading__spinner");
  this.element.classList.add("show-for-medium");
  this.element.classList.add("hide");

  if (el && el.nodeType === 1) {
    el.appendChild(this.element);
  }

  this.show = function () {
    this.element.classList.remove("hide");
  };

  this.hide = function () {
    this.element.classList.add("hide");
  };
};
/*
 * Manager class for "togglable widgets" i.e. the search box and results panel.
 */


stir.ToggleWidget = function ToggleWidget(el, showClass, hideClass) {
  this.show = function show() {
    el.removeAttribute("aria-hidden");
    el.removeAttribute("tabindex");
    showClass && el.classList.add(showClass);
    hideClass && el.classList.remove(hideClass);
  };

  this.hide = function hide() {
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("tabindex", "-1"); //  Firefox needs this if the element has overflow

    hideClass && el.classList.add(hideClass);
    showClass && el.classList.remove(showClass);
  };

  this.hidden = function visible() {
    return el.hasAttribute("aria-hidden") ? true : false;
  };
  /* this.toggle = function toggle() {
        if(this.hidden) {
            this.show();
        } else {
            this.hide();
        }
    } */

};
/*
 * Debounce function from Underscore.js (via David Walsh blog).
 * Creates and returns a new debounced version of the passed function
 * which will postpone its execution until after `wait` milliseconds
 * have elapsed since the last time it was invoked. Useful for implementing
 * behavior that should only happen after the input has stopped arriving.
 * Pass true for the immediate argument to cause debounce to trigger the
 * function on the *leading* instead of the trailing edge of the wait
 * interval. Useful in circumstances like preventing accidental
 * double-clicks on a "submit" button from firing a second time.
 * Examples: wait until the user stops typing before launching a
 * search query. Wait until the user has stopped scrolling before
 * triggering (an expensive) layout repaint.
 * @param {*} func expensive or slow function to call
 * @param {*} wait length of time in miliseconds to wait
 * @param {*} immediate trigger with first rather than last event
 */


stir.debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

stir.lazy = function (targets) {
  if (!targets) return;
  var observer; // The action to be carried out when lazy-loading is triggered.

  function lazyAction(element) {
    // (i) image src-swap method:
    if (element.hasAttribute("data-img-src")) {
      return element.setAttribute("src", element.getAttribute("data-img-src")); // (Using `.getAttribute()` here instead of `.dataset` for better browser support.)
    } // (ii) noscript content-import method:


    Array.prototype.forEach.call(element.querySelectorAll('noscript[data-load="lazy"]'), function (item) {
      // Extract dormant HTML code from inside the noscript, and append it to the DOM:
      item.insertAdjacentHTML("beforebegin", item.innerText.trim().toString()); // …then remove the noscript tag:

      item.parentNode.removeChild(item);
    });
  } // Only initialise the lazy-load observer if (i) we have lazy elements on
  // this page and (ii) if IntersectionObserver is supported.


  if (targets.length > 0) {
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.intersectionRatio > 0) {
            lazyAction(entry.target); // trigger lazy action

            observer.unobserve(entry.target); // stop observing this target once the action has been triggered
          }
        });
      });
    }

    for (var i = 0; i < targets.length; i++) {
      // Cue-up lazy-loading for each target, if observer is available.
      // If there's no observer (i.e. IE etc) just allow images to load non-lazily.
      if (observer) {
        // wait and observe
        observer.observe(targets[i]);
      } else {
        // trigger immediately
        lazyAction(targets[i]);
      }
    }
  }
};

stir.truncate = function truncate(options) {
  var wrapper = document.querySelector(options.selector);
  if (!wrapper) return;
  var modern = ("open" in document.createElement("details"));
  var elements = Array.prototype.slice.call(wrapper.children, options.start || 3);
  var trigger, accordion;

  trigger = function () {
    return modern ? document.createElement("summary") : document.createElement("button");
  }();

  accordion = function () {
    return modern ? document.createElement("details") : document.createElement("div");
  }();

  trigger.innerText = "Read more";
  accordion.classList.add("stir-content-expand");
  trigger.classList.add("stir-content-expander");

  if (elements.length > 1) {
    var last = options.offset ? elements.pop() : null;

    if (modern) {
      accordion.appendChild(trigger);
    } else {
      wrapper.appendChild(trigger);
    }

    wrapper.appendChild(accordion);
    last && wrapper.appendChild(last);

    for (var i = 0; i < elements.length; i++) {
      accordion.appendChild(elements[i]);
    }
  }

  if (modern) return;
  accordion.classList.add("show-for-sr");

  var toggleHandlerForIe = function toggleHandlerForIe(event) {
    accordion.classList.remove("show-for-sr");
    trigger.removeEventListener("click", toggleHandlerForIe);
    trigger.parentNode.removeChild(trigger);
  };

  trigger.addEventListener("click", toggleHandlerForIe);
};

stir.indexBoard = function () {
  var CHAR_CODE_RANGE = {
    start: 65,
    end: 90
  };
  var index = {};

  function reset() {
    for (var cc = CHAR_CODE_RANGE.start; cc <= CHAR_CODE_RANGE.end; cc++) {
      index[String.fromCharCode(cc)] = false;
    }
  }

  return function (element) {
    this.element = element || document.createElement("div");
    this.reset = reset;

    this.enable = function (key) {
      if (index.hasOwnProperty(key)) index[key] = true;
    };

    this.disable = function (key) {
      if (index.hasOwnProperty(key)) index[key] = false;
    };

    this.hide = function () {
      this.element.classList.remove("stir__slidedown");
      this.element.classList.add("stir__slideup");
    };

    this.show = function () {
      this.element.classList.remove("stir__slideup");
      this.element.classList.add("stir__slidedown");
    };

    this.update = function () {
      for (var key in index) {
        if (index.hasOwnProperty(key)) {
          var el = this.element.querySelector('[data-letter="' + key + '"]');

          if (index[key]) {
            el && el.removeAttribute("data-disabled");
          } else {
            el && el.setAttribute("data-disabled", true);
          }
        }
      }
    };
  };
}();
/*
   Helpers for document.querySelector / document.querySelectorAll
 */


stir.node = function (identifier) {
  return document.querySelector(identifier);
};

stir.nodes = function (identifier) {
  return Array.prototype.slice.call(document.querySelectorAll(identifier));
};
/*
  Safely replace the inner html of a node with new html
*/


stir.setHTML = function (node, html) {
  Array.prototype.slice.call(node.childNodes).forEach(function (node) {
    return node.remove();
  });
  if (!html) return;
  node.appendChild(stir.createDOMFragment(html));
};
/*
  Create a DOM node from a html string
*/


stir.stringToNode = function (htmlString) {
  return stir.createDOMFragment(htmlString).firstElementChild;
};
/* 
   FUNCTIONAL PROGRAMMING HELPERS
   ---
   Mostly obtained from Functional-Light-JS
   github.com/getify/Functional-Light-JS
   See FP Tests document for how to use
 */


var _isArray = Array.isArray;
var _keys = Object.keys;
/*
   Clone helper function
 */

stir.clone = function (input) {
  var out = _isArray(input) ? Array(input.length) : {};
  if (input && input.getTime) return new Date(input.getTime());

  for (var key in input) {
    var v = input[key];
    out[key] = _typeof(v) === "object" && v !== null ? v.getTime ? new Date(v.getTime()) : stir.clone(v) : v;
  }

  return out;
};
/*
   Identity helper function
 */


stir.identity = function (input) {
  return input;
};
/*
   Not helper function
 */


stir.not = function not(predicate) {
  return function negated() {
    return !predicate.apply(void 0, arguments);
  };
};
/*
   Partial helper function
 */


stir.partial = function (fn) {
  for (var _len = arguments.length, presetArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    presetArgs[_key - 1] = arguments[_key];
  }

  return function partiallyApplied() {
    for (var _len2 = arguments.length, laterArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      laterArgs[_key2] = arguments[_key2];
    }

    return fn.apply(void 0, presetArgs.concat(laterArgs));
  };
};
/*
   Compose helper function
 */


stir.compose = function () {
  for (var _len3 = arguments.length, fns = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    fns[_key3] = arguments[_key3];
  }

  return fns.reduceRight(function reducer(fn1, fn2) {
    return function composed() {
      return fn2(fn1.apply(void 0, arguments));
    };
  });
};
/*
   Curry helper function
 */


stir.curry = function (fn) {
  var arity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : fn.length;
  return function nextCurried(prevArgs) {
    return function curried() {
      for (var _len4 = arguments.length, nextArgs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        nextArgs[_key4] = arguments[_key4];
      }

      var args = [].concat(_toConsumableArray(prevArgs), nextArgs);

      if (args.length >= arity) {
        return fn.apply(void 0, _toConsumableArray(args));
      } else {
        return nextCurried(args);
      }
    };
  }([]);
};
/*
   Sort version that returns a new list
 */


stir.sort = stir.curry(function (fn, list) {
  if (typeof fn === "function") return stir.clone(list).sort(fn);
  return stir.clone(list).sort();
});
/*
   Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP etc)
 */

stir.range = function (start, stop, step) {
  return Array.from({
    length: (stop - start) / step + 1
  }, function (_, i) {
    return start + i * step;
  });
};
/*
   Deeply flattens an array. 
   eg [1, 2, [3, 30, [300]], [4] => [ 1, 2, 3, 30, 300, 4 ]
 */


stir.flatten = function (list, input) {
  var willReturn = input === undefined ? [] : input;

  for (var i = 0; i < list.length; i++) {
    if (_isArray(list[i])) {
      stir.flatten(list[i], willReturn);
    } else {
      willReturn.push(list[i]);
    }
  }

  return willReturn;
};

stir.removeDuplicates = stir.curry(function (data) {
  return data.filter(function (c, index) {
    return data.indexOf(c) === index;
  });
});
/*
   Helper - More readable than doing !isNaN double negative shenanigans
 */

stir.isNumeric = function (input) {
  return !isNaN(input);
};
/*
   Unbound and curried map filter reduce each etc functions
 */


stir.map = unboundMethod("map", 2);
stir.filter = unboundMethod("filter", 2);
stir.reduce = unboundMethod("reduce", 3);
stir.each = unboundMethod("forEach", 2);
stir.all = unboundMethod("every", 2);
stir.any = unboundMethod("some", 2);
stir.join = unboundMethod("join", 2);

function unboundMethod(methodName) {
  var argCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  return stir.curry(function () {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    var obj = args.pop();
    return obj[methodName].apply(obj, args);
  }, argCount);
}
/**
 * Google Analytics helpers
 */


stir.ga = function () {
  var trackingId = "UA-340900-19";

  var getClientId = function getClientId() {
    if (typeof window.ga == "undefined") return false;
    var trackers = ga.getAll ? ga.getAll() : [];

    for (var i = 0, len = trackers.length; i < len; i += 1) {
      if (trackers[i].get("trackingId") === trackingId) {
        return trackers[i].get("clientId");
      }
    }

    return false;
  };

  return {
    getClientId: getClientId
  };
}();
/*
 * Initiate foundation
 */
// jQuery(document).ready(function ($) {
//     $(document).foundation();
// });

/*
 * Environment object so we don't have to repeat switch commands with hostnames etc
 */


var UoS_env = function () {
  var hostname = window.location.hostname; // env_name e.g. "dev"

  var env_name = "prod";

  switch (hostname) {
    case "localhost":
    case "10.0.2.2":
      env_name = "dev";
      break;

    case "t4cms.stir.ac.uk":
      env_name = "preview";
      break;

    case "t4appdev.stir.ac.uk":
      env_name = "appdev-preview";
      break;

    case "www-stir.t4cms.stir.ac.uk":
      env_name = "pub";
      break;

    case "www-stir.t4appdev.stir.ac.uk":
      env_name = "dev-pub";
      break;

    case "mediadev.stir.ac.uk":
      env_name = "qa";
      break;
  } // webcomponents path e.g. "/webcomponents/"


  var wc_path = "/webcomponents/";

  switch (hostname) {
    case "localhost":
      wc_path = "/";
      break;
  }

  return {
    name: env_name,
    wc_path: wc_path
  };
}();
/*
 * This is our location service within ServiceQ. It is global so that it can be
 * used throughout the site
 */

/* var UoS_locationService = new UoS_ServiceQ({
    request: {
        url: "https://api.ipdata.co?api-key=aaa04e0dafd37c535ca70f6e84dbe4fd98333cd2cb33701044c75279",
        dataType: "jsonp",
    },
    getCacheData: function() {
        return Cookies.getJSON('UoS_LocationService__ipdata-data');
    },
    setCacheData: function(data) {
        Cookies.set('UoS_LocationService__ipdata-data', data);
    }
}); */
// this is a map of country code/names - taken from http://country.io/names.json

/* UoS_locationService.countryNames =
{"BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"};
 */
// list of other (not including uk) eu countries

/* UoS_locationService.euCountryNames = ["Austria", "Belgium", "Bulgaria", "Croatia", "Republic of Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"]; */

/*
 * This is a function to called when opening a widget, and contains handlers
 * to close other widgets. So we don't have to go through the entire site adding
 * widget close instructions everywhere, we can do it with a single call and just
 * update here
 * @param exception {string} The name here of the widget to ignore, but close others
 */


var UoS_closeAllWidgetsExcept = function () {
  var widgetRequestClose = document.createEvent("Event");
  widgetRequestClose.initEvent("widgetRequestClose", true, true);
  var handlers = {
    breadcrumbs: function breadcrumbs() {
      var bcItems = document.querySelectorAll(".breadcrumbs > li");
      if (bcItems) Array.prototype.forEach.call(bcItems, function (item) {
        item.classList.remove("is-active");
      });
    },
    courseSearchWidget: function courseSearchWidget() {
      var cs = document.getElementById("course-search-widget__wrapper");

      if (cs) {
        cs.classList.remove("stir__slidedown");
        cs.classList.add("stir__slideup");
      }
    },
    megamenu: function megamenu() {
      var hnp = document.querySelector(".c-header-nav--primary a");
      hnp && hnp.classList.remove("c-header-nav__link--is-active");
    },
    internalDropdownMenu: function internalDropdownMenu() {
      var idm = document.getElementById("internal-dropdown-menu");
      idm && idm.classList.remove("is-active");
    },
    internalSignpost: function internalSignpost() {
      var isds = document.getElementById("internal-signpost-dropdown__submenu");
      isds && isds.classList.add("hide");
      var isdl = document.getElementById("internal-signpost-dropdown__link");
      isdl && isdl.classList.remove("is-active");
    }
  };
  return function (exception) {
    // new way: dispatch a close request to any open (listening) widgets:
    document.dispatchEvent(widgetRequestClose); // old way: cycle through each close handler and close any widgets
    // other than the exception. Exception will be undefined if all widgets
    // are supposed to close.

    for (var name in handlers) {
      if (handlers.hasOwnProperty(name) && name !== exception) {
        handlers[name]();
      }
    }
  };
}();

document.body.addEventListener("click", UoS_closeAllWidgetsExcept);
/*
 * Helper object to let us do adaptive page loading (e.g. megamenu, mobile menu)
 * UoS_AWD is framework agnostic, so we'll pass in values from Foundation here
 */

/* (function () {

    window.uos_awd = new UoS_AWD({

        // as defined in scss e.g. ["small", "medium", "large", "xlarge", "xxlarge"]
        breakpoints: (function(queries) {
            var breakpoints = [];
            for (var i = 0; i < queries.length; i++) {
                breakpoints.push(queries[i]["name"]);
            }
            return breakpoints;
        })(Foundation.MediaQuery.queries),

        // method to get current breakpoint
        getCurrent: function() {
            return Foundation.MediaQuery.current;
        },
    });

})(); */

/*
 * Replaces the object from Foundation.util.MediaQuery.js
 * https://get.foundation/sites/docs/media-queries.html
 * eg Foundation.MediaQuery.current & Foundation.MediaQuery.get (not in use)
 * Just migrating what we use ie stir.MediaQuery.current and the dispatch event
 */

var stir = stir || {};

stir.MediaQuery = function () {
  var MediaQueryChangeEvent;
  var breakpoints = {
    small: 640,
    medium: 1024,
    large: 1240,
    xlarge: 1440,
    xxlarge: Infinity
  };
  /**
   * Get the current breakpoint eg "small", "medium" ...
   **/

  function getCurrent() {
    var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    for (var index in breakpoints) {
      if (breakpoints.hasOwnProperty(index) && vw <= breakpoints[index]) break;
    }

    return index;
  }
  /**
   * Check viewport size and dispatch an event if it
   * has changed since last time.
   */


  function checkCurrent() {
    var size = getCurrent();

    if (size !== stir.MediaQuery.current) {
      stir.MediaQuery.current = size;
      window.dispatchEvent(MediaQueryChangeEvent);
    }
  }
  /**
   * Set up custom event "MediaQueryChange".
   */


  if (typeof Event === "function") {
    MediaQueryChangeEvent = new Event("MediaQueryChange"); // Event API version
  } else {
    MediaQueryChangeEvent = document.createEvent("Event"); // IE version

    MediaQueryChangeEvent.initEvent("MediaQueryChange", true, true);
  }
  /**
   * Listen for (debounced) resize events and re-check the
   * viewport against the named breakpoints.
   **/


  window.addEventListener("resize", stir.debounce(checkCurrent, 400));
  /**
   * On load: Configure global stir.MediaQuery.current
   **/

  return {
    current: getCurrent()
  };
}();
/*
 * Alternative accordion component
 * Converts a T4 Link menu nav object with class accordion-listing.
 * @author: Ryan Kaye
 * @date: 2021-06-16
 * @version: 1
 */


(function (accordLists) {
  /*
   * Away we go: Get all accordions on page then loop all accordion components
   */
  if (!accordLists) return;
  Array.prototype.forEach.call(accordLists, function (item, index) {
    buildAccordion(item, index);
  });
  /*
   * Function: Config an accordion on load so its ready to use
   */

  function buildAccordion(item, index) {
    var headingId = "accordlist-control-" + index;
    var contentId = "accordlist-panel-" + index;
    var headings = item.querySelectorAll(".accordion-listing > ul > li > ul > li > a");
    var contents = item.querySelectorAll(".accordion-listing > ul > li > ul > li > ul"); // Heading buttons - add new attributes / listen for clicks

    Array.prototype.forEach.call(headings, function (heading, index2) {
      heading.setAttribute("id", headingId + index2);
      heading.setAttribute("aria-controls", contentId + index2);
      heading.setAttribute("aria-expanded", "false");
      heading.addEventListener("click", accordionClick);
    }); // Content Panels - add new attributes

    Array.prototype.forEach.call(contents, function (content, index2) {
      content.setAttribute("id", contentId + index2);
      content.classList.add("hide");
      content.setAttribute("role", "region");
      content.setAttribute("hidden", "true");
      content.setAttribute("aria-labelledby", headingId + index2);
    });
  }
  /*
   * Function: Deal with heading button click events
   * ie open or close the content box
   */


  function accordionClick(e) {
    e.preventDefault();
    var heading = e.target;
    var content = e.target.parentNode.children[1];
    content.classList.toggle("hide");
    if (content.classList.contains("hide")) setCloseAttributes(content, heading);
    if (!content.classList.contains("hide")) setOpenAttributes(content, heading);
  }
  /*
   * Function: Updates accessibilty attributes for close state
   */


  function setCloseAttributes(content, heading) {
    content.setAttribute("hidden", "true");
    heading.setAttribute("aria-expanded", "false");
  }
  /*
   * Function: Updates accessibilty attributes for open state
   */


  function setOpenAttributes(content, heading) {
    content.removeAttribute("hidden");
    heading.setAttribute("aria-expanded", "true");
  }
})(document.querySelectorAll(".accordion-listing")); // this is the half n half


(function () {
  if (!AOS) return;
  var containers, element;
  var left = 'fade-left',
      right = 'fade-right',
      offset = 100,
      duration = 600;
  var image = '.c-half-n-half__image',
      content = '.c-half-n-half__content',
      container = '.c-half-n-half.js-animation';

  var setAnimationAttrs = function setAnimationAttrs(goLeft) {
    if (!_typeof(this.setAttribute) == "function") return;
    this.setAttribute('data-aos', goLeft ? left : right);
    this.setAttribute('data-aos-offset', offset);
    this.setAttribute('data-aos-duration', duration);
  },
      isOdd = function isOdd(num) {
    return num % 2;
  };
  /**
   * Alternate left/right animations for each container on the page
   */


  containers = Array.prototype.slice.call(document.querySelectorAll(container));

  for (var i = 0; i < containers.length; i++) {
    if (element = containers[i].querySelector(image)) setAnimationAttrs.call(element, isOdd(i));
    if (element && isOdd(i)) element.setAttribute("data-aos__initialized", "true"); // is this actually used for anything?

    if (element = containers[i].querySelector(content)) setAnimationAttrs.call(element, !isOdd(i));
  }

  AOS.init({
    once: true,
    disable: 'phone'
  });
})();
/**
 * BREADCRUMBS
 * @param trail the DomElement for the breadcrumb trail
 * @param useSchemaDotOrg boolean whether to use Schema.org or not
 * @param collapse boolean whether to collapse or not
 * 
 */


(function (trail, useSchemaDotOrg, collapse) {
  if (!trail) return; // just bail out now if there is no breadcrumb trail

  var schemaData = [];
  var hierarchyLevel = 0; // track the depth as we move through the hierarchy

  var hierarchyMax = trail.getAttribute('data-hierarchy-max') || 4;
  var TRUNC_THRESHOLD = 25; // Max level befor collapsing kicks in. Default to 4 levels, but can be
  // changed by setting the data-* attribute in the HTML/template.
  // loop through all the "crumbs" in the breadcrumb trail, looking for
  // DOM elements only (element type "1") i.e. not a whitespace text node etc.
  // Todo: consider using newer API `firstElementChild` as that would simplify things.

  for (var crumb = trail.firstChild; crumb; crumb = crumb.nextSibling) {
    if (1 === crumb.nodeType) {
      // t4 adds empty breadcrumbs so we'll remove them:
      if ('' === crumb.textContent.trim()) {
        crumb = crumb.previousSibling; // move pointer back a step

        crumb.parentNode.removeChild(crumb.nextSibling); // remove the empty crumb 
      } else {
        var link = crumb.querySelector('a');
        var subMenu = crumb.querySelector('ul');

        if (subMenu) {
          crumb.classList.add('breadcrumbs__item--has-submenu'); // make a copy the breadcrumb link in the submenu so we can still navigate
          // to that page. The original link will be used instead to toggle submenu open/closed.

          var subMenuHomeItem = document.createElement('li');
          subMenuHomeItem.appendChild(link.cloneNode(true));
          subMenu.insertAdjacentElement('afterbegin', subMenuHomeItem);
          /**
           * Add a click-listener to each crumb to toggle the submenu open/close.
           * Passing `link` into the function-scope closure so we don't have to do a
           * querySelect() to reaquire it on every click event. Without a closure
           * the `link` would be unpredictable.
           */

          applyCrumbClickListener(crumb, link);
        } // Add the data for Schema.org JSON-LD


        if (useSchemaDotOrg) {
          schemaData.push({
            '@type': 'ListItem',
            'position': Array.prototype.indexOf.call(trail.children, crumb) + 1,
            'item': {
              '@id': link.href,
              'name': link.textContent
            }
          });
        }

        if (collapse) {
          crumb.setAttribute('data-hierarchy-level', hierarchyLevel++);
        }
      }
    }
  }

  if (collapse) {
    if (hierarchyLevel > hierarchyMax) {
      // Out of all the crumbs, select just the ones we want to collapse
      // and transform the resulting NodeList into a regular Array:
      var crumbsToCollapse = Array.prototype.slice.call(trail.querySelectorAll('[data-hierarchy-level]')).slice(0, 0 - hierarchyMax); // Just return early if there are too few crumbs:

      if (1 === crumbsToCollapse.length) return; // Remove the first crumb (i.e. never hide "home"), but store it
      // as 'home' for reference later.

      var home = crumbsToCollapse.shift(); // Create the ellipsis drop-down menu to contain the collapsed breadcrumbs

      var ellipsis = document.createElement('li');
      var ellipsisLink = document.createElement('a');
      var ellipsisMenu = document.createElement('ul');
      ellipsis.appendChild(ellipsisLink);
      ellipsis.appendChild(ellipsisMenu); // add the ellipsis just after 'home' breadcrumb

      home.insertAdjacentElement('afterend', ellipsis);
      ellipsisLink.innerText = '…';
      ellipsis.classList.add('breadcrumbs__item--has-submenu');
      ellipsis.setAttribute('data-collapse', ''); // Collapse the breadcrumbs and append them to the new ellipsis menu:

      crumbsToCollapse.forEach(function (value, index) {
        var li = document.createElement('li'); //create a fresh <li>

        li.appendChild(value.querySelector('a')); //recycle the <a> from the crumb

        ellipsisMenu.appendChild(li); //append to the new ellipsis menu

        value.parentNode.removeChild(value); //destroy the old breadcrum
        // Note: destroying the old crumb will also destroy any listeners and sub-menus
        // that were attached to it.
      }); // Set the ellipsis to have the same behaviour as the other breadcrumbs
      // i.e. click to show the drop-down menu

      applyCrumbClickListener(ellipsis, ellipsisLink);
    } // Truncate the remaining links, except the first (home) and last (current page):


    Array.prototype.slice.call(trail.querySelectorAll("li[data-hierarchy-level] > a"), 1, -1).forEach(function (link) {
      if (link.innerText.length > TRUNC_THRESHOLD) {
        link.setAttribute('title', link.innerText);
        link.innerHTML = stir.String.truncate.apply(link.innerText, [TRUNC_THRESHOLD, true]);
      }
    });
  } // Add the attributes/markup for Schema.org microdata
  // See: https://schema.org/BreadcrumbList


  if (useSchemaDotOrg && window.JSON) {
    var schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': schemaData
    });
    trail.insertAdjacentElement('beforebegin', schema);
  }

  function applyCrumbClickListener(crumb, link) {
    crumb.addEventListener('click', function (event) {
      // Here we'll prevent the click event on the crumb (or any of its child elements) bubbling up.
      // Elsewhere we've set a click handler (on the document body) which will trigger
      // the menu (or any other widgets) to close. By trapping the clicks within the crumb
      // it prevents the user accidentally closing the dropdown by e.g. clicking in the margin
      // around the links.
      event.stopPropagation(); // Now we will deal specifically with click events on the crumb (<li> element, i.e. `this`)
      // and the main breadcrumb link (<a> element, `link`), or any direct children of the <a>
      // such as <span>. The links's default action will be prevented, but any other child elements
      // of the <li> (such as submenu links) will not be affected. (We prevent default navigation
      //so that we can use the main link to toggle the dropdown instead).

      if (event.target === this || event.target === link || event.target.parentElement === link) {
        event.preventDefault();
        /**
         * This will toggle the `is-active` class on/off.
         * We can simplify this in the future and just use `classList.toggle()`
         * …when we drop IE support.
         */

        var wasActive = trail.querySelector('.is-active');

        if (this.classList.contains('is-active')) {
          this.classList.remove('is-active');
        } else {
          this.classList.add('is-active');
        }

        wasActive && wasActive.classList.remove('is-active'); // close all other on-screen widgets

        if (self.UoS_closeAllWidgetsExcept) UoS_closeAllWidgetsExcept('breadcrumbs');
      }
    });
  }
})(document.querySelector('.breadcrumbs'), // {HTMLElement} DOM element to use
true, // {boolean}     Use Schema.org markup?
true // {boolean}     Collapse breadcrumbs?
);
/**
 * HEADER CONCIERGE SEARCH ver 4.0 (NOT USING MARTYN'S SEARCHBOX)
 * @author: Ryan Kaye <ryan.kaye@stir.ac.uk>, Robert Morrison <r.w.morrison@stir.ac.uk>
 */
// we will add some new modules to the stir library


var stir = stir || {};
/**
 * Concierge
 * Instantiated below with `new stir.Concierge();`
 */

stir.Concierge = function Concierge(popup) {
  var button = document.querySelector("#header-search__button");
  if (!popup || !button) return;
  var obj2param = this.obj2param; // DOM elements

  var nodes = {
    overlay: popup.querySelector(".overlay"),
    input: popup.querySelector('input[name="query"]'),
    submit: popup.querySelector("button"),
    wrapper: popup.querySelector("#header-search__wrapper"),
    news: popup.querySelector(".c-header-search__news"),
    courses: popup.querySelector(".c-header-search__courses"),
    all: popup.querySelector(".c-header-search__all"),
    suggestions: popup.querySelector(".c-header-search__suggestions")
  }; //Dynamic view managers

  var search, results, spinner; // Settings and data

  var funnelbackServer = "https://stir-search.clients.uk.funnelback.com";
  var funnelbackUrl = funnelbackServer + "/s/";
  var searchFunnelbackUrl = funnelbackUrl + "search.json?";
  var suggestFunnelbackUrl = funnelbackUrl + "suggest.json?collection=stir-www&show=10&partial_query=";
  var courseUrl = "https://www.stir.ac.uk/courses/";
  var searchUrl = "https://www.stir.ac.uk/search/";
  var prevQuery = "";
  var keyUpTime = 400; // miliseconds; keystroke idle time, i.e. stopped typing

  var minQueryLength = 3; // min query length for activating the suggest box

  var KEY_ESC = 27;

  (function init() {
    search = new stir.ToggleWidget(popup, "stir__fadeIn", "stir__fadeOut");
    results = new stir.ToggleWidget(nodes.wrapper, "stir__slidedown", "stir__slideup");
    spinner = new stir.Spinner(nodes.input.parentElement);
    spinner.element.classList.add("c-search-loading__spinner-small"); // hide the results panel (no results to show yet)

    results.hide(); // Assign various event handlers

    button.addEventListener("click", opening);
    nodes.input.addEventListener("focus", focusing);
    nodes.input.addEventListener("keyup", stir.debounce(handleInput, keyUpTime));
    popup.addEventListener("click", function (event) {
      // trap all clicks _except_ those on the overlay
      if (event.target !== nodes.overlay) {
        event.stopPropagation();
      }
    });
  })(); //  H E L P E R   F U N C T I O N S


  function doSearches(query) {
    stir.getJSON(suggestFunnelbackUrl + query, parseSuggestions.bind(nodes.suggestions));
  } // R E N D E R E R S


  function render(label, data) {
    if (this.nodeType !== 1) return;
    this.innerHTML = renderHeading(label.heading, label.icon) + "<ul>" + renderBody(label, data) + "</ul>";
  }

  var renderHeading = function renderHeading(title, icon) {
    return "\n        <h3 class=\"c-header-search__title header-stripped\">\n          <span class=\"".concat(icon, "\"></span> \n          ").concat(title, "\n        </h3>");
  };

  var renderBody = function renderBody(label, data) {
    return data.length > 0 ? data.join("") : renderGenericItem(label.none);
  };

  var renderGenericItem = function renderGenericItem(text) {
    return "<li class=\"c-header-search__item\">".concat(text, "</li>");
  };

  var renderAllItem = function renderAllItem(item) {
    return "\n      <li class=\"c-header-search__item\">\n        <a href=\"".concat(funnelbackServer).concat(item.clickTrackingUrl, "\">\n        ").concat(item.title.split(" | ")[0], " - ").concat(item.title.split(" | ")[1] ? item.title.split(" | ")[1] : "", "</a>\n      </li>");
  };

  var renderCourseItem = function renderCourseItem(item) {
    return "\n      <li class=\"c-header-search__item\">\n        <a href=\"".concat(funnelbackServer).concat(item.clickTrackingUrl, "\">\n        ").concat(item.metaData.award ? item.metaData.award : "", " \n        ").concat(item.title.split(" | ")[0], "</a>\n      </li>");
  };

  var renderSuggestItem = function renderSuggestItem(suggest) {
    return "\n      <li class=\"c-header-search__item\">\n        <a href=\"".concat(searchUrl, "?query=").concat(suggest, "\">").concat(suggest, "</a>\n      </li>");
  }; // P A R S I N G


  function getSeachParams(query_) {
    return obj2param({
      query: query_,
      SF: "[c,d,access,award]",
      collection: "stir-main",
      num_ranks: 25,
      "cool.21": 0.9
    });
  }

  function parseSuggestions(suggests) {
    var max = 5;

    if (suggests.length > 0) {
      // perform search using first suggested term as the query
      stir.getJSON(searchFunnelbackUrl + getSeachParams(suggests[0]), parseFunnelbackResults);
      var suggestsUnique = suggests.filter(function (c, index) {
        return suggests.indexOf(c) === index;
      });
      var suggestsLtd = stir.filter(function (item, index) {
        return index < max;
      }, suggestsUnique);
      render.call(nodes.suggestions, {
        heading: "Suggestions",
        none: "No suggestions found",
        icon: "uos-magnifying-glass"
      }, suggestsLtd.map(renderSuggestItem));
    } else {
      // no suggests so use the raw inputted query to perform the search
      stir.getJSON(searchFunnelbackUrl + getSeachParams(prevQuery), parseFunnelbackResults);
      render.call(nodes.suggestions, {
        heading: "Suggestions",
        none: "No suggestions found",
        icon: "uos-magnifying-glass"
      }, []);
    }

    spinner.hide();
    results.show();
  }

  function parseFunnelbackResults(data) {
    var max = 3;
    var obj = data.response.resultPacket.results;

    if (data.response.resultPacket.resultsSummary.fullyMatching > 0) {
      var coursesHtml = stir.compose(stir.map(renderCourseItem), stir.filter(function (item, index) {
        return index < max;
      }), stir.filter(function (item) {
        return item.liveUrl.includes(courseUrl);
      }))(obj);
      var allHtml = stir.compose(stir.map(renderAllItem), stir.filter(function (item, index) {
        return index < max;
      }), stir.filter(function (item) {
        return !item.liveUrl.includes(courseUrl);
      }))(obj);
      render.call(nodes.news, {
        heading: "All pages",
        none: "No results found",
        icon: "uos-all-tab"
      }, allHtml);
      render.call(nodes.courses, {
        heading: "Courses",
        none: "No courses found",
        icon: "uos-course-tab"
      }, coursesHtml);
    } else {
      render.call(nodes.news, {
        heading: "All pages",
        none: "No results found",
        icon: "uos-all-tab"
      }, []);
      render.call(nodes.courses, {
        heading: "Courses",
        none: "No courses found",
        icon: "uos-course-tab"
      }, []);
    }
  } // E V E N T   H A N D L E R   F U N C T I O N S


  function handleInput(event) {
    if (this.value != prevQuery) {
      results.hide();

      if (this.value.length >= minQueryLength) {
        spinner.show();
        doSearches(this.value);
        prevQuery = this.value;
      } else {
        spinner.hide();
        results.hide();
        prevQuery = "";
      }
    }
  }
  /**
   * If the search recieves focus, also reopen the
   * results-panel if there are results to display.
   **/


  function focusing(event) {
    if (this.value !== "" && results.hidden()) {
      results.show();
      spinner.hide();
    } //UoS_closeAllWidgetsExcept('headerSearch');

  }
  /*
   * Search icon in the header. Clicking it should open the big search input
   */


  function opening(event) {
    if (search.hidden()) {
      search.show();
      nodes.input.focus();
      nodes.input.removeAttribute("tabindex");
      nodes.submit.removeAttribute("tabindex");
    } // we don't want both search boxes visible at the same time. So we
    // tell this box to hide the other when active, and vice versa


    UoS_closeAllWidgetsExcept("headerSearch"); // while the search is open, listen for keystrokes and close requests:

    document.addEventListener("keyup", escaping);
    document.addEventListener("focusin", focusouting);
    document.addEventListener("widgetRequestClose", closing);
    event.stopPropagation(); // prevent triggering the closeWidget listener on body

    event.preventDefault();
  }
  /**
   * When overlay is clicked, hide the header search panel
   **/


  function closing(event) {
    results.hide();
    search.hide();
    nodes.input.setAttribute("tabindex", "-1");
    nodes.submit.setAttribute("tabindex", "-1"); // when the search is closed, stop listening for keystrokes and close requests:

    document.removeEventListener("keyup", escaping);
    document.removeEventListener("focusin", focusouting);
    document.removeEventListener("widgetRequestClose", closing);
  }

  function focusouting(event) {
    if (!popup.contains || !event.target) return; // IE won't support Node.contains()

    if (!popup.contains(event.target)) closing(event);
  }

  function escaping(event) {
    if (event.keyCode === KEY_ESC) closing(event);
  }
};

stir.Concierge.prototype.obj2param = function (obj) {
  // transform key/value pairs from object to URL formatted
  // query string, in this case for use with Funnelback.
  var elements = [];

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      elements.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    }
  }

  return elements.join("&");
};

(function () {
  // instantiate a new anonymous concierge
  new stir.Concierge(document.getElementById("header-search"));
})();
/* 
 *
 * Cookie Banner Code
 *
*

(function(){
	if(window.location.hostname.indexOf('stir.ac.uk')>-1) return;
    if(!window.Cookies) return;
    if(Cookies.get("cookiebanner")) return;

    // set up our elements
    var banner = document.createElement('section');
    var action = document.createElement('button');
    var url = 'https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/policy-and-planning/legal-compliance/data-protectiongdpr/privacy-notices/users-of-the-universitys-website/';
    var message = (function() {
        if (window.location.hostname === "www.stir.ac.uk") {
            // Banner message for the main website:
            return '<p>The University of Stirling uses cookies for advertising and analytics. Read our <a href="'+url+'">website privacy notice</a> to find out more.</p>';
        }
        // banner message for the satellite sites:
        return '<p>This site is hosted by The University of Stirling. Read our <a href="'+url+'">website privacy notice</a> to find out more about how we use cookies.</p>';
    })();

    // apply attributes and classes
    banner.setAttribute("id", "cookiebanner");
	banner.setAttribute("aria-label", "cookie-banner");
	banner.setAttribute("class", "u-bg-grey");
    action.setAttribute("class", 'button button--close');
    action.innerText = "Close";

    // build HTML and add to DOM
    banner.insertAdjacentHTML("afterbegin", message);
    banner.appendChild(action);
    document.body.appendChild(banner);

    // listen for click events
    action.addEventListener('click', closeCookieBanner);

    function closeCookieBanner() {
        // Set cookie so banner no longer appears on subsequent page loads
        Cookies.set("cookiebanner", true, { expires: 30 });
        // stop listening for clicks
        action.removeEventListener('click', closeCookieBanner);
        // destroy banner HTML (and references)
        banner.parentNode.removeChild(banner);
        banner = null;
    }
})();
*/
// this will swap the native action for js-action. Useful for search
// forms where we want non-js situations to be able to submit
// to the Funnelback page, but js situations (i.e. using the search api) to submit to
// the js action page


(function (forms) {
  for (var i = 0; i < forms.length; i++) {
    forms[i].action = forms[i].getAttribute('data-js-action') || forms[i].action;
  }
})(Array.prototype.slice.call(document.querySelectorAll("form[data-js-action]")));
/**
 *  T4 Form submit - outputs this message on all submits - but is only seen if the form fails to submit
 
 NOW IN THE T4 FORM CONTENT TYPE TEXT/FOOT

(function() {
    document.addEventListener('click', function (e) {
        if (e.target.matches('.js-submit')) {
    		// remove any earlier error messages
    		var el = document.getElementsByClassName("form-message")[0];
    		if(el)
    		    el.parentNode.removeChild(el);
            
            setTimeout(function() {
                // output the message after a slight delay
                var html = '<div class="clearfix"></div><p class="has-error form-message">You have missed some required fields in the form. Please complete these then click submit again.</p>';
                document.querySelectorAll('.c-form .js-submit')[0].insertAdjacentHTML('afterend', html);
            }, 500);
    	}
    }, false);
})();
 */

/*
 * Object Fit hack
 * For browsers that dont support object fit
 * Will remove the image tag and instead add a inline background image style
 * @author: Ryan Kaye
 */


(function () {
  var els = stir.nodes("[data-objectfit]");
  if (!els) return;

  if (els.length > 0 && "objectFit" in document.documentElement.style === false) {
    for (var i = 0; i < els.length; i++) {
      if (els[i].children[0]) {
        var src = els[i].children[0].getAttribute("src");
        els[i].removeChild(els[i].children[0]);
        els[i].style.backgroundImage = "url(" + src + ")";
      }
    }
  }
})();
/*
 * Pullquote fixes for Old Edge and IE
 * @author: Ryan Kaye
 */


(function () {
  if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
    var el = stir.nodes(".pullquote");

    if (el) {
      for (var i = 0; i < el.length; i++) {
        el[i].style.borderRight = "15px solid #fff";
      }
    }

    var el = stir.nodes(".pullquote-vid>div.responsive-embed");

    if (el) {
      for (var i = 0; i < el.length; i++) {
        el[i].style.minHeight = parseInt(el[i].offsetWidth / 1.78 + 20) + "px";
      }
    }
  }
})();
/*
 * .c-link fix for Safari chevron
 * @author: Ryan Kaye
 */


(function () {
  if (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1) {
    var els = stir.nodes(".c-link");

    if (els) {
      for (var i = 0; i < els.length; i++) {
        els[i].classList.add("safariFix");
      }
    }
  }
})();
/*
  
  @title: Header Link JS
  @author: Ryan Kaye
  @description: Dynamically add links to the header / mobile navs on the fly
  @date: 
  @updated: 24 August 2022 
    
*/


(function () {
  /*
    Create a header nav item (not the megamenu) 
  */
  var renderHeaderNavLink = function renderHeaderNavLink(text, url, ident) {
    return "\n      <li class=\"c-header-nav__item c-header-nav__item-".concat(ident, " show-for-large\">\n          <a ident=\"header-link-").concat(ident, "\" class=\"c-header-nav__link\" rel=\"nofollow\" href=\"").concat(url, "\">").concat(text, "</a>\n      </li>");
  };
  /*
      Create a mobile nav menu item
   */


  var renderMobileNavLink = function renderMobileNavLink(text, url, ident) {
    return "\n      <li class=\"slidemenu__other-links-".concat(ident, " text-sm\">\n        <a ident=\"menu-link-").concat(ident, "\" href=\"").concat(url, "\" rel=\"nofollow\">").concat(text, "</a>\n      </li>");
  };
  /* 
      Main 
  */


  var main = function main(text, url, ident) {
    var headerHtml = renderHeaderNavLink(text, url, ident);
    var headerNode = stir.node(".c-header-nav--secondary");
    headerNode && headerNode.insertAdjacentHTML("afterbegin", headerHtml);
    var mobileHtml = renderMobileNavLink(text, url, ident);
    var mobileNode = stir.node(".slidemenu__other-links");
    mobileNode && mobileNode.insertAdjacentHTML("afterbegin", mobileHtml);
  };
  /* 
    getUserType 
  */


  var getUserType = function getUserType() {
    if (UoS_env.name === "dev") return "STAFF";
    return window.Cookies && Cookies.get("psessv0") !== undefined ? Cookies.get("psessv0").split("|")[0] : "";
  };
  /*
    On load
  */


  if (getUserType() === "STAFF") {
    main("Staff info", "/internal-staff/", "staff");
  }

  if (getUserType() === "STUDENT") {
    main("Student info", "/internal-students/", "students");
  }
})();
/*
 * INTERNAL MENUS
 */

/*
 * Main Mobile Burger Menu (Internal)
 * Only used by brandbank and Microsites
 */


(function () {
  var intSideMenu = document.querySelector('.internal-sidebar-menu');
  var intMainMobileBurger = document.getElementById('mobileMenuBurger');
  var intMainMobileNav = document.getElementById('mobilemenulinks');
  var intSubMobileBurger = document.querySelector('.burger--internal-sidebar-menu');
  var intSubMobileNav = document.querySelector(".internal-pages-mobile-menu"); //var intBurger = document.querySelector('burger--internal-sidebar-menu');
  //var intNav = document.querySelector(".internal-pages-mobile-menu");

  /**
   * Function: show / hide relavent menu (m) 
   * when burger (b) is clicked
   */

  function intMenutoogle(m, b) {
    m.style.display = 'block'; // just in case there is a display none on the el

    if (m.classList.contains("hide")) {
      m.classList.remove("hide");
      b.classList.add("nav-is-open");
    } else {
      m.classList.add("hide");
      b.classList.remove("nav-is-open");
    }
  }
  /**
   * Click events
   */


  if (intMainMobileBurger && intMainMobileNav) {
    intMainMobileBurger.onclick = function (e) {
      intMenutoogle(intMainMobileNav, intMainMobileBurger);
      e.preventDefault();
    };
  }

  if (intSubMobileBurger && intSubMobileNav) {
    intSubMobileBurger.onclick = function (e) {
      intMenutoogle(intSubMobileNav, intSubMobileBurger);
      e.preventDefault();
    };
  }
  /*if (intBurger) {
      intBurger.onclick = function (e) {
          intMenutoogle(intNav, intBurger)
          e.preventDefault();
      }; 
  }*/

  /**
   * On load events
   */


  if (!intSideMenu) if (intSubMobileBurger) intSubMobileBurger.classList.add('hide'); // remove the sub menu burger if no sub menu
})();
/**
 * INTERNAL SIGNPOST DROPDOWN
 */


var intSignPostBtn = document.getElementById('internal-signpost-dropdown__link');
var intSignPostMenu = document.getElementById('internal-signpost-dropdown__submenu');

if (intSignPostBtn && intSignPostMenu) {
  intSignPostBtn.onclick = function (e) {
    e.stopPropagation();

    if (intSignPostMenu.classList.contains('hide')) {
      intSignPostMenu.classList.remove('hide');
      intSignPostBtn.classList.add('is-active');
    } else {
      intSignPostMenu.classList.add('hide');
      intSignPostBtn.classList.remove('is-active');
    } // kill other popups


    UoS_closeAllWidgetsExcept("internalSignpost");
    e.preventDefault();
    return false;
  }; // Not sure if this is needed
  //intSignPostMenu.onclick = function (e) {
  //e.preventDefault();  
  //};

}
/*
 * Replacement for Foundation dropdown component
 * Used on Brandbank for file picker
 */


(function (scope) {
  if (!scope) return;
  var ddPanes = document.querySelectorAll(".dropdown-pane");
  var ddBtns = document.querySelectorAll(".button--dropdown");

  for (var i = 0; i < ddPanes.length; i++) {
    ddPanes[i].classList.add('hide');
  }

  function doClick(el) {
    el.onclick = function (e) {
      e.target.nextElementSibling.classList.toggle('hide');
      e.preventDefault();
    };
  }

  for (var i = 0; i < ddPanes.length; i++) {
    doClick(ddBtns[i]);
  }
})(document.querySelector(".c-download-box"));
/**
 * Lazy loading
 **/


stir.lazy(document.querySelectorAll('.stirlazy,[data-lazy-container]'));

(function () {
  if (!document.querySelector(".c-zoom")) return;

  switch (window.location.hostname) {
    case "localhost":
      stir.addScript('/src/js-other/loupe.js');
      break;

    default:
      stir.addScript('/webcomponents/dist/js/other/loupe.js');
      break;
  }
})();
/**
 * MEGAMENU
 * Load megamenu only if above certain breakpoint
 * If the megamenu html fails to load the links will just do their default behaviour
 * e.g. goto /study landing page
  *  REMOVE JQUERY
 */


(function () {
  var url;
  var KEY_ESC = 27;
  var mm = document.getElementById('megamenu__container__dev') || document.getElementById('megamenu__container');
  if (!mm) return;

  switch (UoS_env.name) {
    case "dev":
      url = '../data/awd/megamenu.html';
      break;

    case "app-preview":
      url = 'https://t4appdev.stir.ac.uk/terminalfour/preview/1/en/2834';
      break;

    case "appdev-preview":
      url = 'https://t4appdev.stir.ac.uk/terminalfour/preview/1/en/2834';
      break;

    case "qa":
      url = UoS_env.wc_path + "pages/data/awd/megamenu.html";
      break;

    case "preview":
      url = 'https://t4cms.stir.ac.uk/terminalfour/preview/1/en/2834';
      break;

    default:
      // live
      url = "/developer-components/includes/template-external/mega-menu/";
      break;
  }

  function initMegamenu() {
    var primaryNav = document.querySelector('#layout-header .c-header-nav--primary');
    var mainSections = document.querySelectorAll(".megamenu__links > ul > li > a");

    for (var i = 0; i < mainSections.length; i++) {
      mainSections[i].insertAdjacentText("afterbegin", "Visit ");
      mainSections[i].insertAdjacentText("beforeend", " home");
    }
    /**
    * @var active_class The CSS class name to use to style the active megamenu
     */


    var active_class = "c-header-nav__link--is-active"; // prevent click propagating up through to body (which will close the mm)

    mm.addEventListener('click', function (e) {
      e.stopPropagation();
    });
    Array.prototype.forEach.call(document.querySelectorAll('.megamenu'), function (el) {
      el.classList && el.classList.add('animation-slide');
      el.setAttribute('tabindex', -1);
      manageTabIndex(el, false);
    });

    function mmSlideDown(el) {
      if (!el || !el.classList) return;
      el.classList.remove('animation-slide__up');
      el.classList.add('animation-slide__down');
      manageTabIndex(el, true);
      mmFocusFirstElement(el); // listen for 'close' requests

      document.addEventListener('widgetRequestClose', closing);
      document.addEventListener("keyup", escaping);
    }

    function mmSlideUp(el) {
      if (!el || !el.classList) return;
      el.classList.add('animation-slide__up');
      el.classList.remove('animation-slide__down');
      manageTabIndex(el, false); // stop listening for 'close' requests

      document.removeEventListener("keyup", escaping);
      document.removeEventListener('widgetRequestClose', closing);
      el.id && returnFocus(el.id);
    }

    function mmSlideUpAll() {
      unhighlight();
      Array.prototype.forEach.call(document.querySelectorAll('.megamenu.animation-slide__down'), function (el) {
        mmSlideUp(el);
      });
    }

    function mmFocusFirstElement(el) {
      var focusable = el.querySelector("a,button,input");
      focusable && focusable.focus();
    }

    function unhighlight() {
      Array.prototype.forEach.call(primaryNav.querySelectorAll('.' + active_class), function (el) {
        el.classList && el.classList.remove(active_class);
      });
    }

    function manageTabIndex(mm, state) {
      Array.prototype.forEach.call(mm.querySelectorAll('a'), function (el) {
        state ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', -1);
      });
    }

    var returnFocus = function returnFocus(id) {
      var el = document.querySelector("[aria-controls=\"".concat(id, "\"],[data-menu-id=").concat(id, "]"));
      console.info('return focus', el);
      if (!el) return;
      el.focus();
    };

    primaryNav.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var id, mm;
      id = e.target.getAttribute("aria-controls") || e.target.getAttribute("data-menu-id");
      id && (mm = document.querySelector("#" + id)); // if related megamenu found, prevent defaults and apply behaviour

      if (mm) {
        /**
         * If the megamenu related to this link item is already open, close it.
         * If it is not already open, close any that are, then open this one.
                     */
        if (mm.classList && mm.classList.contains('animation-slide__down')) {
          mmSlideUp(mm);
        } else {
          mmSlideUpAll();
          mmSlideDown(mm);
        }

        e.target.classList && e.target.classList.toggle(active_class);
      } else {
        UoS_closeAllWidgetsExcept();
      }
    });

    function escaping(event) {
      if (event.keyCode === KEY_ESC) mmSlideUpAll();
    }

    function closing() {
      unhighlight();
      mmSlideUp(document.querySelector('.megamenu.animation-slide__down'));
    }

    {
      /* Megamenu "subpage" scrolling behaviour */
      var megalinks = document.querySelectorAll('.megamenu .megamenu__links');

      function pan(sibling, positive, event) {
        var dollyTrack = this.parentNode.querySelector("ul > li > ul");
        var distance = positive ? dollyTrack.scrollWidth - dollyTrack.clientWidth : 0;
        stir.scroll.call(dollyTrack, 0, distance);
        this.style.display = 'none';
        sibling && (sibling.style.display = 'block');
        event.preventDefault();
      }

      for (var i = 0; i < megalinks.length; i++) {
        var prev = megalinks[i].querySelector(".megamenu__prev-button");
        var next = megalinks[i].querySelector(".megamenu__next-button");

        if (prev && next) {
          prev.onclick = pan.bind(prev, next, false);
          next.onclick = pan.bind(next, prev, true);
        }
      }
    }
    loaded = true;
  }

  ;
  /**
   * Only load the MegaMenu if the viewport is (currently) larger than 1240px.
   */

  var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  if (vw >= 1240) {
    stir.load(url, function (data) {
      if (data && !data.error) {
        mm.innerHTML = data;
        initMegamenu();
      } else {
        console.error('Unable to load MegaMenu');
      }
    });
  }
})();
/*
   MOBILE MENU 
 */


(function (scope) {
  if (!scope) return;
  var menuContainer = scope; // #mobile-menu-2

  var menuOpenBtn = stir.node("#open_mobile_menu");
  var menuCloseBtn = stir.node("#close_mobile_menu");
  var menu = stir.node("ul.sitemenu-2");
  var hideNodes = ["main", "footer", "#layout-header", ".breadcrumbs-container"];
  /* On load */

  var menusCache = {
    default: menu.innerHTML
  };
  /*
        Renderers
  */

  var renderHome = function renderHome() {
    return "<li><a class=\"button button--left-align expanded button--back secondary u-m-0 text-left\" href=\"/\">Home</a>";
  };

  var renderUpLevel = function renderUpLevel(item) {
    return item ? "<li class=\"u-bg-heritage-green\">\n            <a class=\"button button--left-align heritage-green expanded button--back u-m-0 text-left\" href=\"".concat(item.p, "\">\n                ").concat(item.t, "\n            </a>\n        </li>") : "";
  };

  var renderLanding = function renderLanding(item) {
    return item ? "<li class=\"u-underline u-energy-teal--light \">\n            <a class=\"button no-arrow button--left-align subtle expanded u-m-0 text-left \" href=\"".concat(item.p, "\" data-action=\"go\">\n              <div class=\"flex-container align-middle u-gap-16\">  \n                <span class=\"u-flex1\">").concat(item.t, " home</span>\n                <span class=\"uos-chevron-right u-icon\"></span>\n                </div>\n            </a>\n        </li>") : "";
  };

  var renderLoading = function renderLoading() {
    return "<li><span class=\"button expanded no-arrow\">Loading...</span></li>";
  };

  var renderLink = function renderLink(item) {
    var link = item.u ? item.u : item.p;
    return item ? "\n        <li class=\"u-underline u-energy-teal--light flex-container align-middle\">\n            <a class=\"button no-arrow button--left-align clear expanded u-m-0 text-left\" href=\"".concat(link, "\">\n              <div class=\"flex-container align-middle u-gap-16\"> \n                <span class=\"u-flex1\">").concat(item.t, "</span>\n                <span class=\"uos-chevron-right u-icon\"></span>\n              </div>\n            </a>\n        </li>") : "";
  };

  var renderMenu = function renderMenu(links) {
    return links.map(renderLink).join("");
  };
  /*
      State Helpers   
   */


  var getMenuAjaxUrl = function getMenuAjaxUrl(sect) {
    if (UoS_env.name === "dev" || UoS_env.name === "qa") {
      return "../data/awd/mobilenavs/" + sect + "/index.json";
    }

    return "/developer-components/includes/template-external/mobile-nav-json/" + sect + "/index.json"; // live
  };
  /* getCurrentUrl */


  var getCurrentUrl = function getCurrentUrl() {
    if (UoS_env.name === "dev" || UoS_env.name === "qa") {
      return "/about/professional-services/";
    }

    return window.location.pathname; // live
  };
  /* getParentSection */


  var getParentSection = function getParentSection(url) {
    return url.split("/")[1];
  };
  /* getPreviousLevelPath */


  var getPreviousLevelPath = function getPreviousLevelPath(currentUrl) {
    var to = currentUrl.slice(0, -1).lastIndexOf("/");
    var to_ = to == -1 ? currentUrl.length : to + 1;
    return currentUrl.substring(0, to_);
  };
  /* getCurrentMenu */


  var getCurrentMenu = function getCurrentMenu(initialData, currentUrl, evnt) {
    var currentLevel = currentUrl.split("/").length + 1;
    var links = initialData.filter(function (item) {
      if (item.p && item.p.split("/").length === currentLevel && item.p.includes(currentUrl)) return item;
    });
    if (!links.length && evnt === "click") return "";
    var landing = initialData.filter(function (item) {
      if (item.p === currentUrl) return item;
    });
    var upUrl = getPreviousLevelPath(currentUrl);
    var upLevel = initialData.filter(function (item) {
      if (item.p === upUrl) return item;
    });
    return renderHome() + renderUpLevel(upLevel[0]) + renderLanding(landing[0]) + renderMenu(links);
  };
  /*
      Controller: Fetch the menu data, render to html and output or href if its a link
   */


  var fetchData = function fetchData(currentUrl, menusCache, evnt) {
    var baseSection = getParentSection(currentUrl);
    var ajaxUrl = getMenuAjaxUrl(baseSection);
    console.log(currentUrl);

    if (currentUrl.includes("https://")) {
      window.location = currentUrl;
      return {
        action: "go "
      };
    }

    if (baseSection === "") {
      menu.innerHTML = menusCache.default;
      return {
        action: "navigate"
      };
    }

    if (menusCache[baseSection]) {
      var html = getCurrentMenu(menusCache[baseSection], currentUrl, evnt);

      if (!html) {
        window.location = currentUrl;
        return {
          action: "go "
        };
      }

      stir.setHTML(menu, html);
      return {
        action: "navigate"
      };
    }

    stir.setHTML(menu, renderLoading());
    stir.getJSON(ajaxUrl, function (initialData) {
      if (initialData.error) {
        stir.setHTML(menu, menusCache.default);
        return {
          action: "navigate"
        };
      }

      menusCache[baseSection] = initialData; // cache the data

      var html2 = getCurrentMenu(initialData, currentUrl, evnt);

      if (!html2) {
        window.location = currentUrl;
        return {
          action: "go"
        };
      }

      stir.setHTML(menu, html2);
      return {
        action: "navigate"
      };
    });
    return {
      action: "null"
    };
  };
  /*
     Events / Listeners
   */

  /* Open */


  menuOpenBtn && menuOpenBtn.addEventListener("click", function (e) {
    hideNodes.forEach(function (element) {
      stir.node(element) && stir.node(element).classList.add("hide");
    });
    menuContainer.classList.add("c-mobile-menu-visible");
    fetchData(getCurrentUrl(), menusCache, "open");
    e.preventDefault();
  });
  /* Close */

  menuCloseBtn && menuCloseBtn.addEventListener("click", function (e) {
    hideNodes.forEach(function (element) {
      stir.node(element) && stir.node(element).classList.remove("hide");
    });
    menuContainer.classList.remove("c-mobile-menu-visible");
    e.preventDefault();
  });
  /* Menu link clicks */

  menu && menu.addEventListener("click", function (e) {
    var el = e.target.closest("a");

    if (el.getAttribute("data-action") === "go") {
      window.location = el.getAttribute("href");
      return;
    }

    var _fetchData = fetchData(el.getAttribute("href"), menusCache, "click"),
        action = _fetchData.action;

    if (action && action === "navigate") {
      menu.scrollIntoView();
    }

    e.preventDefault();
  });
  /* Fin */
})(document.getElementById("mobile-menu-2"));
/*
 * MOBILE MENU


(function (scope) {
  if (!scope) return;

  let start, end;

  var mobMenu = scope; // main container for the mobile nav
  var menuOpenBtn = document.getElementById("open_mobile_menu");
  var menuCloseBtn = document.getElementById("close_mobile_menu");
  var menuRootUL = document.querySelector(".sitemenu");
  var menuInitItems = document.querySelectorAll(".sitemenu ul.visible > li");
  var menuLoading = document.querySelector(".mobMenuLoading");

  var sectLinks = document.querySelectorAll(".sitemenu > li > ul > li > a");
  var otherLinks = document.querySelector(".slidemenu__other-links");

  var hideEls = [".wrapper-content", "footer", "#layout-header", ".breadcrumbs-container"];
  var currHref,
    loadSect,
    curClickedEl,
    arrLoaded = [];

  /*
   * Function: work out from the url which section the user is currently browsing
   /
  function getUsersCurrentSection() {
    currHref = window.location.pathname;
    loadSect = currHref.split("/")[1];

    if (UoS_env.name === "dev" || UoS_env.name === "qa") {
      loadSect = "about";
      currHref = "https://t4cms.stir.ac.uk/terminalfour/preview/1/en/10872";
    }
  }

  /*
   * Function: work out from the section what the url of the ajax content is
   /
  function getMenuAjaxUrl(sect) {
    var menuUrl = "";
    var rootUrl = "/developer-components/includes/template-external/mobile-nav/"; // live

    // Reconfig for dev
    if (UoS_env.name === "dev" || UoS_env.name === "qa") rootUrl = "../data/awd/mobilenavs/";

    menuUrl = rootUrl + sect + "/index.html"; // live & dev/qa

    // Reconfig for preview
    if (UoS_env.name === "preview" || UoS_env.name === "appdev-preview") {
      var t4Prevs = {
        study: "21257",
        about: "21258",
        international: "21259",
        research: "21260",
        "student-life": "21261",
        courses: "21373",
        clearing: "21374",
        coronavirus: "24355",
        "internal-students": "24799",
        "internal-staff": "24798",
      };
      menuUrl = "/terminalfour/preview/1/en/" + t4Prevs[sect];
    }

    return menuUrl;
  }

  /*
   * Function: add or remove the visibility clases for the panel
   /
  function togglePanelClasses(el, dowhich) {
    if (dowhich === "remove") {
      el.classList.remove("visible");
      el.classList.remove("fixed");
    }
    if (dowhich === "add") {
      el.classList.add("visible");
      el.classList.add("fixed");
    }
  }

  /*
   * Function: Ajax loads the menu html
   /
  function fetchMenu(url) {
    // show the loading message
    menuLoading && menuLoading.classList.remove("hide");

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", outputMenu);
    oReq.open("GET", url);
    oReq.send();
  }

  /*
   * Function: take the ajax'd content and append it to the correct ul
   /
  function outputMenu() {
    for (var i = 0; i < sectLinks.length; i++) {
      if (sectLinks[i].dataset.sectid === loadSect) {
        var node = document.createElement("span");
        node.innerHTML = this.responseText;
        var newNode = node.querySelector("ul > li > ul");
        sectLinks[i].insertAdjacentElement("afterend", newNode);
      }
    }
    showPanel();
  }

  /*
   * Function: display the correct panel of links
   /
  function showPanel() {
    if (curClickedEl) panelReload();

    if (!curClickedEl) initPanelLoad();
  }

  /*
   * Function: Panel is already open and user has interacted with it
   /
  function panelReload() {
    // if no submenu ul beside it
    if (curClickedEl.nextElementSibling === null) {
      // Clicked the Home btn
      if (curClickedEl.classList.contains("mobMenuHomeBtn")) {
        // Home btn
        // remove the visible class for the cur panel
        if (curClickedEl.closest("ul.visible")) {
          togglePanelClasses(curClickedEl.closest("ul.visible"), "remove"); // remove the visible tags
        }
        // add the visible class for the new panel
        togglePanelClasses(menuRootUL.querySelector("li > ul"), "add");
        configPanel(curClickedEl);
      }

      // Clicked the Prev level link btn
      if (curClickedEl.classList.contains("mobMenuPrevBtn")) {
        // remove the visible class for the cur panel
        if (curClickedEl.closest("ul.visible")) {
          togglePanelClasses(curClickedEl.closest("ul.visible"), "remove");
        }

        var parEl = getNextUlUp(curClickedEl); // a < li < ul < li < ul
        if (parEl) {
          // add the visible class for the new panel
          togglePanelClasses(parEl, "add");
        }

        if (parEl.previousElementSibling) {
          configPanel(parEl.previousElementSibling); // show the new panel
        }
      }

      // Clicked an actual page link - go to the requested page
      if (!curClickedEl.classList.contains("mobMenuPrevBtn") && !curClickedEl.classList.contains("mobMenuHomeBtn")) {
        window.location.href = curClickedEl.getAttribute("href");
      }

      return;
    }

    // if submenu ul beside it
    if (curClickedEl.nextElementSibling !== null && curClickedEl.nextElementSibling.nodeName === "UL") {
      // element has a submenu so show it after hiding the current one
      if (curClickedEl.closest("ul.visible")) {
        togglePanelClasses(curClickedEl.closest("ul.visible"), "remove");
      }

      togglePanelClasses(curClickedEl.nextElementSibling, "add");
      configPanel(curClickedEl);

      return;
    }
  }

  /*
   * Function: Ajax menu is loading for the first time so need to set it up
   /
  function initPanelLoad() {
    if (currHref !== "") {
      var classAdded = false;
      var siteMenuRoot = document.querySelectorAll(".sitemenu a");

      // 1st loop - remove visibility classes
      for (var i = 0; i < siteMenuRoot.length; i++) {
        var el1 = siteMenuRoot[i].parentElement.parentElement;
        if (el1) togglePanelClasses(el1, "remove");
      }

      // 2nd loop (need to be 2 loops so they dont cancel each other out) add visibility classes
      for (var i = 0; i < siteMenuRoot.length; i++) {
        if (siteMenuRoot[i].getAttribute("href") === currHref) {
          // if the cur link has a submenu then show this panel
          if (siteMenuRoot[i].nextElementSibling) {
            togglePanelClasses(siteMenuRoot[i].nextElementSibling, "add"); // ul
            configPanel(siteMenuRoot[i]); // a
            classAdded = true;
          }

          // if the cur link has a submenu
          if (!siteMenuRoot[i].nextElementSibling) {
            // otherwise use the parent panel id if it exists
            var el2 = siteMenuRoot[i].parentElement.parentElement;
            if (el2) {
              togglePanelClasses(el2, "add"); // ul
              configPanel(el2.previousElementSibling); // a
              classAdded = true;
            }
          }
        }
      }

      // if the page isnt found in the above loop add the home panel
      if (!classAdded) {
        togglePanelClasses(menuRootUL.children[0].children[1], "add");
        configPanel(menuRootUL.children[0].children[0]);
      }
    }

    end = Date.now();

    console.log(end - start);
  }

  /*
   * Function: Return the parent list ul (a < li < ul < li < ul) of el
   /
  function getNextUlUp(el) {
    if (el.parentElement.parentElement.parentElement.parentElement) return el.parentElement.parentElement.parentElement.parentElement;

    return undefined;
  }

  /*
   * Function: Determine what extra links and styles need added
   /
  function configPanel(currEl) {
    var isHomePanel = false;

    // this should never be the case should always be an 'A'
    if (currEl.nodeName === "UL") currEl = currEl.children[0];

    if (currEl.getAttribute("href") === "/" || currEl.classList.contains("mobMenuHomeBtn")) isHomePanel = true;

    // add the breadcrumb class for items that have a submenu
    if (currEl.nextElementSibling) {
      var meunLinks = currEl.nextElementSibling.children;
      for (var i = 0; i < meunLinks.length; i++) {
        if (meunLinks[i].children[1]) {
          meunLinks[i].children[0].classList.add("mobMenuBreadcrumb");
        }
      }
    }

    // config as section panel
    if (!isHomePanel) configSectionPanel(currEl);

    // config as home panel - add the home header to the home panel if not already there
    if (isHomePanel) configHomePanel();

    // remove duplicate Home backlinks if found
    if (currEl.nextElementSibling) {
      if (currEl.nextElementSibling.children[1].children[0].innerText === "Home") {
        currEl.nextElementSibling.children[1].remove();
      }
    }

    // append the Other links to the bottom - myportal etc
    appendOtherLinks(currEl, isHomePanel);

    // animate scroll back to the top of the menu
    scrollToMenuTop(isHomePanel);

    // hide the loading graphic
    menuLoading && menuLoading.classList.add("hide");

    // show the panel root ul
    Array.prototype.forEach.call(menuInitItems, function (item) {
      item.classList.remove("hide");
    });
  }

  /*
   * Function: animate scroll back to the top of the menu
   /
  function scrollToMenuTop(isHomePanel) {
    var scrollEl = document.querySelector(".sitemenu ul.visible li a.mobMenuHomeBtn");

    if (isHomePanel) scrollEl = document.querySelector(".sitemenu ul.visible li a.mobMenuHomeLink");

    if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
      scrollEl.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      scrollEl.scrollIntoView();
    }
  }

  /*
   * Function: append the "Other" links to the bottom of main menu - myportal etc
   /
  function appendOtherLinks(currEl, isHomePanel) {
    var otherEl = currEl.nextElementSibling;

    if (isHomePanel) otherEl = menuRootUL.children[0].children[1];

    if (otherEl.lastElementChild.innerHTML !== "") {
      // only add it if its not already there
      if (!otherEl.lastElementChild.children[0].classList.contains("slidemenu__other-links")) {
        var nodeOtherLinks = document.createElement("li");
        nodeOtherLinks.insertAdjacentElement("beforeend", otherLinks);
        otherEl.lastElementChild.insertAdjacentElement("afterend", nodeOtherLinks);
      }
    }

    if (otherEl.lastElementChild.innerHTML === "") {
      // if the user has been on this panel before there will already be an empty li from last time it was inserted
      otherEl.lastElementChild.insertAdjacentElement("beforeend", otherLinks);
    }
  }

  /*
   * Function: Set up non Home panel
   /
  function configSectionPanel(currEl) {
    // Home back-link - add to the top of the menu if not already there
    if (!currEl.nextElementSibling.children[0].children[0].classList.contains("mobMenuHomeBtn")) {
      var node1 = document.createElement("li");
      node1.innerHTML = '<a href="#" class="mobMenuHomeBtn">Home</a>';
      currEl.nextElementSibling.insertAdjacentElement("afterbegin", node1);
    }

    // Previous panel link - add to the to the 2nd position if not already there
    if (!currEl.nextElementSibling.children[1].children[0].classList.contains("mobMenuPrevBtn")) {
      var node3 = document.createElement("li");
      node3.innerHTML = '<a href="#" class="mobMenuPrevBtn">' + currEl.parentElement.parentElement.previousElementSibling.innerText + "</a>";
      currEl.nextElementSibling.children[0].insertAdjacentElement("afterend", node3);
    }

    // Menu header - add to the 3rd position if not already there
    if (!currEl.nextElementSibling.children[2].children[0].classList.contains("mobMenuHeader")) {
      var node4 = document.createElement("li");
      node4.innerHTML = '<span class="mobMenuHeader">' + currEl.innerText + "</span>";
      currEl.nextElementSibling.children[1].insertAdjacentElement("afterend", node4);
    }

    // Link to panels parent page - add to the 4th position if not already there
    if (!currEl.nextElementSibling.children[3].children[0].classList.contains("mobMenuMainBtn")) {
      var node2 = document.createElement("li");
      node2.innerHTML = '<a href="' + currEl.getAttribute("href") + '" class="mobMenuMainBtn" >' + currEl.innerText + " home</a>";
      currEl.nextElementSibling.children[2].insertAdjacentElement("afterend", node2);
    }
  }

  /*
   * Function: Set up Home panel - add the home header link to the panel if not already there
   /
  function configHomePanel() {
    // check the header link is not already there - then add it
    if (!menuRootUL.children[0].children[1].children[0].children[0].classList.contains("mobMenuHomeLink")) {
      var node = document.createElement("li");
      node.innerHTML = '<a href="/" class="mobMenuHomeLink">Home</a>';
      menuRootUL.children[0].children[1].insertAdjacentElement("afterbegin", node);
    }
  }

  /*
   * Event: Section link has been clicked
   /
  function doMenuItemClick(ev) {
    curClickedEl = ev.target;

    if (curClickedEl.dataset.sectid) {
      if (curClickedEl.nextSibling.nodeName !== "UL") {
        loadSect = curClickedEl.dataset.sectid;
        var url = getMenuAjaxUrl(curClickedEl.dataset.sectid);
        fetchMenu(url);
        return;
      }
    }

    showPanel();
  }

  /*
   * Event: Menu Click
   /
  function doMenuClick(e) {
    // Event: Menu item has been clicked
    if (e.target.matches(".sitemenu a")) {
      doMenuItemClick(e);
      e.preventDefault();
    }

    // Event: Menu close request
    if (e.target.matches("#close_mobile_menu")) {
      // unhide the stuff underneath
      Array.prototype.forEach.call(hideEls, function (item) {
        if (document.querySelector(item)) document.querySelector(item).classList.remove("hide");
      });

      menuCloseBtn.classList.add("hide");
      mobMenu.classList.remove("c-mobile-menu-visible");

      var sectLinksVisible = document.querySelectorAll(".sitemenu ul.visible");
      for (var i = 0; i < sectLinksVisible.length; i++) {
        togglePanelClasses(sectLinksVisible[i], "remove");
      }

      e.preventDefault();
    }
  }

  /*
   * Event: Open mobile menu request
   /
  function openMenuClick(e) {
    start = Date.now();

    // Hide the initial static page menu
    Array.prototype.forEach.call(menuInitItems, function (item) {
      item.classList.add("hide");
    });

    // show the menu container and close button
    mobMenu.classList.add("c-mobile-menu-visible");
    menuCloseBtn.classList.remove("hide");

    // Get the menu for the section the user is currently on if its not already loaded in
    getUsersCurrentSection();

    // Shrink all the main content blocks to prevent scrolling
    Array.prototype.forEach.call(hideEls, function (item) {
      if (document.querySelector(item)) document.querySelector(item).classList.add("hide");
    });

    // now get the url for the menu panel, load it, then display it
    var menuUrl = getMenuAjaxUrl(loadSect);

    if (menuUrl !== "") {
      if (arrLoaded.indexOf(menuUrl) < 0) {
        fetchMenu(menuUrl);
        arrLoaded.push(menuUrl);
      }

      // we have already loaded it so no need to fetch it
      if (arrLoaded.indexOf(menuUrl) > -1) {
        showPanel();
      }
    }

    // no menu panel for this url eg within /unimportant-area/...
    if (menuUrl === "") configPanel(menuRootUL.querySelector("a"));

    e.preventDefault();
  }

  /*
   * Listener: Open mobile menu request
   /
  if (menuOpenBtn) menuOpenBtn.addEventListener("click", openMenuClick);

  /*
   * Listener: Menu Click Events
   /
  mobMenu.addEventListener("click", doMenuClick);
})(document.getElementById("mobile-menu"));
*/

/*
 * Helper Function: Reorder items on page with class .c-order-listing
 * @author: Ryan Kaye
 * @version: 2
 * @date: October 2021 (rewrite)
 */


(function (nodes) {
  if (!nodes) return;
  /* --------------------------------------------
   * Sort all child elements in the container (node) by their "data-sort" value
   * Sort will MUTATE the data but give better render performance than stir.sort
   * ------------------------------------------- */

  var sortNodeItems = function sortNodeItems(node) {
    var sortType = node.getAttribute("data-sort-type") ? node.getAttribute("data-sort-type") : "";
    var children = Array.prototype.slice.call(node.querySelectorAll(".c-order-listing-item"));
    var sortedChildren = children.sort(function (a, b) {
      var aValue = a.getAttribute("data-sort");
      var bValue = b.getAttribute("data-sort");

      if (sortType === "int") {
        return parseInt(aValue) < parseInt(bValue) ? -1 : parseInt(aValue) > parseInt(bValue) ? 1 : 0;
      }

      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });
    node.innerHTML = stir.map(function (child) {
      return child.outerHTML;
    }, sortedChildren).join("");
  };
  /*
   * Loop all "c-order-listing" nodes on the page
   */


  stir.each(sortNodeItems, nodes);
})(stir.nodes(".c-order-listing"));

(function () {
  /**
   * Category heading
   */
  var category = document.head.querySelector('meta[name="category"]');
  var heading = document.querySelector("h1.c-automatic-page-heading");

  if (category && heading) {
    category = category.getAttribute("content");
    heading.insertAdjacentHTML("afterend", '<p class="c-category-label" data-category="' + category + '">' + category + '</p>');
  }
  /**
   * Inline Pullquotes
   */


  var pullquotes = Array.prototype.slice.call(document.querySelectorAll('blockquote.c-pullquote[data-element-anchor]'));

  for (var i = 0; i < pullquotes.length; i++) {
    var alignWith, pqParent, destinationContainer, destination;
    var pq = pullquotes[i];
    alignWith = pq.getAttribute("data-element-anchor");
    pqParent = pq.parentElement;
    destinationContainer = pqParent.previousElementSibling;

    if (destinationContainer) {
      if (alignWith && Number.parseInt(alignWith) > 0) {
        destination = destinationContainer.querySelector(".c-wysiwyg-content > :nth-child(" + alignWith + ")");
        destination && destination.insertAdjacentElement("beforebegin", pq);
      } else {
        destination = destinationContainer.querySelector(".c-wysiwyg-content");
        destination && destination.insertAdjacentElement("beforeend", pq);
      }

      destination && pqParent.parentNode.removeChild(pqParent);
    }
  }
})();
/**
 * Scroll back to the top button
 */


(function (backToTopButton) {
  var element; // the observed element

  if (backToTopButton) {
    backToTopButton.addEventListener("click", function () {
      stir.scrollTo(0, 0);
    });

    if (element = document.querySelector('#layout-header')) {
      stir.createIntersectionObserver({
        element: element,
        threshold: [0, 1],
        callback: function callback(entry) {
          if (entry.intersectionRatio > 0) {
            backToTopButton.classList.remove("c-scroll-to-top__visible");
          } else {
            backToTopButton.classList.add("c-scroll-to-top__visible");
          }
        }
      });
    }
  }
})(document.querySelector(".c-scroll-to-top"));
/*
 * @title: Search helpers
 * @description: To aid html generation
 * @author: Ryan Kaye
 */


var StirSearchHelpers = function () {
  /*
      SEARCH SUMMARY
   */
  var _formSummary = function _formSummary(total, start, end) {
    return end === 0 ? "<p>No results found for this query</p>" : "<p>Showing ".concat(start, " - ").concat(end, " of <strong>").concat(total, " results</strong></p>");
  };
  /*
      PAGINATION
   */

  /* Control the page calculations / rendering of the pagination nav */


  var _formPagination = function _formPagination(totalResults_, postsPerPage_, currentPage_, numOfLinks_) {
    var current = parseInt(currentPage_);
    var numOfLinks = getNumOfPages(parseInt(numOfLinks_));
    var total = getTotalPages(parseInt(totalResults_), parseInt(postsPerPage_));
    var start = getStartPage(current, numOfLinks);
    var end = getEndPage(numOfLinks, current, total);
    var values = {
      numOfLinks: numOfLinks,
      total: total,
      current: current,
      previous: current !== 1 ? current - 1 : 0,
      next: current !== total ? current + 1 : 0,
      range: getPageRange(start, end, numOfLinks, total, current)
    };
    return [renderPrevBtn(values), renderPageNav(values), renderNextBtn(values)].join("");
  };
  /*
      HELPERS
   */


  var getNumOfPages = function getNumOfPages(numLinks) {
    return numLinks % 2 === 0 ? numLinks : numLinks - 1;
  };

  var getTotalPages = function getTotalPages(totalResults, postsPerPage) {
    return Math.ceil(totalResults / postsPerPage);
  };

  var getIdealPadVal = function getIdealPadVal(numOfLinks) {
    return numOfLinks / 2;
  };

  var getCurrentPadVal = function getCurrentPadVal(start, end) {
    return end - start;
  };

  var getStartDifference = function getStartDifference(numOfLinks, start, current) {
    return getIdealPadVal(numOfLinks) - current + start;
  };

  var getEndDifference = function getEndDifference(numOfLinks, end, current) {
    return getIdealPadVal(numOfLinks) - (end - current);
  };

  var getAdjustedStart = function getAdjustedStart(dif, start) {
    return start - dif < 1 ? 1 : start - dif;
  };

  var getAdjustedEnd = function getAdjustedEnd(dif, total, end) {
    return end + dif > total ? total : end + dif;
  };
  /* Returns an array with the page numbers for the nav eg [4,5,6,7,8,9,10] */


  function getPageRange(start, end, numOfLinks, total, current) {
    if (getCurrentPadVal(start, end) === numOfLinks) {
      return stir.range(start, end, 1);
    }

    var endPadded = current - start !== getIdealPadVal(numOfLinks) ? getAdjustedEnd(getStartDifference(numOfLinks, start, current), total, end) : end;
    var startPadded = endPadded - current !== getIdealPadVal(numOfLinks) ? getAdjustedStart(getEndDifference(numOfLinks, current, endPadded), start) : start;
    return stir.range(startPadded, endPadded, 1);
  }
  /* Returns the start value for the pagination list */


  function getStartPage(current, numOfLinks) {
    var start = current > getIdealPadVal(numOfLinks) ? current - getIdealPadVal(numOfLinks) : 0;
    return start < 1 ? 1 : start;
  }
  /* Returns a end value for the paginaion list */


  function getEndPage(numOfLinks, current, total) {
    var end = getIdealPadVal(numOfLinks) + current;
    return end > total ? total : end;
  }
  /*
      RENDERERS
   */


  function renderNextBtn(vals) {
    return vals.current === vals.total ? "<div class=\"small-3 medium-3 cell\"></div>" : "\n        <div class=\"small-3 medium-3 cell text-right\">\n            <a href=\"#\" class=\"button small no-arrow\" aria-label=\"Next page\" data-page=\"".concat(vals.next, "\">\n              <span class=\"show-for-medium\">Next <span class=\"show-for-sr\">page</span></span>\n              <span class=\"uos-chevron-right\"></span> \n            </a>\n        </div> ");
  }

  function renderPrevBtn(vals) {
    return vals.current === 1 ? '<div class="small-3 medium-3 cell"></div>' : "\n        <div class=\"small-3 medium-3 cell\">\n            <a href=\"#\" class=\"button small no-arrow\" aria-label=\"Previous page\" data-page=\"".concat(vals.previous, "\">\n              <span class=\"uos-chevron-left\"></span> \n              <span class=\"show-for-medium\">Previous <span class=\"show-for-sr\">page</span></span>\n            </a>\n        </div> ");
  }

  function renderPageNav(vals) {
    return "\n        <nav class=\"small-6 medium-6 cell text-center u-font-bold\" aria-label=\"Pagination\">\n          <ul class=\"pagination show-for-large\">\n              ".concat(renderPageList(vals), "\n          </ul>\n          <p class=\"hide-for-large\">Page ").concat(vals.current, " of ").concat(vals.total, "</p>\n        </nav>");
  }

  function renderPageList(vals) {
    return stir.map(function (page) {
      return page === vals.current ? "<li class=\"current\">\n              <span class=\"show-for-sr\">You're on page</span> ".concat(page, "\n            </li>") : "<li>\n              <a href=\"#\" aria-label=\"Page ".concat(page, "\" data-page=\"").concat(page, "\">").concat(page, "</a>\n            </li>");
    }, vals.range).join("");
  }
  /*
     PUBLIC GET FUNCTIONS
   */


  return {
    formSearchSummaryHTML: _formSummary,
    renderSummary: _formSummary,
    // Nicer name
    formPaginationHTML: _formPagination,
    renderPagination: _formPagination // Nicer name

  };
}();
/*
@author: Ryan Kaye
@date: March 2022
@description: Enables a simple generic show / hide component with example html below

<div class="cell" data-showyhidey>
    <select>
        <option>Test</option>
        <option>Test2</option>
    </select>
    <div data-show="Test">
        <p>Test</p>
    </div>
    <div data-show="Test2">
        <p>Test 2</p>
    </div>
</div>
*/


(function (scope) {
  if (!scope) return;

  var initShowyHidey = function initShowyHidey(element) {
    var select = element.querySelector("select");
    var contents = Array.prototype.slice.call(element.querySelectorAll("[data-show]"));

    var showSelectedItem = function showSelectedItem(e) {
      var id = e.target.options[e.target.selectedIndex].value;
      var el = stir.node('[data-show="' + id + '"]');
      el && stir.each(function (item) {
        return item.classList.add("hide");
      }, contents);
      el && el.classList.remove("hide");
    };

    stir.each(function (item, index) {
      return index !== 0 && item.classList.add("hide");
    }, contents);
    select && (select.selectedIndex = "0");
    select && select.addEventListener("change", showSelectedItem);
  };

  stir.each(initShowyHidey, scope);
})(stir.nodes("[data-showyhidey]"));

if (self.UoS_StickyWidget) (function (widgets) {
  for (var sticky in widgets) {
    if (widgets.hasOwnProperty(sticky)) {
      new UoS_StickyWidget(widgets[sticky]);
    }
  }
})(document.querySelectorAll('.u-sticky'));
var stir = stir || {};
stir.widgets = stir.widgets || {};
/**
 * @name New Accordion
 * @author Ryan Kaye <ryan.kaye@stir.ac.uk>
 * @author Robert Morrison <r.w.morrison@stir.ac.uk>
 * @description example usage: myAccord = new stir.accord(el, true);
 * @param {Element} el is the element to be turned into an accordion
 * @param {Boolean} doDeepLink  true to allow deeplinking (off by default)
 **/

stir.accord = function () {
  /**
   * Just some housekeeping, not essential
   * 1) quick fixes: clen up any aria-expanded="false" attrs.
   * 2) check for Unique IDs
   */
  HOUSEKEEPING: {
    var debug = UoS_env.name !== "prod" ? true : false;
    var accordionIDs = [];
    Array.prototype.forEach.call(document.querySelectorAll(".stir-accordion"), function (item) {
      Array.prototype.forEach.call(item.querySelectorAll("[aria-controls]"), function (a) {
        accordionIDs.push(a.getAttribute("aria-controls"));
      });
      Array.prototype.forEach.call(item.querySelectorAll(".stir-accordion--inactive"), function (b) {
        b.classList.remove("stir-accordion--inactive");
      });
      Array.prototype.forEach.call(item.querySelectorAll(".stir__slideup,.stir__slidedown"), function (c) {
        c.classList.remove("stir__slideup");
        c.classList.remove("stir__slidedown");
      });
    });
    debug && accordionIDs.length > accordionIDs.filter(function (v, i, s) {
      return s.indexOf(v) === i;
    }).length ? console.warn("[Accordion] Duplicate IDs found!") : null;
  }
  /**
   * Links elsewhere on the page that link-to and automatically open an accordion item.
   * If the accordion is already open, leave it open (don't click() again or it will toggle closed).
   * Links must have:
   * 	- an href that matches the accordion ID
   *  - a data-attribute of `remote` with the value `accordion`
   */


  REMOTECONTROL: {
    var remotes = document.querySelectorAll('[data-remote="accordion"]');
    Array.prototype.forEach.call(remotes, function (remote) {
      remote.addEventListener("click", function (event) {
        var el = this.hasAttribute("href") && document.querySelector(this.getAttribute("href"));
        /* if the accordion exists, scroll to it; if it's not already expanded then do so */

        el && (stir.scrollToElement(el, 20), !el.hasAttribute("aria-expanded") && el.click());
        if (history.pushState) history.pushState(null, null, this.getAttribute("href"));else location.hash = "#" + this.getAttribute("href");
        event.preventDefault();
      });
    });
  }

  var _id = 0;

  var Accordion = function Accordion(element, enableDeeplink) {
    if (typeof this.init === "undefined") return console.error("Please call stir.accord() with `new`.");
    this.id = ++_id;
    this.settings = {
      deeplinked: false,
      doDeepLink: enableDeeplink ? true : false
    };
    if (!element) return;
    this.element = element;
    this.control = element.querySelector("[aria-controls]");
    this.panel = element.querySelector('[role="region"]');
    this.init();
  };

  Accordion.prototype.getHeading = function getHeading() {
    var heading;
    Array.prototype.forEach.call(this.element.children, function (child) {
      if (child.matches("h1,h2,h3,h4,h5,h6,accordion-summary")) {
        heading = child;
      }

      if (heading) return;
    });
    return heading;
  };

  Accordion.prototype.init = function () {
    var cid = "accordion-control-" + this.id;
    var pid = "accordion-panel-" + this.id;

    if (!this.control) {
      var h2 = this.getHeading();
      if (!h2) return;
      this.control = document.createElement("button");
      this.control.innerText = h2.innerText;
      this.control.classList.add("stir-accordion--btn");
      this.control.setAttribute("aria-controls", pid);
      this.control.setAttribute("aria-expanded", "false");
      this.control.id = cid;
      h2.innerHTML = "";
      h2.appendChild(this.control);
    }

    if (!this.panel) {
      this.panel = this.element.querySelector("div");
      if (!this.panel) return;
      this.panel.setAttribute("role", "region");
      this.panel.setAttribute("aria-labelledby", cid);
      this.panel.id = pid;
    }

    this.element.classList.add("stir-accordion");
    this.element.addEventListener("click", this.handleClick.bind(this));

    if (this.element.getAttribute("data-deeplink") === "false") {
      this.settings.doDeepLink = false; // Deeplinks forced off: this takes priority over
      // the more general `enableDeeplinks` setting.
    } // Activate the deeplink if
    // (a) deeplinks are allowed, and…


    if (this.settings.doDeepLink) {
      // (b) this accordion matches the current URL hash, and…
      if (this.panel.id == window.location.hash.slice(1)) {
        // (c) only toggle (i.e. open) the accordion if it's NOT already expanded
        if (!this.control.hasAttribute("aria-expanded") || this.control.getAttribute("aria-expanded") === "false") ;
        this.toggle();
      }
    }
  };
  /**
   * Toggle accordion open/closed:
   * The container element needs a CSS class.
   * The button control needs an aria attribute.
   */


  Accordion.prototype.toggle = function () {
    this.element && this.element.classList.toggle("stir-accordion--active");
    this.control && this.control.setAttribute("aria-expanded", this.control.getAttribute("aria-expanded") === "true" ? "false" : "true");
  };

  Accordion.prototype.handleClick = function (e) {
    if (!e.target) return; // capture clicks on CONTROL directly (<a>) or its
    // parent element (e.g. <h2> or <h3>) or a child
    // element (e.g. <span>). Ignore any other clicks and
    // just let those bubble on through.

    if (e.target == this.control || e.target == this.control.parentNode || e.target.parentNode == this.control) {
      this.toggle();

      if (this.settings.doDeepLink) {
        if (history.replaceState) history.replaceState(null, null, "#" + this.panel.id);else location.hash = "#" + this.panel.id;
      }

      e.preventDefault();
    }
  };

  return Accordion;
}();
/**
 * On load: Set up the accordions
 **/


(function () {
  var debug = UoS_env.name !== "prod" ? true : false; // Loop through all stir-accordion elements on the page, and
  // initialise each one as an Accordion widget.

  Array.prototype.forEach.call(document.querySelectorAll(".stir-accordion"), function (accordion) {
    debug && console.warn('[Accordion] Deprecated. Use data-behaviour="accordion" instead of .stir-accordion', accordion);
    new stir.accord(accordion, false);
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-behaviour="accordion"]'), function (accordion) {
    new stir.accord(accordion, false);
  });
})();

var stir = stir || {};
/*
   Deprecated - Replace with html Dialog
   Replaces the Foundation reveal modal
   @author: Ryan Kaye
   Will find modals already in the html
   or allow a modal to be built on the fly
 */

stir.Modal = function Modal(el) {
  var id;
  /* 
    Initiate the modal 
  */

  function initModal() {
    if (!el.hasAttribute("data-stirreveal")) return;
    id = el.id;
    var overlay = document.createElement("section");
    var openButtons = stir.nodes('[data-modalopen="' + id + '"]');
    var closeButton = el.querySelector(".close-button");

    if (!el.parentElement || !el.parentElement.classList.contains("reveal-overlay")) {
      overlay.insertAdjacentElement("beforeend", el);
      el.setAttribute("aria-hidden", true);
      el.setAttribute("role", "dialog");
      el.style.display = "none";
      overlay.classList.add("reveal-overlay");
      document.querySelector("body").insertAdjacentElement("beforeend", overlay);
    }

    overlay.setAttribute("aria-label", "Container for modal " + id);
    overlay.addEventListener("click", overlayClickHandler);
    /*
      Event: Listen for "Show Modal" clicks
     */

    openButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        open_();
        event.preventDefault();
      });
    });
    /*
      Event: Listen for "Close Modal" clicks
     */

    if (closeButton) {
      closeButton.onclick = function (e) {
        close_();
        e.preventDefault();
      };
    }
  }
  /*
    Function: Show the modal
   */


  function open_() {
    if (!el.hasAttribute("data-stirreveal")) return; //el.setAttribute('aria-hidden', false);

    el.removeAttribute("aria-hidden");
    el.style.display = "block";
    el.parentNode.style.display = "block";
  }
  /*
    Function: Hide the modal
   */


  function close_() {
    if (!el.hasAttribute("data-stirreveal")) return;

    if (el.classList.contains("reveal")) {
      el.setAttribute("aria-hidden", true);
      el.style.display = "none";
      el.parentNode.style.display = "none";
    }
  }

  function overlayClickHandler(event) {
    if (event.target != this) return;
    event.preventDefault();
    close_();
  }
  /*
    Function: Use this to create a modal if one doesnt already exist on the page
   */


  function _render(id, label) {
    var html = [];
    var modal = document.createElement("div");
    html.push('<button class="close-button" data-close aria-label="Close modal" type="button">');
    html.push('<span aria-hidden="true">&times;</span>');
    html.push("</button>");
    modal.innerHTML = html.join("\n");
    modal.setAttribute("aria-label", label);
    modal.setAttribute("data-stirreveal", "");
    modal.classList.add("reveal");
    modal.id = id;
    el = modal;
    initModal();
  }
  /*
    Function: Helper: Set the modal content
   */


  function setContent_(html, docFragment) {
    if (!el.hasAttribute("data-stirreveal")) return;
    var button = el.querySelector(".close-button"); // retain the close button for re-use

    el.innerHTML = html;
    docFragment && el.appendChild(docFragment); // insert DOM elements

    button && el.insertAdjacentElement("beforeend", button);
  }
  /*
    On Load: set the modal up
   */


  if (el) initModal();
  /*
    Public functions
   */

  return {
    getId: function getId() {
      return el.id;
    },
    setContent: function setContent(html, el) {
      setContent_(html, el);
    },
    open: function open() {
      open_();
    },
    close: function close() {
      close_();
    },
    render: function render(newid, newlabel) {
      id = newid;

      _render(newid, newlabel);
    }
  };
};
/*

   Dialog Component

 */


stir.Dialog = function Dialog(element_) {
  var close_ = function close_() {
    return element.close();
  };

  var open_ = function open_() {
    return element.showModal();
  };

  var getOpenBtns_ = function getOpenBtns_(id_) {
    return stir.nodes('[data-opendialog="' + id_ + '"]');
  };

  var getCloseBtn_ = function getCloseBtn_() {
    return element.querySelector("[data-closedialog]");
  };

  var setId_ = function setId_() {
    var ident = "dialog" + stir.Math.random(1000);
    element.dataset.dialog = ident;
    return ident;
  };

  var setContent_ = function setContent_(html) {
    stir.setHTML(element, html + renderCloseBtn_());
    initListeners();
  };

  var renderCloseBtn_ = function renderCloseBtn_() {
    return "<button data-closedialog class=\"close-button\">&times;</button>";
  };

  var initListeners = function initListeners(id_) {
    var closeBtn = getCloseBtn_();
    getOpenBtns_(id_).forEach(function (button) {
      button.addEventListener("click", function (e) {
        return open_();
      });
    });
    closeBtn && closeBtn.addEventListener("click", function (e) {
      return close_();
    });
  };
  /*
    Initilaise
  */


  var element = element_ ? element_ : document.createElement("dialog");
  var id = element.dataset.dialog ? element.dataset.dialog : setId_();
  !getCloseBtn_() && setContent_("");
  initListeners(id);
  /*
    Public functions
   */

  return {
    getId: function getId() {
      return element.dataset.dialog;
    },
    getDialog: function getDialog() {
      return element;
    },
    setContent: function setContent(html) {
      setContent_(html);
    },
    open: function open() {
      open_();
    },
    close: function close() {
      close_();
    }
  };
};
/*

   On load: Set up Modals and Dialogs found on the page
 
 */


(function (modals_, dialogs) {
  /* InitDialogs */
  var initDialogs = function initDialogs(dialogs) {
    stir.t4Globals = stir.t4Globals || {};
    stir.t4Globals.dialogs = stir.t4Globals.dialogs || [];
    dialogs.forEach(function (element) {
      stir.t4Globals.dialogs.push(stir.Dialog(element));
    });
  };
  /* Fallback to use legacy modal code */


  var dialogFallback = function dialogFallback(dialogs) {
    var dialogBtns = stir.nodes("[data-opendialog]");
    dialogs.forEach(function (element) {
      element.removeAttribute("data-dialog");
      element.classList.add("reveal");
      element.setAttribute("data-stirreveal", "");
      element.setAttribute("aria-label", "Modal box");
      element.setAttribute("id", element.dataset.dialog);
    });
    dialogBtns.forEach(function (element) {
      element.removeAttribute("data-opendialog");
      element.dataset.modalopen = element.dataset.opendialog;
    });
  };
  /* Dialog support??? */


  if (stir.node("dialog")) {
    typeof HTMLDialogElement === "function" ? initDialogs(dialogs) : dialogFallback(dialogs);
  }
  /* Legacy modals - rescan to get Dialog fallbak instances */


  var modals = stir.nodes("[data-stirreveal]");
  stir.t4Globals = stir.t4Globals || {};
  stir.t4Globals.modals = stir.t4Globals.modals || [];
  modals.forEach(function (el) {
    stir.t4Globals.modals.push(new stir.Modal(el));
  });
})(stir.nodes("[data-stirreveal]"), stir.nodes("dialog"));

var stir = stir || {};
/*
   New Tabs Component
   @author: Ryan Kaye and Robert Morrison

   USAGE
   --
   eg myTabs = stir.tabs(el, true);

   PARAMS
   --
   @el is the element to be turned into tabs
   @doDeepLink true / false to allow / disallow deeplinking
 */

stir.tabhelper = function () {
  var _id = 0;

  function _getId() {
    return ++_id;
  }

  return {
    getId: _getId
  };
}();
/*
	TAB COMPONENT
*/


stir.tabs = function (el, doDeepLink_) {
  if (!el) return;
  /* The data-deeplink param will override the supplied param */

  var doDeepLink = el.dataset.deeplink && el.dataset.deeplink === "false" ? false : doDeepLink_;
  /* 
    WARNING GLOBALS
    @el param
  */

  var deeplinked = false;
  var browsersize = stir.MediaQuery.current;
  var debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
  var accordionify = ["small", "medium"];
  var childElements = Array.prototype.slice.call(el.children);
  /*
     Set up tabs and Listen for clicks
   */

  function init(childElements) {
    el.classList.add("stir-tabs");
    el.setAttribute("role", "tablist");
    var tabs = [];
    var tabGroupId = stir.tabhelper.getId();
    var tabId = 0;
    getHeeders(childElements).forEach(function (control, index) {
      var panel = control.nextElementSibling.nodeName === "DIV" ? control.nextElementSibling : null;
      var id = "_" + tabGroupId + "_" + ++tabId;
      var button = document.createElement("button");

      if (control && panel && 0 === control.children.length) {
        tabs.push({
          id: tabId,
          control: control,
          panel: panel
        });
        initComponent(button, control, panel, id);
        initState(control, index);
      }
    });
    el.addEventListener("click", handleClick);
  }
  /*
    initComponent
  */


  var initComponent = function initComponent(button, control, panel, id) {
    // Classes
    control.classList.add("stir-tabs__tab");
    panel.classList.add("stir-tabs__content"); // Attributes

    control.setAttribute("role", "tab");
    panel.setAttribute("data-tab-content", "");
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("tabindex", "0"); // Text

    button.innerText = control.innerText; //control.innerHTML = "";

    stir.setHTML(control, ""); // Mutual ARIA/ID references

    panel.id = panel.id || "panel" + id;
    button.id = button.id || "tab" + id;
    button.setAttribute("aria-controls", panel.id);
    panel.setAttribute("aria-labelledby", button.id);
    control.appendChild(button);
  };
  /*
    State
  */


  var initState = function initState(control, index) {
    return index === 0 ? open(control) : close(control);
  };

  var open = function open(control) {
    control.classList.add("stir-tabs__tab--active"); // h2

    control.children[0].setAttribute("aria-selected", "true"); // btn

    control.children[0].setAttribute("tabindex", "-1"); // btn

    control.nextElementSibling.removeAttribute("aria-hidden"); //panel

    control.nextElementSibling.classList.remove("hide"); //panel
  };

  var close = function close(control) {
    control.classList.remove("stir-tabs__tab--active");
    control.children[0].setAttribute("aria-selected", "false");
    control.children[0].setAttribute("tabindex", "0");
    control.nextElementSibling.setAttribute("aria-hidden", "true");
    control.nextElementSibling.classList.add("hide");
  };
  /*
    Helpers
  */


  var getBehaviour = function getBehaviour(accordionify, browsersize) {
    return accordionify.includes(browsersize) ? "accordion" : "tabs";
  };

  var getHeeders = function getHeeders(childElements) {
    return childElements.filter(function (item) {
      if (item.matches("h2,h3,h4")) return item;
    });
  };

  var getClickedNode = function getClickedNode(ev) {
    if (ev.target.classList.contains("stir-tabs__tab")) return ev.target;
    if ((ev.target.nodeName === "A" || ev.target.nodeName === "BUTTON") && ev.target.parentNode.classList.contains("stir-tabs__tab")) return ev.target.parentNode;
    return null;
  };
  /*
     Events
   */


  var handleTabClick = function handleTabClick(control) {
    // Close all tabs
    Array.prototype.slice.call(control.parentElement.children).forEach(function (element) {
      if (element.classList.contains("stir-tabs__tab")) close(element);
    });
    open(control);
    return true;
  };
  /* 
    handleAccordionClick 
  */


  var handleAccordionClick = function handleAccordionClick(control) {
    control.nextElementSibling.getAttribute("aria-hidden") === "true" ? open(control) : close(control);
    return true;
  };
  /** 
  * handle all clicks withing tab DOM 
  **/


  function handleClick(ev) {
    var control = getClickedNode(ev);

    if (control) {
      getBehaviour(accordionify, browsersize) === "tabs" ? handleTabClick(control) : handleAccordionClick(control);

      if (doDeepLink) {
        var myhash = "#" + control.nextElementSibling.id;
        if (history.replaceState) history.replaceState(null, null, myhash);else location.hash = myhash;
      }
      /* Callbackify */


      if (control.hasAttribute("data-tab-callback")) {
        var chain = window;
        var callback;
        var callbackdata = control.getAttribute("data-tab-callback").split(".");

        while (callbackdata.length > 0) {
          var n = callbackdata.shift();

          if ("function" === typeof chain[n]) {
            callback = chain[n];
          } else if ("undefined" !== typeof chain[n]) {
            chain = chain[n];
          }
        }

        callback && callback();
      }

      ev.preventDefault();
    }
  }
  /*
     Reset the tabs to onload state
   */


  function reset(childElements) {
    if (!el || !childElements) return;
    getHeeders(childElements).forEach(function (control, index) {
      initState(control, index);
    });
  }
  /*
     Open correct tab panel if a deeplink is found
   */


  function deepLink() {
    var fragId, controller;

    if (fragId = window.location.hash.slice(1)) {
      if (controller = el.querySelector('[aria-controls="' + fragId + '"]')) {
        deeplinked = true; // Close all by default

        getHeeders(childElements).forEach(function (control) {
          if (control.classList.contains("stir-tabs__tab--active")) control.click();
        }); // Open the required one

        if (controller.getAttribute("aria-selected") !== "true") controller.click();
      }
    }
  }
  /*
     Browser has been resized to new breakpoint so need to reinitialise the tabs
   */


  window.addEventListener("MediaQueryChange", function () {
    if (stir.MediaQuery.current !== browsersize) {
      browsersize = stir.MediaQuery.current;
      getBehaviour(accordionify, browsersize);
      reset(childElements);
      doDeepLink && deepLink();
    }
  });
  /* 
    Initial set up
  */

  init(childElements, browsersize, accordionify);
  doDeepLink && deepLink();
  /*  
    Public get and set Functions 
  */

  return {
    isDeepLinked: function isDeepLinked() {
      return deeplinked;
    },
    getEl: function getEl() {
      return el;
    },
    // nicer name
    getElement: function getElement() {
      return el;
    }
  };
};
/*
   ON LOAD 
   Set up any tabs found on the page
 */


(function () {
  var tabNodes = stir.nodes('.stir-tabs,[data-behaviour="tabs"]');
  var doDeepLink = true; //const foo = "";

  if (!tabNodes) return;
  var tabs = tabNodes.map(function (tab) {
    return stir.tabs(tab, doDeepLink);
  });
  /* 
    Scroll to deep linked element if configured 
  */

  if (doDeepLink) {
    var deepLinkNodes = tabs.filter(function (tab) {
      if (tab.isDeepLinked()) return tab;
    });
    if (!deepLinkNodes[0]) return;
    setTimeout(function () {
      stir.scrollToElement(deepLinkNodes[0].getElement(), 120);
    }, 1500);
  }
})();

var stir = stir || {};

(function () {
  // if we are in preview, dynamically load the preview tools
  // otherwise just skip this
  switch (window.location.hostname) {
    case "localhost":
      stir.addScript('/src/js-other/t4-preview-tools.js');
      break;

    case "t4cms.stir.ac.uk":
      stir.addScript('/webcomponents/dist/js/other/t4-preview-tools.js');
      break;
  }
})();

(function (sliders) {
  var renderWrapper = function renderWrapper(classes) {
    return "<div class=\"u-padding-y ".concat(classes, "\"></div>");
  };

  sliders.forEach(function (el) {
    // Additional wrapper for wrappers now required
    if (el.getAttribute("data-ct") === "wrapper") {
      var div = stir.stringToNode(renderWrapper(el.classList.value));
      el.insertAdjacentElement("beforebegin", div);
      div.insertAdjacentElement("afterbegin", el);
    }

    tns({
      container: el,
      controls: false,
      navPosition: "bottom",
      autoHeight: true,
      lazyload: true
    });
  });
})(Array.prototype.slice.call(document.querySelectorAll("[data-tns]")).filter(function (el) {
  return el.id;
}));
/**
 *  Vimeo API background masthead embeds
 */


(function () {
  var autoplay = true;
  var pausedEvent = document.createEvent("Event");
  var endedEvent = document.createEvent("Event");
  pausedEvent.initEvent("paused", true, true);
  endedEvent.initEvent("ended", true, true);

  var insertBackgroundVideo = function insertBackgroundVideo(autoplay) {
    // only when not small
    //if (window.Foundation && "small" == Foundation.MediaQuery.current) return;
    if (stir.MediaQuery.current === "small") return;
    var elements = document.querySelectorAll(".vimeo-bg-video");
    elements && Array.prototype.forEach.call(elements, function (el, i) {
      var video = el.querySelector("div[data-videoId]"); // the container element

      var loops = video.getAttribute("data-noOfLoops"); // the number of times to loop the video

      var id = video.getAttribute("data-videoId"); // the Vimeo ID of the video

      var videoPlayer;
      var options = {
        id: id,
        background: true,
        // if true will ignore 'autoplay' setting and force autoplay
        loop: true,
        autoplay: autoplay,
        controls: false,
        dnt: true,
        transparent: true
      };
      videoPlayer = new Vimeo.Player(video, options);
      videoPlayer.on("play", function (data) {
        if (!autoplay) {
          videoPlayer.pause();
          video.setAttribute("data-playback", "paused");
        } else {
          video.setAttribute("data-playback", "playing");
        }
      });

      if (autoplay) {
        /* var videoTimeout = setTimeout(function() {
                  console.info('timeout!');
                  video.setAttribute("data-playback", "timeout");
              }, 2000); */
        videoPlayer.getDuration().then(function (duration) {
          //clearTimeout(videoTimeout);
          // stop playing after n loops
          (function (video, duration, loops) {
            setTimeout(function () {
              video.setAttribute("data-playback", "ended");
              videoPlayer.pause();
              video.dispatchEvent(endedEvent);
            }, duration * loops * 1000);
          })(video, duration, loops);
        }).catch(function (error) {
          console.error(error.name);
          video.style.display = "none";
        });
      }
    });
  }; //if ("connection" in navigator && navigator.connection.saveData) {
  //console.info("Data saving is enabled. Video background will not be enabled.");
  //TODO: trigger fallback function
  //return;
  //}

  /* if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        autoplay = false;
        console.info('User Agent prefers reduced motion. Video banners will not auto-play.');
    } */


  if (document.querySelector("div[data-videoId]")) insertBackgroundVideo(autoplay);
})();
/**
 * Vimeo API general embeds
 */


(function () {
  /**
   * Function: Embed the video on the page
   **/
  function insertEmbeddedVideo() {
    var id,
        thumb,
        date,
        title,
        elements = document.querySelectorAll("div[data-videoEmbedId]");
    elements && Array.prototype.forEach.call(elements, function (el, i) {
      id = el.getAttribute("data-videoEmbedId");
      id && new Vimeo.Player(el.id, {
        id: id,
        dnt: true,
        loop: false
      });
    });
  }
  /**
   * Function: Build the Schema  Object
   **/


  function buildSchema() {
    var schemaData = [];
    var i = 0;

    if (stir.vimeo) {
      for (var index in stir.vimeo) {
        schemaData.push({
          "@type": "VideoObject",
          position: i + 1,
          name: stir.vimeo[index].name,
          description: stir.vimeo[index].description,
          thumbnailUrl: "https://www.stir.ac.uk/data/video/?content=thumbnail&id=" + stir.vimeo[index].id,
          embedUrl: "https://www.stir.ac.uk/data/video/?content=video&id=" + stir.vimeo[index].id,
          url: "https://www.stir.ac.uk/data/video/?content=video&id=" + stir.vimeo[index].id,
          uploadDate: stir.vimeo[index].uploadDate
        });
        i++;
      }

      var schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.textContent = JSON.stringify({
        "@context": "http://schema.org",
        "@type": "ItemList",
        itemListElement: schemaData
      });
      document.body.insertAdjacentElement("afterbegin", schema);
    }
  }
  /**
   * ON LOAD
   * Loop through all the vided-embed elements on the page and activate
   * the Vimeo Player API for each one.
   */


  if (document.querySelector("div[data-videoEmbedId]")) {
    insertEmbeddedVideo();
  }

  if (document.querySelector("div[data-videoschema]")) {
    buildSchema();
  }
})();