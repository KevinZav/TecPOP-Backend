"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import fileUpload from 'express-fileupload';
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    guardarImagenUsuario(file, usuarioID) {
        return new Promise((resolve, reject) => {
            // crear la carpeta del usuario
            const pathUser = this.crearDirAvatar(usuarioID);
            // Nombre unico para la imagen
            const nombreArchivo = `${usuarioID}.${this.generarNombreUnico(file.name, false)}`;
            // Borrar los otros avatars
            this.borrarAvatarActual(usuarioID);
            // mover el archivo a la carpeta del usuario
            file.mv(`${pathUser}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(nombreArchivo);
                }
            });
        });
    }
    getImagenUsuario(pathImage) {
        const carpetaUsuario = pathImage.split('.')[0];
        const pathImageSend = path_1.default.resolve(__dirname, '../uploads', 'avatar', carpetaUsuario, pathImage);
        const existeImage = fs_1.default.existsSync(pathImageSend);
        if (existeImage) {
            return pathImageSend;
        }
        else {
            return path_1.default.resolve(__dirname, '../assets', 'original.jpg');
        }
    }
    guardarImagenObjeto(file, objetoID) {
        return new Promise((resolve, reject) => {
            // obtener y crear el path
            const pathObjeto = this.crearDirObjeto(objetoID);
            // Nombre unico para la imagen
            const nombreImagen = this.generarNombreUnico(file.name, true);
            // obtener las demas imagenes
            const imagenes = fs_1.default.readdirSync(pathObjeto);
            // mover la imagen al Path
            file.mv(`${pathObjeto}/${nombreImagen}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    imagenes.push(nombreImagen);
                    resolve(imagenes);
                }
            });
        });
    }
    borrarImagenObjeto(objetoID, imagen) {
        const pathImage = path_1.default.resolve(__dirname, '../uploads', 'objeto', objetoID, imagen);
        const existeImage = fs_1.default.existsSync(pathImage);
        if (existeImage) {
            fs_1.default.unlinkSync(pathImage);
            const imagenes = fs_1.default.readdirSync(path_1.default.resolve(__dirname, '../uploads', 'objeto', objetoID));
            return { eliminado: true, imagenes };
        }
        else {
            return { eliminado: false };
        }
    }
    borrarImagenesObjeto(objetoID) {
        const pathImagenes = path_1.default.resolve(__dirname, '../uploads', 'objeto', objetoID);
        if (fs_1.default.existsSync(pathImagenes)) {
            const imagenes = fs_1.default.readdirSync(pathImagenes);
            imagenes.forEach(imagen => {
                let pathImagen = path_1.default.resolve(pathImagenes, imagen);
                fs_1.default.unlinkSync(pathImagen);
            });
            return true;
        }
        return false;
    }
    getImagenObjeto(objetoID, imagen) {
        const pathImagen = path_1.default.resolve(__dirname, '../uploads', 'objeto', objetoID, imagen);
        if (fs_1.default.existsSync(pathImagen)) {
            return pathImagen;
        }
        else {
            return path_1.default.resolve(__dirname, '../assets', 'original.jpg');
        }
    }
    crearDirObjeto(objetoID) {
        const pathObjeto = path_1.default.resolve(__dirname, '../uploads', 'objeto', objetoID);
        if (!fs_1.default.existsSync(pathObjeto)) {
            fs_1.default.mkdirSync(pathObjeto);
        }
        return pathObjeto;
    }
    mostarArchivos() {
        const pathDir = path_1.default.resolve(__dirname, '../assets');
        const archivos = fs_1.default.readdirSync(pathDir);
        console.log(archivos);
    }
    crearDirAvatar(usuarioID) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', 'avatar', usuarioID);
        const existeDir = fs_1.default.existsSync(pathUser);
        if (!existeDir) {
            fs_1.default.mkdirSync(pathUser);
        }
        return pathUser;
    }
    borrarAvatarActual(usuarioID) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', 'avatar', usuarioID);
        if (fs_1.default.existsSync(pathUser)) {
            const avatars = fs_1.default.readdirSync(pathUser);
            avatars.forEach(avatar => {
                fs_1.default.unlinkSync(`${pathUser}/${avatar}`);
            });
        }
    }
    generarNombreUnico(nombreOriginal, unico) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        if (unico) {
            return `${idUnico}.${extension}`;
        }
        else {
            return extension;
        }
    }
}
exports.default = FileSystem;
