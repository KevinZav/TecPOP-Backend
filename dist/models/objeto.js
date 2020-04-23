"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const objetoSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del objeto es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion del objeto es necesaria']
    },
    fotos: [{
            type: String
        }],
    estado: {
        type: String,
        required: [true, 'El estado del objeto es necesario'],
        default: 'activo'
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario del objeto es necesario']
    }
});
exports.Objeto = mongoose_1.model('Objeto', objetoSchema);
