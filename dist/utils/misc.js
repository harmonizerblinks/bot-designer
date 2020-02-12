"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
exports.isEmptyObject = function (obj) { return Object.entries(obj).length === 0
    && obj.constructor === Object; };
exports.getRootPath = function () { return path_1.default.join(__dirname, '').split('/src')[0]; };
//# sourceMappingURL=misc.js.map