import { DataTypes } from 'sequelize'
import sequelize from "../connection"
import Colleges from './Colleges';

const Exams = sequelize.define('exams',{
    e_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    uniqid:{
        type : DataTypes.STRING,
        allowNull:false
    },
    name:{
        type : DataTypes.STRING,
        allowNull: false
    },
    image:{
        type : DataTypes.STRING,
        allowNull : false
    },
    starting:{
        type : DataTypes.DATE,
        allowNull : false
    },
    duration:{
        type : DataTypes.CHAR(3),
        allowNull : false
    },
    regstart:{
        type : DataTypes.DATE,
        allowNull : false
    },
    regend:{
        type : DataTypes.DATE,
        allowNull : false
    },
    c_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'colleges',key:'c_id'}
    }
},
{
timestamps:true
});

Colleges.hasMany(Exams,{foreignKey:'c_id'});

export default Exams