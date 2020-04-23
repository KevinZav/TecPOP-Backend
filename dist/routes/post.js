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
const post_1 = require("../models/post");
const objeto_1 = require("../models/objeto");
// declaracion del router de express
const postRoutes = express_1.Router();
// ==============================
// Publicar un post
// ==============================
postRoutes.post('/post', [autenticacion_1.verificaToken, verificacion_1.verificaDataPost], (req, res) => {
    const post = req.postVerificado;
    const cambioEstado = cambiarEstadoObjeto(post.objeto, 'perdido');
    if (!cambioEstado) {
        return res.json({
            ok: false,
            err: {
                message: 'No se ha cambiado el estado del objeto'
            }
        });
    }
    post_1.Post.create(post).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate('objeto').execPopulate();
        yield postDB.populate('usuario', '-password -status').execPopulate();
        return res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        return res.json({
            ok: false,
            err
        });
    });
});
// ==============================
// Eliminar un post
// ==============================
postRoutes.delete('/post/:id', [autenticacion_1.verificaToken], (req, res) => {
    const idUsuario = req.usuario._id;
    const idPost = req.params.id;
    post_1.Post.findOneAndDelete({ _id: idPost, usuario: idUsuario }, (err, postDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el post con ese ID o usuario'
                }
            });
        }
        const objetoID = postDB.objeto._id;
        cambiarEstadoObjeto(objetoID, 'activo');
        return res.json({
            ok: true,
            message: 'Se ha eliminado el post correctamente'
        });
    });
});
// ==============================
// Actualizar un post
// ==============================
postRoutes.put('/post/:id', [autenticacion_1.verificaToken, verificacion_1.verificaDataPost], (req, res) => {
    const post = req.postVerificado;
    const idPost = req.params.id;
    post_1.Post.findOne({ _id: idPost }, (err, postDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el post con ese ID'
                }
            });
        }
        const objetoID = postDB.objeto._id;
        cambiarEstadoObjeto(objetoID, 'activo');
    });
    post_1.Post.findOneAndUpdate({ _id: idPost }, post, { new: true }, (err, postDB) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el post con ese ID'
                }
            });
        }
        const objetoID = postDB.objeto._id;
        cambiarEstadoObjeto(objetoID, 'perdido');
        yield postDB.populate('objeto', '-usuario').execPopulate();
        yield postDB.populate('usuario', '-password -status').execPopulate();
        return res.json({
            ok: true,
            post: postDB
        });
    }));
});
// ==============================
// Obtener informacion de un post
// ==============================
postRoutes.get('/post/:id', autenticacion_1.verificaToken, (req, res) => {
    const id = req.params.id;
    post_1.Post.findById(id, (err, postDB) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado un post con ese ID'
                }
            });
        }
        yield postDB.populate('objeto', '-usuario').execPopulate();
        yield postDB.populate('usuario', '-password -status').execPopulate();
        return res.json({
            ok: true,
            post: postDB
        });
    }));
});
// ==============================
// Obtener post de un usuario
// ==============================
postRoutes.get('/posts/usuario', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = req.query.page - 1 | 0;
    if (page <= 0) {
        page = 0;
    }
    const from = page * 5;
    const usuarioID = req.usuario._id;
    yield post_1.Post.find({ usuario: usuarioID })
        .populate('objeto', '-usuario')
        .populate('usuario', '-password -status')
        .limit(5)
        .skip(from)
        .exec((err, postsDB) => {
        return res.json({
            ok: true,
            posts: postsDB
        });
    });
}));
// ==============================
// Obtener post paginados
// ==============================
postRoutes.get('/posts', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = req.query.page - 1 | 0;
    if (page <= 0) {
        page = 0;
    }
    const from = page * 5;
    yield post_1.Post.find()
        .populate('objeto', '-usuario')
        .populate('usuario', '-password -status')
        .limit(5)
        .skip(from)
        .exec((err, postsDB) => {
        return res.json({
            ok: true,
            posts: postsDB
        });
    });
}));
// ==============================
// Reaccionar a un post
// ==============================
postRoutes.get('/post/reaccionar/:id', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idUsuario = req.usuario._id;
    const idPost = req.params.id;
    let reacciones = [];
    yield post_1.Post.findById(idPost, (err, postDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se encuentra un post con ese ID'
                }
            });
        }
        reacciones = postDB.reacciones || [];
    });
    const reaccionesFiltradas = reacciones.filter(reaccion => reaccion + '' !== idUsuario);
    let reaccion;
    if (reaccionesFiltradas.length === reacciones.length) {
        reacciones.push(idUsuario);
        reaccion = true;
    }
    else {
        reacciones = reaccionesFiltradas;
        reaccion = false;
    }
    post_1.Post.findByIdAndUpdate(idPost, { reacciones }, { new: true }, (err, postDB) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se encontró un post con el id especificado'
                }
            });
        }
        return res.json({
            ok: true,
            reaccion,
            reacciones: ((_a = postDB.reacciones) === null || _a === void 0 ? void 0 : _a.length) || 0
        });
    }));
}));
function cambiarEstadoObjeto(objetoID, estado) {
    return __awaiter(this, void 0, void 0, function* () {
        yield objeto_1.Objeto.findByIdAndUpdate(objetoID, { estado }, (err, objetoDB) => {
            if (err) {
                return false;
            }
            if (!objetoDB) {
                return false;
            }
        });
        return true;
    });
}
exports.default = postRoutes;
