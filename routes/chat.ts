// ===================================
// Importaciones necesarias
// ===================================
// Modulos de Node
import {Router, Response, Request} from 'express';
import _ from 'underscore';
// Modulos del servidor
// middlewares
import { verificaToken } from '../middlewares/autenticacion';
// Esquema necesario para la ruta
import { Chat } from '../models/chat';

// declaracion del router de express
const chatRoute = Router();

// ===============================
// Crear un chat
// ===============================
chatRoute.post('/chat/:destinatario', verificaToken,async (req: any, res: Response) => {
    
    const usuario1 = req.usuario._id;
    const usuario2 = req.params.destinatario;
    const channel = `chat_${usuario1}_${usuario2}`;
    const channel2 = `chat_${usuario2}_${usuario1}`;
    const chat = {
        usuario1,
        usuario2,
        channel
    };
    await Chat.findOne()
    .or([{channel},{channel: channel2}])   
    .exec( async (err,chatDB) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        
        if(chatDB) {
            await chatDB?.populate('usuario1','-password -status -userID').execPopulate();
            await chatDB?.populate('usuario2','-password -status -userID').execPopulate();
            return res.json({
                ok: true,
                chat: chatDB
            });
        } else {
            Chat.create(chat).then( async (chatDB) => {
        
                await chatDB?.populate('usuario1','-password -status -userID').execPopulate();
                await chatDB?.populate('usuario2','-password -status -userID').execPopulate();
        
                return res.json({
                    ok: true,
                    chat: chatDB
                });
            }).catch( err => {
                return res.json({
                    ok: true,
                    err
                });
            });
        }
    });

});
// ===============================
// Obtener Chats de un usuario
// ===============================
chatRoute.get('/chat',verificaToken,(req: any, res: Response) => {
    
    const usuarioId = req.usuario._id;

    Chat.find()
        .or([{usuario1:usuarioId},{usuario2:usuarioId}])
        .populate('usuario2','-password -status -userID')
        .populate('usuario1','-password -status -userID')
        .exec((err, chatsDB) => {
            
            if(err) {
                return res.json({
                    ok: false,
                    err
                });
            }
            if(!chatsDB) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'No se han encontrado chats de ese usuario'
                    }
                });
            }
            const chatsFiltrados: any = [];
            chatsDB.forEach(chat => {
                const chatFiltrado = _.pick(chat,
                                        [chat.usuario1+'' === usuarioId ? 'usuario2' : 'usuario1','_id']);
                chatsFiltrados.push(chatFiltrado);
            });
            
            return res.json({
                ok: true,
                chats: chatsDB
            })

        });

});


export default chatRoute;