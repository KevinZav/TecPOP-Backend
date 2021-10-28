import {Document} from 'mongoose';
import { IUsuario } from './IUsuario';


export interface IObjeto extends Document{
    nombre: string;
    descripcion: string;
    imagenes: string;
    estado: string;
    usuario: IUsuario;
}