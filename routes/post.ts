// ===================================
// Importaciones necesarias
// ===================================
// Modulos de Node
import {Router, Response, Request} from 'express';
import _ from 'underscore';
// Modulos del servidor
// middlewares
import { verificaToken } from '../middlewares/autenticacion';
import { verificaDataPost } from '../middlewares/verificacion';
// Esquema necesario para la ruta
import { Post } from '../models/post';
import { Objeto } from '../models/objeto';

// declaracion del router de express
const postRoutes = Router();

// ==============================
// Publicar un post
// ==============================
postRoutes.post('/post',[verificaToken, verificaDataPost], (req: any, res: Response) => {

    const post = req.postVerificado;
    
    // const cambioEstado = cambiarEstadoObjeto(post.objeto,'Perdido');
    
    // if(!cambioEstado) {
    //     return res.json({
    //         ok: false,
    //         err: {
    //             message: 'No se ha cambiado el estado del objeto'
    //         }
    //     })
    // }

    Post.create(post).then( async (postDB) => {

        await postDB.populate('objeto').execPopulate();
        await postDB.populate('usuario','-password -status').execPopulate();
        
        return res.json({
            ok: true,
            post: postDB
        });

    }).catch( err => {
        return res.json({
            ok: false,
            err
        });
    });

});
// ==============================
// Eliminar un post
// ==============================
postRoutes.delete('/post/:id',[verificaToken], (req: any, res: Response) => {
    
    const idUsuario = req.usuario._id;
    const idPost = req.params.id;
    
    Post.findOneAndDelete({_id:idPost,usuario: idUsuario}, (err, postDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el post con ese ID o usuario'
                }
            });
        }
        const objetoID = postDB.objeto._id;
        cambiarEstadoObjeto(objetoID,'Activo');
        return res.json({
            ok: true,
            message: 'Se ha eliminado el post correctamente'
        });
    });
});
// ==============================
// Actualizar un post
// ==============================
postRoutes.put('/post/:id',[verificaToken, verificaDataPost],(req: any, res: Response) => {
    
    const post = req.postVerificado;
    const idPost = req.params.id;
    
    Post.findOne({_id:idPost}, (err, postDB)  => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el post con ese ID'
                }
            });
        }
    });
    Post.findOneAndUpdate({_id:idPost},post,{new: true}, async (err, postDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el post con ese ID'
                }
            });
        }

        await postDB.populate('objeto','-usuario').execPopulate();
        await postDB.populate('usuario','-password -status').execPopulate();
        return res.json({
            ok: true,
            post: postDB
        });

    });

});
// ==============================
// Obtener informacion de un post
// ==============================
postRoutes.get('/post/:id',verificaToken,(req: any, res: Response) => {
    
    const id = req.params.id;
    Post.findById(id, async (err, postDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado un post con ese ID'
                }
            })
        }
        await postDB.populate('objeto','-usuario').execPopulate();
        await postDB.populate('usuario','-password -status').execPopulate();
        return res.json({
            ok: true,
            post: postDB
        });
    });

});
// ==============================
// Obtener posts de un usuario
// ==============================
postRoutes.get('/posts/usuario',verificaToken, async (req: any, res: Response) => {

    let page = req.query.page - 1 | 0;
    if(page <= 0) {
        page = 0;
    }
    const from = page * 5;
    const usuarioID = req.usuario._id;

    await Post.find({usuario:usuarioID})
    .populate('objeto','-usuario')
    .populate('usuario','-password -status')
    .limit(5)
    .sort({created:-1})
    .skip(from)
    .exec(  (err,postsDB) => {

        return res.json({
            ok: true,
            posts: postsDB
        });

    });
    
});
// ==============================
// Obtener post paginados
// ==============================
postRoutes.get('/posts',verificaToken, async (req: any, res: Response) => {

    let page = req.query.page - 1 | 0;
    if(page <= 0) {
        page = 0;
    }
    const from = page * 5;
    
    await Post.find()
    .populate('objeto','-usuario')
    .populate('usuario','-password -status')
    .limit(5)
    .sort({created:-1})
    .skip(from)
    .exec(  (err,postsDB) => {

        return res.json({
            ok: true,
            posts: postsDB
        });

    });

});
// ==============================
// Reaccionar a un post
// ==============================
postRoutes.get('/post/reaccionar/:id',verificaToken, async (req:any, res: Response) => {
    
    const idUsuario = req.usuario._id;
    const idPost = req.params.id;
    
    let reacciones : any[] = [];
    await Post.findById(idPost, (err,postDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se encuentra un post con ese ID'
                }
            });
        }
        reacciones = postDB.reacciones || [];
    });
    
    const reaccionesFiltradas = reacciones.filter(reaccion => reaccion + '' !== idUsuario ); 
    let reaccion: boolean;
    if(reaccionesFiltradas.length === reacciones.length) {
        reacciones.push(idUsuario);
        reaccion = true;
    } else {
        reacciones = reaccionesFiltradas;
        reaccion = false;
    }

    Post.findByIdAndUpdate(idPost,{reacciones}, {new: true} , async (err, postDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se encontró un post con el id especificado'
                }
            })
        }
        
        return res.json({
            ok: true,
            reaccion,
            reacciones: postDB.reacciones?.length || 0
        })
    });

});
// ==============================
// Post de objeto encontrado
// ==============================
postRoutes.post('/post/encontrado', verificaToken ,(req: any, res) => {
    const body = req.body;
    const objeto = {
        nombre: body.nombre,
        descripcion: body.descripcion,
        estado: 'Encontrado',
        usuario: req.usuario._id
    }
    Objeto.create(objeto).then( objetoDB => {
        const post = {
            created: new Date(),
            mensaje: body.mensaje,
            ubicacion: body.ubicacion || '',
            objeto: objetoDB._id,
            usuario: req.usuario._id
        }
        Post.create(post).then( async (postDB) => {
            await postDB.populate('objeto').execPopulate();
            await postDB.populate('usuario','-password -status').execPopulate();
            return res.json({
                ok: true,
                post: postDB
            })
        }).catch( err => {
            return res.json({
                ok: false,
                err
            });
        });
    }).catch( err => {
        return res.json({
            ok: false,
            err
        });
    });
});
// ==================================
// Eliminar post de objeto encontrado
// ==================================
postRoutes.delete('/post/encontrado/:post', verificaToken ,(req: any, res) => {
    const postId = req.params.post;
    
    Post.findByIdAndDelete(postId, (err, postDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!postDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se ha encontrado un post con ese ID'
                }
            });
        } else {
            const objetoId = postDB.objeto;
            Objeto.findByIdAndDelete(objetoId, (err, objetoDB) => {
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
                            message: 'No se ha encontrado un objeto con ese Id'
                        }
                    });
                } else {
                    return res.json({
                        ok: true,
                        message: 'Post y objeto eliminados con exito'
                    });
                }
            });
            
        }
    });

});


async function cambiarEstadoObjeto(objetoID: string, estado: string ) {
    
    await Objeto.findByIdAndUpdate(objetoID,{estado}, (err, objetoDB) => {
        
        if(err) {
            return false;
        }
        if(!objetoDB) {
            return false;
        }
    });

    return true;

}


export default postRoutes;

