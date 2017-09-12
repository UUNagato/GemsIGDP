//lvli
module.exports = (sequelize, DataTypes) => {
    var theRecord = sequelize.define('personalRecord',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        state : DataTypes.INTEGER,
        user_id : DataTypes.INTEGER,
        date : DataTypes.DATE,
        content : DataTypes.STRING
    },{
        timestamps: false,
        tableName: 'personal_record'
    });

   
    /*theRecord.associate = function(models){
        theRecord.belongsTo(models.user,{foreignKey:'user_id'});
    };*/
    
    return theRecord;
};