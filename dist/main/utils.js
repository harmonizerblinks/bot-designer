"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCommand = function (str) { return str.split(' ').length === 1
    && str.charAt(0) === '/'; };
exports.guesstimateRoute = function (routes, message) {
    var updatedRoutes = routes.map(function (r) { return ({
        paths: __spreadArrays([
            r.path
        ], (r.aliases || [])),
        middleware: r.middleware,
        component: r.component,
    }); })
        .map(function (r) { return (__assign(__assign({}, r), { paths: r.paths.reduce(function (acc, curr) {
            if (curr.includes(' ') || curr === '**') {
                return __spreadArrays(acc, [curr]);
            }
            return __spreadArrays(acc, [
                curr,
                exports.isCommand(curr) ? curr.slice(1) : "/" + curr,
            ]);
        }, []) })); });
    var _loop_1 = function (i) {
        var route = updatedRoutes[i];
        for (var j = 0; j < route.paths.length; j += 1) {
            if (message.toLowerCase().includes(route.paths[j].toLowerCase())) {
                return { value: routes.find(function (_r, idx) { return idx === i; }) };
            }
        }
    };
    for (var i = 0; i < updatedRoutes.length; i += 1) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return routes.find(function (r) { return r.path === '**'; });
};
exports.getTimeDiffInMins = function (start) { return (new Date().getTime() - new Date(start).getTime()) / (60 * 1000); };
//# sourceMappingURL=utils.js.map