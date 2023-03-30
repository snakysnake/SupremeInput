'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var SupremeLabel = require('./SupremeLabel.js');
require('vue');

var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SupremeLabel: SupremeLabel["default"]
});

var DSLibrary = {
    install: function (app) {
        // Auto import all components
        for (var componentKey in components) {
            app.use(components[componentKey]);
        }
    }
};

exports.SupremeLabel = SupremeLabel["default"];
exports["default"] = DSLibrary;
