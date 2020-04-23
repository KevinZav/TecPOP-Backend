"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    mensaje: {
        type: String,
        required: [true, 'El mensaje del Post es necesaria']
    },
    ubicacion: {
        type: String
    },
    objeto: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Objeto',
        required: [true, 'El objeto del Post es necesario']
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario del Post es necesario']
    },
    reacciones: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Usuario'
        }]
});
postSchema.pre('create', function (next) {
    this.created = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
