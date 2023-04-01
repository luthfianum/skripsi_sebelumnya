import Jawaban from "../models/jawabanModels.js";

import nodemailer from "nodemailer"
// var md5 = require('md5');
import session from "express-session"
import express from "express"
const app = express();
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
export const addJawaban = async (req, res) => {
    try {
        await Jawaban.bulkCreate(req.body)
        .then(
            result =>{
                res.json({
                    "message": 
                    req.body
                })
            }
        );
        res.json({
            "message": 
            req.body
        })
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const totalJawaban = async(req,res)=>{
    try {
        const regis_mahasiswa = await Jawaban.findAll();
        // const unique = [...new Set(regis_mahasiswa.map(item => item.id_penyebaran))];
        res.json({
            "message": regis_mahasiswa
        })
    } catch (error) {
        res.json({ message: error.message });
    }
}
export const getJawabanByIdMahasiswa = async (req, res) => {
    try {
        const regis_mahasiswa = await Jawaban.findAll({
            where: {
                id_mahasiswa: req.params.id
            },
            attributes: ['id_kuesioner',"id_penyebaran"],
        });
        
        res.json({
            "message": 
            regis_mahasiswa
        })
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const getJawabanByKueseoner = async (req, res) => {
    try {
        const regis_mahasiswa = await Jawaban.findAll({
            where: {
                id_mahasiswa: req.params.id,
                id_kuesioner: req.body.id_kuesioner
            }
        });
        res.json({
            "message": 
            regis_mahasiswa.length
        })
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const getJawabanByIdPetanyaan = async (req, res) => {
    try {
        const regis_mahasiswa = await Jawaban.findAll({
            where: {
                id_pertanyaan: req.params.id
            }
        });
        res.json({
            "message": 
            regis_mahasiswa
        })
    } catch (error) {
        res.json({ message: error.message });
    }  
}
// getJawabanByKueseoner