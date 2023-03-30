import index from './SupremeLabel.mjs';
export { default as SupremeLabel } from './SupremeLabel.mjs';
import 'vue';

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

export { DSLibrary as default };
