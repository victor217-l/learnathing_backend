const express = require('express');
var mysql = require('mysql')
require('dotenv').config()

var pool = mysql.createPool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
})

pool.getConnection((err,conn) => {
    if(err)  console.log(err)
        console.log("connected  successful")
    
})

module.exports = pool;