import { Sequelize } from "sequelize";
import db from "../config/database.js";
 
const { DataTypes } = Sequelize;
 
const Jawaban = db.define('jawaban',{
    id_kuesioner:{
        type: DataTypes.INTEGER
    },
    id_pertanyaan:{
        type: DataTypes.INTEGER
    },
    id_mahasiswa:{
        type: DataTypes.INTEGER
    },
    jawaban:{
        type: DataTypes.STRING
    },id_penyebaran:{
        type: DataTypes.INTEGER
    }

},{
    freezeTableName: true
});
 
export default Jawaban;