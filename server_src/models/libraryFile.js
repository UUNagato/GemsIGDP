
//sucaiku he sucaikuwenjian duoduiduo guanxibiao
module.exports = (sequelize, DataTypes) => {
    var theLFile = sequelize.define('libraryFile',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        name : DataTypes.STRING,
        tags : DataTypes.STRING,//format:['tag1','tag2',...]
        library_id : DataTypes.INTEGER,
        file_id : DataTypes.INTEGER,
        thumbnail_id : DataTypes.INTEGER,
        upload_time : DataTypes.DATE,
        view : {
            type: DataTypes.INTEGER,
            defaultValue: 0}
    },{
        timestamps: false,
        tableName: 'library_file'
    });

    theLFile.associate = function(models) {
        theLFile.belongsTo(models.library, {foreignKey:'library_id'});
        theLFile.belongsTo(models.file, {as:'file', foreignKey:'file_id'});
        theLFile.belongsTo(models.file, {as:'thumbnail', foreignKey:'thumbnail_id'});
    }
    
    return theLFile;
};