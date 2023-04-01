import Mahasiswa from "../models/mahasiswaModels.js";
import KuesionerTitle from "../models/kuesionerTitleModels.js";
import Penyebaran from "../models/penyebaranModel.js"
import nodemailer from "nodemailer"
// var md5 = require('md5');
import session from "express-session"
import express from "express"
const app = express();
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
export const updatePenyebaran = async(req,res)=>{
    try{
        await Penyebaran.update(req.body, {
            where: {
                id_kuesioner: req.params.id
            }
        });
        res.json({
            "message": "Updated berhasil"
        });
    
    }catch(error){
        res.json({message:error.message})
    }
}

export const findPenyebaranById = async (req,res)=>{
    try{
        const dataRes = []
        const data = await Penyebaran.findAll({
            where: {
                id_mahasiswa: req.params.id 
            },
            attributes: ['id', 'id_kuesioner',"penyebaran"], 
        })
          for(let a = 0 ; a < data.length; a++){
            const dataKuesioner = await KuesionerTitle.findAll({
                where: {
                    id: data[a].id_kuesioner
                }, 
            })
            dataRes.push(
                {
                    id_penyebaran: data[a].id,
                    penyebaran:data[a].penyebaran,
                    deskripsi: dataKuesioner[0].deskripsi,
                    hadiah: dataKuesioner[0].hadiah,
                    id: dataKuesioner[0].id,
                    id_mahasiswa: dataKuesioner[0].id_mahasiswa,
                    metode: dataKuesioner[0].metode,
                    responden: dataKuesioner[0].responden,
                    title: dataKuesioner[0].title,
                    expired: dataKuesioner[0].expired
                }
            )
             
          }
          
          res.json(dataRes);
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}
export const penyebaranSimple = async (req, res) => {
    try {
        let init = 0;
        // const data = {
            // gender:req.body.gender,
            // prodi :req.body,prodi,
            // angkatan : req.body.angkatan
        // }
        const data =  await Mahasiswa.findAll({
            where: req.body.data[0]
        });
        while(init < req.body.responden){
            let random = data[Math.floor(Math.random() * ((data.length - 1) - 0 + 1))].id
            // if(random != req.body.mahasiswa){
                
                await Penyebaran.create({
                    id_mahasiswa : random,
                    id_kuesioner: req.body.id_kuesioner, 
                })
                init++;
            // }
    
        }
        
        res.json({ message: "succes"});
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const penyebaranSystematic = async (req, res) => {
    try {
        const data =  await Mahasiswa.findAll({
            where: req.body.data[0]
        });
        let responden  = parseInt(data.length/req.body.responden)
        let init = 0
        let penyebaran = responden;

        while(init <= req.body.responden){
            if(penyebaran >= req.body.lengthRes){
                penyebaran = penyebaran - data.length
            }
            
            await Penyebaran.create({
                    id_mahasiswa : data[responden].id,
                    id_kuesioner: req.body.id_kuesioner, 
                })
            responden= responden + penyebaran;
            init++
        }
        res.json({ message: init });
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const penyebaranCluster = async (req, res) => {
    try {
        
        let init =0
        let initData = 0
        // let init3 = 0
        let initCluster = 0
        let data = []
        while(init < req.body.data.length ){
            let mahasiswa_up = await Mahasiswa.findAll({
                where: req.body.data[init]
            });
            if(mahasiswa_up.length!=0){
                data.push(mahasiswa_up)
                initData++
            }
            init++;
        }
        
        let randomCluster = parseInt(req.body.responden/data.length);
        init = 0
        let init2=0
        let init3=0
        let index,random
        let bool1=true,bool2= true
        while(init < req.body.responden){
            init2=0
            while(init2 < data.length && bool1){
                init3 = 0
                while(init3 < randomCluster&&bool2){
                    index =Math.floor(Math.random()*data[init2].length)
                    random = data[init2][index].id
                    if(random != req.body.mahasiswa){
                        await Penyebaran.create({
                            id_mahasiswa : random,
                            id_kuesioner: req.body.id_kuesioner, 
                        })
                        init3++
                        init++
                        
                        if(init >= req.body.responden){
                            bool1 = false
                            bool2 = false
                            res.json({ message: init});
                        }
                    }
                }
                init2++
            }
        }
        res.json({ message: data.length + "  "+ randomCluster});
    } catch (error) {
        res.json({ message: error.message });
    }
    
}