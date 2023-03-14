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

const getMinesPosition = ({
  minesPosition,
  boardWidth,
  boardHeight,
  minesCount,
}) => {
  const newMinePosition = Math.floor(Math.random() * boardWidth * boardHeight);

  if (!minesPosition.includes(newMinePosition)) {
    minesPosition.push(newMinePosition);
  }

  return minesPosition.length === minesCount
    ? minesPosition
    : getMinesPosition({ minesPosition, boardWidth, boardHeight, minesCount });
};

const getMinesCoordinates = ({ boardWidth, boardHeight, minesCount }) =>
  getMinesPosition({
    minesPosition: [],
    boardWidth,
    boardHeight,
    minesCount,
  }).map((minePosition) => ({
    x: minePosition % boardWidth,
    y: Math.floor(minePosition / boardWidth),
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
