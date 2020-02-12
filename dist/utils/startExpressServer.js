"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var misc_1 = require("./misc");
exports.startExpressServer = function (port) {
    if (port === void 0) { port = 3000; }
    var app = express_1.default();
    app.use(morgan_1.default('tiny'));
    app.use(cors_1.default());
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use('/', express_1.default.static(misc_1.getRootPath()));
    var PORT = process.env.PORT || port;
    app.listen(PORT, function () { return console.log("[\u2713] Running on port " + PORT); });
    return app;
};
//# sourceMappingURL=startExpressServer.js.map