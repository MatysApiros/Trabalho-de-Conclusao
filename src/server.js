import { app } from './app.js';
import http from 'http';
import { emergencias } from './controller/chamadas-periodicas-emergencias.js';
import { utis } from './controller/chamadas-periodicas-utis.js';
import { scheduleJob } from 'node-schedule';
import { ModelEmergenciasSchema, ModelUtisSchema } from './model/post.js';
import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://apiros:whiix416EGE7ghQa@cluster0.witsr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(() => {
        console.log('Database connected!');
    })
    .catch(() => {
        console.log('Connection Failed!')
    });

const porta = 3000;
app.set('port', porta);
const server = http.createServer(app);


app.get('/emergencias', emergencias);
app.get('/utis', utis);

const port = 3000;

server.listen(port, () => {

    // console.log(`http://localhost:${port}/emergencias`);
    // console.log(`http://localhost:${port}/utis`);

    scheduleJob(' */1 * * * *', function(){
        emergencias().then(emergencias => {
            createEmergenciaSchemas(emergencias);
            // console.log(emergencias)
        });
        utis().then(utis => {
            createUtisSchemas(utis);
            // console.log(utis);
        });
    });
});


function createEmergenciaSchemas(emergencias) {
    let schema = [];

    emergencias.forEach(emergencia => {
        schema.push(new ModelEmergenciasSchema(emergencia));
    });

    console.log(schema);
}

function createUtisSchemas(utis) {

    let schema = [];

    utis.forEach(uti => {
        schema.push(new ModelUtisSchema(uti));
    });
    
    console.log(schema);
}