import { IUsuario } from './IUsuario';
import { IChat } from './IChat';
import { Document } from 'mongoose';


export interface IMensaje  extends Document{
    texto: string;
    usuario: IUsuario;
    chat: IChat;
    created: Date;
}