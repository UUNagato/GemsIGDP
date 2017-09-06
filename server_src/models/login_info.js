/*
    Login_Info Table Models

    Created By UUNagato at 2017/9/6
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
    var Login_info = sequelize.define('login', {
        id : {type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
        user_id : DataTypes.INTEGER,
        user_name : DataTypes.STRING(16),
        password : DataTypes.CHAR(32)
    }, {
        timestamps: false,
        tableName: 'login_info'
    });

    Login_info.associate = function(models) {
        Login_info.belongsTo(models.user, {as:'user',foreignKey:'user_id'});
    };

    return Login_info;
};