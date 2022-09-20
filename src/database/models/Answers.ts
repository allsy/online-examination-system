import { DataTypes } from 'sequelize'
import sequelize from "../connection"
import Exams from './Exams';
import Questions from './Questions';
import Users from './Users';

const Answers = sequelize.define('answers',{
    ans_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    q_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'questions',key:'q_id'}
    },
    u_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'users',key:'u_id'}
    },
    e_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'exams',key:'e_id'}
    },
    option:{
        type: DataTypes.CHAR(1),
        allowNull: false
    }
},{
    timestamps:false
});

Exams.hasMany(Answers,{foreignKey:'e_id'});
Questions.hasMany(Answers,{foreignKey:'q_id'});
Users.hasMany(Answers,{foreignKey:'u_id'});

export default Answers