import express from 'express';

export const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Methods", "GET");
    next();
});