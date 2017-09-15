
//zhanshichuang mokuai
module.exports = (sequelize, DataTypes) => {
    var theFile =  sequelize.define('file',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        //exhibition_id : DataTypes.INTEGER, //one exhibitonWindow can has many files
        file_time : DataTypes.DATE,  
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
        theFile.belongsToMany(models.file,{through:'exhibitionFile', foreignKey:'file_id', otherKey:'window_id'});
        theFile.belongsTo(models.user,{foreignKey:'user_id'});
    };
    
    return theFile;
};