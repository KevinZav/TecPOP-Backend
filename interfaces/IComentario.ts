import {Document} from 'mongoose';
import { IUsuario } from './IUsuario';
import { IPost } from './IPost';

export interface IComentario extends Document {
    texto: string;
    usuario: IUsuario;
    post: IPost;
    created: Date;
}