import dotenv from "dotenv";

dotenv.config();

// MySQL DETAILS
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE = process.env.MYSQL_HOST || 'logica';
const DIALECT = process.env.DB_DRIVER || 'mysql';

// const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
// const MYSQL_USER = process.env.MYSQL_USER || 'allkodsi_logica';
// const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'doctor@1989';
// const MYSQL_DATABASE = process.env.MYSQL_HOST || 'allkodsi_logica';
// const DIALECT = process.env.DB_DRIVER || 'mysql';

const MYSQL = {
    host : MYSQL_HOST,
    user : MYSQL_USER,
    password : MYSQL_PASSWORD,
    database : MYSQL_DATABASE,
    dialect : DIALECT
}


// SERVER DETAILS
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost'
const SERVER_PORT = process.env.SERVER_PORT || 8000

const SERVER = {
    hostname : SERVER_HOSTNAME,
    port : SERVER_PORT
}

const config = {
    mysql : MYSQL,
    server : SERVER
}

export default config