// ===================================
// Importaciones necesarias
// ===================================
// Modulos de Node
import {Router, Response, Request} from 'express';
// Modulos del servidor
// middlewares
import { verificaToken } from '../middlewares/autenticacion';
// Esquema necesario para la ruta
import { Mensaje } from '../models/mensaje';


// declaracion del router de express
const mensajeRoutes = Router();

// ==============================
// Agregar mensaje a un chat
// ==============================
mensajeRoutes.post('/mensaje',verificaToken,(req: any, res: Response) => {

    const usuario = req.usuario._id;
    const texto = req.body.texto;
    const chat = req.body.chat;

    const mensaje = {
        usuario,
        texto,
        chat,
        created: new Date()
    };
    Mensaje.create(mensaje).then( async (mensajeDB) => {

        await mensajeDB.populate('usuario','-password -status -userID').execPopulate();
        return res.json({
            ok: true,
            mensaje: mensajeDB
        })
    }).catch(err => {
        return res.json({
            ok: false,
            err
        });
    });

});
// ==============================
// Obtener mensajes por chat
// ==============================
mensajeRoutes.get('/mensaje/:chat',verificaToken,(req: any,res: Response) => {
    
    const chat = req.params.chat;

    Mensaje.find({chat})
    .populate('usuario','-password -status -userID')
    .sort({created:1})
    .exec((err,mensajesDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        if(!mensajesDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No se han encontrado mensajes'
                }
            });
        }
        return res.json({
            ok: true,
            mensajes: mensajesDB
        });
    });

});

export default mensajeRoutes;