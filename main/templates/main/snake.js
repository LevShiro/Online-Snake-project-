
let score = 0;
var ctx = null;
var mainfont = "fantasy";

class vector {
    x = 0;
    y = 0;
    constructor(x, y) {
        if (!x || !y) {
            this.x = 0;
            this.y = 0;
            return;
        }
        this.x = x;
        this.y = y;
    }
}

var mainscreen = {
    xsiz: 1000,
    ysiz: 1000,

}
var images = {
    snake: "snake.png",
    apple: "apple.png",
}


var loadsceenparams = {
    items_to_load: 2,
    progress_bar_posy: 70,
    progress_bar_height: 20,
}

var game_params = {
    controls_setting: {
        up: "KeyW",
        down: "KeyS",
        left: "KeyA",
        right: "KeyD",
    },
    gridsizx: 32,
    gridsizy: 32,
    draw_fps: 12,
}

function EatApple() {
    score+=1;
    document.getElementById("score").textContent= score
    console.log(score)
}
const sendData = async (url)=>{
    const responce = await fetch(url,{
        method:'POST',
        headers: {'X-CSRFToken': Cookies.get('csrftoken')},
        body:JSON.stringify({
            score:score,
        }),
    })
    if (!responce.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${responce}`)
    }
    console.log('fffff',score)
    score=0
    document.getElementById("score").textContent= score
    $('#nickname-score').load(document.URL +  ' #nickname-score');
}

function main() {
    ctx = document.getElementById("wrapper_play")
    if (!ctx) {
        console.error("cant find canvas with id === wrapper_play")
        return;
    }
    mainscreen.xsiz = ctx.width;
    mainscreen.ysiz = ctx.height
    ctx = ctx.getContext("2d");
    if (!ctx) {
        console.error("cant find canvas with id === wrapper_play")
        return;
    }
    ctx.strokeRect(0, 0, mainscreen.xsiz, mainscreen.ysiz)
    function a(imgc, ic) {
        return function () { images[ic] = imgc; load_update(); }
    }
    for (i in images) {
        let img = new Image();
        img.src = images[i];
        img.onload = a(img, i);

    }

    load_update();
}
var timer_id = null;
var skipped = 0;
function load_update(skip) {
    let vec = new vector();
    vec.y = (mainscreen.ysiz / 100) * loadsceenparams.progress_bar_posy;
    vec.x = 10;
    let summar_elems = 0;
    let loadet_elems = 0;
    for (i in images) {
        summar_elems += 1;
        if (!(typeof (images[i]) === "string")) {
            loadet_elems += 1;
        }
    }
    if (skip) { skipped += 1; loadet_elems += skipped; console.log("skipped due timeout")}
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, mainscreen.xsiz, mainscreen.ysiz);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(vec.x, vec.y, mainscreen.xsiz - 10 - vec.x, 20);
    ctx.fillStyle = "#000000"
    ctx.fillRect(vec.x, vec.y, (mainscreen.xsiz - 10 - vec.x) * (loadet_elems / summar_elems), 20);
    ctx.font = mainfont;
    ctx.textAlign = "center";
    ctx.fillText(loadet_elems + " / " + summar_elems, mainscreen.xsiz / 2, vec.y - 20);
    if (timer_id) {
        clearTimeout(timer_id, 0);
    }
    if (loadet_elems < summar_elems) {
        timer_id = setTimeout(load_update, 2000, true);


    } else {
        console.log("images load");
        setInterval(loop, 1000 / game_params.draw_fps);



    }
}

class state_base {
    update() {
    }
    eventer(event) {
    }
}


class wait_button extends state_base {
    update() {
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000"
        ctx.fillText("нажмите любую кнопку", mainscreen.xsiz / 2, mainscreen.ysiz / 2);

    }
    eventer(event) {
        stateclass = new game();


    }
    
}

class game extends state_base{

    update() {
        let cellsizex = mainscreen.xsiz / game_params.gridsizx;
        let cellsizey = mainscreen.ysiz / game_params.gridsizy;
        for (var x = 0; x < game_params.gridsizx; x++) {
            for (var y = 0; y < game_params.gridsizy; y++) {
                ctx.fillStyle = "#00ff00";
                ctx.drawImage(images.snake, cellsizex * x, cellsizey * y, cellsizex, cellsizey);
                    
            }
        }

    }
}


var stateclass = null;
function loop() {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, mainscreen.xsiz, mainscreen.ysiz);
    if (!stateclass) { stateclass = new wait_button(); }
    stateclass.update();


}

function buttons_listener(event) {
    if (stateclass) { stateclass.eventer(event);}
}

document.addEventListener("keydown", buttons_listener);

main();
