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
Object.defineProperty(exports, "__esModule", { value: true });
// ===================================
// Importaciones necesarias
// ===================================
// Modulos de Node
const express_1 = require("express");
// Modulos del servidor
// middlewares
const autenticacion_1 = require("../middlewares/autenticacion");
// Esquema necesario para la ruta
const mensaje_1 = require("../models/mensaje");
// declaracion del router de express
const mensajeRoutes = express_1.Router();
// ==============================
// Agregar mensaje a un chat
// ==============================
mensajeRoutes.post('/mensaje', autenticacion_1.verificaToken, (req, res) => {
    const usuario = req.usuario._id;
    const texto = req.body.texto;
    const chat = req.body.chat;
    const mensaje = {
        usuario,
        texto,
        chat,
        created: new Date()
    };
    mensaje_1.Mensaje.create(mensaje).then((mensajeDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield mensajeDB.populate('usuario', '-password -status -userID').execPopulate();
        return res.json({
            ok: true,
            mensaje: mensajeDB
        });
    })).catch(err => {
        return res.json({
            ok: false,
            err
        });
    });
});
// ==============================
// Obtener mensajes por chat
// ==============================
mensajeRoutes.get('/mensaje/:chat', autenticacion_1.verificaToken, (req, res) => {
    const chat = req.params.chat;
    mensaje_1.Mensaje.find({ chat })
        .populate('usuario', '-password -status -userID')
        .sort({ created: 1 })
        .exec((err, mensajesDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!mensajesDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se han encontrado mensajes'
                }
            });
        }
        return res.json({
            ok: true,
            mensajes: mensajesDB
        });
    });
});
exports.default = mensajeRoutes;
