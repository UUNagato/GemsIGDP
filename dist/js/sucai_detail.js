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

$().ready(function(){
    // init preview window
    // first judge the type of the file
    var viewContainer = $('#view_container');
    var filesrc = viewContainer.attr('filesrc');
    var filetype = filesrc.substring(filesrc.lastIndexOf('.') + 1, filesrc.length);
    if(filetype === 'obj') {
        init3DPreview('obj', filesrc);
    } else if(filetype === 'jpg' || filetype === 'png' || filetype === 'gif') {
        initImgPreview(filesrc);
    } else if(filetype === 'ogg' || filetype === 'mp3') {
        initAudioPreview(filesrc);
    }
})

function initImgPreview(src) {
    var node = $('<img class="card" src="' + src + '" />');
    $('#view_container').append(node);
}

function initAudioPreview(src) {
    var audio = $('<audio controls>');
    var source = $('<source src="' + src + '">');
    audio.append(source);
    $('#view_container').append(audio);
}

function init3DPreview(type, src) {
    var canvasdiv = document.getElementById('view_container');
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
        loader.load(src,function(object){
            scene.add(object);
        },onProgress, onError);
    };

    gems_renderer = new THREE.WebGLRenderer();
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
}