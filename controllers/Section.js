import Section from "../models/sectionModels.js"
import KuesionerPertanyaan from "../models/kuesionerPertanyaanModels.js";
import Mahasiswa from "../models/mahasiswaModels.js";
import { response } from "express";

export const addSection = async (req,res)=>{
    try{
        await Section.create(req.body).then(
            result=>{
                res.json({message:result})
            }
        );
                
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}
export const getPertanyaanToBeSection = async (req,res)=>{
    try{
        const data=[]
        const data1=[]
        await KuesionerPertanyaan.findAll({
            where: {
                id_kuesioner : req.params.id
            }
        }).then(
            result=>{
                const section = result[0].section
                for(let a = 0 ; a < result.length;a++){
                    if(section != result[a].section){
                        data.push(data1)
                    }
                    data1.push(result[a])
                }
                if(data.length ==0 ){
                    data.push(result)
                }
                    res.json({ message: data });
                
            }
        )
                
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}
export const findSectionByIdPertanyaan = async (req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_kuesioner : req.params.id
            }
        }).then(
            result=>{
                    res.json({ message: result });
                
            }
        )
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}
// findIdKuesioner
export const findIdKuesioner = async (req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_kuesioner : req.params.id,
            }
        }).then(
            result=>{
                res.json({ message: result });
            }
        )
        
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}
export const findIdPertanyaan = async (req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_pertanyaan : req.params.id,
            }
        }).then(
            result=>{
                res.json({ message: result });
            }
        )
        
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}
export const deleteSectionByPertanyaan = async(req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_pertanyaan : req.params.id,
            }
        }).then(
            result=>{
                for(let a = 0; a < result.length;a++){
                    KuesionerPertanyaan.destroy({
                        where: {
                            id_kuesioner:result[a].id_kuesioner,
                            section:result[a].section,
                        }
                    })
                }
                 
                Section.destroy({
                    where: {
                        id_pertanyaan: req.params.id
                    }
                    
                });
                
            }
        )
        res.json({
            "message":"delete berhasil"
        });
    
    }catch(error){
        res.json({message:error.message})
    }
}
export const deleteSection = async(req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_option : req.params.id,
            }
        }).then(
            result=>{
                 KuesionerPertanyaan.destroy({
                    where: {
                        section:result[0].section,
                        id_kuesioner:result[0].id_kuesioner
                    }
                })
                Section.destroy({
                    where: {
                        id_option: req.params.id
                    }
                    
                });
                
            }
        )
        res.json({
            "message":"delete berhasil"
        });
    
    }catch(error){
        res.json({message:error.message})
    }
}

export const findSectionPertanyaan = async (req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_pertanyaan : req.params.id_pertanyaan,
                id_option : req.params.id_option
            }
        }).then(
            result=>{
                res.json({ message: result });
            }
        )
        
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}
export const findSectionOption = async (req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_option : req.params.id_option
            }
        }).then(
            result=>{
                res.json({ message: result });
            }
        )
        
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}

