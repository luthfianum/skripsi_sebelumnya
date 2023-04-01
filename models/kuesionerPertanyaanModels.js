import { Sequelize } from "sequelize";
import db from "../config/database.js";
 
const { DataTypes } = Sequelize;
 
const KuesionerPertanyaan = db.define('pertanyaan',{
    id_kuesioner:{
        type: DataTypes.INTEGER
    },
    pertanyaan:{
        type: DataTypes.STRING
    },
    type:{
        type: DataTypes.STRING
    },
    section:{
        type: DataTypes.STRING
    },    
    master:{
        type: DataTypes.BOOLEAN
    }
    
},{
    freezeTableName: true
});
 
export default KuesionerPertanyaan;