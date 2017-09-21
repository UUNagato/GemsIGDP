function uploadfile() {
    $('#fileinput').click();
}

function onfileselect() {
    var file = $('#fileinput')[0].files[0];
    if(file) {
        var filename = file.name;
        var filetype = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
        $('#preupload').hide();
        $('#selectedfile').show();
        if(filetype === 'obj') {
            initCanvasPreview3D(filetype, createOBJURL(file));
        } else if(filetype === 'png' || filetype === 'jpg' || filetype === 'gif') {
            initImagePreview(file);
        } else if(filetype === 'mp3' || filetype === 'ogg') {
            initAudioPreview(file);
        } else {
            $('#onpost').attr('disabled','disabled');
            $('#preupload').show();
            $('#selectedfile').hide();
        }
    }
}

function initImagePreview(file) {
    $('#infop').text(file.name);
    var url = createOBJURL(file);
    $('#selectedfile').css('background-image','url(' + url + ')');
    $('#onpost').removeAttr('disabled');
}

function initAudioPreview(file) {
    $('#infop').text(file.name);
    var url = createOBJURL(file);
    var audiotag = $('<audio controls>');
    var source = $('<source src="' + url + '">');
    audiotag.append(source);
    $('#selectedfile').append(audiotag);
    $('#onpost').removeAttr('disabled');
}

function createOBJURL(file) {
    if(window.webkitURL !== undefined) {
        return window.webkitURL.createObjectURL(file);
    } else if(window.URL && window.URL.createObjectURL) {
        return window.URL.createObjectURL(file);
    }
    return null;
}

var gems_renderer = null;
function initCanvasPreview3D(type, url) {
    $('#preupload').hide();
    $('#selectedfile').show();
    var canvasdiv = document.getElementById('selectedfile');
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, canvasdiv.clientWidth/canvasdiv.clientHeight, 0.1, 1000 );

    manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {
        console.log(item, loaded, total);
    };
    var onProgress = function(xhr) {
        if(xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(percentComplete);
        }
    };
    var onError = function(xhr) {
        console.error(xhr);
    };

    if(type === 'obj') {
        var loader = new THREE.OBJLoader(manager);
        loader.load(url,function(object){
            scene.add(object);
        },onProgress, onError);
    };

    gems_renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer : true
    });
    gems_renderer.setSize( canvasdiv.clientWidth, canvasdiv.clientHeight );
    canvasdiv.appendChild( gems_renderer.domElement );

    var light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);

    controls = new THREE.TrackballControls( camera, gems_renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.keys = [ 65, 83, 68 ];
    controls.dynamicDampingFactor = 0.3;


    camera.position.z = 5;

    var animate = function () {
        requestAnimationFrame( animate );

        controls.update();
        gems_renderer.render(scene, camera);
    };

    animate();
    $('#onpost').removeAttr('disabled');
}

function onpost() {
    showalert('');
    var form = new FormData();
    var title = $('#title').val();
    var tags = $('#tags').val();
    var file = $('#fileinput')[0].files[0];
    // basic format check
    var titleexp = /^\D[^><\n\f\r\t\v]{2,50}/;
    var tagexp = /^\D[^><\n\f\r\t\v]{0,255}/;

    if(!titleexp.test(title)) {
        showalert('不合法的标题格式');
        return;
    }

    if(!tagexp.test(tags)) {
        showalert('不合法的标签格式');
        return;
    }

    $('#onpost').attr('disabled','disabled');
    // get file type
    if(file !== undefined) {
        var filename = file.name;
        var filetype = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
        if(filetype === 'obj') {
            // upload thumbnail
            gems_renderer.domElement.toBlob(function(blob) {
                form.append('thumbnail', blob);
                postdata(form, file);
            })
        } else {
            postdata(form, file);
        }
    };
}

function showalert(text) {
    if(text === '') {
        $('#alertinfo').hide();
        return;
    } else {
        $('#alertinfo').text(text);
        $('#alertinfo').show();
    }
}

function postdata(form, file) {
    form.append('file', file);
    var csrf = window.localStorage.getItem('csrf');

    $.ajax({
        url: '/materials/upload',
        method: 'POST',
        data: form,
        cache: false,
        processData: false,
        contentType: false,
        beforeSend:function(xhr){
            xhr.setRequestHeader('x-access-token',csrf);
        },
        success:function(data){
            if(data.error) {
                showalert(data.error);
                $('#onpost').removeAttr('disabled');
            } else {
                // upload text
                postmaterial(data.file,data.thumbnail);
            }
        }
    });
}

function postmaterial(fileid, thumbnailid) {
    var title = $('#title').val();
    var tags = $('#tags').val();

    var csrf = window.localStorage.getItem('csrf');
    $.ajax({
        url:'/materials/materialupload',
        data:{name:title,
                tags:tags,
                fileid : fileid,
                thumbnailid : thumbnailid
        },
        method:'POST',
        cache: false,
        beforeSend:function(xhr){
            xhr.setRequestHeader('x-access-token',csrf);
        },
        success:function(data){
            if(data.error !== undefined) {
                showalert(data.error);
                $('#onpost').removeAttr('disabled');
            } else {
                window.location.href = '/materials';
            }
        }
    });
}