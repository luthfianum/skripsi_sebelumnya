import Mahasiswa from "../models/mahasiswaModels.js";

import DataMahasiswaUp from "../models/mahasiswaUPModels.js"
import md5 from "md5"
import nodemailer from "nodemailer"
// var md5 = require('md5');
import session from "express-session"
import express from "express"
const app = express();
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mirzrakha2804@gmail.com',
      pass: ''
    }
  });


export const UpdateMahasiswaById = async(req,res)=>{
    await Mahasiswa.update(req.body, {
        where: {
            id : req.params.id 
        }
    }).then(
        result=>{ 
            res.json({ message: result});
        }
    );   
}
export const addMahasiswaUP = async (req, res) => {
    try {
        for(var a=1; a < 421; a++){
            if(a % 2 != 0 ){
                await Mahasiswa.update({ gender : 'P' },{ where : { id : a }}); 
            }else{
                await Mahasiswa.update({ gender : 'W' },{ where : { id : a }}); 

            }
        }
        res.json({
            "message": req.body
        })
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const addMahasiswa = async (req, res) => {
    try {
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const register = async (req, res) => {
    try {
        await Mahasiswa.bulkCreate(req.body);
        // res.json({
        //     "message": req.body
        // });
        const mahasiswa_up = await DataMahasiswaUp.findAll({
            where: {
                nim: req.body.nim
            }
        });
        const regis_mahasiswa = await Mahasiswa.findAll({
            where: {
                nim: req.body.nim
            }
        });
        if(mahasiswa_up.length != 0 ){
            if(regis_mahasiswa.length == 0 ){
                req.body.password = md5(req.body.password)
                await Mahasiswa.create(req.body);
                var mailOptions = {
                    from: 'mirzarakha2804@gmail.com',
                    to: 'mirzarakhadwipradana28@gmail.com',
                    subject: 'Sending Email using Node.js',
                    text: 'That was easy!'
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                        res.json({
                        "message": "register gagal"
                    });
                    } else {
                    //   console.log('Email sent: ' + info.response);
                    res.json({
                        "message": "register berhasil"
                    });
                    }
                    });
            }else{
                res.json({
                    "message": "mahasiswa sudah mendaftar"
                });
            }
        }else{
            res.json({
                "message": "nim tidak tersedia"
            });
        }
        
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const getAllDataMahasiswaLength = async (req, res) => {
    try {
        
        const mahasiswa_up = await Mahasiswa.findAll();
        res.json({
            "id": mahasiswa_up.length
        });
        
        
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const allMahasiswa = async (req, res) => {
    try {
        
        const mahasiswa_up = await Mahasiswa.findAll();
        res.json({
            message: mahasiswa_up
        });
        
        
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const getMahasiswaLength = async (req, res) => {
    try {
        const mahasiswa_up = await Mahasiswa.findAll({
            where: req.body
        });
        res.json({
            "id": mahasiswa_up.length
        });
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const login = async (req, res) => {
    try {
        const regis_mahasiswa = await Mahasiswa.findAll({
            where: {
                nim: req.body.nim
            }
        });
        if(regis_mahasiswa.length != 0 ){
            if(regis_mahasiswa[0].password == md5(req.body.password)){
                // session._id = regis_mahasiswa[0].id
                res.json({
                    "message": regis_mahasiswa[0].id
                });
            }else{
                res.json({
                    "message": "password salah"
                });
            }
        }else{
            res.json({
                "message": "nim tidak tersedia"
            });
        }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const logout = async (req, res) => {
    try {
        // if(session._id == undefined){
            res.json({
                "message": "logout berhasil"
            }); 
        // }else{
        //     res.json({
        //         "message": "logout gagal"
        //     });
        // }     
    } catch (error) {
        res.json({ message: error.message });
    }  
}
export const sessionLogin = async (req, res) => {
    try {
        // delete session._id 
        
        res.json({
            "message": session._id
        }); 

    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const getMahasiswaById = async (req, res) => {
    try {
        // delete session._id
        const mahasiswa = await Mahasiswa.findAll({
            where: {
                id: req.params.id
            }
        }); 
        res.json({
            "message": mahasiswa
        }); 

    } catch (error) {
        res.json({ message: error.message });
    }  
}