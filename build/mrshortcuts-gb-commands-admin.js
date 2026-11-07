/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/blocks/commands/components/commands/RefreshCSSFiles.js"
/*!***********************************************************************!*\
  !*** ./src/js/blocks/commands/components/commands/RefreshCSSFiles.js ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useRefreshCSSFilesCommand: () => (/* binding */ useRefreshCSSFilesCommand)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_commands__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/commands */ "@wordpress/commands");
/* harmony import */ var _wordpress_commands__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_commands__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _modals_RefreshCSSFilesModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modals/RefreshCSSFilesModal */ "./src/js/blocks/commands/components/modals/RefreshCSSFilesModal.js");
/* harmony import */ var _icons_GBIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../icons/GBIcon */ "./src/js/blocks/commands/components/icons/GBIcon.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * Command to refresh GenerateBlocks CSS files.
 */

;






/**
 * Hook to register the Refresh CSS Files command.
 *
 * @return {JSX.Element|null} The RefreshCSSFiles component.
 */
function useRefreshCSSFilesCommand() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isLoading = _useState4[0],
    setIsLoading = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState6 = _slicedToArray(_useState5, 2),
    message = _useState6[0],
    setMessage = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    error = _useState8[0],
    setError = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState0 = _slicedToArray(_useState9, 2),
    warning = _useState0[0],
    setWarning = _useState0[1];
  (0,_wordpress_commands__WEBPACK_IMPORTED_MODULE_1__.useCommand)({
    name: 'mrshortcuts-gb-refresh-css-files',
    label: 'GenerateBlocks: Generate CSS Files',
    keywords: ['generate', 'css', 'files', 'generateblocks', 'regenerate'],
    icon: /*#__PURE__*/React.createElement(_icons_GBIcon__WEBPACK_IMPORTED_MODULE_4__["default"], {
      width: "16",
      height: "16"
    }),
    callback: function callback() {
      setIsOpen(true);
      setIsLoading(true);
      setError(false);
      setWarning(false);
      setMessage('');
      _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: '/mediaron/block-shortcuts-for-gb/v1/regenerate_css_files',
        method: 'POST'
      }).then(function (result) {
        setIsLoading(false);
        if (result.success) {
          setMessage(result.response || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('CSS files regenerated successfully.', 'mediaron-block-shortcuts-for-gb'));
          setTimeout(function () {
            setIsOpen(false);
          }, 2000);
        } else {
          setError(true);
          setMessage(result.response || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Failed to regenerate CSS files.', 'mediaron-block-shortcuts-for-gb'));
        }
      })["catch"](function (err) {
        setIsLoading(false);
        // Check if it's a permission error.
        if (err.code === 'rest_forbidden' || err.status === 401 || err.status === 403) {
          setError(true);
          setMessage((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('You do not have permission to refresh CSS files.', 'mediaron-block-shortcuts-for-gb'));
        } else {
          setError(true);
          setMessage(err.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('An error occurred while regenerating CSS files.', 'mediaron-block-shortcuts-for-gb'));
        }
      });
    },
    context: 'admin' // Works in both admin and block editor.
  });
  return /*#__PURE__*/React.createElement(_modals_RefreshCSSFilesModal__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isOpen: isOpen,
    onClose: function onClose() {
      return setIsOpen(false);
    },
    isLoading: isLoading,
    message: message,
    error: error,
    warning: warning
  });
}

/***/ },

/***/ "./src/js/blocks/commands/components/icons/GBIcon.js"
/*!***********************************************************!*\
  !*** ./src/js/blocks/commands/components/icons/GBIcon.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GenerateBlocks icon component for GB-related commands.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} The GBIcon component.
 */
var GBIcon = function GBIcon(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 50 60.12",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M6.686 31.622V18.918a.077.077 0 0 1 .05-.072l6.5-2.313 6.5-2.313 9.682-3.445L39.1 7.33a.067.067 0 0 0 .036-.028.074.074 0 0 0 .014-.044V.076a.077.077 0 0 0-.032-.062.076.076 0 0 0-.069-.009l-13 4.625-13 4.625-6.5 2.313-6.5 2.313a.067.067 0 0 0-.036.028.097.097 0 0 0-.013.046V52.067c0 .026.013.048.032.062s.044.018.069.009l3.267-1.163 3.267-1.163c.015-.005.028-.015.036-.028s.014-.028.014-.044V37.999l.001-6.377c-.001 0 0 0 0 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m23.949 29.976 13-4.625 13-4.625c.015-.005.028-.015.036-.028s.015-.028.015-.044V8.056a.077.077 0 0 0-.032-.062.076.076 0 0 0-.069-.009l-13 4.625-13 4.625-6.5 2.313-6.5 2.313a.067.067 0 0 0-.036.028.074.074 0 0 0-.014.044V60.045c0 .026.013.048.032.062a.076.076 0 0 0 .069.009l6.475-2.304 6.475-2.304 6.525-2.322 6.525-2.322 6.5-2.313 6.5-2.313c.015-.005.028-.015.036-.028s.014-.025.014-.041V27.193a.077.077 0 0 0-.032-.062.076.076 0 0 0-.069-.009l-6.45 2.295L37 31.711a.067.067 0 0 0-.036.028.074.074 0 0 0-.014.044v6.272a.077.077 0 0 1-.05.072l-6.45 2.295L24 42.715a.075.075 0 0 1-.101-.071V30.046c0-.016.005-.031.014-.044a.08.08 0 0 1 .036-.026z"
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GBIcon);

