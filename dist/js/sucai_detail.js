function thumbs(event)
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

