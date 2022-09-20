import { DataTypes } from 'sequelize'
import sequelize from "../connection"

const College_Users = sequelize.define('college_users',{
    cu_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
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
    }
},
{
timestamps:true
});

export default College_Users