/***/ },

/***/ "./src/js/blocks/commands/components/modals/RefreshCSSFilesModal.js"
/*!**************************************************************************!*\
  !*** ./src/js/blocks/commands/components/modals/RefreshCSSFilesModal.js ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Modal for refreshing CSS files.
 */




/**
 * RefreshCSSFilesModal component.
 *
 * @param {Object}   props           - Component props.
 * @param {boolean}  props.isOpen    - Boolean to control modal visibility.
 * @param {Function} props.onClose   - Callback when modal is closed.
 * @param {boolean}  props.isLoading - Boolean indicating loading state.
 * @param {string}   props.message   - Message to display.
 * @param {boolean}  props.error     - Boolean indicating error state.
 * @param {boolean}  props.warning   - Boolean indicating warning state.
 * @return {JSX.Element|null} The RefreshCSSFilesModal component.
 */
var RefreshCSSFilesModal = function RefreshCSSFilesModal(_ref) {
  var isOpen = _ref.isOpen,
    onClose = _ref.onClose,
    isLoading = _ref.isLoading,
    message = _ref.message,
    error = _ref.error,
    warning = _ref.warning;
  if (!isOpen) {
    return null;
  }

  // Determine message color.
  var messageColor = '#00a32a'; // Success color.
  if (error) {
    messageColor = '#d63638'; // Error color.
  } else if (warning) {
    messageColor = '#dba617'; // Warning color.
  }
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Modal, {
    isDismissible: !isLoading,
    shouldCloseOnClickOutside: false,
    onRequestClose: function onRequestClose() {
      onClose();
    },
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Generate CSS Files', 'mediaron-block-shortcuts-for-gb')
  }, isLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Spinner, null), /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Refreshing CSS files…', 'mediaron-block-shortcuts-for-gb'))), !isLoading && message && /*#__PURE__*/React.createElement("p", {
    style: {
      color: messageColor
    }
  }, message));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RefreshCSSFilesModal);

/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ },

/***/ "react-dom/client"
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
(module) {

module.exports = window["ReactDOM"];

/***/ },

/***/ "@wordpress/api-fetch"
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["apiFetch"];

/***/ },

/***/ "@wordpress/commands"
/*!**********************************!*\
  !*** external ["wp","commands"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["commands"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "@wordpress/plugins"
/*!*********************************!*\
  !*** external ["wp","plugins"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["plugins"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************************************!*\
  !*** ./src/js/blocks/commands/commands-admin.js ***!
  \**************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom/client */ "react-dom/client");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom_client__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_commands_RefreshCSSFiles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/commands/RefreshCSSFiles */ "./src/js/blocks/commands/components/commands/RefreshCSSFiles.js");
/**
 * Admin-wide commands registration.
 */





/**
 * Commands admin component.
 *
 * @return {JSX.Element|null} The CommandsAdmin component.
 */
var CommandsAdmin = function CommandsAdmin() {
  var refreshCSSFilesModal = (0,_components_commands_RefreshCSSFiles__WEBPACK_IMPORTED_MODULE_2__.useRefreshCSSFilesCommand)();
  return refreshCSSFilesModal;
};

// Works in the block editor.
(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__.registerPlugin)('mrshortcuts-gb-commands-admin', {
  render: CommandsAdmin
});

// Works in the admin area (non-block editor).
// Attach to admin footer div.
var rootElement = document.getElementById('mrshortcuts-gb-commands-admin');
if (rootElement) {
  var root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_0__.createRoot)(rootElement);
  root.render(/*#__PURE__*/React.createElement(CommandsAdmin, null));
}
})();

/******/ })()
;
//# sourceMappingURL=mrshortcuts-gb-commands-admin.js.map