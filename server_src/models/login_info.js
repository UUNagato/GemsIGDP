/*
    Login_Info Table Models

    Created By UUNagato at 2017/9/6
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
    var Login_info = sequelize.define('login', {
        id : {type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
        user_id : DataTypes.INTEGER,
        user_name : DataTypes.CHAR(16),
        email:{type:DataTypes.STRING,validata:{isEmail:true}},
        password : DataTypes.CHAR(32)
    }, {
        timestamps: false,
        tableName: 'login_info'
    });
    
    return Login_info;
};