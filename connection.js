const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "users",
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if(err) {
        console.log(err);
    }else{
        console.log('Connected');
    }
});

module.exports = mysqlConnection;