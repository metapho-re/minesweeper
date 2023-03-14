import { BOARD_WIDTH, BOARD_HEIGHT, MINES_COUNT } from './modules/constants.js';
import {
  smiley,
  updateCounter,
  updateTimer,
  stopTimer,
} from './modules/header.js';
import { board, generateCells } from './modules/cells.js';

const initializeGame = () => {
  stopTimer();

  smiley.classList.remove('has-won', 'has-lost');

  board.style.width = `${BOARD_WIDTH * 32}px`;
  board.style.height = `${BOARD_HEIGHT * 32}px`;

  updateCounter(() => MINES_COUNT);
  updateTimer(0);
  generateCells();
};

smiley.addEventListener('click', initializeGame);

initializeGame();
