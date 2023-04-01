import { Sequelize } from "sequelize";
import db from "../config/database.js";
 
const { DataTypes } = Sequelize;
 
const KuesionerOptions = db.define('options',{
    id_pertanyaan:{
        type: DataTypes.INTEGER
    },
    option:{
        type: DataTypes.STRING
    },
},{
    freezeTableName: true
});
 
export default KuesionerOptions;