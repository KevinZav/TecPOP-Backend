// ===================================
// Importaciones necesarias
// ===================================
// Modulos de Node
import {Router, Response, Request, response} from 'express';
import _ from 'underscore';
// Modulos del servidor
import FileSystem from '../classes/file-system';
// middlewares
import { verificaToken } from '../middlewares/autenticacion';
import { verificaDataObjeto } from '../middlewares/verificacion';
// Esquema necesario para la ruta
import { FileUpload } from '../interfaces/IfileUpload';
import { Objeto } from '../models/objeto';

// declaracion del router de express
const objetRoutes = Router();
// Clase de FileSystem
const fs = new FileSystem();

// =============================
// Creacion de objeto
// =============================
objetRoutes.post('/objeto',verificaToken, (req: any, res: Response) => {
    
    const userId = req.usuario._id;
    const objeto = req.body;
    objeto.usuario = userId;
    Objeto.create(objeto).then( async (objetoDB) => {

        await objetoDB.populate('usuario','-password').execPopulate();
        
        return res.json({
            ok: true,
            objeto: objetoDB
        });

    }).catch( (err) => {
        return res.status(400).json({
            ok: false,
            err
        });
    });

});
// =============================
// Borrar el objeto
// =============================
objetRoutes.delete('/objeto/eliminar/:id',verificaToken, (req: any, res: Response) => {
    
    const idObjeto = req.params.id;
    const idUsuario = req.usuario._id;
    
    Objeto.findOneAndDelete({_id:idObjeto, usuario: idUsuario}, ( err, objetoDB )=> {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!objetoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el objeto con ese ID y ese usuarioID'
                }
            });
        }
        // borrar imagenes
        fs.borrarImagenesObjeto(objetoDB._id+'');
        return res.json({
            ok: true,
            objeto: objetoDB
        })
    });

});
// ==============================
// Actualizar info de un objeto
// ==============================
objetRoutes.put('/objeto/:id',[verificaToken, verificaDataObjeto],(req: any, res: Response) => {

    const idUsuario = req.usuario._id;
    const idObjeto = req.params.id;
    const objeto = req.objetoValidado;
    
    Objeto.findOneAndUpdate({_id:idObjeto,usuario:idUsuario},objeto,{new: true}, (err, objetoDB) => {
        
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!objetoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el objeto con el ID o usuario especificado'
                }
            });
        }
        return res.json({
            ok: true,
            objeto: objetoDB
        });

    });

});
// ==============================
// Ver informacion de un objeto
// ==============================
objetRoutes.get('/objeto/:id', verificaToken, (req, res) => {
    
    const idObjeto = req.params.id;
    
    Objeto.findById(idObjeto, async (err, objetoDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!objetoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No existe un objeto con ese id'
                }
            });
        }
        await objetoDB.populate('usuario','-password').execPopulate();
        return res.json({
            ok: true,
            objeto: objetoDB
        });
    });

});
// ==============================
// Obtener objetos de usuario
// ==============================
objetRoutes.get('/objeto', verificaToken, (req: any, res: Response) => {
    
    const idUsuario = req.usuario._id;
    let page = req.query.page - 1 || 0;
    if(page<0) {
        page = 0;
    }
    const skip = page * 10;
    Objeto.find({usuario: idUsuario})
        .populate('usuario','-password')
        .limit(10)
        .skip(skip)
        .exec( (err, objetosDB) => {
            if(err) {
                return res.json({
                    ok: false,
                    err
                });
            }
            if(!objetosDB) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'No se han encontrado objetos de ese usuario'
                    }
                });
            }
            return res.json({
                ok: true,
                objetos: objetosDB
            });
        });

});


// ==============================
// Publicar imagen de un objeto
// ==============================
objetRoutes.post('/objeto/imagen', verificaToken, async (req: any, res: Response) => {
    
    const idObjeto = req.query.id;
    const idUsuario = req.usuario._id;
    const file: FileUpload = req.files.image;
    
    const fotos = await fs.guardarImagenObjeto(file,idObjeto);

    Objeto.findOneAndUpdate({_id:idObjeto, usuario: idUsuario},{fotos},{new:true}, (err,objetoDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!objetoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el objeto con el ID o usuario especificado'
                }
            });
        }
        return res.json({
            ok: true,
            objeto: objetoDB
        });
    });

});
// ==============================
// Borrar imagen de un objeto
// ==============================
objetRoutes.post('/objeto/imagen/eliminar', verificaToken, (req: any, res: Response) => {
    
    const idObjeto = req.body.id;
    const imagen = req.body.image;
    const idUsuario = req.usuario._id;
    const imagenObject = fs.borrarImagenObjeto(idObjeto,imagen);
    if( !imagenObject.eliminado ) {

        return res.json({
            ok: false,
            err: {
                message: 'No se ha encontrado la imagen especificada'
            }
        });

    }
    Objeto.findOneAndUpdate({_id:idObjeto, usuario:idUsuario}, {fotos: imagenObject.imagenes},
    {new: true}, (err, objectoDB) => {
        
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!objectoDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el objeto con el ID o usuario especificado'
                }
            });
        }
        return res.json({
            ok: true,
            objeto: objectoDB
        });

    });
    
});
objetRoutes.get('/objeto/imagen/:objeto/:imagen', (req, res) => {
    
    const idObjeto = req.params.objeto;
    const imagen = req.params.imagen;
    
    const imagenPath = fs.getImagenObjeto(idObjeto,imagen);
    return res.sendFile(imagenPath);

});

export default objetRoutes;