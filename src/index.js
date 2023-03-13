const BOARD_WIDTH = 9;
const BOARD_HEIGHT = 9;
const MINES_COUNT = 10;

let intervalId;
let counter;
let timer;

const colors = [
  'transparent',
  '#0000ff',
  '#008200',
  '#fe0000',
  '#000084',
  '#840000',
  '#008284',
  '#840084',
  '#757575',
];

const smiley = document.querySelector('#smiley');
const board = document.querySelector('#board');

const updateCounter = (value) => {
  counter = value;

  document.querySelector('#counter').innerText = String(value).padStart(3, 0);
};

const updateTimer = (value) => {
  timer = value ?? timer + 1;

  document.querySelector('#timer').innerText = String(timer).padStart(3, 0);
};

const getMinesPosition = (minesPosition) => {
  const newMinePosition = Math.floor(
    Math.random() * BOARD_WIDTH * BOARD_HEIGHT
  );

  if (!minesPosition.includes(newMinePosition)) {
    minesPosition.push(newMinePosition);
  }

  return minesPosition.length === MINES_COUNT
    ? minesPosition
    : getMinesPosition(minesPosition);
};

const getMinesCoordinates = () =>
  getMinesPosition([]).map((minePosition) => ({
    x: minePosition % BOARD_WIDTH,
    y: Math.floor(minePosition / BOARD_WIDTH),
  }));

const getAdjacentMinesCount = ({ minesCoordinates, x, y }) =>
  minesCoordinates.filter(
    (mineCoordinates) =>
      mineCoordinates.x >= x - 1 &&
      mineCoordinates.x <= x + 1 &&
      mineCoordinates.y >= y - 1 &&
      mineCoordinates.y <= y + 1
  ).length;

const setAdjacentMinesCountIndicator = ({ cell, adjacentMinesCount }) => {
  if (adjacentMinesCount > 0) {
    cell.classList.add('has-adjacent-mines');

    const adjacentMinesCountText = document.createElement('p');

    adjacentMinesCountText.innerText = adjacentMinesCount;
    adjacentMinesCountText.style.color = colors[adjacentMinesCount];
    adjacentMinesCountText.style.fontWeight = 'bold';

    cell.appendChild(adjacentMinesCountText);
  }
};

const getIsGameOver = () =>
  smiley.classList.contains('has-won') || smiley.classList.contains('has-lost');

const expandAdjacentCells = (cell) => {
  if (cell.classList.contains('is-opened')) {
    return;
  }

  cell.classList.add('is-opened');

  if (cell.classList.contains('has-adjacent-mines')) {
    return;
  }

  const x = Number(cell.getAttribute('x'));
  const y = Number(cell.getAttribute('y'));

  const adjacentCells = [
    document.querySelector(`[x="${x - 1}"][y="${y - 1}"]`),
    document.querySelector(`[x="${x - 1}"][y="${y}"]`),
    document.querySelector(`[x="${x - 1}"][y="${y + 1}"]`),
    document.querySelector(`[x="${x}"][y="${y - 1}"]`),
    document.querySelector(`[x="${x}"][y="${y + 1}"]`),
    document.querySelector(`[x="${x + 1}"][y="${y - 1}"]`),
    document.querySelector(`[x="${x + 1}"][y="${y}"]`),
    document.querySelector(`[x="${x + 1}"][y="${y + 1}"]`),
  ].filter((adjacentCell) => adjacentCell);

  adjacentCells.forEach(expandAdjacentCells);
};

const cellClickEventListener = (event) => {
  const leftClickedCell = event.target;

  if (
    leftClickedCell.classList.contains('is-opened') ||
    leftClickedCell.classList.contains('is-flagged') ||
    getIsGameOver()
  ) {
    return;
  }

  if (!intervalId) {
    intervalId = setInterval(updateTimer, 1000);
  }

  if (leftClickedCell.classList.contains('has-mine')) {
    clearInterval(intervalId);
    intervalId = null;

    leftClickedCell.classList.add('has-exploded');
    smiley.classList.add('has-lost');

    document.querySelectorAll('.has-mine:not(.is-flagged)').forEach((cell) => {
      cell.classList.add('is-opened');
    });

    return;
  }

  expandAdjacentCells(leftClickedCell);

  if (
    document.querySelectorAll('.cell:not(.is-opened)').length === MINES_COUNT
  ) {
    updateCounter(0);
    clearInterval(intervalId);
    intervalId = null;

    smiley.classList.add('has-won');

    document.querySelectorAll('.has-mine:not(.is-flagged)').forEach((cell) => {
      cell.classList.add('is-flagged');
    });
  }
};

const cellContextMenuEventListener = (event) => {
  event.preventDefault();

  const rightClickedCell = event.target;

  if (rightClickedCell.classList.contains('is-opened') || getIsGameOver()) {
    return;
  }

  const isFlagged = rightClickedCell.classList.toggle('is-flagged');

  updateCounter(isFlagged ? counter - 1 : counter + 1);
};

const generateCells = () => {
  board.innerHTML = '';

  const minesCoordinates = getMinesCoordinates();

  Array(BOARD_HEIGHT)
    .fill()
    .forEach((_, y) => {
      Array(BOARD_WIDTH)
        .fill()
        .forEach((_, x) => {
          const cell = document.createElement('div');

          cell.classList.add('cell');
          cell.setAttribute('x', x);
          cell.setAttribute('y', y);

          const hasMine = minesCoordinates.some(
            (mineCoordinates) =>
              x === mineCoordinates.x && y === mineCoordinates.y
          );

          if (hasMine) {
            cell.classList.add('has-mine');
          } else {
            const adjacentMinesCount = getAdjacentMinesCount({
              minesCoordinates,
              x,
              y,
            });

            setAdjacentMinesCountIndicator({ cell, adjacentMinesCount });
          }

          cell.addEventListener('click', cellClickEventListener);
          cell.addEventListener('contextmenu', cellContextMenuEventListener);

          board.appendChild(cell);
        });
    });
};

const initializeGame = () => {
  clearInterval(intervalId);
  intervalId = null;

  smiley.classList.remove('has-won', 'has-lost');

  board.style.width = `${BOARD_WIDTH * 32}px`;
  board.style.height = `${BOARD_HEIGHT * 32}px`;

  updateCounter(MINES_COUNT);
  updateTimer(0);
  generateCells();
};

smiley.addEventListener('click', initializeGame);

initializeGame();
