//zhanshichuang mokuai
module.exports = (sequelize, DataTypes) => {
    var theFile =  sequelize.define('file',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        exhibition_id : DataTypes.INTEGER, //one exhibitonWindow can has many files
        file_code : DataTypes.STRING,
        file_time : DataTypes.DATE,  
        user_id : DataTypes.INTEGER,
        file_label : DataTypes.STRING,
        file_name : DataTypes.STRING,
        file_address : DataTypes.STRING,
        file_type : DataTypes.STRING
    },{
        timestamps: false,
        tableName: 'file'
    });

    /*theFile.associate = function(models){
        theFile.belongsTo(models.user,{foreignKey:'user_id'});
    };*/
    
    return theFile;
};