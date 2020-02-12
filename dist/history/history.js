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
exports.getUserHistory = function (history, entityRef, channel) { return history.find(function (h) { return h.entityRef === entityRef && h.channel === channel; }); };
exports.createUserHistory = function (history, entityRef, channel) { return __spreadArrays(history, [
    {
        id: history.length + 1,
        entityRef: entityRef,
        channel: channel,
        path: '',
        locked: false,
        state: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]); };
exports.updateUserHistory = function (history, entityRef, data) { return history.map(function (h) {
    if (h.entityRef === entityRef) {
        return __assign(__assign(__assign({}, h), data), { updatedAt: new Date().toISOString() });
    }
    return h;
}); };
//# sourceMappingURL=history.js.map