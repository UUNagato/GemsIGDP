//wenzhang pinglun
module.exports = (sequelize, DataTypes) => {
    var theComment = sequelize.define("commentList",{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},
        user_id : DataTypes.INTEGER,
        article_id : DataTypes.INTEGER,
        release_time : DataTypes.INTEGER,
        content : DataTypes.TEXT,
        last_release_time : DataTypes.DATE,
        cite_comment_id : DataTypes.INTEGER,
        state : {
            type : DataTypes.INTEGER,
            defaultValue : 1}
    },{
        timestamps: false,
        tableName: 'comment_list'
    });

    
    /*theComment.associate = function(models){
        theComment.belongsTo(models.article,{foreignKey:'article_id'});
    };*/

    return theComment;
};