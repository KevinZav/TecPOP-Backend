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
// Modulos del servidor
const file_system_1 = __importDefault(require("../classes/file-system"));
// middlewares
const autenticacion_1 = require("../middlewares/autenticacion");
const verificacion_1 = require("../middlewares/verificacion");
const objeto_1 = require("../models/objeto");
// declaracion del router de express
const objetRoutes = express_1.Router();
// Clase de FileSystem
const fs = new file_system_1.default();
// =============================
// Creacion de objeto
// =============================
objetRoutes.post('/objeto', autenticacion_1.verificaToken, (req, res) => {
    const userId = req.usuario._id;
    const objeto = req.body;
    objeto.usuario = userId;
    objeto_1.Objeto.create(objeto).then((objetoDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield objetoDB.populate('usuario', '-password').execPopulate();
        return res.json({
            ok: true,
            objeto: objetoDB
        });
    })).catch((err) => {
        return res.status(400).json({
            ok: false,
            err
        });
    });
});
// =============================
// Borrar el objeto
// =============================
objetRoutes.delete('/objeto/eliminar/:id', autenticacion_1.verificaToken, (req, res) => {
    const idObjeto = req.params.id;
    const idUsuario = req.usuario._id;
    objeto_1.Objeto.findOneAndDelete({ _id: idObjeto, usuario: idUsuario }, (err, objetoDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!objetoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el objeto con ese ID y ese usuarioID'
                }
            });
        }
        // borrar imagenes
        fs.borrarImagenesObjeto(objetoDB._id + '');
        return res.json({
            ok: true,
            objeto: objetoDB
        });
    });
});
// ==============================
// Actualizar info de un objeto
// ==============================
objetRoutes.put('/objeto/:id', [autenticacion_1.verificaToken, verificacion_1.verificaDataObjeto], (req, res) => {
    const idUsuario = req.usuario._id;
    const idObjeto = req.params.id;
    const objeto = req.objetoValidado;
    objeto_1.Objeto.findOneAndUpdate({ _id: idObjeto, usuario: idUsuario }, objeto, { new: true }, (err, objetoDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!objetoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el objeto con el ID o usuario especificado'
                }
            });
        }
        return res.json({
            ok: true,
            objeto: objetoDB
        });
    });
});
// ==============================
// Ver informacion de un objeto
// ==============================
objetRoutes.get('/objeto/:id', autenticacion_1.verificaToken, (req, res) => {
    const idObjeto = req.params.id;
    objeto_1.Objeto.findById(idObjeto, (err, objetoDB) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!objetoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No existe un objeto con ese id'
                }
            });
        }
        yield objetoDB.populate('usuario', '-password').execPopulate();
        return res.json({
            ok: true,
            objeto: objetoDB
        });
    }));
});
// ==============================
// Obtener objetos de usuario
// ==============================
objetRoutes.get('/objeto', autenticacion_1.verificaToken, (req, res) => {
    const idUsuario = req.usuario._id;
    let page = req.query.page - 1 || 0;
    if (page < 0) {
        page = 0;
    }
    const skip = page * 10;
    objeto_1.Objeto.find({ usuario: idUsuario })
        .populate('usuario', '-password')
        .limit(10)
        .skip(skip)
        .exec((err, objetosDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!objetosDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se han encontrado objetos de ese usuario'
                }
            });
        }
        return res.json({
            ok: true,
            objetos: objetosDB
        });
    });
});
// ==============================
// Publicar imagen de un objeto
// ==============================
objetRoutes.post('/objeto/imagen', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idObjeto = req.query.id;
    const idUsuario = req.usuario._id;
    const file = req.files.image;
    const fotos = yield fs.guardarImagenObjeto(file, idObjeto);
    objeto_1.Objeto.findOneAndUpdate({ _id: idObjeto, usuario: idUsuario }, { fotos }, { new: true }, (err, objetoDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!objetoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el objeto con el ID o usuario especificado'
                }
            });
        }
        return res.json({
            ok: true,
            objeto: objetoDB
        });
    });
}));
// ==============================
// Borrar imagen de un objeto
// ==============================
objetRoutes.post('/objeto/imagen/eliminar', autenticacion_1.verificaToken, (req, res) => {
    const idObjeto = req.body.id;
    const imagen = req.body.image;
    const idUsuario = req.usuario._id;
    const imagenObject = fs.borrarImagenObjeto(idObjeto, imagen);
    if (!imagenObject.eliminado) {
        return res.json({
            ok: false,
            err: {
                message: 'No se ha encontrado la imagen especificada'
            }
        });
    }
    objeto_1.Objeto.findOneAndUpdate({ _id: idObjeto, usuario: idUsuario }, { fotos: imagenObject.imagenes }, { new: true }, (err, objectoDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!objectoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el objeto con el ID o usuario especificado'
                }
            });
        }
        return res.json({
            ok: true,
            objeto: objectoDB
        });
    });
});
objetRoutes.get('/objeto/imagen/:objeto/:imagen', (req, res) => {
    const idObjeto = req.params.objeto;
    const imagen = req.params.imagen;
    const imagenPath = fs.getImagenObjeto(idObjeto, imagen);
    return res.sendFile(imagenPath);
});
exports.default = objetRoutes;
