import { Sequelize } from "sequelize";
import db from "../config/database.js";
 
const { DataTypes } = Sequelize;
 
const Section = db.define('section',{
    id_kuesioner:{
        type: DataTypes.INTEGER
    },
    id_pertanyaan:{
        type: DataTypes.INTEGER
    },
    id_option:{
        type: DataTypes.INTEGER
    },
    section:{
        type: DataTypes.INTEGER
    },
    
},{
    freezeTableName: true
});
 
export default Section;