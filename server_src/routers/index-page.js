'user strict'
const fs = require('fs');
const projectpath = require('../configs/projectpath.js');

var fn_index = async(ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(projectpath.path + '/index.html');
};

module.exports = {
    'GET /' : fn_index
};