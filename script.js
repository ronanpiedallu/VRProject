//////////////////////////////////////////////////
// CAMERA
//////////////////////////////////////////////////

navigator.mediaDevices.getUserMedia({
    video:{
        facingMode:"environment"
    },
    audio:false
})
.then(stream=>{
    document.getElementById("camera").srcObject = stream;
})
.catch(console.error);

//////////////////////////////////////////////////
// SYSTEME FENETRES
//////////////////////////////////////////////////

const hud = document.getElementById("hud");

let windowCounter = 0;

function saveLayout(){

    const data = [];

    document.querySelectorAll(".window")
    .forEach(win=>{

        data.push({

            id:win.dataset.id,

            type:win.dataset.type,

            left:win.style.left,

            top:win.style.top,

            width:win.style.width,

            height:win.style.height,

            text:
                win.querySelector("textarea")
                ?.value || ""

        });

    });

    localStorage.setItem(
        "arLayout",
        JSON.stringify(data)
    );
}

function createWindow(type,data={}){

    const win =
    document.createElement("div");

    win.className = "window";

    win.dataset.type = type;

    win.dataset.id =
        data.id || (++windowCounter);

    win.style.left =
        data.left || "100px";

    win.style.top =
        data.top || "100px";

    win.style.width =
        data.width || "300px";

    win.style.height =
        data.height || "200px";

    //////////////////////////////////////////////////

    const title =
    document.createElement("div");

    title.className = "titlebar";

    title.textContent =
        type.toUpperCase();

    //////////////////////////////////////////////////

    const content =
    document.createElement("div");

    content.className = "content";

    //////////////////////////////////////////////////

    if(type==="clock"){

        const clock =
        document.createElement("div");

        clock.style.fontSize="32px";

        content.appendChild(clock);

        setInterval(()=>{

            clock.textContent =
            new Date()
            .toLocaleTimeString();

        },1000);
    }

    //////////////////////////////////////////////////

    if(type==="notes"){

        const textarea =
        document.createElement(
            "textarea"
        );

        textarea.value =
            data.text || "";

        textarea.addEventListener(
            "input",
            saveLayout
        );

        content.appendChild(
            textarea
        );
    }

    //////////////////////////////////////////////////

    const resize =
    document.createElement("div");

    resize.className =
        "resize";

    //////////////////////////////////////////////////

    win.appendChild(title);
    win.appendChild(content);
    win.appendChild(resize);

    hud.appendChild(win);

    //////////////////////////////////////////////////
    // DRAG
    //////////////////////////////////////////////////

    let drag=false;
    let offsetX=0;
    let offsetY=0;

    title.addEventListener(
        "pointerdown",
        e=>{

            drag=true;

            offsetX =
            e.clientX -
            win.offsetLeft;

            offsetY =
            e.clientY -
            win.offsetTop;
        }
    );

    window.addEventListener(
        "pointermove",
        e=>{

            if(!drag) return;

            win.style.left =
            (e.clientX-offsetX)+"px";

            win.style.top =
            (e.clientY-offsetY)+"px";
        }
    );

    window.addEventListener(
        "pointerup",
        ()=>{
            drag=false;
            saveLayout();
        }
    );

    //////////////////////////////////////////////////
    // RESIZE
    //////////////////////////////////////////////////

    let resizing=false;

    resize.addEventListener(
        "pointerdown",
        ()=>{

            resizing=true;
        }
    );

    window.addEventListener(
        "pointermove",
        e=>{

            if(!resizing) return;

            win.style.width =
            e.clientX -
            win.offsetLeft +
            "px";

            win.style.height =
            e.clientY -
            win.offsetTop +
            "px";
        }
    );

    window.addEventListener(
        "pointerup",
        ()=>{
            resizing=false;
            saveLayout();
        }
    );

    saveLayout();
}

//////////////////////////////////////////////////
// MENU
//////////////////////////////////////////////////

const menu =
document.getElementById("menu");

document
.getElementById("addButton")
.addEventListener(
"click",
()=>{

    menu.classList.toggle(
        "hidden"
    );
});

menu
.querySelectorAll("button")
.forEach(button=>{

    button.addEventListener(
        "click",
        ()=>{

            createWindow(
                button.dataset.type
            );

            menu.classList.add(
                "hidden"
            );
        }
    );
});

//////////////////////////////////////////////////
// RESTAURATION
//////////////////////////////////////////////////

const saved =
JSON.parse(
localStorage.getItem(
    "arLayout"
) || "[]"
);

saved.forEach(data=>{

    createWindow(
        data.type,
        data
    );
});

//////////////////////////////////////////////////
// FENETRES PAR DEFAUT
//////////////////////////////////////////////////

if(saved.length===0){

    createWindow("clock");

    createWindow(
        "notes",
        {
            left:"450px",
            top:"120px"
        }
    );
}
