/*window.onload=function(){
    $('.title-3').hide();
};*/

//show the rule of input info
function showMess(event)
{
    var $input = $(event);
    var div = $input.parent().parent();
    
    $('.title-3').hide();
    //div.find('.title-3').show();

    //when info of alert or ok is hidden, the title-3 info will show
    if($input.attr('id') === 'name')
    {
        if(div.find('.alert').is(':hidden') && div.find('.glyphicon-ok').is(':hidden')&& div.find('#alert-2').is(':hidden')&& div.find('#alert-1').is(':hidden'))
            div.find('.title-3').show();
    }
    else{
        if(div.find('.alert').is(':hidden') && div.find('.glyphicon-ok').is(':hidden'))
            div.find('.title-3').show();
    }
    
    //$('.glyphicon-ok').hide();
    // $input.parent().parent().find('.title-3').show();
}


//check the username is already exist in database or not
function userid(event)
{
    var id = $(event).val();
    var input = $(event);
    var div = input.parent().parent();
    
    var reg=/^[a-zA-Z0-9_]{6,18}$/; 
    if(!reg.test(id))
    {
        console.log('have illegal char');
        div.find('.title-3').hide();
        div.find('.alert').hide();
        div.find('.glyphicon-ok').hide();
        div.find('#alert-2').show();
    }
    else{
        $.ajax({
            type : "post",
            data : {
                name : id
            },
            dataType : "text",
            url : "/register/checkId",
            success : function(data){
                if(data == 'success'){
                    //
                    console.log('success');
                    console.log(div.find('.title3').text());
                    div.find('.title-3').hide();
                    div.find('.alert').hide();
                    div.find('.glyphicon-ok').show();
                }else{
                    //
                    console.log("fail");
                    div.find('.glyphicon-ok').hide();
                    div.find('.title-3').hide();
                    div.find('#alert-1').show();
                }
            }
        });
    }
}


//to judge the email is legal or not
function email(event)
{
    let email = $(event).val();
    let div = $(event).parent().parent();
    let judge=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

    if(!judge.test(email))
    {
        console.log('email have illegal char');
        div.find('.title-3').hide();
        div.find('.glyphicon-ok').hide();
        div.find('.alert').show();
    }else{
        div.find('.title-3').hide();
        div.find('.alert').hide();
        div.find('.glyphicon-ok').show();
    }
}


//to judge the length of password is legal or not
function passLen(event)
{
    var password = $(event).val();
    var input = $(event);
    var div = input.parent().parent();
    if($(event).val().length < 6 || $(event).val().length > 16)
    {
        div.find('.title-3').hide();
        div.find('.glyphicon-ok').hide();
        div.find('.alert').show();
    }
    else
    {
        div.find('.title-3').hide();
        div.find('.alert').hide();
        div.find('.glyphicon-ok').show();
    }

}


//to judge the repassword input is the same as password
function passwordRe(event)
{
    let password = $('#password').val();
    let passwordRe = $(event).val();
    let div = $(event).parent().parent();

    if(passwordRe.length>=6 && passwordRe.length<=16)
    {
        if(password == passwordRe)
        {
            div.find('.title-3').hide();
            div.find('.alert').hide();
            div.find('.glyphicon-ok').show();
        }
        else{
            div.find('.title-3').hide();
            div.find('.glyphicon-ok').hide();
            div.find('.alert').show();
        }
    }
}


//to upload the register info if all the info are right
function upRegInfo(){
    //to check all the info are right
    var right = true;
    $('.info-s').find('.glyphicon-ok').each(function(){
        if($(this).is(':hidden'))
        {
            right = false;
            //break;
        }
    });

    if(right === true)
    {
        let name = $('#name').val();
        let email = $('#email').val();
        let password = $('#password').val();


        $.post('/register/upInfo', {username : name, email : email, password : password},
            function(info){
                //console.log('register success, url is '+url);
                
                if(info.error === 1){
                    //the username error
                    alert('the username is illegal, please input again.');
                }else if(info.error === 2){
                    //the email error
                    alert('the email is illegal, please input again.');
                }
                else if(info.error === 3){
                    //the password error
                    alert('the password is illegal, please input again.');
                }
                else if(info.error === 4){
                    //cannot send email
                    alert('can not send email, please try again.');
                }else{
                    //success
                    console.log('registe success');
                    window.location.href = '/register/inform';
                }
                
                
        });

    }else{
        alert('please input the legal info!');
    }
}