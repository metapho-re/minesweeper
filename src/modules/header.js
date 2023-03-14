let intervalId;
let counter;
let timer;

const smiley = document.querySelector('#smiley');

const getIsGameOver = () =>
  smiley.classList.contains('has-won') || smiley.classList.contains('has-lost');

const updateCounter = (valueGetter) => {
  const value = valueGetter(counter);

  counter = value;

  document.querySelector('#counter').innerText = String(value).padStart(3, 0);
};

const updateTimer = (value) => {
  timer = value ?? timer + 1;

  document.querySelector('#timer').innerText = String(timer).padStart(3, 0);
};

const startTimerIfIdle = () => {
  if (!intervalId) {
    intervalId = setInterval(updateTimer, 1000);
  }
};

const stopTimer = () => {
  clearInterval(intervalId);
  intervalId = null;
};

export {
  smiley,
  getIsGameOver,
  updateCounter,
  updateTimer,
  startTimerIfIdle,
  stopTimer,
};
