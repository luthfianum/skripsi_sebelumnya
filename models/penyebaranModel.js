import { Sequelize } from "sequelize";
import db from "../config/database.js";
 
const { DataTypes } = Sequelize;
 
const Penyebaran = db.define('penyebaran',{
    id_mahasiswa:{
        type: DataTypes.INTEGER
    },
    id_kuesioner:{
        type: DataTypes.INTEGER
    },penyebaran:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName: true
});
 
export default Penyebaran;