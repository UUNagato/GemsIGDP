// some global operation like initialize navbar
$().ready(function(){
    // read login cookie
    var cookies = document.cookie.split('; ');
    var login = false;
    for(i in cookies) {
        var arr = cookies[i].split('=');
        if(arr[0]==='authentication') {
            login = true;
        }
    }

    // check navbar
    if(login && window.localStorage) {
        // get profile
        var profilesrc = window.localStorage.getItem('user_profile');
        var nickname = window.localStorage.getItem('user_nickname');
        if(profilesrc !== null && nickname !== null) {
            changeToLoginNavbar(profilesrc, nickname);
        } else {
            getUserInfoAndStore();
        }
    }
})

function changeToLoginNavbar(profilesrc, nickname) {
    $('#unlog').addClass('navbar-hide');
    // set profile
    console.log(profilesrc);
    $('#userprofile').attr('src',profilesrc);
    $('#usernick').text(nickname);
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
                changeToLoginNavbar(data.user_profile, data.user_nickname);
            }
        }
    })
}