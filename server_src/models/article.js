
//wenzhang mokuai
module.exports = (sequelize, DataTypes) => {
    var theArticle =  sequelize.define("article",{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement: true},
        user_id : DataTypes.INTEGER,
        title : DataTypes.STRING(50),
        release_time : DataTypes.DATE,
        label : DataTypes.ENUM('game_design','game_make'),
        content : DataTypes.TEXT,
        dianzan : {
            type : DataTypes.INTEGER,
            defaultValue : 0},
        state : {
            type : DataTypes.INTEGER,
            defaultValue : 1},
        liulan : {
            type : DataTypes.INTEGER,
            defaultValue : 0},
        //comment_id : DataTypes.INTEGER
    },{
        timestamps: false,
        tableName: 'article'
    });

    
    theArticle.associate = function(models) {
        theArticle.belongsTo(models.user,{foreignKey:'user_id'});
        theArticle.hasMany(models.commentList,{foreignKey:'comment_id'});
    };

    return theArticle;
};