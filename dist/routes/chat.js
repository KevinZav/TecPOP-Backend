"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ===================================
// Importaciones necesarias
// ===================================
// Modulos de Node
const express_1 = require("express");
const underscore_1 = __importDefault(require("underscore"));
// Modulos del servidor
// middlewares
const autenticacion_1 = require("../middlewares/autenticacion");
// Esquema necesario para la ruta
const chat_1 = require("../models/chat");
// declaracion del router de express
const chatRoute = express_1.Router();
// ===============================
// Crear un chat
// ===============================
chatRoute.post('/chat/:destinatario', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario1 = req.usuario._id;
    const usuario2 = req.params.destinatario;
    const channel = `chat_${usuario1}_${usuario2}`;
    const channel2 = `chat_${usuario2}_${usuario1}`;
    const chat = {
        usuario1,
        usuario2,
        channel
    };
    yield chat_1.Chat.findOne()
        .or([{ channel }, { channel: channel2 }])
        .exec((err, chatDB) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (chatDB) {
            yield (chatDB === null || chatDB === void 0 ? void 0 : chatDB.populate('usuario1', '-password -status -userID').execPopulate());
            yield (chatDB === null || chatDB === void 0 ? void 0 : chatDB.populate('usuario2', '-password -status -userID').execPopulate());
            return res.json({
                ok: true,
                chat: chatDB
            });
        }
        else {
            chat_1.Chat.create(chat).then((chatDB) => __awaiter(void 0, void 0, void 0, function* () {
                yield (chatDB === null || chatDB === void 0 ? void 0 : chatDB.populate('usuario1', '-password -status -userID').execPopulate());
                yield (chatDB === null || chatDB === void 0 ? void 0 : chatDB.populate('usuario2', '-password -status -userID').execPopulate());
                return res.json({
                    ok: true,
                    chat: chatDB
                });
            })).catch(err => {
                return res.json({
                    ok: true,
                    err
                });
            });
        }
    }));
}));
// ===============================
// Obtener Chats de un usuario
// ===============================
chatRoute.get('/chat', autenticacion_1.verificaToken, (req, res) => {
    const usuarioId = req.usuario._id;
    chat_1.Chat.find()
        .or([{ usuario1: usuarioId }, { usuario2: usuarioId }])
        .populate('usuario1', '-password -status -userID')
        .populate('usuario2', '-password -status -userID')
        .exec((err, chatsDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!chatsDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se han encontrado chats de ese usuario'
                }
            });
        }
        const chatsFiltrados = [];
        chatsDB.forEach(chat => {
            const chatFiltrado = underscore_1.default.pick(chat, [chat.usuario1 + '' === usuarioId ? 'usuario2' : 'usuario1', '_id']);
            chatsFiltrados.push(chatFiltrado);
        });
        return res.json({
            ok: true,
            chats: chatsFiltrados
        });
    });
});
exports.default = chatRoute;
