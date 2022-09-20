import { DataTypes } from 'sequelize'
import sequelize from "../connection"
import Exams from './Exams';

const Questions = sequelize.define('questions',{
    q_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    question:{
        type : DataTypes.STRING(3000),
        allowNull: false
    },
    a:{
        type : DataTypes.STRING,
        allowNull : false
    },
    b:{
        type : DataTypes.STRING,
        allowNull : false
    },
    c:{
        type : DataTypes.STRING,
        allowNull : false
    },
    d:{
        type : DataTypes.STRING,
        allowNull : false
    },
    answer:{
        type : DataTypes.CHAR(2),
        allowNull : false
    },
    marks:{
        type : DataTypes.STRING(5),
        allowNull : false
    },
    e_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'exams',key:'e_id'}
    }
},
{
timestamps:false
});


Exams.hasMany(Questions,{foreignKey:"e_id"});



export default Questions