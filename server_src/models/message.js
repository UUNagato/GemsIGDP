
//xiaoxi mokuai
module.exports = (sequelize, DataTypes) => {
    var theMessage =  sequelize.define('message',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        sent_id : DataTypes.INTEGER,
        message_time: DataTypes.DATE,
        message_content : DataTypes.STRING,
        receive_id : DataTypes.INTEGER
    },{
        timestamps: false,
        tableName: 'message'
    });

    
    theMessage.associate = function(models){
        theMessage.belongsTo(models.user,{as:'sents', foreignKey:'sent_id'});
        theMessage.belongsTo(models.user,{as:'receives', foreignKey:'receive_id'});
    };
    
    return theMessage;
};