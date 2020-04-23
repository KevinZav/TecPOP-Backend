"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.mensajeSchema = new mongoose_1.Schema({
    texto: {
        type: String,
        required: [true, 'El texto del mensaje es necesario']
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario del mensaje es indispensable']
    },
    chat: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Chat',
        required: [true, 'El chat del mensaje es necesario']
    },
    created: {
        type: Date
    }
});
exports.Mensaje = mongoose_1.model('Mensaje', exports.mensajeSchema);
