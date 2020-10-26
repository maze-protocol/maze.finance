import countdown from './_countdown';

const start = (function () {
  const date = new Date();
  date.setUTCFullYear(2020, 9, 30);
  date.setUTCHours(18, 0, 0);
  return date;
})();
const end = (function () {
  const date = new Date();
  date.setUTCFullYear(2020, 10, 6);
  date.setUTCHours(18, 0, 0);
  return date;
})();
const beforeStartTxt = 'Token sale starts in';
const beforeEndTxt = 'Token sale ends in';
const el = document.querySelector('[data-toggle="countdown"]');
const isStarted = Date() > start;
const isFinished = Date() > end;

if (el && !isFinished) {
  if (!isStarted) {
    el.querySelector('.header').innerHTML = beforeStartTxt;
    countdown(start, el);
  } else {
    el.querySelector('.header').innerHTML = beforeEndTxt;
    countdown(end, el);
  }
}
