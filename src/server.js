import { app } from './app.js';
import http from 'http';
import { emergencias, utis } from './controller/chamadas-periodicas.js';

const porta = 3000;
app.set('port', porta);
const server = http.createServer(app);

app.get('/emergencias', emergencias);
app.get('/utis', utis);

const port = 3000;

server.listen(port, () => {
    console.log(`http://localhost:${port}/emergencias`);
});


// https://stackoverflow.com/questions/56992131/web-scraping-periodically-job-performance