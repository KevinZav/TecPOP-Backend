import { Schema, model } from 'mongoose';
import { IChat } from '../interfaces/IChat';

export const chatSchema = new Schema({
    
    usuario1: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Todos los usuario son necesarios']
    },
    usuario2: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Todos los usuario son necesarios']
    },
    channel : {
        type: String,
        required: [true, 'El canal del chat es necesario']
    }

});

export const Chat = model<IChat>('Chat',chatSchema);