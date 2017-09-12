var models = require('../models');

var fn_testdb = async(ctx, next) => {
    models.login.sync({force:true}).then(()=>{
        console.log("table login_info success");
    })
    
    models.user.sync({force:true}).then(()=>{
        console.log("table user_info success");
    })
};

module.exports = {
    'GET /testdb': fn_testdb
};