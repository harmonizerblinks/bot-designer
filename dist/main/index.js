"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mutablestate_js_1 = require("mutablestate.js");
var render_1 = require("./render");
var startExpressServer_1 = require("../utils/startExpressServer");
exports.Superbot = function (expressApplication) {
    var app = expressApplication || startExpressServer_1.startExpressServer();
    var historyState = mutablestate_js_1.createMutableState([]);
    var routesState = mutablestate_js_1.createMutableState([]);
    var historyCB = function () { };
    historyState.onChange(function (h) { return historyCB(h); });
    return {
        setRoutes: function (routes) {
            routesState.set(routes);
        },
        setHistory: function (history) {
            historyState.set(history);
        },
        onHistory: function (cb) {
            historyCB = cb;
        },
        use: function (plugin) {
            var messageCallback = function (opts) { return render_1.render(historyState, routesState.get(), opts)(); };
            plugin(app, messageCallback);
        },
    };
};
//# sourceMappingURL=index.js.map