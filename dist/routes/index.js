"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_1 = __importDefault(require("./usuario"));
const objeto_1 = __importDefault(require("./objeto"));
const post_1 = __importDefault(require("./post"));
const comentario_1 = __importDefault(require("./comentario"));
const chat_1 = __importDefault(require("./chat"));
const mensaje_1 = __importDefault(require("./mensaje"));
const indexRoutes = [
    usuario_1.default,
    objeto_1.default,
    post_1.default,
    comentario_1.default,
    chat_1.default,
    mensaje_1.default
];
exports.default = indexRoutes;
