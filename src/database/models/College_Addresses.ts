import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from "../connection"
import Colleges from './Colleges';

const College_Addresses = sequelize.define('college_addresses',{
    ca_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    state:{
        type : DataTypes.STRING,
        allowNull: true
    },
    city:{
        type : DataTypes.STRING,
        allowNull : true
    },
    pin:{
        type : DataTypes.CHAR(6),
        allowNull : true
    },
    landmark:{
        type : DataTypes.STRING,
        allowNull : true
    },
    c_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model:'colleges',key:'c_id'}
    }
},{
    timestamps:false
});

Colleges.hasOne(College_Addresses,{foreignKey:'c_id'});

export default College_Addresses