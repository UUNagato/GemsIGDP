/*
    User_Info Table Models

    Created By UUNagato at 2017/9/6
 */
module.exports = (sequelize, DataTypes) => {
    var User_info = sequelize.define('user', {
        id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        nickname:DataTypes.STRING(16),
        email:{type:DataTypes.STRING,validata:{isEmail:true}},
        contact:DataTypes.STRING,
        profile:DataTypes.INTEGER,
        register_time:DataTypes.DATE,
        lastlogin_time:DataTypes.DATE,
        age:DataTypes.INTEGER,
        sex:DataTypes.ENUM('男','女'),
        githubLink:{type:DataTypes.STRING,allowNull:true,defaultValue:null},
        perosonalWeb:{type:DataTypes.STRING,allowNull:true,defaultValue:null},
        signature:{type:DataTypes.STRING,allowNull:true,defaultValue:null},
        authority:{type:DataTypes.INTEGER,defaultValue:0},
        status:{type:DataTypes.INTEGER,defaultValue:1}
    }, {
        timestamps: false,
        tableName: 'user_info'
    });

    User_info.associate = function(models) {
        User_info.hasOne(models.login,{as:'LoginInfo', foreignKey:'user_id'});
    }
};