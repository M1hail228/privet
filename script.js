const rows = 4;
const cols = 3;

const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");
const win = document.getElementById("win");

let slots = [];
let tiles = [];

/* ========= создание слотов ========= */

for (let i = 0; i < rows * cols; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    board.appendChild(slot);
    slots.push(slot);
}

/* ========= создание кусочков ========= */

for (let i = 0; i < rows * cols; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";

    const x = i % cols;
    const y = Math.floor(i / cols);

    tile.style.backgroundImage = "url('image.jpg')";
    tile.style.backgroundPosition =
        `${(x/(cols-1))*100}% ${(y/(rows-1))*100}%`;

    tile.dataset.correct = i;

    tile.onclick = () => placeTile(tile);

    tiles.push(tile);
}

/* ========= перемешиваем ========= */

shuffle(tiles);
tiles.forEach(t => piecesContainer.appendChild(t));


/* ========= логика ========= */

function placeTile(tile) {
    // если уже стоит — вернуть вниз
    if (tile.parentElement.classList.contains("slot")) {
        piecesContainer.appendChild(tile);
        return;
    }

    // найти первый свободный слот
    const free = slots.find(s => !s.firstChild);
    if (!free) return;

    free.appendChild(tile);

    checkWin();
}


/* ========= проверка ========= */

function checkWin() {
    for (let i = 0; i < slots.length; i++) {
        const tile = slots[i].firstChild;
        if (!tile || +tile.dataset.correct !== i) return;
    }

    win.classList.remove("hidden");
}


/* ========= shuffle ========= */

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
