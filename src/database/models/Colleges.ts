import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from "../connection"
import College_Users from './College_Users';

const Colleges = sequelize.define('colleges',{
    c_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    uniqid:{
        type : DataTypes.STRING,
        allowNull: true
    },
    name:{
        type : DataTypes.STRING,
        allowNull : true
    },
    image:{
        type : DataTypes.STRING,
        allowNull : true
    },
    cu_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'college_users',key:'cu_id'}
    }
},{
    timestamps:false
});

College_Users.hasOne(Colleges,{foreignKey:'cu_id'});

export default Colleges