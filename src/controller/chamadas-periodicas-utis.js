import puppeteer from 'puppeteer';
import {
    referenciaElementosHtmlUTIs,
    referenciaEspecializacoesUTIs
} from '../config/referencia-elementos-doc-utis.js';

export const utis = async() => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox'],
    });
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
    
    return hospitaisPagina;
};