export const findSection = async (req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_pertanyaan : req.params.id_pertanyaan,
                id_option : req.params.id_option
            }
        }).then(
            result=>{
                if(result.length == 0){
                    res.json({ message: false });
                }else{
                    res.json({ message: true });
                }
            }
        )
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}
export const updateSection = async (req,res)=>{
    try{
        var id ;
        await Section.findAll({
            where: {
                id_pertanyaan : req.params.id_pertanyaan,
                id_option : req.params.id_option
            }
        }).then(
            result=>{
                 id = result[0].id 
            }
        )
        
        await Section.update(req.body, {
            where: {
                id : id 
            }
        });
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}

export const findSectionByKuesioner = async (req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_kuesioner : req.params.id
            }
        }).then(
            result=>{
                    res.json({ message: result });
                
            }
        )
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}
export const findSectionByJawaban = async (req,res)=>{
    try{
        await Section.findAll({
            where: {
                id_option : req.params.id
            }
        }).then(
            result=>{
                    res.json({ message: result });
                
            }
        )
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}


export const getPertanyaanBysection = async (req,res)=>{
    try{
        await KuesionerPertanyaan.findAll({
            where: {
                Section : req.params.id,
                id_kuesioner:req.params.idK
            }
        }).then(
            result=>{
                    res.json({ message: result });
                
            }
        )
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}

export const findPertanyaanBySection = async (req,res)=>{
    try{
        await KuesionerPertanyaan.findAll({
            where: {
                section : req.params.id,
                id_kuesioner : req.params.id_kuesioner
            }
        }).then(
            result=>{
                res.json({ message: result });
            }
        )
        
        
           
        //})
    }catch (error) {
        res.json({ message: error.message });
    }
}

export const addMahasiswa = async (req,res)=>{
    try{
        let data = []
        for(let a = 0; a < 90 ; a+=3){
            data.push(
                {
                    name:"1android"+(a+3),
                    nim: "52301230"+(a+3),
                    gender:"P",
                    studi: "teknik mesin",
                    password:"202cb962ac59075b964b07152d234b70",
                    angkatan:"2018",
                    provinsi:"",
                    kelahiran:"2000"

                }
            )
            data.push(
                {
                    name:"1android"+(a+1),
                    nim: "52301230"+(a+1),
                    gender:"W",
                    studi: "teknik mesin",
                    password:"202cb962ac59075b964b07152d234b70",
                    angkatan:"2018",
                    provinsi:"",
                    kelahiran:"2000"

                }
            )
            data.push(
                {
                    name:"1android"+(a+2),
                    nim: "52301230"+(a+2),
                    gender:"P",
                    studi: "teknik mesin",
                    password:"202cb962ac59075b964b07152d234b70",
                    angkatan:"2018",
                    provinsi:"",
                    kelahiran:"2000"

                }
            )
            data.push(
                {
                    name:"1android"+(a+3),
                    nim: "52301231"+(a+3),
                    gender:"W",
                    studi: "teknik mesin",
                    password:"202cb962ac59075b964b07152d234b70",
                    angkatan:"2019",
                    provinsi:"",
                    kelahiran:"2001"

                }
            )
            data.push(
                {
                    name:"1android"+(a+1),
                    nim: "52301231"+(a+1),
                    gender:"P",
                    studi: "teknik mesin",
                    password:"202cb962ac59075b964b07152d234b70",
                    angkatan:"2019",
                    provinsi:"",
                    kelahiran:"2001"

                }
            )
            data.push(
                {
                    name:"1android"+(a+2),
                    nim: "52301231"+(a+2),
                    gender:"W",
                    studi: "teknik mesin",
                    password:"202cb962ac59075b964b07152d234b70",
                    angkatan:"2019",
                    provinsi:"",
                    kelahiran:"2001"

                }
            )
            data.push(
                {
                    name:"1android"+(a+3),
                    nim: "52301232"+(a+3),
                    gender:"P",
                    studi: "teknik mesin",
                    password:"202cb962ac59075b964b07152d234b70",
                    angkatan:"2020",
                    provinsi:"",
                    kelahiran:"2002"

                }
            )
            data.push(
                {
                    name:"1android"+(a+1),
                    nim: "52301232"+(a+1),
                    gender:"W",
                    studi: "teknik mesin",
                    password:"202cb962ac59075b964b07152d234b70",
                    angkatan:"2020",
                    provinsi:"",
                    kelahiran:"2002"

                }
            )
            data.push(
                {
                    name:"1android"+(a+2),
                    nim: "52301232"+(a+2),
                    gender:"P",
                    studi: "teknik mesin",
                    password:"202cb962ac59075b964b07152d234b70",
                    angkatan:"2020",
                    provinsi:"",
                    kelahiran:"2002"

                }
            )
        }
        await Mahasiswa.bulkCreate(data);
        
        res.json({ message: data });
        // await Mahasiswa.create(req.body);
                
    }catch (error) {
        res.json({ message: error.message });
    }
}
