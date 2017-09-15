
//zhanshichuang mokuai
module.exports = (sequelize, DataTypes) => {
    var theFile =  sequelize.define('file',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        user_id : DataTypes.INTEGER,
        file_name : DataTypes.STRING,
        file_path : DataTypes.STRING,
        upload_time : DataTypes.DATE,
        file_md5 : DataTypes.CHAR(32),  
        file_type : DataTypes.STRING
    },{
        timestamps: false,
        tableName: 'file'
    });

    theFile.associate = function(models){
        theFile.belongsTo(models.user,{foreignKey:'user_id'});
    };
    
    return theFile;
};