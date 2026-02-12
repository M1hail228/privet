const rows = 4;
const cols = 3;
const puzzle = document.getElementById("puzzle");
const winScreen = document.getElementById("winScreen");

let tiles = [];
let emptyIndex;

function createPuzzle() {
    for (let i = 0; i < rows * cols - 1; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");

        const x = i % cols;
        const y = Math.floor(i / cols);

        tile.style.backgroundImage = "url('image.jpg')";
        tile.style.backgroundPosition = `${(x / (cols - 1)) * 100}% ${(y / (rows - 1)) * 100}%`;

        tile.dataset.index = i;
        tile.addEventListener("click", () => moveTile(i));

        tiles.push(tile);
    }

    const empty = document.createElement("div");
    empty.classList.add("tile", "empty");

    tiles.push(empty);
    emptyIndex = tiles.length - 1;

    shuffle();

    render();
}

function shuffle() {
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
}

function render() {
    puzzle.innerHTML = "";
    tiles.forEach(tile => puzzle.appendChild(tile));
}

function moveTile(i) {
    const emptyPos = emptyIndex;
    const row = Math.floor(i / cols);
    const col = i % cols;
    const emptyRow = Math.floor(emptyPos / cols);
    const emptyCol = emptyPos % cols;

    const isNeighbor =
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isNeighbor) {
        [tiles[i], tiles[emptyPos]] = [tiles[emptyPos], tiles[i]];
        emptyIndex = i;
        render();
        checkWin();
    }
}

function checkWin() {
    let correct = true;

    for (let i = 0; i < tiles.length - 1; i++) {
        if (parseInt(tiles[i].dataset.index) !== i) {
            correct = false;
            break;
        }
    }

    if (correct) {
        winScreen.classList.remove("hidden");
    }
}

createPuzzle();
