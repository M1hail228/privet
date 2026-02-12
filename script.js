const rows = 4;
const cols = 3;

const puzzle = document.getElementById("puzzle");
const winScreen = document.getElementById("winScreen");
const buttons = document.querySelectorAll("[data-dir]");

let tiles = [];        // массив DOM-элементов
let emptyTile;         // ссылка на пустую клетку
let selectedTile = null;


/* ===================== СОЗДАНИЕ ===================== */

function createPuzzle() {
    const total = rows * cols;

    for (let i = 0; i < total - 1; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";

        const x = i % cols;
        const y = Math.floor(i / cols);

        tile.style.backgroundImage = "url('image.jpg')";
        tile.style.backgroundSize = "300% 400%";
        tile.style.backgroundPosition =
            `${(x/(cols-1))*100}% ${(y/(rows-1))*100}%`;

        tile.dataset.correct = i; // правильная позиция

        tile.onclick = () => select(tile);

        tiles.push(tile);
    }

    emptyTile = document.createElement("div");
    emptyTile.className = "tile empty";

    tiles.push(emptyTile);

    smartShuffle();
    render();
}


/* ===================== ВЫБОР ===================== */

function select(tile) {
    if (tile === emptyTile) return;

    selectedTile = tile;
    render();
}


/* ===================== ДВИЖЕНИЕ ===================== */

buttons.forEach(btn =>
    btn.onclick = () => {
        if (!selectedTile) return;
        move(btn.dataset.dir);
    }
);


function move(dir) {
    const i = tiles.indexOf(selectedTile);
    const empty = tiles.indexOf(emptyTile);

    const row = Math.floor(i / cols);
    const col = i % cols;

    let target = null;

    if (dir === "up") target = i - cols;
    if (dir === "down") target = i + cols;
    if (dir === "left") target = i - 1;
    if (dir === "right") target = i + 1;

    // можно двигать только если цель = пустая
    if (target === empty) {
        [tiles[i], tiles[empty]] = [tiles[empty], tiles[i]];
        render();
        checkWin();
    }
}


/* ===================== РЕНДЕР ===================== */

function render() {
    puzzle.innerHTML = "";

    tiles.forEach(t => {
        t.classList.toggle("active", t === selectedTile);
        puzzle.appendChild(t);
    });
}


/* ===================== ПЕРЕМЕШИВАНИЕ ===================== */

function smartShuffle() {
    for (let k = 0; k < 150; k++) {
        const empty = tiles.indexOf(emptyTile);
        const neighbors = getNeighbors(empty);
        const rand = neighbors[Math.floor(Math.random()*neighbors.length)];

        [tiles[empty], tiles[rand]] = [tiles[rand], tiles[empty]];
    }
}

function getNeighbors(i) {
    const n = [];
    const row = Math.floor(i / cols);
    const col = i % cols;

    if (row > 0) n.push(i - cols);
    if (row < rows-1) n.push(i + cols);
    if (col > 0) n.push(i - 1);
    if (col < cols-1) n.push(i + 1);

    return n;
}


/* ===================== ПОБЕДА ===================== */

function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (+tiles[i].dataset.correct !== i) return;
    }

    winScreen.classList.remove("hidden");
}


/* ===================== СТАРТ ===================== */

createPuzzle();
