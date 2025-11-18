import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");

const dataFields = {
    days: document.querySelector("[data-days]"),
    hours: document.querySelector("[data-hours]"),
    minutes: document.querySelector("[data-minutes]"),
    seconds: document.querySelector("[data-seconds]"),
};

let userSelectedDate = null;
let timerIntervalId = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const selectedDate = (selectedDates[0]);
      if (selectedDate.getTime() <= Date.now()) {
          iziToast.error({
              message: "Please choose a date in the future",
              position: "topRight",
          });
          startButton.disabled = true;
          userSelectedDate = null;
      }
      else {
          userSelectedDate = selectedDate;
          startButton.disabled = false;
      }
  },
};

flatpickr(datetimePicker, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};

function addLeadingZero(value) {
    return value.toString().padStart(2, "0");
}

function updateTimerDisplay(time) {
    const { days, hours, minutes, seconds } = convertMs(time);

    dataFields.days.textContent = addLeadingZero(days); 
    dataFields.hours.textContent = addLeadingZero(hours);
    dataFields.minutes.textContent = addLeadingZero(minutes);
    dataFields.seconds.textContent = addLeadingZero(seconds);
};

function timer() {
if (!userSelectedDate || timerIntervalId) {
    return;
    }  
    
startButton.disabled = true;
    datetimePicker.disabled = true;
    
    timerIntervalId = setInterval(() => {
        const timeLeft = userSelectedDate.getTime() - Date.now();
    
        if (timeLeft <= 1000) {
            clearInterval(timerIntervalId)
            timerIntervalId = null;
            updateTimerDisplay(0);

            startButton.disabled = true;
            datetimePicker.disabled = false;

            iziToast.success({
                message: 'Countdown finished!',
                position: 'topRight',
            });
            return;
        }
        updateTimerDisplay(timeLeft)
    }, 1000);

}

startButton.addEventListener('click', timer);