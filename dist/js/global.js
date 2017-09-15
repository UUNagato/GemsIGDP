// some global operation like initialize navbar
$().ready(function(){
    var login = isLocallyLogin();

    // check navbar
    if(login && window.localStorage) {
        // get profile
        var userid = window.localStorage.getItem('user_id');
        var profilesrc = window.localStorage.getItem('user_profile');
        var nickname = window.localStorage.getItem('user_nickname');
        if(userid !== null && profilesrc !== null && nickname !== null) {
            changeToLoginNavbar(userid, profilesrc, nickname);
        } else {
            getUserInfoAndStore();
        }
    }
});

function isLocallyLogin() {
    // read login cookie
    var cookies = document.cookie.split('; ');
    for(i in cookies) {
        var arr = cookies[i].split('=');
        if(arr[0]==='authentication') {
            return true;
        }
    }
    return false;
}

function changeToLoginNavbar(userid, profilesrc, nickname) {
    $('#unlog').addClass('navbar-hide');
    // set profile
    $('#userprofile').attr('src',profilesrc);
    $('#usernick').text(nickname);
    $('#personalpage').attr('href','/idPage/' + userid);
    $('#login').removeClass('navbar-hide');
}

function getUserInfoAndStore() {
    $.post({
        url: '/user/getuserinfo',
        success: function(data) {
            if(data.error === undefined) {
                window.localStorage.setItem('user_id',data.user_id);
                window.localStorage.setItem('user_profile',data.user_profile);
                window.localStorage.setItem('user_nickname',data.user_nickname);
                changeToLoginNavbar(data.user_id, data.user_profile, data.user_nickname);
            }
        }
    })
}

function logOut() {
    if(isLocallyLogin()) {
        // clear localstorage
        window.localStorage.removeItem('csrf');
        window.localStorage.removeItem('user_id');
        window.localStorage.removeItem('user_profile');
        window.localStorage.removeItem('user_nickname');

        var date = new Date();
        date.setTime(date.getTime() - 1000);
        document.cookie = 'authentication=; expires=' + date.toUTCString();
        location.reload();
    }
}