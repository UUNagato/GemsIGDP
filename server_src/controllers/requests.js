/*
    the request module
    insert,query in the request table

*/


var models = require('../models');


//get the request by id
//use for the show of all text
var getRequestByIdfunc = async function(id) {
    var request = await models.request.findOne({
        include: [{
            model: models.user,
            where: { id: Sequelize.col('request.user_id') },
            required: true
        }],
        where :{
            id : id
        }
    });

    return request;
};


//insert a data in the request table
//use for release a request
//params: ?????an object???
//return true for insert success or false for not
var releaseRequestfunc = async function() {
    try{
        await models.request.create({
            user_id : user_id,
            title : title,
            release_time : new Date(),
            content : content,
            connection : connection
        });
    }catch(error){
        console.log('when insert a new request, errors happen: '+error);
        return false;
    }

    return true;
};


//update the number of yuedu in the request table
//use for when other users click a request page to look up, the yuedu+1
//params: request_id
//return true for update success or false for not
var upYuedufunc = async function(id) {
    try{
        
        //the method of let yuedu++ is not sure!!!!!!!!!!!!!
        
        var result = await models.request.findOne({
            attributes: ['yuedu'],
            where :{
                id : id
            }
        });
        
        var old = result.yuedu;
        old++;
        
        await models.request.update({
            yuedu : old,
            where:{
                id : id
            }
        });
    }catch(error){
        console.log('when the number of yuedu in a request up, errors happen: '+error);
        return false;
    }

    return true;
}

module.exports = {
    getRequestById : getRequestByIdfunc
}