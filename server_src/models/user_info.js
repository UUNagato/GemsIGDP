/*
    User_Info Table Models

    Created By UUNagato at 2017/9/6
 */
module.exports = (sequelize, DataTypes) => {
    var User_info = sequelize.define('user', {
        id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        nickname:DataTypes.STRING(16),
        contact:{type:DataTypes.STRING,defaultValue:''},
        profile:{type:DataTypes.INTEGER,defaultValue:0},
        register_time:DataTypes.DATE,
        lastlogin_time:DataTypes.DATE,
        age:DataTypes.INTEGER,
        sex:DataTypes.ENUM('male','female'),
        github:{type:DataTypes.STRING,allowNull:true,defaultValue:null},
        personal_web:{type:DataTypes.STRING,allowNull:true,defaultValue:null},
        signature:{type:DataTypes.STRING,allowNull:true,defaultValue:null},
        authority:{type:DataTypes.INTEGER,defaultValue:0},
        status:{type:DataTypes.INTEGER,defaultValue:1}
    }, {
        timestamps: false,
        tableName: 'user_info'
    });

    return User_info;
};