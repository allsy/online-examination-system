import { Dialect, Sequelize } from "sequelize";
import config from "../config/config";

const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password,{
        host:config.mysql.host,
        dialect:config.mysql.dialect as Dialect,
        logging:false

});


export default sequelize