"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.comentarioSchema = new mongoose_1.Schema({
    texto: {
        type: String,
        required: [true, 'El texto del comentario es obligatorio']
    },
    created: {
        type: Date,
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario del comentario es requerido']
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'El post del comentario es requerido']
    }
});
exports.Comentario = mongoose_1.model('Comentario', exports.comentarioSchema);
