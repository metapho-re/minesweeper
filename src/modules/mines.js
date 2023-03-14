import { BOARD_WIDTH, BOARD_HEIGHT, MINES_COUNT, colors } from './constants.js';

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

export {
  getMinesCoordinates,
  getAdjacentMinesCount,
  setAdjacentMinesCountIndicator,
};
