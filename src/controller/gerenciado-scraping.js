import { ModelEmergenciasSchema, ModelUtisSchema } from '../model/post.js';
import { emergencias } from "./chamadas-periodicas-emergencias.js";
import { utis } from "./chamadas-periodicas-utis.js";

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

export function createEmergenciaSchemas(emergencias) {

    let schema = [];

    emergencias.forEach(emergencia => {
        schema.push(new ModelEmergenciasSchema(emergencia));
    });

    ModelEmergenciasSchema.deleteMany({})
        .then(() => ModelEmergenciasSchema.bulkSave(schema));
}

export function createUtisSchemas(utis) {

    let schema = [];

    utis.forEach(uti => {
        schema.push(new ModelUtisSchema(uti));
    });

    ModelUtisSchema.deleteMany({})
        .then(() => ModelUtisSchema.bulkSave(schema));
}