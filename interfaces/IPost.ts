import { Document } from 'mongoose';
import { IObjeto } from './IObjeto';
import { IUsuario } from './IUsuario';

export interface IPost extends Document {
    created: Date;
    mensaje: string;
    ubicacion: string;
    objeto: IObjeto;
    usuario: IUsuario;
    reacciones?: IUsuario[];
}