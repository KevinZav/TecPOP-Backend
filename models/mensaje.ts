import {  model, Schema } from 'mongoose';
import { IMensaje } from '../interfaces/IMensaje';


export const mensajeSchema = new Schema({
    
    texto: {
        type: String,
        required: [true,'El texto del mensaje es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario del mensaje es indispensable']
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: [true, 'El chat del mensaje es necesario']
    },
    created: {
        type: Date
    }
    
});

export const Mensaje = model<IMensaje>('Mensaje', mensajeSchema);