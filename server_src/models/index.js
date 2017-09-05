/*
    Basic Database Framework.
    You should define every models in this folder
    And this file will auto import it as long as you defined a correct model.
 */
'use strict'
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var dbconfig = require("../configs/config.js");

console.log('Module - Models is loading');

// instantiate sequelize
var sequelize = new Sequelize(dbconfig.database, dbconfig.username, dbconfig.password, {
    host: dbconfig.host,
    dialect: 'mysql',
});

// find all models and imports them
var db = {};
var files = fs.readdirSync(__dirname);
var js_files = files.filter((f) => {
    return (f.endsWith('.js') && f != 'index.js');
});

for(var f of js_files) {
    console.log('Model file' + f + ' has been found.');
    var model = sequelize.import(path.join(__dirname, f));
    console.log('Model ' + model.name + ' has been added.');
    db[model.name] = model;
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

