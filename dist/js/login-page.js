$().ready(function() {
    if(window.localStorage === undefined) {
        setErrorInfo(3);
    }

    $('#loginbtn').click(function(){
        // clear status
        $('div#groupname').removeClass('has-error');
        $('div#grouppass').removeClass('has-error');
        $('#alertdiv').hide();
        // check if empty
        var username = $('input#fmusername').val();
        var nameexp = /^[a-zA-Z0-9_]{6,18}$/;

        var isname = nameexp.test(username);
        if(!isname) {
            // try email
            var emailexp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if(!emailexp.test(username)) {
                // failed, make high light
                setErrorInfo(0);
                return;
            }
        }

        // check password
        var password = $('input#fmpassword').val();
        var passexp = /[^><\s]{6,18}/;
        if(!passexp.test(password)) {
            setErrorInfo(1);
            return;
        }

        // all passed, send login request
        var data = {
            password:password
        };
        if(isname) {
            data['username'] = username;
        }else {
            data['email'] = username;
        }
        $.post(
            '/login/check',
            data,
            function(data, status) {
                if(status === 'success') {
                    if(data.error) {
                        setErrorInfo(data.error);
                    } else if(data.token) {
                        var date = new Date();
                        date.setTime(date.getTime() + 15 * 24 * 3600000);
                        document.cookie = 'authentication=' + data.token + '; expires=' + date.toUTCString();
                        // save csrf
                        window.localStorage.setItem('csrf',data.csrf);
                        // jump
                        window.location.href = '/';
                    }
                }
            }
        )
    })
});

function setErrorInfo(index) {
    switch(index) {
    case 0:
        $('#alertdiv').html('<strong>用户名或邮箱</strong>错误').show();
        $('div#groupname').addClass('has-error');
        break;
    case 1:
        $('#alertdiv').html('<strong>密码</strong>错误').show();
        $('div#grouppass').addClass('has-error');
        break;
    case 2:
        $('#alertdiv').html('<strong>用户名或密码</strong>错误').show();
        $('div#grouppass').addClass('has-error');
        break;
    case 3:
        $('#alertdiv').html('<strong>您的浏览器</strong>不支持该网站登录,请更换浏览器至最新版本').show();
        break;
    }
};