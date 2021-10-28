import { Document } from 'mongoose';
import { IUsuario } from './IUsuario';


export interface IChat extends Document {
    usuario1: IUsuario;
    usuario2: IUsuario;
    channel: string;
}
