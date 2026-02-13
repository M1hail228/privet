const rows = 3;
const cols = 3;

const puzzle = document.getElementById("puzzle");
const winScreen = document.getElementById("winScreen");
const buttons = document.querySelectorAll("[data-dir]");

const stage2 = document.getElementById("stage2");
const finalStage = document.getElementById("finalStage");
const bigPhoto = document.getElementById("bigPhoto");

const bgMusic = document.getElementById("bgMusic");
const music2 = document.getElementById("music2");
const music3 = document.getElementById("music3");
const hitSound = document.getElementById("music4");

let tiles = [];
let emptyTile;
let selectedTile = null;

let hits = 0;
let stage2Started = false;


/* ========= музыка при первом клике ========= */
document.body.addEventListener("click", () => {
    bgMusic.play().catch(()=>{});
}, { once:true });


/* ========= создание пазла ========= */
function createPuzzle() {

    for(let i=0;i<rows*cols-1;i++){

        const tile = document.createElement("div");
        tile.className = "tile";

        const x = i % cols;
        const y = Math.floor(i / cols);

        tile.style.backgroundImage = "url(image.jpg)";
        tile.style.backgroundPosition =
            `${(x/(cols-1))*100}% ${(y/(rows-1))*100}%`;

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


/* ========= выбор ========= */
function select(tile){
    if(tile === emptyTile) return;
    selectedTile = tile;
    render();
}


/* ========= движение ========= */
buttons.forEach(btn=>{
    btn.onclick = () => move(btn.dataset.dir);
});


function move(dir){

    if(!selectedTile) return;

    const i = tiles.indexOf(selectedTile);
    const empty = tiles.indexOf(emptyTile);

    let target = null;

    if(dir==="up") target = i-cols;
    if(dir==="down") target = i+cols;
    if(dir==="left") target = i-1;
    if(dir==="right") target = i+1;

    if(target === empty){
        [tiles[i], tiles[empty]] = [tiles[empty], tiles[i]];
        render();
        checkWin();
    }
}


/* ========= рендер ========= */
function render(){
    puzzle.innerHTML = "";
    tiles.forEach(t=>{
        t.classList.toggle("active", t===selectedTile);
        puzzle.appendChild(t);
    });
}


/* ========= shuffle ========= */
function smartShuffle(){
    do{
        for(let k=0;k<30;k++){
            const empty = tiles.indexOf(emptyTile);
            const neighbors = getNeighbors(empty);
            const rand = neighbors[Math.floor(Math.random()*neighbors.length)];
            [tiles[empty], tiles[rand]] = [tiles[rand], tiles[empty]];
        }
    }while(isSolved());
}


function getNeighbors(i){
    const n=[];
    const r=Math.floor(i/cols);
    const c=i%cols;

    if(r>0) n.push(i-cols);
    if(r<rows-1) n.push(i+cols);
    if(c>0) n.push(i-1);
    if(c<cols-1) n.push(i+1);

    return n;
}


function isSolved(){
    for(let i=0;i<tiles.length-1;i++){
        if(+tiles[i].dataset.correct !== i) return false;
    }
    return true;
}


/* ========= победа ========= */
function checkWin(){

    if(!isSolved()) return;

    winScreen.classList.remove("hidden");

    if(!stage2Started){
        stage2Started = true;
        setTimeout(startStage2, 700);
    }
}


/* ========= stage 2 ========= */
function startStage2(){
    bgMusic.pause();
    music2.play();
    stage2.classList.remove("hidden");
}

    
/* ========= удары ========= */
bigPhoto.onclick = () => {

    hits++;

    // 🔥 звук удара
    hitSound.currentTime = 0;
    hitSound.play();

    if(hits >= 10){
        stage2.classList.add("hidden");
        music2.pause();
        music3.play();
        finalStage.classList.remove("hidden");
    }
};


/* ========= старт ========= */
createPuzzle();
