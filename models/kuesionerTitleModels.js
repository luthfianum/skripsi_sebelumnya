import { Sequelize } from "sequelize";
import db from "../config/database.js";
 
const { DataTypes } = Sequelize;
 
const KuesionerTitle = db.define('kuesioner',{
    id_mahasiswa:{
        type: DataTypes.INTEGER
    },
    title:{
        type: DataTypes.STRING
    },
    deskripsi:{
        type: DataTypes.STRING
    },
    metode:{
        type: DataTypes.STRING
    },
    responden:{
        type: DataTypes.INTEGER
    },
    hadiah:{
        type: DataTypes.STRING
    },
    expired:{
        type: DataTypes.STRING
    },
    penyebaran:{
        type: DataTypes.INTEGER
    }

},{
    freezeTableName: true
});
 
export default KuesionerTitle;