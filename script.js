import * as THREE from "three";

/////////////////////////////////////////////////
// CAMERA
/////////////////////////////////////////////////

const video =
document.getElementById("camera");

navigator.mediaDevices.getUserMedia({

    video:{
        facingMode:{
            ideal:"environment"
        },

        width:{ideal:1920},
        height:{ideal:1080},

        frameRate:{ideal:60}
    },

    audio:false

}).then(stream=>{

    video.srcObject=stream;

}).catch(err=>{

    alert(
        "Erreur caméra : " +
        err.message
    );

});

/////////////////////////////////////////////////
// THREE.JS
/////////////////////////////////////////////////

const scene =
new THREE.Scene();

const camera =
new THREE.PerspectiveCamera(
    70,
    window.innerWidth/window.innerHeight,
    0.01,
    1000
);

const renderer =
new THREE.WebGLRenderer({
    alpha:true,
    antialias:true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document
.getElementById("container")
.appendChild(renderer.domElement);

/////////////////////////////////////////////////
// FENÊTRE FLOTTANTE
/////////////////////////////////////////////////

const texture =
new THREE.TextureLoader().load(
    "assets/image.png"
);

const geometry =
new THREE.PlaneGeometry(
    2,
    1.2
);

const material =
new THREE.MeshBasicMaterial({

    map:texture,
    transparent:true

});

const windowPlane =
new THREE.Mesh(
    geometry,
    material
);

/////////////////////////////////////////////////
// POSITION FIXE DANS LE MONDE
/////////////////////////////////////////////////

windowPlane.position.set(
    0,
    0,
    -5
);

scene.add(windowPlane);

/////////////////////////////////////////////////
// GYROSCOPE
/////////////////////////////////////////////////

let alpha=0;
let beta=0;
let gamma=0;

function requestOrientation(){

    if(
      typeof DeviceOrientationEvent
      !== "undefined"
      &&
      typeof DeviceOrientationEvent
      .requestPermission === "function"
    ){

        DeviceOrientationEvent
        .requestPermission()
        .then(response=>{

            if(response==="granted"){

                startGyro();

            }

        });

    }
    else{

        startGyro();

    }
}

function startGyro(){

    window.addEventListener(

        "deviceorientation",

        e=>{

            alpha=e.alpha || 0;
            beta=e.beta || 0;
            gamma=e.gamma || 0;

        },

        true

    );
}

document.body.addEventListener(

    "click",

    requestOrientation,

    {once:true}

);

/////////////////////////////////////////////////
// ANIMATION
/////////////////////////////////////////////////

function animate(){

    requestAnimationFrame(
        animate
    );

    camera.rotation.order="YXZ";

    camera.rotation.y=
        THREE.MathUtils.degToRad(
            -alpha
        );

    camera.rotation.x=
        THREE.MathUtils.degToRad(
            beta-90
        )*0.3;

    camera.rotation.z=
        THREE.MathUtils.degToRad(
            gamma
        )*0.1;

    renderer.render(
        scene,
        camera
    );
}

animate();

/////////////////////////////////////////////////
// RESIZE
/////////////////////////////////////////////////

window.addEventListener(
"resize",
()=>{

    camera.aspect=
        window.innerWidth/
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});
