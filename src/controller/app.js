import express from 'express';
import { ModelEmergenciasSchema, ModelUtisSchema } from '../model/post.js';

export const app = express();

export const porta = process.env.PORT || 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('port', porta);

app.get('/emergencias', (req,res, next) => {
    ModelEmergenciasSchema.find()
        .then(documents => {
            res.status(200).json({
                emergencias: documents,
            });
        })
        .catch();
});
app.get('/utis', (req,res, next) => {
    ModelUtisSchema.find()
        .then(documents => {
            res.status(200).json({
                utis: documents,
            });
        })
        .catch();
});