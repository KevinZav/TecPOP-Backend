// ===================================
// Puerto
// ===================================

export const PORT = Number(process.env.PORT) || 3000;


// ===================================
// Entorno
// ===================================
const ENTORNO = process.env.NODE_ENV || 'dev';
let urlDB = '';
if(ENTORNO === 'dev') {
    urlDB = `mongodb://localhost:27017/tecpop`;
} else {
    urlDB = `mongodb+srv://KevinZav:Holamundo+42@cluster0-uw8oi.mongodb.net/TecPOP`;
}
process.env.urlDB = urlDB;