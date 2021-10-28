import { Schema, model } from 'mongoose';
import { IPost } from '../interfaces/IPost';

const postSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Objeto',
        required: [true, 'El objeto del Post es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario del Post es necesario']
    },
    reacciones: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }]
});

postSchema.pre<IPost>('create', function(next) {
    this.created = new Date();
    next();
})

export const Post = model<IPost>('Post',postSchema);