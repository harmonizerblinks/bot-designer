"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
exports.telegramPlugin = function (token) { return function (_app, cb) {
    var bot = new node_telegram_bot_api_1.default(token, { polling: true });
    bot.on('message', function (msg) {
        var rawText = msg.text, chatId = msg.chat.id;
        var formattedText = (rawText && rawText.trim()) || 'start';
        cb({
            from: chatId,
            text: formattedText,
            channel: 'TELEGRAM',
            onSendMessage: function (text, opts) { return bot.sendMessage(chatId, text, (opts && opts.telegram) || { parse_mode: 'Markdown' }); },
            onSendPhoto: function (photoUrl, caption) { return bot.sendPhoto(chatId, photoUrl, { caption: caption }); },
            onSendAudio: function (audioUrl, caption) { return bot.sendAudio(chatId, audioUrl, { caption: caption }); },
            onSendVideo: function (videoUrl, caption) { return bot.sendVideo(chatId, videoUrl, { caption: caption }); },
            onSendDocument: function (documentUrl, caption) { return bot.sendDocument(chatId, documentUrl, { caption: caption }); },
            onSendContact: function (phoneNumber, firstName, lastName) { return bot.sendContact(chatId, phoneNumber, firstName, {
                last_name: lastName,
            }); },
            onSendLocation: function (latitude, longitude) { return bot.sendLocation(chatId, latitude, longitude); },
        });
    });
}; };
//# sourceMappingURL=telegramPlugin.js.map