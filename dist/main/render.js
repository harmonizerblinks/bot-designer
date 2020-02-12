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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("../history/history");
var utils_1 = require("./utils");
var historyController_1 = require("../history/historyController");
var createHistoryForUserIfDoesNotExist = function (historyState, entityRef, channel) {
    var userHistory = history_1.getUserHistory(historyState.get(), entityRef, channel);
    if (!userHistory) {
        var newHistory = history_1.createUserHistory(historyState.get(), entityRef, channel);
        historyState.set(newHistory);
        userHistory = history_1.getUserHistory(historyState.get(), entityRef, channel);
    }
    if (utils_1.getTimeDiffInMins(userHistory.updatedAt) > 15) {
        var newHistory = history_1.updateUserHistory(historyState.get(), entityRef, {
            path: '',
            locked: false,
            state: {},
        });
        historyState.set(newHistory);
    }
    return userHistory;
};
var getRoute = function (historyState, routes, userHistory, entityRef, text) {
    var route;
    var newHistory;
    if (utils_1.isCommand(text) || !userHistory.locked) {
        route = utils_1.guesstimateRoute(routes, text);
        if (!route) {
            return undefined;
        }
        newHistory = history_1.updateUserHistory(historyState.get(), entityRef, {
            path: route.path,
            locked: false,
            state: {},
        });
    }
    else {
        route = utils_1.guesstimateRoute(routes, userHistory.path);
        if (!route) {
            return undefined;
        }
        newHistory = history_1.updateUserHistory(historyState.get(), entityRef, {
            path: route.path,
            locked: true,
            state: userHistory.state,
        });
    }
    historyState.set(newHistory);
    return route;
};
exports.render = function (historyState, routes, primaryProps) { return function (text, secondaryProps) {
    if (text === void 0) { text = primaryProps.text; }
    if (secondaryProps === void 0) { secondaryProps = {}; }
    var from = primaryProps.from;
    var userHistory = createHistoryForUserIfDoesNotExist(historyState, from, primaryProps.channel);
    var route = getRoute(historyState, routes, userHistory, from, text);
    if (!route || !route.component || typeof route.component !== 'function') {
        throw new Error('Invalid route: Missing component');
    }
    var props = __assign(__assign(__assign({}, primaryProps), secondaryProps), { render: exports.render(historyState, routes, primaryProps), history: historyController_1.historyController(historyState, from, primaryProps.channel, text, primaryProps.onSendMessage) });
    var updatedProps = props;
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var middleware, _loop_1, i, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!route.middleware) return [3, 4];
                    middleware = route.middleware;
                    _loop_1 = function (i) {
                        var m, shouldContinue;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    m = middleware[i];
                                    if (typeof m !== 'function') {
                                        return [2, { value: Promise.resolve() }];
                                    }
                                    shouldContinue = false;
                                    return [4, m(updatedProps, function (moreProps) {
                                            updatedProps = __assign(__assign({}, updatedProps), (moreProps || {}));
                                            shouldContinue = true;
                                        })];
                                case 1:
                                    _a.sent();
                                    if (!shouldContinue) {
                                        return [2, "break"];
                                    }
                                    return [2];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < middleware.length)) return [3, 4];
                    return [5, _loop_1(i)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2, state_1.value];
                    if (state_1 === "break")
                        return [3, 4];
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3, 1];
                case 4: return [2];
            }
        });
    }); })();
    route.component(updatedProps);
}; };
//# sourceMappingURL=render.js.map