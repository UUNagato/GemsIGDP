
//zhanshichuang mokuai
module.exports = (sequelize, DataTypes) => {
    var theEWindow =  sequelize.define('exhibitionWindow',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        state : {
            type : DataTypes.INTEGER,
            defaultValue : 1},
        user_id : DataTypes.INTEGER,
        title : DataTypes.STRING(50),
        introduce : DataTypes.STRING,
        //file_id : DataTypes.INTEGER,
        date : DataTypes.DATE,
        dianzan : {
            type : DataTypes.INTEGER,
            defaultValue : 0},
        liulan : {
            type : DataTypes.INTEGER,
            defaultValue : 0}
    },{
        timestamps: false,
        tableName: 'exhibition_window'
    });

    theEWindow.associate = function(models) {
        theEWindow.belongsTo(models.user,{as:'Author', foreignKey:'user_id'});
        theEWindow.hasMany(models.file,{as:'Files', foreignKey:'file_id'});
    };
    
    return theEWindow;
};