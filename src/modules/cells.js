import { BOARD_WIDTH, BOARD_HEIGHT, MINES_COUNT } from './constants.js';
import {
  getMinesCoordinates,
  getAdjacentMinesCount,
  setAdjacentMinesCountIndicator,
} from './mines.js';
import {
  getIsGameOver,
  updateCounter,
  startTimerIfIdle,
  stopTimer,
} from './header.js';

const board = document.querySelector('#board');

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

  startTimerIfIdle();

  if (leftClickedCell.classList.contains('has-mine')) {
    stopTimer();

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
    stopTimer();
    updateCounter(() => 0);

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

  updateCounter(
    isFlagged ? (counter) => counter - 1 : (counter) => counter + 1
  );
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

export { board, generateCells };
