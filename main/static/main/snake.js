
let score = 0;
var ctx = null;
var mainfont = "fantasy";

class vector {
    x = 0;
    y = 0;
    constructor(x, y) {
        if (x === null || x === undefined || y === null || y === undefined) {
            this.x = 0;
            this.y = 0;
            return;
        }
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }

    static sum(vec1, vec2) {
        return new vector(vec1.x + vec2.x, vec1.y + vec2.y);
    }
}

var mainscreen = {
    xsiz: 1000,
    ysiz: 1000,

}
var images = {
    snake: "static/main/snake.png",
    apple: "static/main/apple.png",
}


var loadsceenparams = {
    items_to_load: 2,
    progress_bar_posy: 70,
    progress_bar_height: 20,
}

var game_params = {
    controls_setting: {
        up: ["KeyW", "ArrowUp"],
        down: ["KeyS", "ArrowDown"],
        left: ["KeyA", "ArrowLeft"],
        right: ["KeyD", "ArrowRight"],
    },
    gridsizx: 16,
    gridsizy: 16,
    draw_fps: 5,
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
var clk_timer_id = null;
function set_loop_fps(fps) {
    if (clk_timer_id !== null && clk_timer_id !== undefined) {
        clearInterval(clk_timer_id);
        clk_timer_id = null;
    }
    clk_timer_id = setInterval(loop, 1000 / fps);

}

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
        timer_id = setTimeout(load_update, 8000, true);


    } else {
        for (i of Object.keys(images)) {
            if (!(images[i] instanceof Image)) { images[i] = new Image(); }
        }

        console.log("images load");
        set_loop_fps(15);
    }
}

class state_base {
    update() {
    }
    key_eventer(event) {
    }
}


class wait_button extends state_base {
    constructor() {
        super();
        set_loop_fps(15);
    }

    update() {
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000"
        ctx.fillText("нажмите любую кнопку", mainscreen.xsiz / 2, mainscreen.ysiz / 2);

    }
    key_eventer(event) {
        stateclass = new game();


    }
    
}

var grid = [] // contains objects 

class grid_object_base{
    type = '';
    img = null;
}
class grid_snake extends grid_object_base {
    type = 'snake';
    img = images.snake;
}
class grid_apple extends grid_object_base {
    type = 'apple';
    img = images.apple;
}

function get_grid_cell(x, y) {
    if (y || typeof (x) === 'number') {
        return grid[x][y];
    } else {
        return grid[x.x][x.y];
    }
}
function set_grid_cell(x, y, val) {
    if (val || typeof(x) === 'number') {
        grid[x][y] = val;
    } else {
        grid[x.x][x.y] = y;
    }
}

function move_to(dir) { // функция для управления направлением змейки
    if (stateclass instanceof game) {
        stateclass.key_eventer(dir);
    }
}


class game extends state_base{
    constructor() {
        super();
        for (var i = 0; i < game_params.gridsizx; i++) {
            grid[i] = [];
            
        }
        let x = Math.floor(game_params.gridsizx / 2)
        let y = Math.floor(game_params.gridsizy / 2)
        this.snake = [new vector(x, y), new vector(x, y - 1), new vector(x, y - 2)]
        this.snake_move = new vector(0, 1);
        for (var i = 0; i < this.snake.length; i++) {
            set_grid_cell(this.snake[i].x, this.snake[i].y, new grid_snake());
        }
        this.snake_pref_move = new vector(new vector(this.snake_move.x, this.snake_move.y))

        this.apple_pos = new vector(0, 0);

        set_loop_fps(game_params.draw_fps);
    }
    snake_step() {
        if (this.snake[0].x + this.snake_move.x < 0 || this.snake[0].x + this.snake_move.x >= game_params.gridsizx) return false;
        if (this.snake[0].y + this.snake_move.y < 0 || this.snake[0].y + this.snake_move.y >= game_params.gridsizy) return false;

        if (get_grid_cell(vector.sum(this.snake[0], this.snake_move))) {
            if (get_grid_cell(vector.sum(this.snake[0], this.snake_move)).type === 'apple') {
                set_grid_cell(vector.sum(this.snake[0], this.snake_move), new grid_snake());
                this.snake.unshift(vector.sum(this.snake[0], this.snake_move))
                EatApple();
                return true;
            } else {
                return false;
            }
        }

        let x = this.snake[0].x;
        let y = this.snake[0].y;
        let sx = 0;
        let sy = 0;
        this.snake[0] = vector.sum(this.snake[0], this.snake_move)
        set_grid_cell(this.snake[0], get_grid_cell(x, y));
        set_grid_cell(x, y, null);
        for (var i = 1; i < this.snake.length; i++) {
            sx = this.snake[i].x;
            sy = this.snake[i].y;
            this.snake[i].x = x;
            this.snake[i].y = y;
            x = sx;
            y = sy;
            set_grid_cell(this.snake[i], get_grid_cell(x, y));
            set_grid_cell(x, y, null);
        }

        this.snake_pref_move.set(this.snake_move.x, this.snake_move.y);

        
        return true;
    }

