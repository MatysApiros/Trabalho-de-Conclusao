import puppeteer from 'puppeteer';
import {
    referenciaElementosHTMLEmergencias,
    referenciaEspecializacoesEmergencias
} from '../config/referencia-elementos-doc-emergencias.js';
import {
    referenciaElementosHtmlUTIs,
    referenciaEspecializacoesUTIs
} from '../config/referencia-elementos-doc-utis.js';

export const emergencias = async(request, response) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://docs.google.com/spreadsheets/d/1-Zea1tEJd-rJJp77Veptkrone0_hddVKgy-pW58E5iM/pubhtml');

    let hospitaisPagina = [];
    
    await page.exposeFunction('referenciaHTML', () => referenciaElementosHTMLEmergencias);
    await page.exposeFunction('referenciaEspecializacoesEmergencias', () => referenciaEspecializacoesEmergencias);

    hospitaisPagina = await page.evaluate((async() => {

        const referencias = await referenciaHTML();
        const especializacoes = await referenciaEspecializacoesEmergencias();
        const hospitais = [];

        let label;
        let especializacao;

        for (ref of referencias) {

            if (especializacoes.includes(ref)) {
                especializacao = ref;
                continue;
            }

            let current = document.getElementById(ref);

            let nextSibling = current.nextSibling;
            let obj = [];

            while (nextSibling) {
                obj.push(nextSibling.innerHTML);
                nextSibling = nextSibling.nextElementSibling;
            }

            const pularELemento =  new DOMParser().parseFromString(obj[1], 'text/xml').firstChild.innerHTML;

            if (!pularELemento.includes('parsererror')) {
                
                if (obj[0]) {
                    label = obj[0];
                }

                hospitais.push({
                    nomeHospital: new DOMParser().parseFromString(obj[1], 'text/xml').firstChild.innerHTML,
                    dataAtualizacao: obj[2],
                    leitos: obj[3],
                    numeroPacientes: obj[4],
                    percentualLotacao: obj[10],
                    label,
                    especializacao,
                });
            } else {

                let nomeHospital;

                if (especializacao === 'PSIQUIATRICA' || especializacao === 'TRAUMA') {
                    nomeHospital = obj[0]
                } else {
                    nomeHospital = new DOMParser().parseFromString(obj[0], 'text/xml').firstChild.innerHTML;
                }

                hospitais.push({
                    nomeHospital,
                    dataAtualizacao: obj[1],
                    leitos: obj[2],
                    numeroPacientes: obj[3],
                    percentualLotacao: obj[9],
                    label,
                    especializacao,
                });
            }
            
        }
    
        return hospitais;
    }));
    
    await browser.close();
    
    response.send(hospitaisPagina);
};

export const utis = async(request, response) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://docs.google.com/spreadsheets/d/e/2PACX-1vTwlPdNvBfVAYGVXKzmWxWLpQLuPwf28zVY3PhqBw5qZ6D4sppyXj5IIslEOUfBBipAyqnGTUHX-IRV/pubhtml');

    let hospitaisPagina = [];
    
    await page.exposeFunction('referenciaHTML', () => referenciaElementosHtmlUTIs);
    await page.exposeFunction('referenciaEspecializacoesUTIs', () => referenciaEspecializacoesUTIs);

    hospitaisPagina = await page.evaluate((async() => {

        const referencias = await referenciaHTML();
        const especializacoes = await referenciaEspecializacoesUTIs();
        const hospitais = [];

        let especializacao;

        for (ref of referencias) {

            if (especializacoes.includes(ref)) {
                especializacao = ref;
                continue;
            }

            let current = document.getElementById(ref);

            let nextSibling = current.nextSibling;
            let obj = [];

            while (nextSibling) {
                obj.push(nextSibling.innerHTML);
                nextSibling = nextSibling.nextElementSibling;
            }

            hospitais.push({
                nomeHospital: obj[1],
                dataAtualizacao: obj[2],
                leitos: obj[3],
                numeroPacientes: obj[5],
                percentualLotacao: obj[14],
                especializacao,
            });
        }
    
        return hospitais;
    }));

    await browser.close();
    
    response.send(hospitaisPagina);
};