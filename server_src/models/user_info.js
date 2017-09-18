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
        User_info.hasOne(models.login, {foreignKey:'user_id'});
        User_info.hasOne(models.individualPage ,{foreignKey:'user_id'});

        User_info.hasMany(models.article ,{foreignKey:'user_id'});
        User_info.hasMany(models.commentList ,{foreignKey:'user_id'});

        User_info.hasMany(models.exhibitionWindow ,{foreignKey:'user_id'});
        User_info.hasMany(models.library ,{foreignKey:'user_id'});
        User_info.hasMany(models.file ,{foreignKey:'user_id'});
        User_info.hasMany(models.request ,{foreignKey:'user_id'});
        
        User_info.hasMany(models.message ,{foreignKey:'user_id'});
        User_info.hasMany(models.personalRecord ,{foreignKey:'user_id'}); 
    };


    return User_info;
};