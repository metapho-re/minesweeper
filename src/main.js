import { getBoardParameters } from './modules/parameters.js';
import {
  smiley,
  updateCounter,
  updateTimer,
  stopTimer,
} from './modules/header.js';
import { board, generateCells } from './modules/cells.js';

const initializeGame = () => {
  const { boardWidth, boardHeight, minesCount } = getBoardParameters();

  stopTimer();

  smiley.classList.remove('has-won', 'has-lost');

  board.style.width = `${boardWidth * 32}px`;
  board.style.height = `${boardHeight * 32}px`;

  updateCounter(() => minesCount);
  updateTimer(0);
  generateCells({ boardWidth, boardHeight, minesCount });
};

smiley.addEventListener('click', initializeGame);

initializeGame();
