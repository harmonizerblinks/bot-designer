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
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("./history");
var misc_1 = require("../utils/misc");
var getState = function (historyState, entityRef, channel) { return history_1.getUserHistory(historyState.get(), entityRef, channel).state; };
var setState = function (historyState, entityRef, state) {
    var newHistory = history_1.updateUserHistory(historyState.get(), entityRef, { state: state });
    historyState.set(newHistory);
};
var getLockStatus = function (historyState, entityRef, channel) { return history_1.getUserHistory(historyState.get(), entityRef, channel).locked; };
var lock = function (historyState, entityRef) {
    var newHistory = history_1.updateUserHistory(historyState.get(), entityRef, { locked: true });
    historyState.set(newHistory);
};
var unlock = function (historyState, entityRef) {
    var newHistory = history_1.updateUserHistory(historyState.get(), entityRef, { locked: false });
    historyState.set(newHistory);
};
var endFlow = function (historyState, entityRef) {
    unlock(historyState, entityRef);
    setState(historyState, entityRef, {});
};
var startFlow = function (historyState, entityRef, channel, text, onSendMessage, steps, exitKeyword, exitMessage) {
    if (text === exitKeyword) {
        endFlow(historyState, entityRef);
        onSendMessage(exitMessage);
        return;
    }
    if (misc_1.isEmptyObject(getState(historyState, entityRef, channel))
        || !getLockStatus(historyState, entityRef, channel)) {
        lock(historyState, entityRef);
        setState(historyState, entityRef, {
            steps: steps,
            currentStepIdx: 0,
        });
    }
};
var getCurrentStep = function (historyState, entityRef, channel, steps) { return steps[getState(historyState, entityRef, channel).currentStepIdx]; };
var flowGoToNext = function (historyState, entityRef, channel) {
    var state = getState(historyState, entityRef, channel);
    setState(historyState, entityRef, __assign(__assign({}, state), { currentStepIdx: state.currentStepIdx + 1 }));
};
exports.historyController = function (historyState, entityRef, channel, text, onSendMessage) { return ({
    getState: function () { return getState(historyState, entityRef, channel); },
    setState: function (state) {
        var _a = getState(historyState, entityRef, channel), steps = _a.steps, currentStepIdx = _a.currentStepIdx;
        setState(historyState, entityRef, __assign(__assign({}, state), (steps && currentStepIdx ? { steps: steps, currentStepIdx: currentStepIdx } : {})));
    },
    createFlow: function (steps, exitKeyword, exitMessage) { return ({
        start: function () { return startFlow(historyState, entityRef, channel, text, onSendMessage, steps, exitKeyword, exitMessage); },
        end: function () { return endFlow(historyState, entityRef); },
        getCurrentStep: function () { return getCurrentStep(historyState, entityRef, channel, steps); },
        next: function () { return flowGoToNext(historyState, entityRef, channel); },
    }); },
}); };
//# sourceMappingURL=historyController.js.map