// check documentation https://www.npmjs.com/package/mysql

const mysql = require('mysql');
const config = require("config.json");

var mysqlConnection = mysql.createConnection(config.mysql_config);

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


module.exports = mysqlConnection;