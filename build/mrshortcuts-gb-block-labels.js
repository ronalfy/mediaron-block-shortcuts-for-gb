/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/blocks/utils/BlockTypes.js"
/*!*******************************************!*\
  !*** ./src/js/blocks/utils/BlockTypes.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v1Blocks: () => (/* binding */ v1Blocks),
/* harmony export */   v1VariationNames: () => (/* binding */ v1VariationNames),
/* harmony export */   v2Blocks: () => (/* binding */ v2Blocks),
/* harmony export */   vdVariationNames: () => (/* binding */ vdVariationNames)
/* harmony export */ });
/**
 * Begin v1 legacy block modifications.
 */
var v1Blocks = ['generateblocks/button-container', 'generateblocks/buttons', 'generateblocks/button', 'generateblocks/headline', 'generateblocks/container', 'generateblocks/grid', 'generateblocks/image', 'generateblocks/query-loop'];
var v1VariationNames = ['tabs', 'accordion'];

/**
 * V2 blocks that need to be labeled.
 */
var v2Blocks = ['generateblocks/text', 'generateblocks/element', 'generateblocks/media', 'generateblocks/shape', 'generateblocks/query', 'generateblocks/looper', 'generateblocks/query-no-results', 'generateblocks/query-page-numbers', 'generateblocks/loop-item', 'generateblocks-pro/accordion', 'generateblocks-pro/accordion-item', 'generateblocks-pro/accordion-toggle', 'generateblocks-pro/accordion-toggle-icon', 'generateblocks-pro/accordion-content', 'generateblocks-pro/tabs', 'generateblocks-pro/tabs-menu', 'generateblocks-pro/tab-menu-item', 'generateblocks-pro/tab-items', 'generateblocks-pro/tab-item', 'generateblocks/button-container', 'generateblocks-pro/navigation', 'generateblocks-pro/menu-container', 'generateblocks-pro/menu-toggle', 'generateblocks-pro/classic-menu', 'generateblocks-pro/classic-menu-item', 'generateblocks-pro/classic-sub-menu', 'generateblocks-pro/site-header'];
var vdVariationNames = [];


/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/escape-html"
/*!************************************!*\
  !*** external ["wp","escapeHtml"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["escapeHtml"];

/***/ },

/***/ "@wordpress/hooks"
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
(module) {

module.exports = window["wp"]["hooks"];

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
/*!*********************************************************!*\
  !*** ./src/js/blocks/components/GBBlockLabels/index.js ***!
  \*********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_escape_html__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/escape-html */ "@wordpress/escape-html");
/* harmony import */ var _wordpress_escape_html__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils_BlockTypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/BlockTypes */ "./src/js/blocks/utils/BlockTypes.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != _typeof(t) || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
;






// Add custom category
function addGenerateBlocksV1Category(categories) {
  return [].concat(_toConsumableArray(categories), [{
    slug: 'generateblocks-v1',
    title: 'GenerateBlocks V1',
    icon: null
  }]);
}

// Modify block registration for v1 and v2 blocks.
function modifyBlockRegistration(settings, name) {
  if (_utils_BlockTypes__WEBPACK_IMPORTED_MODULE_5__.v1Blocks.includes(name) && mrshortcutsgbPatternInserter.enableV1Blocks) {
    return _objectSpread(_objectSpread({}, settings), {}, {
      category: 'generateblocks-v1'
    });
  }
  return settings;
}

// Register filters
;(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('blocks.registerBlockType', 'gbcm/modify-block-category', modifyBlockRegistration, 1000);
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('blocks.getCategories', 'gbcm/add-v1-category', addGenerateBlocksV1Category);
if ('true' === mrshortcutsgbPatternInserter.enableV1Blocks) {
  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.removeFilter)('blocks.registerBlockType', 'generateblocks/disableBlocks');
}

// Register a plugin to get all blocks.
wp.plugins.registerPlugin('generateblocks-custom', {
  render: function render() {
    if ('true' !== mrshortcutsgbPatternInserter.enableV1Blocks) {
      return null;
    }
    var hasModifiedBlocks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    var allBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(function (select) {
      return select('core/blocks').getBlockTypes();
    }, []);
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
      if (allBlocks.length === 0 || hasModifiedBlocks.current) {
        return;
      }
      allBlocks.forEach(function (block) {
        if (block.name.includes('generateblocks')) {
          if (_utils_BlockTypes__WEBPACK_IMPORTED_MODULE_5__.v1Blocks.includes(block.name)) {
            /**
             * Re-Register v1 Blocks with updated Title and __experimentalLabel.
             */
            (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.unregisterBlockType)(block.name);
            // Get the original __experimentalLabel function if it exists.
            var originalLabel = block.__experimentalLabel;
            var v1Suffix = (0,_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_4__.escapeAttribute)(mrshortcutsgbPatternInserter.v1BlockSuffix);

            // Remove suffix from title if it already exists (from filter hook).
            var originalTitle = block.title;
            if (originalTitle.endsWith(' ' + v1Suffix)) {
              originalTitle = originalTitle.slice(0, -(' ' + v1Suffix).length);
            }

            // Re-register with updated title and override __experimentalLabel.
            ;(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.registerBlockType)(block.name, _objectSpread(_objectSpread({}, block), {}, {
              title: originalTitle + ' ' + v1Suffix,
              category: 'generateblocks-v1',
              __experimentalLabel: originalLabel ? function (attrs, context) {
                var _attrs$metadata;
                var customName = (attrs === null || attrs === void 0 || (_attrs$metadata = attrs.metadata) === null || _attrs$metadata === void 0 ? void 0 : _attrs$metadata.name) || '';
                if ('list-view' === (context === null || context === void 0 ? void 0 : context.context) && customName) {
                  // For custom names, don't add suffix if already present.
                  return customName;
                }
                return originalLabel(attrs, context) + ' ' + v1Suffix;
              } : undefined
            }));

            // Get all variations of the v1 Blocks and update the title.
            var variations = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.getBlockVariations)(block.name);
            if (variations) {
              variations.forEach(function (variation) {
                // Find the specific variation.
                (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.unregisterBlockVariation)(block.name, variation.name);

                // Change title of variation.
                variation.title = variation.title + ' ' + v1Suffix;
                (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.registerBlockVariation)(block.name, variation);
              });
            }
          } else {
            /**
             * Re-Register v2 Blocks with updated Title.
             */
            (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.unregisterBlockType)(block.name);
            // Re-register with updated title.
            (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.registerBlockType)(block.name, _objectSpread(_objectSpread({}, block), {}, {
              title: block.title + ' ' + (0,_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_4__.escapeAttribute)(mrshortcutsgbPatternInserter.v2BlockSuffix)
            }));

            // Get all variations of the v2 Blocks and update the title.
            var _variations = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.getBlockVariations)(block.name);
            if (_variations) {
              _variations.forEach(function (variation) {
                // Find the specific variation.
                (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.unregisterBlockVariation)(block.name, variation.name);

                // Change title of variation.
                variation.title = variation.title + ' ' + (0,_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_4__.escapeAttribute)(mrshortcutsgbPatternInserter.v2BlockSuffix);
                (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.registerBlockVariation)(block.name, variation);
              });
            }
          }
        }
      });

      // Mark as modified to prevent re-triggering
      hasModifiedBlocks.current = true;
    }, [allBlocks]);
    return null;
  }
});
})();

/******/ })()
;
//# sourceMappingURL=mrshortcuts-gb-block-labels.js.map