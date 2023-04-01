import { Sequelize } from "sequelize";
import db from "../config/database.js";
 
const { DataTypes } = Sequelize;
 
const DataMahasiswaUp = db.define('mahasiswa_up',{
    nim:{
        type: DataTypes.STRING
    },
    nama:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
});
 
export default DataMahasiswaUp;