import KuesionerTitle from "../models/kuesionerTitleModels.js";
import KuesionerPertanyaan from "../models/kuesionerPertanyaanModels.js";
import KuesionerOptions from "../models/kuesionerOptionsModels.js";
import DataMahasiswaUp from "../models/mahasiswaUPModels.js"
import md5 from "md5"
import nodemailer from "nodemailer"
// var md5 = require('md5');
import session from "express-session"
import express from "express"
import Jawaban from "../models/jawabanModels.js";
import Mahasiswa from "../models/mahasiswaModels.js";
import Penyebaran from "../models/penyebaranModel.js"

const app = express();
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

export const addKuesionerTitle = async (req, res) => {
    try {
        // if(session._id != undefined){
            // req.body.id_mahasiswa = parseInt(session._id)
            await KuesionerTitle.create(req.body)
            .then(
                result => 
                session.id_kuesioner = result.id
                );
                res.json({
                    "message": 
                    session.id_kuesioner
                })

        // }else{
        //     res.json({
        //         "message": "Anda Belum Login"
        //     });
        // }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const addKuesionerPertanyaan = async (req, res) => {
    try {
            await KuesionerPertanyaan.create(req.body)
            .then(
                result => 
                    res.json({
                        "message": result
                    })
                );
                
    } catch (error) {
        res.json({ message: error.message });
    }  
}
// getJawaban
export const getJawaban = async (req, res) => {
    try {
        // if(session._id != undefined){
            const pertanyaan = await KuesionerPertanyaan.findAll({
                where: {
                    id_kuesioner: req.params.id
                }
            });
            const jawaban1 = await Jawaban.findAll({
                where: {
                    id_kuesioner: req.params.id
                }
            })
            const jawaban = jawaban1.sort(function IHaveAName(a, b) { // non-anonymous as you ordered...
                return b.id_pernyebaran < a.id_pernyebaran ?  1 // if b should come earlier, push a to end
                     : b.id_pernyebaran > a.id_pernyebaran ? -1 // if b should come later, push a to begin
                     : 0;                   // a and b are equal
            });
            const mahasiswa = await Mahasiswa.findAll();
            
            let data  = []
            let dataJawaban = {}
            var idPenyebaran = jawaban[0].id_penyebaran
            var sum = 0
            for(let a = 0 ; a < jawaban.length; a++){
                

                if(jawaban[a].id_penyebaran != idPenyebaran){
                    data.push(dataJawaban)
                    idPenyebaran = jawaban[a].id_penyebaran
                    dataJawaban={}
                }

                var index = pertanyaan.findIndex(obj => obj.id==jawaban[a].id_pertanyaan);
                var indexMahasiswa = mahasiswa.findIndex(obj => obj.id==jawaban[0].id_mahasiswa);
                dataJawaban["nim"]=mahasiswa[indexMahasiswa].nim
                dataJawaban["name"]=mahasiswa[indexMahasiswa].name
                dataJawaban[pertanyaan[index].pertanyaan]=jawaban[a].jawaban
                
                
            }data.push(dataJawaban)
            res.json({
                "message":data
            });



            // res.json({
            //     "message":data
            // });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const getPertanyaanById = async (req, res) => {
    try {
        // if(session._id != undefined){
            const regis_mahasiswa = await KuesionerPertanyaan.findAll({
                where: {
                    id_kuesioner: req.params.id
                }
            });
            res.json({
                "message":regis_mahasiswa
            });
        // }else{
        //     res.json({
        //         "message": "Anda Belum Login"
        //     });
        // }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const getKuesionerByid_mahasiswa = async (req, res) => {
    try {
        // if(session._id != undefined){
            const regis_mahasiswa = await KuesionerTitle.findAll({
                where: {
                    id_mahasiswa: req.params.id
                }
            });

            res.json({
                "message":regis_mahasiswa
            });

            
        // }else{
        //     res.json({
        //         "message": "Anda Belum Login"
        //     });
        // }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const addOptions = async (req,res)=>{
    try{
        await KuesionerOptions.create(req.body)
            .then(
                result => 
                    res.json({
                        "message": result
                    })
                );
                
    }catch(error) {
        res.json({ message: error.message });
    }  
}
export const updateOptions = async (req, res) => {
    try {
        await KuesionerOptions.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Updated berhasil"
        });
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const getAllOptions = async (req, res) => {
    try {
        // if(session._id != undefined){
            const regis_mahasiswa = await KuesionerOptions.findAll();
            res.json({
                "message":regis_mahasiswa
            });
            
           
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const getOptionsById = async (req, res) => {
    try {
        // if(session._id != undefined){
            const regis_mahasiswa = await KuesionerOptions.findAll({
                where: {
                    id_pertanyaan : req.params.id
                }
            });
            res.json({
                "message":regis_mahasiswa
            });
            
           
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const getOptionsById1 = async (req, res) => {
    try {
        // if(session._id != undefined){
            const regis_mahasiswa = await KuesionerOptions.findAll();
            res.json({
                "message":regis_mahasiswa
            });
            
           
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const deleteOptionsById = async (req, res) => {
    try {
            await KuesionerOptions.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.json({
                "message":"delete berhasil"
            });
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const deleteOptionsById_pertanyaan = async (req, res) => {
    try {
            await KuesionerOptions.destroy({
                where: {
                    id_pertanyaan: req.params.id
                }
            });
            res.json({
                "message":"delete berhasil"
            });
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const deletePertanyaanBySection = async (req, res) => {
    try {
        
            await KuesionerPertanyaan.destroy({
                where: {
                    id_kuesioner: req.params.id_kuesioner,
                    section:req.params.section
                }
            })
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const deletePertanyaanById = async (req, res) => {
    try {
        // if(session._id != undefined){
            await KuesionerPertanyaan.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.json({
                "message":"delete berhasil"
            });
        // }else{
        //     res.json({
        //         "message": "Anda Belum Login"
        //     });
        // }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const getTitleByArr = async (req, res) => {
    try {
        // if(session._id != undefined){
            const regis_mahasiswa = await KuesionerTitle.findAll({
                where:  req.body
                
            });
            res.json({
                "message":regis_mahasiswa
            });
        // }else{
        //     res.json({
        //         "message": "Anda Belum Login"
        //     });
        // }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const getTitleById = async (req, res) => {
    try {
        // if(session._id != undefined){
            const regis_mahasiswa = await KuesionerTitle.findAll({
                where: {
                    id: req.params.id
                }
            });
            
            res.json({
                "message":regis_mahasiswa
            });
        // }else{
        //     res.json({
        //         "message": "Anda Belum Login"
        //     });
        // }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const updateKuesionerQuestion = async (req, res) => {
    try {
        // if(session._id != undefined){
            await KuesionerTitle.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            res.json({
                "message": req.body
            });
        // }else{
        //     res.json({
        //         "message": "Anda Belum Login"
        //     });
        // }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const updateKuesionerPertanyaan = async (req, res) => {
    try {
        // if(session._id != undefined){
            await KuesionerPertanyaan.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            res.json({
                "message": "Updated berhasil"
            });
        // }else{
        //     res.json({
        //         "message": "Anda Belum Login"
        //     });
        // }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}