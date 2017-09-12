//sucaiku he sucaikuwenjian duoduiduo guanxibiao
module.exports = (sequelize, DataTypes) => {
    var theLFile = sequelize.define('libraryFile',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        library_content_id : DataTypes.INTEGER,
        file_id : DataTypes.INTEGER
    },{
        timestamps: false,
        tableName: 'library_file'
    });
    
    return theLFile;
};