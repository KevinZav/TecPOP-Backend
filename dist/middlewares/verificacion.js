"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const objeto_1 = require("../models/objeto");
exports.verificaData = (req, res, next) => {
    const usuario = req.body;
    const usuarioValidado = {};
    if (usuario.nombre) {
        usuarioValidado.nombre = usuario.nombre;
    }
    if (usuario.apellidos) {
        usuarioValidado.apellidos = usuario.apellidos;
    }
    if (usuario.carrera) {
        usuarioValidado.carrera = usuario.carrera;
    }
    if (usuario.password) {
        usuarioValidado.password = bcrypt_1.default.hashSync(usuario.password, 10);
    }
    req.usuarioValidado = usuarioValidado;
    next();
};
exports.verificaDataObjeto = (req, res, next) => {
    const objeto = req.body;
    const objetoValidado = {};
    if (objeto.nombre) {
        objetoValidado.nombre = objeto.nombre;
    }
    if (objeto.descripcion) {
        objetoValidado.descripcion = objeto.descripcion;
    }
    if (objeto.estado) {
        objetoValidado.estado = objeto.estado;
    }
    req.objetoValidado = objetoValidado;
    next();
};
exports.verificaDataPost = (req, res, next) => {
    const post = req.body;
    const idUsuario = req.usuario._id;
    const postVerificado = {};
    if (post.mensaje) {
        postVerificado.mensaje = post.mensaje;
    }
    if (post.ubicacion) {
        postVerificado.ubicacion = post.ubicacion;
    }
    if (post.objeto) {
        postVerificado.objeto = post.objeto;
        // logica para verificar un objeto;
        objeto_1.Objeto.findOne({ _id: postVerificado.objeto, usuario: idUsuario }, (err, objetoDB) => {
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
                        message: 'No se encontro un objeto con el id y usuario especificado'
                    }
                });
            }
        });
    }
    else {
        return res.json({
            ok: false,
            err: {
                message: 'objeto no especificado'
            }
        });
    }
    postVerificado.created = new Date();
    postVerificado.usuario = idUsuario;
    req.postVerificado = postVerificado;
    next();
};
exports.verificaDataComentario = (req, res, next) => {
    const comentario = req.body;
    const comentarioVerificado = {};
    if (comentario.texto) {
        comentarioVerificado.texto = comentario.texto;
    }
    if (comentario.post) {
        comentarioVerificado.post = comentario.post;
        console.log(comentario.post);
    }
    comentarioVerificado.created = new Date();
    comentarioVerificado.usuario = req.usuario._id;
    req.comentarioVerificado = comentarioVerificado;
    next();
};
