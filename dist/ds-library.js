/*! SupremeInput Library v1.0.0 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["Ds-library"] = {}, global.Vue));
})(this, (function (exports, vue) { 'use strict';

  var md5Exports = {};
  var md5 = {
    get exports(){ return md5Exports; },
    set exports(v){ md5Exports = v; },
  };

  var cryptExports = {};
  var crypt = {
    get exports(){ return cryptExports; },
    set exports(v){ cryptExports = v; },
  };

  (function () {
    var base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      crypt$1 = {
        // Bit-wise rotation left
        rotl: function (n, b) {
          return n << b | n >>> 32 - b;
        },
        // Bit-wise rotation right
        rotr: function (n, b) {
          return n << 32 - b | n >>> b;
        },
        // Swap big-endian to little-endian and vice versa
        endian: function (n) {
          // If number given, swap endian
          if (n.constructor == Number) {
            return crypt$1.rotl(n, 8) & 0x00FF00FF | crypt$1.rotl(n, 24) & 0xFF00FF00;
          }

          // Else, assume array and swap all items
          for (var i = 0; i < n.length; i++) n[i] = crypt$1.endian(n[i]);
          return n;
        },
        // Generate an array of any length of random bytes
        randomBytes: function (n) {
          for (var bytes = []; n > 0; n--) bytes.push(Math.floor(Math.random() * 256));
          return bytes;
        },
        // Convert a byte array to big-endian 32-bit words
        bytesToWords: function (bytes) {
          for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8) words[b >>> 5] |= bytes[i] << 24 - b % 32;
          return words;
        },
        // Convert big-endian 32-bit words to a byte array
        wordsToBytes: function (words) {
          for (var bytes = [], b = 0; b < words.length * 32; b += 8) bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xFF);
          return bytes;
        },
        // Convert a byte array to a hex string
        bytesToHex: function (bytes) {
          for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
          }
          return hex.join('');
        },
        // Convert a hex string to a byte array
        hexToBytes: function (hex) {
          for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
          return bytes;
        },
        // Convert a byte array to a base-64 string
        bytesToBase64: function (bytes) {
          for (var base64 = [], i = 0; i < bytes.length; i += 3) {
            var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
            for (var j = 0; j < 4; j++) if (i * 8 + j * 6 <= bytes.length * 8) base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 0x3F));else base64.push('=');
          }
          return base64.join('');
        },
        // Convert a base-64 string to a byte array
        base64ToBytes: function (base64) {
          // Remove non-base-64 characters
          base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');
          for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
            if (imod4 == 0) continue;
            bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
          }
          return bytes;
        }
      };
    crypt.exports = crypt$1;
  })();

  var charenc = {
    // UTF-8 encoding
    utf8: {
      // Convert a string to a byte array
      stringToBytes: function (str) {
        return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
      },
      // Convert a byte array to a string
      bytesToString: function (bytes) {
        return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
      }
    },
    // Binary encoding
    bin: {
      // Convert a string to a byte array
      stringToBytes: function (str) {
        for (var bytes = [], i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i) & 0xFF);
        return bytes;
      },
      // Convert a byte array to a string
      bytesToString: function (bytes) {
        for (var str = [], i = 0; i < bytes.length; i++) str.push(String.fromCharCode(bytes[i]));
        return str.join('');
      }
    }
  };
  var charenc_1 = charenc;

  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */

  // The _isBuffer check is for Safari 5-7 support, because it's missing
  // Object.prototype.constructor. Remove this eventually
  var isBuffer_1 = function (obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
  };
  function isBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
  }

  // For Node v0.10 support. Remove this eventually.
  function isSlowBuffer(obj) {
    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
  }

  (function () {
    var crypt = cryptExports,
      utf8 = charenc_1.utf8,
      isBuffer = isBuffer_1,
      bin = charenc_1.bin,
      // The core
      md5$1 = function (message, options) {
        // Convert to byte array
        if (message.constructor == String) {
          if (options && options.encoding === 'binary') message = bin.stringToBytes(message);else message = utf8.stringToBytes(message);
        } else if (isBuffer(message)) message = Array.prototype.slice.call(message, 0);else if (!Array.isArray(message) && message.constructor !== Uint8Array) message = message.toString();
        // else, assume byte array already

        var m = crypt.bytesToWords(message),
          l = message.length * 8,
          a = 1732584193,
          b = -271733879,
          c = -1732584194,
          d = 271733878;

        // Swap endian
        for (var i = 0; i < m.length; i++) {
          m[i] = (m[i] << 8 | m[i] >>> 24) & 0x00FF00FF | (m[i] << 24 | m[i] >>> 8) & 0xFF00FF00;
        }

        // Padding
        m[l >>> 5] |= 0x80 << l % 32;
        m[(l + 64 >>> 9 << 4) + 14] = l;

        // Method shortcuts
        var FF = md5$1._ff,
          GG = md5$1._gg,
          HH = md5$1._hh,
          II = md5$1._ii;
        for (var i = 0; i < m.length; i += 16) {
          var aa = a,
            bb = b,
            cc = c,
            dd = d;
          a = FF(a, b, c, d, m[i + 0], 7, -680876936);
          d = FF(d, a, b, c, m[i + 1], 12, -389564586);
          c = FF(c, d, a, b, m[i + 2], 17, 606105819);
          b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
          a = FF(a, b, c, d, m[i + 4], 7, -176418897);
          d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
          c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
          b = FF(b, c, d, a, m[i + 7], 22, -45705983);
          a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
          d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
          c = FF(c, d, a, b, m[i + 10], 17, -42063);
          b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
          a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
          d = FF(d, a, b, c, m[i + 13], 12, -40341101);
          c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
          b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
          a = GG(a, b, c, d, m[i + 1], 5, -165796510);
          d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
          c = GG(c, d, a, b, m[i + 11], 14, 643717713);
          b = GG(b, c, d, a, m[i + 0], 20, -373897302);
          a = GG(a, b, c, d, m[i + 5], 5, -701558691);
          d = GG(d, a, b, c, m[i + 10], 9, 38016083);
          c = GG(c, d, a, b, m[i + 15], 14, -660478335);
          b = GG(b, c, d, a, m[i + 4], 20, -405537848);
          a = GG(a, b, c, d, m[i + 9], 5, 568446438);
          d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
          c = GG(c, d, a, b, m[i + 3], 14, -187363961);
          b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
          a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
          d = GG(d, a, b, c, m[i + 2], 9, -51403784);
          c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
          b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
          a = HH(a, b, c, d, m[i + 5], 4, -378558);
          d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
          c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
          b = HH(b, c, d, a, m[i + 14], 23, -35309556);
          a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
          d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
          c = HH(c, d, a, b, m[i + 7], 16, -155497632);
          b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
          a = HH(a, b, c, d, m[i + 13], 4, 681279174);
          d = HH(d, a, b, c, m[i + 0], 11, -358537222);
          c = HH(c, d, a, b, m[i + 3], 16, -722521979);
          b = HH(b, c, d, a, m[i + 6], 23, 76029189);
          a = HH(a, b, c, d, m[i + 9], 4, -640364487);
          d = HH(d, a, b, c, m[i + 12], 11, -421815835);
          c = HH(c, d, a, b, m[i + 15], 16, 530742520);
          b = HH(b, c, d, a, m[i + 2], 23, -995338651);
          a = II(a, b, c, d, m[i + 0], 6, -198630844);
          d = II(d, a, b, c, m[i + 7], 10, 1126891415);
          c = II(c, d, a, b, m[i + 14], 15, -1416354905);
          b = II(b, c, d, a, m[i + 5], 21, -57434055);
          a = II(a, b, c, d, m[i + 12], 6, 1700485571);
          d = II(d, a, b, c, m[i + 3], 10, -1894986606);
          c = II(c, d, a, b, m[i + 10], 15, -1051523);
          b = II(b, c, d, a, m[i + 1], 21, -2054922799);
          a = II(a, b, c, d, m[i + 8], 6, 1873313359);
          d = II(d, a, b, c, m[i + 15], 10, -30611744);
          c = II(c, d, a, b, m[i + 6], 15, -1560198380);
          b = II(b, c, d, a, m[i + 13], 21, 1309151649);
          a = II(a, b, c, d, m[i + 4], 6, -145523070);
          d = II(d, a, b, c, m[i + 11], 10, -1120210379);
          c = II(c, d, a, b, m[i + 2], 15, 718787259);
          b = II(b, c, d, a, m[i + 9], 21, -343485551);
          a = a + aa >>> 0;
          b = b + bb >>> 0;
          c = c + cc >>> 0;
          d = d + dd >>> 0;
        }
        return crypt.endian([a, b, c, d]);
      };

    // Auxiliary functions
    md5$1._ff = function (a, b, c, d, x, s, t) {
      var n = a + (b & c | ~b & d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md5$1._gg = function (a, b, c, d, x, s, t) {
      var n = a + (b & d | c & ~d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md5$1._hh = function (a, b, c, d, x, s, t) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md5$1._ii = function (a, b, c, d, x, s, t) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };

    // Package private blocksize
    md5$1._blocksize = 16;
    md5$1._digestsize = 16;
    md5.exports = function (message, options) {
      if (message === undefined || message === null) throw new Error('Illegal argument ' + message);
      var digestbytes = crypt.wordsToBytes(md5$1(message, options));
      return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt.bytesToHex(digestbytes);
    };
  })();

  // heavily inspired from:
  // https://www.youtube.com/watch?v=CALrQCw41dI
  // (...watch to understand v-model with custom components)
  var script = vue.defineComponent({
      name: "SupremeLabel",
      props: {
          modelValue: {
              type: String,
          },
          minlength: {
              type: Number,
              default: 0,
          },
          type: {
              type: String,
              default: "text",
          },
          id: {
              type: String,
              default: "",
          },
          label: {
              type: String,
              default: "",
          },
          placeholder: {
              type: String,
              default: "",
          },
          description: {
              type: String,
              default: "",
          },
          min: {
              type: Number,
              default: 0,
          },
          max: {
              type: Number,
              default: 1,
          },
          autocomplete: {
              type: String,
              default: "",
          },
          disabled: {
              type: Boolean,
              default: false,
          },
          step: {
              type: Number,
              default: 0,
          },
          required: {
              type: Boolean,
              default: false,
          },
      },
      data: function () {
          return {
              realId: "",
          };
      },
      computed: {
          describedById: function () {
              return this.realId + "-help";
          },
          amountOfDivisionSteps: function () {
              var length = Math.floor(this.max - this.min);
              return Number(Math.floor(length / this.step) + 1);
          },
      },
      created: function () {
          // ... give random id if not set
          if (this.id == "") {
              this.realId = md5Exports(this.label);
          }
          else {
              this.realId = this.id;
          }
      },
  });

  const _hoisted_1 = { class: "mt-2" };
  const _hoisted_2 = ["for"];
  const _hoisted_3 = ["id", "placeholder", "value", "disabled", "model", "required", "aria-describedby"];
  const _hoisted_4 = ["id", "model", "placeholder", "required"];
  const _hoisted_5 = ["id", "value", "required", "placeholder", "model", "aria-describedby"];
  const _hoisted_6 = ["id", "value", "required", "placeholder", "model", "aria-describedby"];
  const _hoisted_7 = { key: 5 };
  const _hoisted_8 = ["id", "required", "min", "max", "value", "step", "aria-describedby"];
  const _hoisted_9 = {
    key: 0,
    class: "w-full flex justify-between text-xs px-2",
    "aria-hidden": "true"
  };
  const _hoisted_10 = {
    key: 6,
    class: "div"
  };
  const _hoisted_11 = ["id", "required", "value"];
  const _hoisted_12 = ["id", "required", "value"];
  const _hoisted_13 = { key: 7 };
  const _hoisted_14 = ["id", "required", "model", "aria-describedby", "value"];
  const _hoisted_15 = ["id", "required", "model", "aria-describedby", "value"];
  const _hoisted_16 = ["id", "required", "value", "placeholder", "model", "aria-describedby"];
  const _hoisted_17 = ["required", "autocomplete", "minlength", "model", "aria-describedby"];
  const _hoisted_18 = ["model", "value", "required", "placeholder", "aria-describedby"];
  const _hoisted_19 = ["id", "value", "placeholder", "min", "model", "aria-describedby"];
  const _hoisted_20 = ["id"];

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
      (_ctx.label)
        ? (vue.openBlock(), vue.createElementBlock("label", {
            key: 0,
            for: _ctx.realId,
            class: "block mb-2 text-sm font-medium"
          }, vue.toDisplayString(_ctx.label), 9 /* TEXT, PROPS */, _hoisted_2))
        : vue.createCommentVNode("v-if", true),
      (_ctx.type == 'text')
        ? (vue.openBlock(), vue.createElementBlock("input", {
            key: 1,
            id: _ctx.realId,
            type: "text",
            placeholder: _ctx.placeholder,
            value: _ctx.modelValue,
            disabled: _ctx.disabled,
            class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5",
            model: _ctx.modelValue,
            required: _ctx.required,
            "aria-describedby": _ctx.describedById,
            onInput: _cache[0] || (_cache[0] = $event => (_ctx.$emit('update:modelValue', $event.target.value)))
          }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_3))
        : vue.createCommentVNode("v-if", true),
      (_ctx.type == 'textarea')
        ? (vue.openBlock(), vue.createElementBlock("textarea", {
            key: 2,
            id: _ctx.realId,
            rows: "4",
            model: _ctx.modelValue,
            class: "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-xl shadow border border-gray-300 focus:ring-green-500 focus:border-green-500 focus:outline-none",
            autocorrect: "off",
            spellcheck: "false",
            placeholder: _ctx.placeholder,
            required: _ctx.required,
            onInput: _cache[1] || (_cache[1] = $event => (_ctx.$emit('update:modelValue', $event.target.value)))
          }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_4))
        : vue.createCommentVNode("v-if", true),
      (_ctx.type == 'time')
        ? (vue.openBlock(), vue.createElementBlock("input", {
            key: 3,
            id: _ctx.realId,
            type: "time",
            value: _ctx.modelValue,
            required: _ctx.required,
            placeholder: _ctx.placeholder,
            class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5",
            model: _ctx.modelValue,
            "aria-describedby": _ctx.describedById,
            onInput: _cache[2] || (_cache[2] = $event => (_ctx.$emit('update:modelValue', $event.target.value)))
          }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_5))
        : vue.createCommentVNode("v-if", true),
      (_ctx.type == 'color')
        ? (vue.openBlock(), vue.createElementBlock("input", {
            key: 4,
            id: _ctx.realId,
            type: "color",
            value: _ctx.modelValue,
            required: _ctx.required,
            placeholder: _ctx.placeholder,
            class: "bg-gray-50 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 focus:outline-none h-14 block w-full",
            model: _ctx.modelValue,
            "aria-describedby": _ctx.describedById,
            onInput: _cache[3] || (_cache[3] = $event => (_ctx.$emit('update:modelValue', $event.target.value)))
          }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_6))
        : (_ctx.type == 'range')
          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
              vue.createElementVNode("input", {
                id: _ctx.realId,
                type: "range",
                required: _ctx.required,
                min: _ctx.min,
                max: _ctx.max,
                value: _ctx.modelValue,
                class: "range",
                step: _ctx.step,
                "aria-describedby": _ctx.describedById,
                onInput: _cache[4] || (_cache[4] = $event => (_ctx.$emit('update:modelValue', $event.target.value)))
              }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_8),
              (_ctx.step > 0)
                ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.amountOfDivisionSteps, (index) => {
                      return (vue.openBlock(), vue.createElementBlock("span", {
                        key: index,
                        class: "overflow-hidden"
                      }, "|"))
                    }), 128 /* KEYED_FRAGMENT */))
                  ]))
                : vue.createCommentVNode("v-if", true)
            ]))
          : (_ctx.type == 'checkbox')
            ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10, [
                (_ctx.modelValue == true)
                  ? (vue.openBlock(), vue.createElementBlock("input", {
                      key: 0,
                      id: _ctx.realId,
                      type: "checkbox",
                      required: _ctx.required,
                      checked: "",
                      class: "checkbox",
                      value: _ctx.modelValue,
                      onInput: _cache[5] || (_cache[5] = $event => (_ctx.$emit('update:modelValue', $event.target.checked)))
                    }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_11))
                  : (vue.openBlock(), vue.createElementBlock("input", {
                      key: 1,
                      id: _ctx.realId,
                      type: "checkbox",
                      required: _ctx.required,
                      class: "checkbox",
                      value: _ctx.modelValue,
                      onInput: _cache[6] || (_cache[6] = $event => (_ctx.$emit('update:modelValue', $event.target.checked)))
                    }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_12))
              ]))
            : (_ctx.type == 'toggle')
              ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, [
                  (_ctx.modelValue == true)
                    ? (vue.openBlock(), vue.createElementBlock("input", {
                        key: 0,
                        id: _ctx.realId,
                        checked: "",
                        type: "checkbox",
                        class: "toggle",
                        required: _ctx.required,
                        model: _ctx.modelValue,
                        "aria-describedby": _ctx.describedById,
                        value: _ctx.modelValue,
                        onInput: _cache[7] || (_cache[7] = $event => (_ctx.$emit('update:modelValue', $event.target.checked)))
                      }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_14))
                    : (vue.openBlock(), vue.createElementBlock("input", {
                        key: 1,
                        id: _ctx.realId,
                        type: "checkbox",
                        class: "toggle",
                        required: _ctx.required,
                        model: _ctx.modelValue,
                        "aria-describedby": _ctx.describedById,
                        value: _ctx.modelValue,
                        onInput: _cache[8] || (_cache[8] = $event => (_ctx.$emit('update:modelValue', $event.target.checked)))
                      }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_15))
                ]))
              : (_ctx.type == 'tel')
                ? (vue.openBlock(), vue.createElementBlock("input", {
                    key: 8,
                    id: _ctx.realId,
                    type: "tel",
                    required: _ctx.required,
                    value: _ctx.modelValue,
                    placeholder: _ctx.placeholder,
                    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5",
                    model: _ctx.modelValue,
                    "aria-describedby": _ctx.describedById,
                    onInput: _cache[9] || (_cache[9] = $event => (_ctx.$emit('update:modelValue', $event.target.value)))
                  }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_16))
                : (_ctx.type == 'password')
                  ? (vue.openBlock(), vue.createElementBlock("input", {
                      key: 9,
                      type: "password",
                      required: _ctx.required,
                      class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5",
                      autocomplete: _ctx.autocomplete,
                      minlength: _ctx.minlength,
                      model: _ctx.modelValue,
                      "aria-describedby": _ctx.describedById,
                      onInput: _cache[10] || (_cache[10] = $event => (_ctx.$emit('update:modelValue', $event.target.value)))
                    }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_17))
                  : (_ctx.type == 'email')
                    ? (vue.openBlock(), vue.createElementBlock("input", {
                        key: 10,
                        type: "email",
                        class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5",
                        model: _ctx.modelValue,
                        value: _ctx.modelValue,
                        required: _ctx.required,
                        placeholder: _ctx.placeholder,
                        "aria-describedby": _ctx.describedById,
                        onInput: _cache[11] || (_cache[11] = $event => (_ctx.$emit('update:modelValue', $event.target.value)))
                      }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_18))
                    : (_ctx.type == 'number')
                      ? (vue.openBlock(), vue.createElementBlock("input", {
                          key: 11,
                          id: _ctx.realId,
                          type: "number",
                          inputmode: "numeric",
                          value: _ctx.modelValue,
                          placeholder: _ctx.placeholder,
                          min: _ctx.min,
                          class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5",
                          model: _ctx.modelValue,
                          "aria-describedby": _ctx.describedById,
                          onInput: _cache[12] || (_cache[12] = $event => (_ctx.$emit('update:modelValue', $event.target.value)))
                        }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_19))
                      : vue.createCommentVNode("v-if", true),
      (_ctx.description.length > 0)
        ? (vue.openBlock(), vue.createElementBlock("p", {
            key: 12,
            id: _ctx.describedById,
            class: "text-gray-700 text-xs p-1"
          }, vue.toDisplayString(_ctx.description), 9 /* TEXT, PROPS */, _hoisted_20))
        : vue.createCommentVNode("v-if", true)
    ]))
  }

  script.render = render;
  script.__file = "src/components/SupremeLabel/SupremeLabel.vue";

  var index = {
      install: function (Vue) {
          Vue.component(script.name, script);
      }
  };

  var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SupremeLabel: index
  });

  var DSLibrary = {
      install: function (app) {
          // Auto import all components
          for (var componentKey in components) {
              app.use(components[componentKey]);
          }
      }
  };

  exports.SupremeLabel = index;
  exports["default"] = DSLibrary;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
