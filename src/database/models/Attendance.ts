import { DataTypes } from 'sequelize'
import sequelize from "../connection"
import Exams from './Exams';
import Users from './Users';

const Attendance = sequelize.define('attendance',{
    a_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    u_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'users',key:'u_id'}
    },
    e_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'exams',key:'e_id'}
    },
    startedAt:{
        type: DataTypes.DATE,
        allowNull : false,
        defaultValue:new Date(Date.now())
    },
    endedAt:{
        type: DataTypes.DATE,
        allowNull : true
    }
},{
    timestamps:false
});

Exams.hasMany(Attendance,{foreignKey:'e_id'});
Users.hasMany(Attendance,{foreignKey:'u_id'});

export default Attendance