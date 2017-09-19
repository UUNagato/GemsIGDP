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
        $('#selectedfile').text(filename);
    }
}

// animation
function initCanvasPreview3D() {
    $('#preupload').hide();
    $('#selectedfile').show();
    var canvasdiv = document.getElementById('selectedfile');
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, canvasdiv.clientWidth/canvasdiv.clientHeight, 0.1, 1000 );

    var manager = new THREE.LoadingManager();
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

    var loader = new THREE.OBJLoader(manager);
    loader.load('/LWA.obj',function(object){
        scene.add(object);
    },onProgress, onError);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasdiv.clientWidth, canvasdiv.clientHeight );
    canvasdiv.appendChild( renderer.domElement );

    var light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);

    camera.position.z = 5;

    var animate = function () {
        requestAnimationFrame( animate );

        renderer.render(scene, camera);
    };

    animate();
}

function onpost() {
    var form = new FormData();
    var title = $('#title').val();
    var tags = $('#tags').val();
    var file = $('#fileinput')[0].files[0];
    form.append('file', file);
    var csrf = window.localStorage.getItem('csrf');

    $.ajax({
        url: 'materials/upload',
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
                console.log(data.error);
            } else {
                window.location.href = '/materials';
            }
        }
    });
}