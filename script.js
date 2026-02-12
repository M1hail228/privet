const rows = 4;
const cols = 3;

const puzzle = document.getElementById("puzzle");
const winScreen = document.getElementById("winScreen");
const buttons = document.querySelectorAll("button[data-dir]");

let tiles = [];
let emptyIndex;
let selectedIndex = null;

/* ---------- создание ---------- */
function createPuzzle() {
    for (let i = 0; i < rows * cols - 1; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";

        const x = i % cols;
        const y = Math.floor(i / cols);

        tile.style.backgroundImage = "url('image.jpg')";
        tile.style.backgroundPosition =
            `${(x/(cols-1))*100}% ${(y/(rows-1))*100}%`;

        tile.dataset.index = i;

        tile.addEventListener("click", () => selectTile(i));

        tiles.push(tile);
    }

    const empty = document.createElement("div");
    empty.className = "tile empty";
    tiles.push(empty);

    emptyIndex = tiles.length - 1;

    smartShuffle();
    render();
}

/* ---------- выбор плитки ---------- */
function selectTile(i) {
    selectedIndex = i;
    render();
}

/* ---------- движение через стрелки ---------- */
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (selectedIndex === null) return;
        move(selectedIndex, btn.dataset.dir);
    });
});

function move(i, dir) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    let target = null;

    if (dir === "up") target = i - cols;
    if (dir === "down") target = i + cols;
    if (dir === "left") target = i - 1;
    if (dir === "right") target = i + 1;

    if (target === emptyIndex) {
        swap(i, emptyIndex);
        emptyIndex = i;
        selectedIndex = target;

        render();
        checkWin();
    }
}

/* ---------- вспомогательные ---------- */
function swap(a, b) {
    [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
}

function render() {
    puzzle.innerHTML = "";

    tiles.forEach((t, i) => {
        if (i === selectedIndex) t.classList.add("active");
        else t.classList.remove("active");

        puzzle.appendChild(t);
    });
}

/* ---------- перемешивание ---------- */
function smartShuffle() {
    for (let i = 0; i < 150; i++) {
        const neighbors = getNeighbors(emptyIndex);
        const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
        swap(rand, emptyIndex);
        emptyIndex = rand;
    }
}

function getNeighbors(i) {
    const n = [];
    const row = Math.floor(i / cols);
    const col = i % cols;

    if (row > 0) n.push(i - cols);
    if (row < rows - 1) n.push(i + cols);
    if (col > 0) n.push(i - 1);
    if (col < cols - 1) n.push(i + 1);

    return n;
}

/* ---------- победа ---------- */
function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (+tiles[i].dataset.index !== i) return;
    }

    winScreen.classList.remove("hidden");
}

createPuzzle();
