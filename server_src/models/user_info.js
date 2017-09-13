/*
    User_Info Table Models

    Created By UUNagato at 2017/9/6
 */


module.exports = (sequelize, DataTypes) => {
    var User_info = sequelize.define('user', {
        id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        nickname:DataTypes.STRING(16),
        telephone:DataTypes.STRING,
        qq:DataTypes.STRING,
        birthday:DataTypes.DATE,
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

    User_info.associate = function(models){
        User_info.hasOne(models.login);
        User_info.hasOne(models.individualPage);

        User_info.hasMany(models.article);
        User_info.hasMany(models.commentList);

        User_info.hasMany(models.exhibitionWindow);
        User_info.hasMany(models.library);
        User_info.hasMany(models.file);
        User_info.hasMany(models.request);
        
        User_info.hasMany(models.message);
        User_info.hasMany(models.personalRecord); 
    };


    return User_info;
};