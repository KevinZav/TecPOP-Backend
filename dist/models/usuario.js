"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    userID: {
        type: String,
        required: [true, 'El userID del usuario es requerido'],
        unique: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del usuario es requerido']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos del usuario son requerido']
    },
    carrera: {
        type: String
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'La password del usuario es requerida']
    },
    status: {
        type: Boolean,
        default: true,
        required: [true, 'El estado del usuario es requerido']
    }
});
usuarioSchema.method('verificarPassword', function (password) {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
