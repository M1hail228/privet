const rows = 3;
const cols = 3;

const puzzle = document.getElementById("puzzle");
const winScreen = document.getElementById("winScreen");
const buttons = document.querySelectorAll("[data-dir]");

const stage2 = document.getElementById("stage2");
const finalStage = document.getElementById("finalStage");
const bigPhoto = document.getElementById("bigPhoto");
const crack = document.getElementById("crack");

const bgMusic = document.getElementById("bgMusic");
const music2 = document.getElementById("music2");
const music3 = document.getElementById("music3");

let tiles = [];
let emptyTile;
let selectedTile = null;
let hits = 0;

/* ===== Музыка при первом клике ===== */
document.body.addEventListener("click", () => {
    bgMusic.play().catch(()=>{});
}, { once:true });

/* ===== Создание пазла ===== */
function createPuzzle() {
    for (let i = 0; i < rows*cols-1; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";

        const x = i % cols;
        const y = Math.floor(i / cols);

        tile.style.backgroundImage = "url(image.jpg)";
        tile.style.backgroundPosition = `${(x/(cols-1))*100}% ${(y/(rows-1))*100}%`;

        tile.dataset.correct = i;

        tile.onclick = () => select(tile);

        tiles.push(tile);
    }

    emptyTile = document.createElement("div");
    emptyTile.className = "tile empty";
    tiles.push(emptyTile);

    smartShuffle();
    render();
}

/* ===== Выбор плитки ===== */
function select(tile){
    if(tile === emptyTile) return;
    selectedTile = tile;
    render();
}

/* ===== Движение ===== */
buttons.forEach(btn => {
    btn.onclick = () => move(btn.dataset.dir);
});

function move(dir){
    if(!selectedTile) return;

    const i = tiles.indexOf(selectedTile);
    const empty = tiles.indexOf(emptyTile);

    let target = null;

    if(dir === "up") target = i - cols;
    if(dir === "down") target = i + cols;
    if(dir === "left") target = i - 1;
    if(dir === "right") target = i + 1;

    if(target === empty){
        [tiles[i], tiles[empty]] = [tiles[empty], tiles[i]];
        render();
        checkWin();
    }
}

/* ===== Рендер ===== */
function render(){
    puzzle.innerHTML = "";
    tiles.forEach(t=>{
        t.classList.toggle("active", t===selectedTile);
        puzzle.appendChild(t);
    });
}

/* ===== Перемешивание ===== */
function smartShuffle(){
    for(let k=0;k<15;k++){
        const empty = tiles.indexOf(emptyTile);
        const neighbors = getNeighbors(empty);
        const rand = neighbors[Math.floor(Math.random()*neighbors.length)];
        [tiles[empty], tiles[rand]] = [tiles[rand], tiles[empty]];
    }
}

function getNeighbors(i){
    const n=[];
    const r = Math.floor(i / cols);
    const c = i % cols;

    if(r>0) n.push(i-cols);
    if(r<rows-1) n.push(i+cols);
    if(c>0) n.push(i-1);
    if(c<cols-1) n.push(i+1);

    return n;
}

/* ===== Проверка победы ===== */
let stage2Started = false; // новая переменная

function checkWin(){
    for(let i=0;i<tiles.length-1;i++){
        if(+tiles[i].dataset.correct !== i) return; // ещё не выиграли
    }

    // показываем победный экран
    winScreen.classList.remove("hidden");

    // запускаем Stage 2 только один раз
    if(!stage2Started){
        stage2Started = true;
        setTimeout(startStage2, 800); // небольшой таймаут 0.8с для плавности
    }
}


/* ===== Stage 2 интерактив ===== */
function startStage2(){
    bgMusic.pause();
    music2.play();
    stage2.classList.remove("hidden");
}

bigPhoto.onclick = () => {
    hits++;
    crack.classList.remove("hidden");
    crack.style.opacity = 0.3 + hits*0.07;

    if(hits >= 10){
        stage2.classList.add("hidden");
        music2.pause();
        music3.play();
        finalStage.classList.remove("hidden");
    }
};

/* ===== Старт игры ===== */
createPuzzle();
