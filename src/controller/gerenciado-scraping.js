import { ModelEmergenciasSchema, ModelUtisSchema } from '../model/post.js';
import { emergencias } from "./chamadas-periodicas-emergencias.js";
import { utis } from "./chamadas-periodicas-utis.js";

/*
    Realiza a chamada para os scrappers e
    em caso de sucesso, salva os novos dados no banco
*/
export function chamadaScrapper() {

    console.info('--- Realizando chamada do scrapper ---');

    try {

        emergencias().then(emergencias => {
            console.info('--- Scrapping de Emergencias realizado! ---');
            createEmergenciaSchemas(emergencias);
        }).catch(err => {
            throw new Error(err);
        });

        utis().then(utis => {
            console.info('--- Scrapping de UTIs realizado! ---');
            createUtisSchemas(utis);
        }).catch(err => {
            throw new Error(err);
        });

    } catch (error) {
        console.error(error);
        setTimeout(() => chamadaScrapper(), 60000);
    }
}


/*
    Preapara os dados de Emergencias para serem salvos,
    deleta os dados atuais e só então salva os novos
*/
export function createEmergenciaSchemas(emergencias) {

    let schema = [];

    emergencias.forEach(emergencia => {
        schema.push(new ModelEmergenciasSchema(emergencia));
    });

    ModelEmergenciasSchema.deleteMany({})
        .then(() => ModelEmergenciasSchema.bulkSave(schema));
}

/*
    Preapara os dados de UTIs para serem salvos,
    deleta os dados atuais e só então salva os novos
*/
export function createUtisSchemas(utis) {

    let schema = [];

    utis.forEach(uti => {
        schema.push(new ModelUtisSchema(uti));
    });

    ModelUtisSchema.deleteMany({})
        .then(() => ModelUtisSchema.bulkSave(schema));
}

