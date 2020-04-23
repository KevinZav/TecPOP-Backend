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
const verificacion_1 = require("../middlewares/verificacion");
// Esquema necesario para la ruta
const comentario_1 = require("../models/comentario");
// declaracion del router de express
const comentarioRoutes = express_1.Router();
// ===============================
// Postear un comentario
// ===============================
comentarioRoutes.post('/comentario', [autenticacion_1.verificaToken, verificacion_1.verificaDataComentario], (req, res) => {
    const comentario = req.comentarioVerificado;
    comentario_1.Comentario.create(comentario).then((comentarioDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield comentarioDB.populate('post', '-usuario -objeto -ubicacion').execPopulate();
        yield comentarioDB.populate('usuario', '-password -status').execPopulate();
        return res.json({
            ok: true,
            comentario: comentarioDB
        });
    }));
});
// ===============================
// Eliminar un comentario
// ===============================
comentarioRoutes.delete('/comentario/:id', [autenticacion_1.verificaToken], (req, res) => {
    const idComentario = req.params.id;
    comentario_1.Comentario.findByIdAndDelete(idComentario, (err, comentarioDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!comentarioDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se pudo encontrar un comentario con ese ID'
                }
            });
        }
        return res.json({
            ok: true,
            message: 'Se ha eliminado el comentario correctamente'
        });
    });
});
// ===============================
// Obtener comentarios de un post
// ===============================
comentarioRoutes.get('/comentario/:post', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = req.params.post;
    const comentarios = yield comentario_1.Comentario.find({ post })
        .populate('usuario', '-password -status')
        .exec();
    return res.json({
        ok: true,
        comentarios
    });
}));
exports.default = comentarioRoutes;
