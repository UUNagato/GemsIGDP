var Gems_UploadPicViewer = {
    MaxImages : 5,

    GemsImageStyle : [
        {
            'left':0.15,      // 15%
            'width':0.25,
            'height':0.3,
            'zIndex':'10'
        },
        {
            'left':0.3,     // 30%
            'width':0.35,
            'height':0.4,
            'zIndex':'15'
        },
        {
            'left':0.5,     // 50%
            'width':0.45,
            'height':0.5,
            'zIndex':'20'
        },
        {
            'left':0.7,     // 70%
            'width':0.35,
            'height':0.4,
            'zIndex':'15'
        },
        {
            'left':0.85,     // 85%
            'width':0.25,
            'height':0.3,
            'zIndex':'10'
        }
    ],

    getObjectURL : function(file) {
        var url = null;
        if(window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }

        return url;
    },

    revokeObjectURL : function(url) {
        if(window.revokeObjectURL != undefined) {
            window.revokeObjectURL(url);
        } else if (window.URL != undefined) {
            window.URL.revokeObjectURL(url);
        } else if (window.webkitURL != undefined) {
            window.webkitURL.revokeObjectURL(url);
        }
    },

    createNew : function(container) {
        var win = {};
        win.imgs = [];
        win.container = container;
        win.imgIndex = -1;
        win.animating = false;

        $(container).find('.left-btn').click(function() {
            win.move(-1);
        })

        $(container).find('.right-btn').click(function() {
            win.move(1);
        })

        // when window size changed, modify this component.
        $(window).resize(function() {
            win.StaticUpdate();
        })

        win.move = function(step) {
            var final = win.imgIndex + step;
            if(final >= win.imgs.length) {
                final = win.imgs.length - 1;
            }
            if(final < 0) {
                final = 0;
            }

            win.imgIndex = final;
            win.Update();
        }

        win.addImg = function(imgsrc) {
            if(win.imgs.length <= Gems_UploadPicViewer.MaxImages) {
                var newimg = $('<div></div>').addClass('imgwindow').hide();
                // add input tag
                var inputtag = $('<input type="file" accept="image/png,image/gif,image/jpeg"/>').hide();
                // add image tag
                var imageTag = $('<img src="img/img-icon-add.png" height="100%" />');
                newimg.fileinput = inputtag;

                // add a delete button
                var delbtn = $('<button type="button" class="btn-delete" />').hide();
                delbtn.click(function(event) {
                    // delete this img
                    for(i in win.imgs) {
                        if(win.imgs[i] === newimg) {
                            win.imgs.splice(i,1);
                            // release url
                            var objectURL = newimg.find('img').attr('src');
                            Gems_UploadPicViewer.revokeObjectURL(objectURL);

                            // remove obj
                            newimg.fileinput.remove();
                            newimg.remove();

                            // check if index out of range
                            if(win.imgIndex >= win.imgs.length)
                                win.imgIndex = win.imgs.length - 1;
                            
                            // if empty, add one
                            if(win.imgs.length === 0)
                                win.addImg();
                            
                            win.Update();
                        }
                    }

                    event.stopPropagation();
                });

                newimg.append(imageTag);
                newimg.append(delbtn);


                // change
                inputtag.change(function(){
                    // max, not add
                    if(win.imgs.length > Gems_UploadPicViewer.MaxImages)
                        return;
                    // change the background of img window
                    var files = $(this).get(0).files;
                    var url = Gems_UploadPicViewer.getObjectURL(files[0]);
                    if(url === null) {
                        imageTag.attr('src','img/img-icon-notsupport.png');
                        delbtn.show();
                    } else {
                        imageTag.attr('src',url);
                        delbtn.show();
                    }

                    win.addImg();
                })
                
                // for jquery to open file input dialog.
                fileopen = function() {
                    return inputtag.click();
                }
                // add click event
                imageTag.click(function(){
                   fileopen();
                });

                win.imgs.push(newimg);
                $(win.container).append(newimg);
                $(win.container).append(inputtag);
                win.imgIndex++;
                win.Update();
            }
        };

        win.Update = function() {
            for(i in win.imgs) {
                if(i >= win.imgIndex - 2 && i <= win.imgIndex + 2) {
                    win.imgs[i].show();
                    win.imgs[i].animate(win.GetStyleObject(i - win.imgIndex + 2), 'fast');
                } else {
                    win.imgs[i].hide();
                }
            }
        }

        win.StaticUpdate = function() {
            console.log(win.imgIndex);
            for(i in win.imgs) {
                console.log(i + " when index=" + win.imgIndex);
                if(i >= win.imgIndex - 2 && i <= win.imgIndex + 2) {
                    win.imgs[i].stop(true,true);
                    win.imgs[i].css(win.GetStyleObject(i - win.imgIndex + 2));
                    win.imgs[i].show();
                } else {
                    win.imgs[i].stop(true,true);
                    win.imgs[i].hide();
                }
            }
        }

        win.GetStyleObject = function(index) {
            if(index >= 0 && index < Gems_UploadPicViewer.MaxImages && win.container) {
                let jc = $(win.container);
                let pwidth = win.imgs[index - 2 + win.imgIndex].width();
                console.log('width:' + pwidth + ' and height:' + win.imgs[index-2+win.imgIndex].width());
                return {
                    'width': 'auto',
                    'height': Gems_UploadPicViewer.GemsImageStyle[index].height * jc.height() + 'px',
                    'left' : (Gems_UploadPicViewer.GemsImageStyle[index].left * jc.width() - pwidth / 2) + 'px',
                    'zIndex' : Gems_UploadPicViewer.GemsImageStyle[index].zIndex
                };
            }
        }

        return win;
    }
}

$().ready(function(){
    var picwindows = $('div.showWindowPicViewer').each(function(i) {
        Gems_UploadPicViewer.createNew(this).addImg();
    })
});