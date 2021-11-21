import { app, porta } from './controller/app.js';
import http from 'http';
import { scheduleJob } from 'node-schedule';
import mongoose from 'mongoose';
import { chamadaScrapper } from './controller/gerenciado-scraping.js';

/*
    Realiza a conexão com o banco
*/
mongoose.connect("mongodb+srv://apiros:whiix416EGE7ghQa@cluster0.witsr.mongodb.net/hospitais?retryWrites=true&w=majority")
    .then(() => {
        console.log('Database connected!');
    })
    .catch(() => {
        console.log('Connection Failed!')
    });

/*
    Cria uma nova instancia do server que ficará rodando
    e ativa o scheduleJob encarregado de fazer chamadas
    a cada 1 hora
*/
const server = http.createServer(app);

server.listen(porta, () => {

    scheduleJob('0 0 */1 * * *', function(){

        console.info('--- Scheddule completou um ciclo de 1 hora ---');

        chamadaScrapper();
    });

});
