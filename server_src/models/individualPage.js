//gerenyemian mokuai
module.exports = (sequelize, DataTypes) => {
    var thePage = sequelize.define('individualPage',{
        individual_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true},     
        user_id : DataTypes.INTEGER,   
        page_template : DataTypes.INTEGER,   
        custom_page : DataTypes.STRING,   
        recent_developments : DataTypes.STRING,
        option1 : {
            type : DataTypes.INTEGER,  
            defaultValue : 1}, 
        option2 : {
            type : DataTypes.INTEGER,
            defaultValue : 1}
    },{
        timestamps: false,
        tableName: 'individual_page'
    });

    thePage.associate = function(models){
        thePage.belongsTo(models.user,{foreignKey:'user_id'});
        thePage.hasMany(models.personalRecord,{foreignKey:'record_id'});
    };
    
    return thePage;
};