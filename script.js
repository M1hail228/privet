const rows = 4;
const cols = 3;

const puzzle = document.getElementById("puzzle");
const winScreen = document.getElementById("winScreen");

let tiles = [];
let emptyIndex;

function createPuzzle() {
    tiles = [];

    for (let i = 0; i < rows * cols - 1; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";

        const x = i % cols;
        const y = Math.floor(i / cols);

        tile.style.backgroundImage = "url('image.jpg')";
        tile.style.backgroundPosition =
            `${(x / (cols - 1)) * 100}% ${(y / (rows - 1)) * 100}%`;

        tile.dataset.index = i;

        // ✅ только тап/клик
        tile.addEventListener("pointerdown", () => moveTile(i));

        tiles.push(tile);
    }

    const empty = document.createElement("div");
    empty.className = "tile empty";

    tiles.push(empty);
    emptyIndex = tiles.length - 1;

    smartShuffle();
    render();
}

/* ---------- гарантированно решаемое перемешивание ---------- */
function smartShuffle() {
    for (let i = 0; i < 150; i++) {
        const neighbors = getNeighbors(emptyIndex);
        const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
        swap(rand, emptyIndex);
        emptyIndex = rand;
    }
}

/* ---------- соседние клетки ---------- */
function getNeighbors(i) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    const neighbors = [];

    if (row > 0) neighbors.push(i - cols);
    if (row < rows - 1) neighbors.push(i + cols);
    if (col > 0) neighbors.push(i - 1);
    if (col < cols - 1) neighbors.push(i + 1);

    return neighbors;
}

function swap(a, b) {
    [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
}

function render() {
    puzzle.innerHTML = "";
    tiles.forEach(t => puzzle.appendChild(t));
}

/* ---------- движение ---------- */
function moveTile(i) {
    if (getNeighbors(emptyIndex).includes(i)) {
        swap(i, emptyIndex);
        emptyIndex = i;

        render();
        checkWin();
    }
}

/* ---------- проверка победы ---------- */
function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (+tiles[i].dataset.index !== i) return;
    }

    winScreen.classList.remove("hidden");
}

createPuzzle();
