var fs = require('fs');

var fn_index = async(ctx, next) => {
    ctx.response.redirect('/index.html');
};

module.exports = {
    'GET /' : fn_index
};