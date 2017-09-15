
//sucaiku neirong
module.exports = (sequelize, DataTypes) => {
    var theLContent = sequelize.define('libraryContent',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        library_id : DataTypes.INTEGER,
        add_time : DataTypes.DATE,
        //file_id : DataTypes.INTEGER,
        file_authority : {
            type : DataTypes.INTEGER,
            defaultValue : 1}
    },{
        timestamps: false,
        tableName: 'library_content'
    });

    
    theLContent.associate = function(models){
        theLContent.belongsTo(models.library,{foreignKey:'library_id'});
        //theLContent.hasMany(models.file,{foreignKey:'file_id'});
    };
    
    return theLContent;
};