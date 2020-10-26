const countdown = (date, el) => {
  date = Math.floor(((date instanceof Date ? date.getTime() : date) - Date.now()) / 1000);

  const daySelector = el.querySelector('.day');
  const hourSelector = el.querySelector('.hour');
  const minuteSelector = el.querySelector('.minute');
  const secondSelector = el.querySelector('.second');
  const render = async () => {
    daySelector.innerHTML = Math.floor(date / 86400).toString().padStart(2, '0');
    const hours = date % 86400;
    hourSelector.innerHTML = Math.floor(hours / 3600).toString().padStart(2, '0');
    const minutes = hours % 3600;
    minuteSelector.innerHTML = Math.floor(minutes / 60).toString().padStart(2, '0');
    const seconds = minutes % 60;
    secondSelector.innerHTML = Math.floor(seconds).toString().padStart(2, '0');
  };
  render(date, el);
  setInterval(() => {
    date--;
    render();
  }, 1000);
};

export default countdown;
