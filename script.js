import * as THREE from "three";

//////////////////////////////////////////////////
// CAMERA VIDEO
//////////////////////////////////////////////////

const video = document.getElementById("camera");

navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: {
            ideal: "environment"
        }
    },
    audio: false
})
.then(stream => {
    video.srcObject = stream;
})
.catch(err => {
    alert(err.message);
});

//////////////////////////////////////////////////
// THREE.JS
//////////////////////////////////////////////////

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    100
);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document
    .getElementById("container")
    .appendChild(renderer.domElement);

//////////////////////////////////////////////////
// PIVOT TÊTE
//////////////////////////////////////////////////

const head = new THREE.Group();
scene.add(head);

//////////////////////////////////////////////////
// FENÊTRE AR
//////////////////////////////////////////////////

const texture = new THREE.TextureLoader().load(
    "assets/image.png"
);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1.2),
    new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    })
);

plane.position.set(0, 0, -5);

scene.add(plane);

//////////////////////////////////////////////////
// ORIENTATION
//////////////////////////////////////////////////

let referenceQuaternion = null;

const currentQuaternion =
    new THREE.Quaternion();

const correctionQuaternion =
    new THREE.Quaternion();

correctionQuaternion.setFromEuler(
    new THREE.Euler(
        -Math.PI / 2,
        0,
        0,
        "YXZ"
    )
);

function handleOrientation(event) {

    const alpha =
        THREE.MathUtils.degToRad(
            event.alpha || 0
        );

    const beta =
        THREE.MathUtils.degToRad(
            event.beta || 0
        );

    const gamma =
        THREE.MathUtils.degToRad(
            event.gamma || 0
        );

    const euler =
        new THREE.Euler(
            beta,
            alpha,
            -gamma,
            "YXZ"
        );

    currentQuaternion
        .setFromEuler(euler);

    currentQuaternion.multiply(
        correctionQuaternion
    );

    if (!referenceQuaternion) {

        referenceQuaternion =
            currentQuaternion.clone();

        return;
    }

    const relative =
        referenceQuaternion
            .clone()
            .invert()
            .multiply(
                currentQuaternion
            );

    head.quaternion.copy(
        relative
    );
}

//////////////////////////////////////////////////
// ACTIVATION CAPTEURS
//////////////////////////////////////////////////

async function enableSensors() {

    try {

        if (
            typeof DeviceOrientationEvent !== "undefined" &&
            typeof DeviceOrientationEvent.requestPermission === "function"
        ) {

            const permission =
                await DeviceOrientationEvent.requestPermission();

            if (permission !== "granted") {
                return;
            }
        }

        window.addEventListener(
            "deviceorientation",
            handleOrientation,
            true
        );

    } catch (e) {

        console.error(e);

    }
}

document.body.addEventListener(
    "click",
    enableSensors,
    { once: true }
);

//////////////////////////////////////////////////
// RECENTRAGE
//////////////////////////////////////////////////

function recenter() {

    referenceQuaternion =
        currentQuaternion.clone();

}

let lastTap = 0;

document.addEventListener(
    "touchend",
    () => {

        const now = Date.now();

        if (
            now - lastTap < 300
        ) {
            recenter();
        }

        lastTap = now;
    }
);

//////////////////////////////////////////////////
// ANIMATION
//////////////////////////////////////////////////

function animate() {

    requestAnimationFrame(
        animate
    );

    camera.position.set(
        0,
        0,
        0
    );

    camera.lookAt(
        0,
        0,
        -1
    );

    renderer.render(
        scene,
        camera
    );
}

animate();

//////////////////////////////////////////////////
// RESIZE
//////////////////////////////////////////////////

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
