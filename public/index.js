const circle = document.querySelector('#circle');
const timer = document.querySelector('#timer');

let seconds = 0;

const interval = setInterval(() => {
    seconds++;
    if (seconds > 60) {
        seconds = 1;
    }

    const offset = (75.4 * (60 - seconds)) / 60;

    circle.style.strokeDashoffset = offset;
    timer.textContent = seconds;

}, 1000);