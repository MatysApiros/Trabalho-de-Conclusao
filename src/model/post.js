import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchemaEmergencias = new Schema({
    nomeHospital: { type: String },
    dataAtualizacao: { type:String },
    leitos: { type:String },
    numeroPacientes: { type:String },
    percentualLotacao: { type:String },
    label: { type:String },
    especializacao: { type:String },
});

const postSchemaUtis = new Schema({
    nomeHospital: { type:String },
    dataAtualizacao: { type:String },
    leitos: { type:String },
    numeroPacientes: { type:String },
    percentualLotacao: { type:String },
    especializacao: { type:String },
});

export const ModelEmergenciasSchema = mongoose.model('Emergencias', postSchemaEmergencias);
export const ModelUtisSchema = mongoose.model('Utis', postSchemaUtis);
