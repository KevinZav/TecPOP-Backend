"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ===================================
// Importaciones necesarias
// ===================================
// Modulos de node
const mongoose_1 = __importDefault(require("mongoose"));
const safe_1 = __importDefault(require("colors/safe"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
// Server
const server_1 = __importDefault(require("./classes/server"));
// Rutas de aplicacion
const index_1 = __importDefault(require("./routes/index"));
const config_1 = require("./config/config");
// Inicializacion del servidor
const server = new server_1.default(config_1.PORT);
// Body Parser 
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// fileUpload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// Importante configurar Cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
// Uso de las rutas de aplicacion
server.app.use(index_1.default);
// Mensaje de bienvenida al RestServer
server.app.get('/', (req, res) => {
    return res.json({
        ok: true,
        message: 'Bienvenido al Rest Server de TecPOP'
    });
});
// inicializacion de la base de datos
mongoose_1.default.connect(`${process.env.urlDB}`, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }, (err) => {
    if (err)
        throw err;
    console.log(safe_1.default.cyan(`Base de datos ONLINE`));
});
// Levantar Express
server.start(() => {
    console.log(safe_1.default.blue(`Escuchando el puerto: 3000`));
});
