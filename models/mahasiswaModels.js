import { Sequelize } from "sequelize";
import db from "../config/database.js";
 
const { DataTypes } = Sequelize;
 
const Mahasiswa = db.define('mahasiswa',{
    name:{
        type: DataTypes.STRING
    },
    nim:{
        type: DataTypes.STRING
    },
    gender:{
        type: DataTypes.STRING
    },
    studi:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    angkatan:{
        type: DataTypes.STRING
    },
    kelahiran:{
        type: DataTypes.STRING
    },
    provinsi:{
        type: DataTypes.STRING
    },
},{
    freezeTableName: true
});
 
export default Mahasiswa;