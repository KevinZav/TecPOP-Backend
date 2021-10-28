// ===================================
// Importaciones necesarias
// ===================================
// Modulos de Node
import {Router, Response, Request} from 'express';
// Modulos del servidor
// middlewares
import { verificaToken } from '../middlewares/autenticacion';
import { verificaDataComentario } from '../middlewares/verificacion';
// Esquema necesario para la ruta
import { Comentario } from '../models/comentario';


// declaracion del router de express
const comentarioRoutes = Router();

// ===============================
// Postear un comentario
// ===============================
comentarioRoutes.post('/comentario',[verificaToken, verificaDataComentario], (req: any, res: Response) => {
    
    const comentario = req.comentarioVerificado;
    Comentario.create(comentario).then( async (comentarioDB) => {
        await comentarioDB.populate('post','-usuario -objeto -ubicacion').execPopulate();
        await comentarioDB.populate('usuario','-password -status').execPopulate();
        return res.json({
            ok: true,
            comentario: comentarioDB
        })
    });

});
// ===============================
// Eliminar un comentario
// ===============================
comentarioRoutes.delete('/comentario/:id',[verificaToken], (req:any,res: Response) => {
    
    const idComentario = req.params.id;
    Comentario.findByIdAndDelete(idComentario, (err, comentarioDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!comentarioDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se pudo encontrar un comentario con ese ID'
                }
            });
        }
        return res.json({
            ok: true,
            message: 'Se ha eliminado el comentario correctamente'
        })
    })

});
// ===============================
// Obtener comentarios de un post
// ===============================
comentarioRoutes.get('/comentario/:post',verificaToken ,async (req: any, res: Response) => {
    const post = req.params.post;

    const comentarios = await Comentario.find({post})
    .populate('usuario','-password -status')
    .exec();
    return res.json({
        ok: true,
        comentarios
    });

});

export default comentarioRoutes;