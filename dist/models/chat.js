"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.chatSchema = new mongoose_1.Schema({
    usuario1: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Todos los usuario son necesarios']
    },
    usuario2: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Todos los usuario son necesarios']
    },
    channel: {
        type: String,
        required: [true, 'El canal del chat es necesario']
    }
});
exports.Chat = mongoose_1.model('Chat', exports.chatSchema);
