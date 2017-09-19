/*
    the request module
    insert,query in the request table

*/


var models = require('../models');
var date_convert = require('../configs/date_format.js');
var user_control = require('/opt/gitProject/GemsIGDP/server_src/controllers/users.js');
var Sequelize = require('sequelize');


//get the request by id
//use for the show of all text
var getRequestByIdfunc = async function(id) {
    var r = await models.request.findOne({
        attributes : ['id','title','release_time','content','contact'],
        include: [{
            model: models.user,
            attributes : ['nickname'],
            where: { id: Sequelize.col('request.user_id') },//include the user's nickname
            required: true
        }],
        where :{
            id : id
        }
    });

    var request = {
        id : r.id,
        title : r.title,
        release_time : date_convert.getDateTime(r.release_time),
        author : r.user.nickname,
        content : r.content,
        contact : r.contact
    };

    return request;
};


//insert a data in the request table
//use for release a request
//params: ?????an object???
//return true for insert success or false for not
var releaseRequestfunc = async function(user_id,title,content,contact) {
    try{
        await models.request.create({
            user_id : user_id,
            title : title,
            release_time : new Date(),
            content : content,
            contact : contact
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
        
        var result = await models.request.findById(id);
        result.increment('yuedu'); //yuedu++
        
        /*var old = result.yuedu;
        old++;
        
        await models.request.update({
            yuedu : old,
            where:{
                id : id
            }
        });*/
    }catch(error){
        console.log('when the number of yuedu in a request up, errors happen: '+error);
        return false;
    }

    return true;
};


//get the number of all requests
//return the count
var countRequestsfunc = async function(){
    var requests = await models.request.findAndCountAll();

    return requests.count;
}

//get all requests in request_list table
//use for show in requestList.html
//return requests(include object and count)
var getRequestListfunc = async function(currentPage){
    let c = (currentPage-1) *6;
    var r = await models.request.findAll({
        attributes : ['id','title','content','yuedu','release_time'],
        limit : 6,
        include: [{
            model: models.user,
            attributes : ['nickname'],
            where: { id: Sequelize.col('request.user_id') },//include the user's nickname
            required: true
        }],
        where : {id : {$gt : c}}
    });

    var i;
    var requests = new Array();
    for(i in r)
    {
        requests[i] = {
            id : r[i].id,
            title : r[i].title,
            content : r[i].content,
            yuedu : r[i].yuedu,
            release_time : date_convert.getDateTime(r[i].release_time)
        };
    }

    return requests;
};

/**
 * 
 * @param {integer} request_id 
 * @return {boolean} true for delete success, false for not
 * will throw error
 */
var deleteRequestfunc = async function(request_id){
    //get current user's id
    let user_id = user_control.getCurrentUser().user_id;
    let request = await models.request.findOne({
        attributes : ['user_id'],
        where : {id : request_id}
    });
    
    //if current user is this request's author, he have the authority to delete this request
    if(user_id === request.user_id)
    {
        try{
            await models.request.destroy({
                where : {id : request_id}
            });
        }catch(error){
            throw(error);
            console.log('delete a request, errors happen:'+error);
            return false;
        }
    }
    else{
        throw('you have no authority to delete this request!');
        return false;
    }

    return true;
};


module.exports = {
    getRequestById : getRequestByIdfunc,
    releaseRequest : releaseRequestfunc,
    getRequestList : getRequestListfunc,
    countRequests : countRequestsfunc,
    deleteRequest : deleteRequestfunc
}