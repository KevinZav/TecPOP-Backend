// import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
import {FileUpload} from '../interfaces/IfileUpload'

export default class FileSystem{

    guardarImagenUsuario( file: FileUpload, usuarioID: string ) {

        return new Promise( (resolve, reject) => {
            // crear la carpeta del usuario
            const pathUser = this.crearDirAvatar(usuarioID);
            // Nombre unico para la imagen
            const nombreArchivo: string = `${usuarioID}.${this.generarNombreUnico(file.name, false)}`;
            
            // Borrar los otros avatars
            this.borrarAvatarActual(usuarioID);

            // mover el archivo a la carpeta del usuario
            file.mv( `${ pathUser }/${ nombreArchivo }`, ( err: any) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(nombreArchivo);
                }
    
            });
        });

    }
    getImagenUsuario( pathImage: string ) {
        
        const carpetaUsuario = pathImage.split('.')[0];

        const pathImageSend = path.resolve(__dirname,'../uploads','avatar',carpetaUsuario,pathImage);
        

        const existeImage = fs.existsSync(pathImageSend);
        if (existeImage) {
            return pathImageSend;
        } else {
            return path.resolve(__dirname,'../assets','original.jpg');
        }

    }
    public guardarImagenObjeto(file: FileUpload,objetoID: string) {
        
        return new Promise( (resolve, reject) => {

            // obtener y crear el path
            const pathObjeto = this.crearDirObjeto(objetoID);
            // Nombre unico para la imagen
            const nombreImagen = this.generarNombreUnico(file.name,true);
            // obtener las demas imagenes
            const imagenes = fs.readdirSync(pathObjeto);
            // mover la imagen al Path
            file.mv( `${pathObjeto}/${nombreImagen}`, (err: any) => {
                if(err) {
                    reject(err);
                } else {
                    imagenes.push(nombreImagen);
                    resolve(imagenes);
                }
            });

        });

    }
    borrarImagenObjeto( objetoID: string, imagen: string ) {
        
        const pathImage = path.resolve(__dirname,'../uploads','objeto',objetoID,imagen);
        const existeImage = fs.existsSync(pathImage);

        if (existeImage) {

            fs.unlinkSync(pathImage);
            const imagenes = fs.readdirSync(path.resolve(__dirname,'../uploads','objeto',objetoID));
            return {eliminado:true, imagenes};

        } else {
            return {eliminado: false};
        }

    }
    borrarImagenesObjeto(objetoID: string) {

        const pathImagenes = path.resolve(__dirname,'../uploads','objeto',objetoID);
        if(fs.existsSync(pathImagenes)) {
            const imagenes = fs.readdirSync(pathImagenes);
            imagenes.forEach(imagen => {
                let pathImagen = path.resolve(pathImagenes,imagen);
                fs.unlinkSync(pathImagen);
            });
            return true;
        }
        return false;

    }
    getImagenObjeto(objetoID: string, imagen: string) {
        const pathImagen = path.resolve(__dirname,'../uploads','objeto',objetoID,imagen);
        
        if(fs.existsSync(pathImagen)) {
            return pathImagen;
        } else {
            return path.resolve(__dirname,'../assets','original.jpg'); 
        }

    }
    public crearDirObjeto(objetoID: string) {
        const pathObjeto = path.resolve(__dirname,'../uploads','objeto',objetoID);
        
        if(!fs.existsSync(pathObjeto)) {
            fs.mkdirSync(pathObjeto);
        }
        return pathObjeto;

    }
    public mostarArchivos() {
        const pathDir = path.resolve(__dirname,'../assets');
        const archivos = fs.readdirSync(pathDir);
        console.log(archivos);
    }
    private crearDirAvatar( usuarioID: string ): string {
        const pathUser = path.resolve(__dirname,'../uploads','avatar',usuarioID);
        
        const existeDir = fs.existsSync(pathUser);
        if( !existeDir ) {
            fs.mkdirSync(pathUser);
        }

        return pathUser;
    }

    private borrarAvatarActual(usuarioID: string) {
        
        const pathUser = path.resolve(__dirname,'../uploads','avatar',usuarioID);
        if(fs.existsSync(pathUser)){
            const avatars = fs.readdirSync(pathUser);
            avatars.forEach(avatar => {
                fs.unlinkSync(`${pathUser}/${avatar}`);
            });
        }

    }
   
    private generarNombreUnico( nombreOriginal: string, unico: boolean ) {

        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[ nombreArr.length -1 ];
        
        const idUnico = uniqid();
        if(unico){
            return `${idUnico}.${extension}`;
        } else {
            return extension;
        }

    }
    

}