var models = require('../models');

var fn_inquiryLibrary = async(ctx, next) => {
    /*models.library.sync({force:true}).then(()=>{
        console.log("table library success");
    })*/
    models.library.findAll({
        where: {
            user_id: 113
        }
    }).then(library =>{
        console.log(library);
    });
};

module.exports = {
    'GET /inquiryLibrary': fn_inquiryLibrary
};