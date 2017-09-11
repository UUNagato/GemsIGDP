function changeDiv_1()
{
    $('.right-2').attr("style","display:none;");
    $('.right-3').attr("style","display:none;");
    $('.right-4').attr("style","display:none;");
    $('.right-1').attr("style","display:block;");//显示div
}

function changeDiv_2()
{
    $('.right-1').attr("style","display:none;");
    $('.right-3').attr("style","display:none;");
    $('.right-4').attr("style","display:none;");
    $('.right-2').attr("style","display:block;");//显示div
}

function changeDiv_3()
{
    $('.right-2').attr("style","display:none;");
    $('.right-1').attr("style","display:none;");
    $('.right-4').attr("style","display:none;");
    $('.right-3').attr("style","display:block;");//显示div
}

function changeDiv_4()
{
    $('.right-2').attr("style","display:none;");
    $('.right-3').attr("style","display:none;");
    $('.right-1').attr("style","display:none;");
    $('.right-4').attr("style","display:block;");//显示div
}

function like(event)
{
    if(event.colortype === 0)
        event.colortype = 1;
    else
        event.colortype = 0;

    if(event.colortype === 0)
        $(event).attr("style","color:#FF2020;");
    else
        $(event).css('color','#2A2A2A');
}

$(function(){
    $('.glyphicon-star').click(function(){
        if(this.colortype === 0)
            this.colortype = 1;
        else
            this.colortype = 0;
    
        if(this.colortype === 0)
            $(this).attr("style","color:#FEC82E;");
        else
            $(this).css('color','#2A2A2A');
    });
});