    snake_set_dir(dir) {
        switch (dir) {
            case 'right':
                if (this.snake_pref_move.x !== -1) this.snake_move.set(1, 0);
                break;
            case 'left':
                if (this.snake_pref_move.x !== 1) this.snake_move.set(-1, 0);
                break;
            case 'down':
                if (this.snake_pref_move.y !== -1) this.snake_move.set(0, 1);
                break;
            case 'up':
            default:
                if (this.snake_pref_move.y !== 1) this.snake_move.set(0, -1);
        }
    }

    gen_apple() {
        let c = null;
        for (var i = 0; i < 15; i++) {
            this.apple_pos.x = Math.round(Math.random() * (game_params.gridsizx - 1));
            this.apple_pos.y = Math.round(Math.random() * (game_params.gridsizy - 1));
            c = get_grid_cell(this.apple_pos);
            if (c === null || c === undefined) {
                set_grid_cell(this.apple_pos, new grid_apple());
                return true;
            }
        }
        for (var y = 0; y < game_params.gridsizy; y++) {
            for (var x = 0; x < game_params.gridsizx; x++) {
                this.apple_pos.set(x, y);
                c = get_grid_cell(this.apple_pos);
                if (c === null || c === undefined) {
                    set_grid_cell(this.apple_pos, new grid_apple());
                    return true;
                }
            }
        }
        return false;
    }

    update() {
        let cellsizex = mainscreen.xsiz / game_params.gridsizx;
        let cellsizey = mainscreen.ysiz / game_params.gridsizy;
        let img = null;
        for (var x = 0; x < game_params.gridsizx; x++) {
            for (var y = 0; y < game_params.gridsizy; y++) {
                if (grid[x][y]) {
                    img = grid[x][y].img;
                    ctx.drawImage(img, cellsizex * x, cellsizey * y + cellsizey - ((cellsizex / img.width) * img.height), cellsizex, (cellsizex / img.width) * img.height);
                }
            }
        }

        if (!this.snake_step()) {
            this.game_over();
            return;
        } else {
            let c = get_grid_cell(this.apple_pos);
            if (!(c !== null && c !== undefined && c.type === 'apple')) {
                if (!this.gen_apple()) {
                    this.game_over();
                    return;
                }


            }

        }


    }
    key_eventer(event) {
        if (event instanceof KeyboardEvent) {
            if (game_params.controls_setting.up.includes(event.code)) {
                this.snake_set_dir('up');
            } else if (game_params.controls_setting.down.includes(event.code)) {
                this.snake_set_dir('down');
            } else if (game_params.controls_setting.left.includes(event.code)) {
                this.snake_set_dir('left');
            } else if (game_params.controls_setting.right.includes(event.code)) {
                this.snake_set_dir('right');
            }

        }

    }
    game_over() {
        //stateclass = new wait_button();
        stateclass = null;
        set_loop_fps(1);
        sendData('sendScore');
    }

}


var stateclass = null;
function loop() {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, mainscreen.xsiz, mainscreen.ysiz);
    ctx.strokeRect(0, 0, mainscreen.xsiz, mainscreen.ysiz);
    if (!stateclass) { stateclass = new wait_button(); }
    stateclass.update();


}

function buttons_listener(event) {
    if (stateclass) { stateclass.key_eventer(event);}
}

document.addEventListener("keydown", buttons_listener);

main();
