import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Objeto } from '../models/objeto';


export const verificaData = ( req: any, res: Response, next: NextFunction ) => {
    
    const usuario = req.body;
    const usuarioValidado: any = {};
    
    if(usuario.nombre) {
        usuarioValidado.nombre = usuario.nombre;
    }
    if(usuario.apellidos) {
        usuarioValidado.apellidos = usuario.apellidos;
    }
    if(usuario.carrera) {
        usuarioValidado.carrera = usuario.carrera;
    }
    if(usuario.password) {
        usuarioValidado.password = bcrypt.hashSync( usuario.password, 10 );
    }
    
    req.usuarioValidado = usuarioValidado;
    next();

}

export const verificaDataObjeto = (req: any, res: Response, next: NextFunction) => {
    const objeto = req.body;
    const objetoValidado: any = {};
    
    if(objeto.nombre) {
        objetoValidado.nombre = objeto.nombre;
    }
    if(objeto.descripcion) {
        objetoValidado.descripcion = objeto.descripcion;
    }
    if(objeto.estado) {
        objetoValidado.estado = objeto.estado;
    }
    
    req.objetoValidado = objetoValidado;
    next();
}

export const verificaDataPost = (req: any, res: Response, next: NextFunction) => {

    const post = req.body;
    const idUsuario = req.usuario._id;
    const postVerificado: any = {};
    if(post.mensaje) {
        postVerificado.mensaje = post.mensaje;    
    }
    if(post.ubicacion) {
        postVerificado.ubicacion = post.ubicacion;
    }
    if(post.objeto) {
        postVerificado.objeto = post.objeto;
        // logica para verificar un objeto;
        Objeto.findOne({_id:postVerificado.objeto, usuario:idUsuario},(err, objetoDB) => {
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
                        message: 'No se encontro un objeto con el id y usuario especificado'
                    }
                });
            }
        });
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'objeto no especificado'
            }
        })
    }
    postVerificado.created = new Date();
    postVerificado.usuario = idUsuario;
    req.postVerificado = postVerificado;
    next();

}
export const verificaDataComentario = (req: any, res: Response, next: NextFunction) => {
    const comentario = req.body;
    const comentarioVerificado: any = {};
    if(comentario.texto) {
        comentarioVerificado.texto = comentario.texto;
    }
    if(comentario.post) {
        comentarioVerificado.post = comentario.post;
        console.log(comentario.post);
    }
    comentarioVerificado.created = new Date();
    comentarioVerificado.usuario = req.usuario._id;
    req.comentarioVerificado = comentarioVerificado;
    next();

}