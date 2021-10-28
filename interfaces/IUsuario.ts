import {Document} from 'mongoose';


export interface IUsuario extends Document{
    userID: string;
    nombre: string;
    apellidos: string;
    carrera: string;
    avatar?: string;
    password:string;
    status?: boolean;
    verificarPassword: Function;
}