
//xuqiu mokuai
module.exports = (sequelize, DataTypes) => {
    var theRequest =  sequelize.define('request',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        user_id : DataTypes.INTEGER,
        title : DataTypes.STRING(50),
        yuedu : {
            type : DataTypes.INTEGER,
            defaultValue : 0},
        release_time : DataTypes.DATE,
        content : DataTypes.TEXT,
        contact : DataTypes.STRING(20),
        state : {
            type : DataTypes.INTEGER,
            defaultValue : 1}
    },{
        timestamps: false,
        tableName: 'request'
    });

    
    theRequest.associate = function(models){
        theRequest.belongsTo(models.user, {foreignKey:'user_id'});
    };
    
    return theRequest;
};