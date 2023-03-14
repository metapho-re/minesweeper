const getCustomParameters = (urlSearchParams) => {
  const width = Number(urlSearchParams.get('width'));
  const height = Number(urlSearchParams.get('height'));
  const mines = Number(urlSearchParams.get('mines'));

  const isWidthValid = width >= 9 && width <= 30;
  const isHeightValid = height >= 9 && height <= 30;

  const boardWidth = isWidthValid ? width : 9;
  const boardHeight = isHeightValid ? height : 9;

  const isMinesValid = mines >= 1 && mines <= boardWidth * boardHeight - 1;

  const minesCount = isMinesValid ? mines : 10;

  return { boardWidth, boardHeight, minesCount };
};

export const getBoardParameters = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);

  const level = urlSearchParams.get('level');

  switch (level) {
    case 'intermediate': {
      return {
        boardWidth: 16,
        boardHeight: 16,
        minesCount: 40,
      };
    }
    case 'difficult': {
      return {
        boardWidth: 30,
        boardHeight: 16,
        minesCount: 99,
      };
    }
    case 'custom': {
      return getCustomParameters(urlSearchParams);
    }
    default: {
      return {
        boardWidth: 9,
        boardHeight: 9,
        minesCount: 10,
      };
    }
  }
};
