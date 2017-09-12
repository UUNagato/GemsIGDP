var nunjucks = require('nunjucks');
var option = require('../configs/nunjucksconfig.js');
var file = require('../configs/path.js');


/*function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('/opt/gitProject/GemsIGDP/dist', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}


var env = createEnv('/opt/gitProject/GemsIGDP/dist', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});



module.exports = {
    env : env
};*/


var env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader( file.path, option.nunjucksLoaders), option.nunjucksOpts);


module.exports = {
    env : env
};