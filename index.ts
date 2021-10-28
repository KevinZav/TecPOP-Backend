// ===================================
// Importaciones necesarias
// ===================================
// Modulos de node
import mongoose from 'mongoose';
import colors from 'colors/safe';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
// Server
import Server from './classes/server';
// Rutas de aplicacion
import indexRoutes from './routes/index';
import { PORT } from './config/config';



// Inicializacion del servidor
const server = new Server(PORT);
// Body Parser 
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());
// fileUpload
server.app.use(fileUpload({useTempFiles: true}));

// Importante configurar Cors
server.app.use(cors({origin: true, credentials: true}));

// Uso de las rutas de aplicacion
server.app.use(indexRoutes);

// Mensaje de bienvenida al RestServer
server.app.get('/', (req, res) => {
    return res.json({
        ok: true,
        message: 'Bienvenido al Rest Server de TecPOP V2.0.0'
    });
});

// inicializacion de la base de datos
mongoose.connect(`${process.env.urlDB}`,
        {useCreateIndex: true, useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify:true},
        (err) => {
            if(err) throw err;
            console.log(colors.cyan(`Base de datos ONLINE`));
        });

// Levantar Express
server.start( () => {
    console.log(colors.blue(`Escuchando el puerto: 3000`));
});