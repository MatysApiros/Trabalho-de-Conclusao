import { app } from './app.js';
import http from 'http';
import { emergencias } from './controller/chamadas-periodicas-emergencias.js';
import { utis } from './controller/chamadas-periodicas-utis.js';
import { scheduleJob } from 'node-schedule';

const porta = 3000;
app.set('port', porta);
const server = http.createServer(app);


app.get('/emergencias', emergencias);
app.get('/utis', utis);

const port = 3000;

server.listen(port, () => {

    console.log(`http://localhost:${port}/emergencias`);
    console.log(`http://localhost:${port}/utis`);

    scheduleJob(' */1 * * * *', function(){
        emergencias().then(emergencias => console.log(emergencias));
        utis().then(utis => console.log(utis))
    });
});
