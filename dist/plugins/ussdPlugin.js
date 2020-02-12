"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ussd_router_1 = require("ussd-router");
var MessageHandler = function (cb) { return function (req, res) {
    var _a = req.body, from = _a.phoneNumber, rawText = _a.text;
    var preFormattedText = ussd_router_1.ussdRouter(rawText.trim(), '00', '0') || 'start';
    var formattedText = preFormattedText.split('*').slice(-1)[0];
    var footer = '\n\n0: Back\n00: Home';
    cb({
        from: from,
        text: formattedText,
        channel: 'USSD',
        onSendMessage: function (text, opts) {
            var sendingOptions = (opts && opts.ussd) || { type: 'CON', showFooter: false };
            var msg = sendingOptions.type === 'CON'
                ? "CON " + text
                : "END " + text;
            if (sendingOptions.showFooter || (formattedText !== 'start' && sendingOptions.type !== 'END')) {
                msg += footer;
            }
            res.send(msg);
            return Promise.resolve();
        },
    });
}; };
exports.ussdPlugin = function () { return function (app, cb) {
    app.post('/webhook/ussd', MessageHandler(cb));
}; };
//# sourceMappingURL=ussdPlugin.js.map