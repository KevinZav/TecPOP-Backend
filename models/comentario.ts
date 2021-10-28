import { Schema,model } from 'mongoose';
import { IComentario } from '../interfaces/IComentario';


export const comentarioSchema = new Schema({
    texto: {
        type: String,
        required: [true, 'El texto del comentario es obligatorio']
    },
    created: {
        type: Date,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'El usuario del comentario es requerido' ]
    },
    post: {
        type: Schema.Types.ObjectId,
        ref:'Post',
        required: [true, 'El post del comentario es requerido']
    }
});


export const Comentario = model<IComentario>('Comentario',comentarioSchema);