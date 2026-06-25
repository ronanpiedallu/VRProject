//////////////////////////////////////////////////
// CAMERA
//////////////////////////////////////////////////

navigator.mediaDevices
.getUserMedia({

    video:{
        facingMode:{
            ideal:"environment"
        }
    },

    audio:false

})
.then(stream=>{

    document
    .getElementById("camera")
    .srcObject=stream;

});

//////////////////////////////////////////////////
// HORLOGE
//////////////////////////////////////////////////

setInterval(()=>{

    document
    .getElementById("clockText")
    .textContent=

    new Date()
    .toLocaleTimeString();

},1000);

//////////////////////////////////////////////////
// ORIENTATION
//////////////////////////////////////////////////

let referenceYaw=null;

window.addEventListener(

    "deviceorientation",

    event=>{

        const yaw=
            event.alpha||0;

        if(
            referenceYaw===null
        ){

            referenceYaw=yaw;

        }

        const delta=
            yaw-referenceYaw;

        const windows=
            document
            .querySelectorAll(
                ".window"
            );

        windows.forEach(
            (window,index)=>{

                const depth=
                    (index+1)*0.4;

                const x=
                    Math.sin(
                        delta*
                        Math.PI/
                        180
                    )
                    *
                    300
                    *
                    depth;

                window.style.transform=
                    `
                    translateX(${x}px)
                    `;
            }
        );

    }

);
