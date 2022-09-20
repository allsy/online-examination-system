
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from "../connection"
import Exams from './Exams';

const Users = sequelize.define('users',{
    u_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    uuid:{
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue:Math.random()
    },
    name:{
        type : DataTypes.STRING,
        allowNull : false
    },
    email:{
        type : DataTypes.STRING,
        allowNull : false
    },
    password:{
        type : DataTypes.STRING,
        allowNull : false
    },
    type:{
        type:DataTypes.CHAR(1),
        allowNull: false
    },
    e_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'exams',key:'e_id'}
    },
},
{
timestamps:true
});

Exams.hasMany(Users,{foreignKey:'e_id'});

export default Users