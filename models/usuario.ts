import { Schema,model } from 'mongoose';
import { IUsuario } from '../interfaces/IUsuario';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
    userID: {
        type: String,
        required: [true, 'El userID del usuario es requerido' ],
        unique: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del usuario es requerido' ]
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos del usuario son requerido' ]
    },
    carrera: {
        type: String
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'La password del usuario es requerida']
    },
    status: {
        type: Boolean,
        default: true,
        required: [true, 'El estado del usuario es requerido']
    }
});

usuarioSchema.method( 'verificarPassword', function( password: string ): boolean {
    if ( bcrypt.compareSync( password, this.password ) ) {
        return true;
    } else {
        return false;
    }
});




export const Usuario = model<IUsuario>('Usuario', usuarioSchema);