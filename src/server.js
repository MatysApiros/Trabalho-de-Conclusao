import { app } from './app.js';
import http from 'http';
import { emergencias } from './controller/chamadas-periodicas-emergencias.js';
import { utis } from './controller/chamadas-periodicas-utis.js';
import { scheduleJob } from 'node-schedule';
import { ModelEmergenciasSchema, ModelUtisSchema } from './model/post.js';
import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://apiros:whiix416EGE7ghQa@cluster0.witsr.mongodb.net/hospitais?retryWrites=true&w=majority")
    .then(() => {
        console.log('Database connected!');
    })
    .catch(() => {
        console.log('Connection Failed!')
    });

const porta = process.env.PORT || 3000;

app.set('port', porta);

app.get('/emergencias', (req,res, next) => {
    ModelEmergenciasSchema.find()
        .then(documents => {
            res.status(200).json({
                hospitais: documents
            });
        })
        .catch();
});
app.get('/utis', (req,res, next) => {
    ModelUtisSchema.find()
        .then(documents => {
            res.status(200).json({
                hospitais: documents
            });
        })
        .catch();
});

const server = http.createServer(app);

server.listen(porta, () => {

    console.log(`http://localhost:${porta}/emergencias`);
    console.log(`http://localhost:${porta}/utis`);

    // SCHEDULE 1 minuto: ' */1 * * * *'

    // SCHEDULE 1 hora: '* * 1 * * *'

    scheduleJob('0 0 */1 * * *', function(){
        chamadaScrapper();
    });

});


function chamadaScrapper() {

    try {
        emergencias().then(emergencias => {
            console.log(emergencias);
            createEmergenciaSchemas(emergencias);
        });
        utis().then(utis => {
            console.log(utis);
            createUtisSchemas(utis);
        });
    } catch (error) {
        setTimeout(() => chamadaScrapper(), 60000);
    }
}

function createEmergenciaSchemas(emergencias) {

    let schema = [];

    emergencias.forEach(emergencia => {
        schema.push(new ModelEmergenciasSchema(emergencia));
    });

    ModelEmergenciasSchema.deleteMany({})
        .then(() => ModelEmergenciasSchema.bulkSave(schema));
}

function createUtisSchemas(utis) {

    let schema = [];

    utis.forEach(uti => {
        schema.push(new ModelUtisSchema(uti));
    });

    ModelUtisSchema.deleteMany({})
        .then(() => ModelUtisSchema.bulkSave(schema));
}