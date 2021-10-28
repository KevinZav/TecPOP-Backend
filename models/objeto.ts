import { Schema, model } from 'mongoose';
import { IObjeto } from '../interfaces/IObjeto';

const objetoSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario del objeto es necesario']
    }
})

export const Objeto = model<IObjeto>('Objeto',objetoSchema);