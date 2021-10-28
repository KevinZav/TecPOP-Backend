// ===================================
// Importaciones necesarias
// ===================================
// Modulos de Node
import {Router, Response, Request, response} from 'express';
import _ from 'underscore';
import bcrypt from 'bcrypt';
// Modulos del server
import FileSystem from '../classes/file-system';
import Token from '../classes/token';
// middlewares
import { verificaToken } from '../middlewares/autenticacion';
import { verificaData } from '../middlewares/verificacion';
// Esquema necesario para la ruta
import { Usuario } from '../models/usuario';
import { FileUpload } from '../interfaces/IfileUpload';

// declaracion del router de express
const userRoutes = Router();
// Clase de FileSystem
const fs = new FileSystem();
// =============================
// Creacion de usuario con Token
// =============================
userRoutes.post('/usuario', verificaData,(req: any , res: Response ) => {

    const body = req.body;
    const usuario = req.usuarioValidado;
    usuario.userID = body.userID;

    Usuario.create(usuario).then( (userDB) => {
        const userToken = {
            _id: userDB._id,
            userID: userDB.userID,
            nombre: userDB.nombre,
            apellidos: userDB.apellidos,
            carrera: userDB.carrera
        }
        // Obtencion del Token
        const tokenUser = Token.getJWToken(userToken);

        return res.json({
            ok: true,
            token: tokenUser
        });
    }).catch( err  => {
        return res.json({
            ok: false,
            err
        });
    });

});
// =============================
// Modificar usuario con Token
// =============================
userRoutes.put('/usuario',[verificaToken, verificaData], (req: any ,res: Response ) => {
    
    const id = req.usuario._id;
    const nuevoUser = req.usuarioValidado;
    Usuario.findByIdAndUpdate(id,nuevoUser, {new: true}, (err, userDB) => {
            
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el usuario'
                }
            });
        }
        const userToken = {
            _id: userDB._id,
            userID: userDB.userID,
            nombre: userDB.nombre,
            apellidos: userDB.apellidos,
            carrera: userDB.carrera
        }
        // Obtencion del Token
        const tokenUser = Token.getJWToken(userToken);
        return res.json({
            ok: true,
            token: tokenUser
        });

    });

});
// =============================
// Deshabilitar un usuario
// =============================
userRoutes.delete('/usuario',verificaToken, ( req: any, res: Response ) => {
    
    const id = req.usuario._id;
    const status =  { status: false };

    Usuario.findByIdAndUpdate(id, status,{new: true}, (err, userDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            })
        }
        if(!userDB) {
            return res.json({
                ok: false,
                err: {
                    message:'No se ha encontrado el usuario'
                }
            })
        }
        return res.json({
            ok: true,
            message: 'Se ha eliminado el usuario correctamente'
        })
    });
});
// =============================
// Login de usuario
// =============================
userRoutes.post('/usuario/login', ( req:any , res: Response) => {
    
    const userID = req.body.userID;
    const password = req.body.password;

    Usuario.findOne( {userID} ,( err, userDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'El (usuario) o contraseña son incorrectos'
                }
            });
        }
        const verificarPassword = userDB.verificarPassword(password);
        if(verificarPassword) {
            const userToken = {
                _id: userDB._id,
                userID: userDB.userID,
                nombre: userDB.nombre,
                apellidos: userDB.apellidos,
                carrera: userDB.carrera
            }
            // Obtencion del Token
            const tokenUser = Token.getJWToken(userToken);
            // Informacion principal del usuario
            const userFiltrado = _.pick(userDB,['userID','nombre','apellidos','carrera','status','avatar']);
            return res.json({
                ok: true,
                token: tokenUser
            })
        } else {
            return res.json({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) incorrectos'
                }
            });
        }

    });

});
// ================================
// Informacion de usuario por token
// ================================
userRoutes.get('/usuario/info', verificaToken,(req: any, res: Response) => {
    const id = req.usuario._id;
    Usuario.findById(id, (err, userDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado un usuario con ese ID'
                }
            });
        }
        const userFiltrado = _.pick(userDB,['_id','userID','nombre','apellidos','carrera','status','avatar']);
        return res.json({
            ok: true,
            usuario: userFiltrado
        });
    });
});

// =============================
// Actualizar Avatar de usuario
// =============================
userRoutes.post('/usuario/avatar',[verificaToken], async ( req: any, res:Response ) => {

    if(!req.files) {
        return res.json({
            ok: false,
            err: {
                message: 'No se recibió ninguna imagen'
            }
        });
    }
    // File
    const file: FileUpload = req.files.image;

    //validar tipo de File
    if(file.mimetype.indexOf('image')<0) {
        return res.json({
            ok: false,
            err: {
                message: 'No se subió el archivo correctamente'
            }
        });
    }
    const id = req.usuario._id;
    
    let avatar = '';
    await fs.guardarImagenUsuario(file,id).then((imagen: any) => avatar = imagen);
    
    Usuario.findByIdAndUpdate(id, {avatar}, {new:true} , (err, userDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se encontro el usuario'
                }
            });
        }

        return res.json({
            ok: true,
            avatar: userDB.avatar,
            message: 'imagen subida con exito'
        });
    });

});
// ===============================
// Obtener Informacion del usuario
// ===============================
userRoutes.get('/usuario/info',verificaToken, (req: any , res) => {
        
    const id = req.usuario._id;
    Usuario.findById(id, ( err, userDB) => {
        
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!userDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado un usuario'
                }
            });
        }
        
        const userFiltrado = _.pick(userDB,['userID','nombre','apellidos','carrera','avatar']);
        return res.json({
            ok: true,
            usuario: userFiltrado
        })
    });

});
// ===============================
// Obtener Avatar del usuario
// ===============================
userRoutes.get('/usuario/avatar/:avatar', (req, res) => {
    
    const imagen = req.params.avatar;

    const pathImage = fs.getImagenUsuario(imagen);
    res.sendFile(pathImage);
    
});
export default userRoutes;
