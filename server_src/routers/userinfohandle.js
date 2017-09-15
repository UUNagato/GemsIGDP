/**
 * Handle some realtime user info get
 *
 */
const users = require('../controllers/users.js');

var fn_getuserinfo = async function(ctx, next) {
    var user = users.getCurrentUser();
    if(user !== null) {
        var userinfo = await users.getProfileAndNicknameById(user.user_id);
        ctx.response.body = {user_id:user.user_id,
                            user_profile:userinfo.profile,
                            user_nickname:userinfo.nickname};
    } else {
        ctx.response.body = {error:'不是合法用户。'};
    }
}

module.exports = {
    'POST /user/getuserinfo': fn_getuserinfo
}