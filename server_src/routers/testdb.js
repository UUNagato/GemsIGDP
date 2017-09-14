var models = require('../models');
var control = require('../controllers/requests.js');

var fn_testdb = async(ctx, next) => {
    /*models.user.sync({force:true}).then(()=>{
        console.log("table user_info success");
    });

    models.login.sync({force:true}).then(()=>{
        console.log("table login_info success");
    });
    
    models.article.sync({force:true}).then(()=>{
        console.log("table article success");
    });

    models.commentList.sync({force:true}).then(()=>{
        console.log("table commentList success");
    });*/

    models.request.sync({force:true}).then(()=>{
        console.log("table request success");
    });

};

var fn_insert = async(ctx, next) => {
    //let result1 = await control.releaseArticle(5,'JavaScript','game_make','For without words, in friendship, all thoughts, all desires, all expectations are born and shared, with joy that is unacclaimed. When you part from your friend, you grieve not; ');
    //let result2 = await control.releaseArticle(6,'Java','game_make','For that which you love most in him may be clearer in his absence, as the mountain to the climber is clearer from the plain. And let there be no purpose in friendship save the deepening of the spirit. ');
    
    //let result1 = await control.addComment('hahahahhah',2,1);
    //let result2 = await control.addComment('23333333333',2,1);
    let result1 = await control.releaseRequest(1,'need games','need ps4 and pc games!!!!','12345');
    let result2 = await control.releaseRequest(2,'need ideas','need ps4 and pc games!!!!','00000');
    
    if(result1 === true && result2 === true)
        console.log('add requests success!');
    
};

module.exports = {
    'GET /testdb': fn_testdb,
    'GET /insert': fn_insert
};