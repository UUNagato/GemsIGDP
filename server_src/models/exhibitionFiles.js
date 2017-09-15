'use strict'
module.exports = (sequelize, DataTypes) => {
    var theEWindow =  sequelize.define('exhibitionFile',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        window_id : {
            type : DataTypes.INTEGER
        },
        file_id : {
            type : DataTypes.INTEGER
        }
    },{
        timestamps: false,
        tableName: 'exhibition_files'
    });
    
    return theEWindow;
};