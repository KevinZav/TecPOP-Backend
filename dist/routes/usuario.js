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
// Modulos del server
const file_system_1 = __importDefault(require("../classes/file-system"));
const token_1 = __importDefault(require("../classes/token"));
// middlewares
const autenticacion_1 = require("../middlewares/autenticacion");
const verificacion_1 = require("../middlewares/verificacion");
// Esquema necesario para la ruta
const usuario_1 = require("../models/usuario");
// declaracion del router de express
const userRoutes = express_1.Router();
// Clase de FileSystem
const fs = new file_system_1.default();
// =============================
// Creacion de usuario con Token
// =============================
userRoutes.post('/usuario', verificacion_1.verificaData, (req, res) => {
    const body = req.body;
    const usuario = req.usuarioValidado;
    usuario.userID = body.userID;
    usuario_1.Usuario.create(usuario).then((userDB) => {
        const userToken = {
            _id: userDB._id,
            userID: userDB.userID,
            nombre: userDB.nombre,
            apellidos: userDB.apellidos,
            carrera: userDB.carrera
        };
        // Obtencion del Token
        const tokenUser = token_1.default.getJWToken(userToken);
        return res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        return res.json({
            ok: false,
            err
        });
    });
});
// =============================
// Modificar usuario con Token
// =============================
userRoutes.put('/usuario', [autenticacion_1.verificaToken, verificacion_1.verificaData], (req, res) => {
    const id = req.usuario._id;
    const nuevoUser = req.usuarioValidado;
    usuario_1.Usuario.findByIdAndUpdate(id, nuevoUser, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el usuario'
                }
            });
        }
        const userFiltrado = underscore_1.default.pick(userDB, ['userID', 'nombre', 'apellidos', 'carrera', 'status']);
        return res.json({
            ok: true,
            usuario: userFiltrado
        });
    });
});
// =============================
// Deshabilitar un usuario
// =============================
userRoutes.delete('/usuario', autenticacion_1.verificaToken, (req, res) => {
    const id = req.usuario._id;
    const status = { status: false };
    usuario_1.Usuario.findByIdAndUpdate(id, status, { new: true }, (err, userDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el usuario'
                }
            });
        }
        return res.json({
            ok: true,
            message: 'Se ha eliminado el usuario correctamente'
        });
    });
});
// =============================
// Login de usuario
// =============================
userRoutes.get('/usuario', (req, res) => {
    const userID = req.body.userID;
    const password = req.body.password;
    usuario_1.Usuario.findOne({ userID }, (err, userDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'El (usuario) o contraseña son incorrectos'
                }
            });
        }
        const verificarPassword = userDB.verificarPassword(password);
        if (verificarPassword) {
            const userToken = {
                _id: userDB._id,
                userID: userDB.userID,
                nombre: userDB.nombre,
                apellidos: userDB.apellidos,
                carrera: userDB.carrera
            };
            // Obtencion del Token
            const tokenUser = token_1.default.getJWToken(userToken);
            // Informacion principal del usuario
            const userFiltrado = underscore_1.default.pick(userDB, ['userID', 'nombre', 'apellidos', 'carrera', 'status', 'avatar']);
            return res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) incorrectos'
                }
            });
        }
    });
});
// ================================
// Informacion de usuario por token
// ================================
userRoutes.get('/usuario/info', autenticacion_1.verificaToken, (req, res) => {
    const id = req.usuario._id;
    usuario_1.Usuario.findById(id, (err, userDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado un usuario con ese ID'
                }
            });
        }
        const userFiltrado = underscore_1.default.pick(userDB, ['userID', 'nombre', 'apellidos', 'carrera', 'status', 'avatar']);
        return res.json({
            ok: true,
            usuario: userFiltrado
        });
    });
});
// =============================
// Actualizar Avatar de usuario
// =============================
userRoutes.post('/usuario/avatar', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.json({
            ok: false,
            err: {
                message: 'No se recibió ninguna imagen'
            }
        });
    }
    // File
    const file = req.files.image;
    //validar tipo de File
    if (file.mimetype.indexOf('image') < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'No se subió el archivo correctamente'
            }
        });
    }
    const id = req.usuario._id;
    let avatar = '';
    yield fs.guardarImagenUsuario(file, id).then((imagen) => avatar = imagen);
    usuario_1.Usuario.findByIdAndUpdate(id, { avatar }, { new: true }, (err, userDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se encontro el usuario'
                }
            });
        }
        return res.json({
            ok: true,
            avatar: userDB.avatar,
            message: 'imagen subida con exito'
        });
    });
}));
// ===============================
// Obtener Informacion del usuario
// ===============================
userRoutes.get('/usuario/info', autenticacion_1.verificaToken, (req, res) => {
    const id = req.usuario._id;
    usuario_1.Usuario.findById(id, (err, userDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado un usuario'
                }
            });
        }
        const userFiltrado = underscore_1.default.pick(userDB, ['userID', 'nombre', 'apellidos', 'carrera', 'avatar']);
        return res.json({
            ok: true,
            usuario: userFiltrado
        });
    });
});
// ===============================
// Obtener Avatar del usuario
// ===============================
userRoutes.get('/usuario/avatar/:avatar', (req, res) => {
    const imagen = req.params.avatar;
    const pathImage = fs.getImagenUsuario(imagen);
    res.sendFile(pathImage);
});
exports.default = userRoutes;
