async function startCamera() {
    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                    ideal: "environment"
                },

                width: { ideal: 1920 },
                height: { ideal: 1080 },

                frameRate: {
                    ideal: 60
                }
            },

            audio: false
        });

        const camera = document.getElementById("camera");
        camera.srcObject = stream;

    } catch (error) {

        alert(
            "Impossible d'accéder à la caméra : " +
            error.message
        );
    }
}

startCamera();