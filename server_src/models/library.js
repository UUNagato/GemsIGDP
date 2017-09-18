
//sucaiku mokuai
module.exports = (sequelize, DataTypes) => {
    var theLibrary = sequelize.define('library',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        create_time : DataTypes.DATE,
        user_id : DataTypes.INTEGER,
        library_name : DataTypes.STRING(50),
    },{
        timestamps: false,
        tableName: 'library'
    });

    
    theLibrary.associate = function(models){
        theLibrary.belongsTo(models.user, {foreignKey:'user_id'});
        theLibrary.hasMany(models.libraryFile, {foreignKey:'library_id'});
    };

    //insert data
    /*theLibrary.create({
        id : 1,
        user_id : 113,
        library_name : 'test library1 from user113'
    });

    theLibrary.create({
        id : 2,
        user_id : 113,
        library_name : 'test library2 from user113'
    });

    theLibrary.create({
        id : 3,
        user_id : 111,
        library_name : 'test library3 from user111'
    });*/

    return theLibrary;
};