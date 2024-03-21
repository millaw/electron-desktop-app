const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let currentMonth = new Date().getMonth(); // Get current month index
let currentYear = new Date().getFullYear(); // Get current year
let today = new Date().getDate(); // Get today's date
const currentMonthElement = document.getElementById('currentMonth');
const calendarMonth = document.getElementById('calendarMonth');

let collegeClose = []; // Array to store closed dates

async function fetchCollegeClosureDates() {
  try {
    const url = 'https://mobile.laguardia.edu/getAC/getAC';
    const response = await fetch(url);
    const data = await response.json();
    data.ac.forEach(value => {
      if (value.ExceptionTypeID === 3) {
        collegeClose.push(value.StartDate);
      }
    });
  } catch (error) {
    console.error('Error fetching or processing college closure dates:', error);
  }
}

function isDayMarked(weekNumber, weekDay) {
  const dayIndex = (weekDay + 6) % 7;
  const startDayIndex = (weekNumber % 2 === 0) ? 0 : 1;
  const daysInWeek = (weekNumber % 2 === 0) ? 4 : 3;
  return dayIndex >= startDayIndex && dayIndex < startDayIndex + daysInWeek;
}

async function displayMonth(monthIndex) {
  await fetchCollegeClosureDates();
  const monthName = months[monthIndex];
  const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, monthIndex, 1).getDay();
  let monthHtml = `<div class="month-grid">`;

  for (let i = 0; i < firstDayOfMonth; i++) {
    monthHtml += `<div class="day"></div>`;
  }

  for (let i = 1; i <= daysInMonth; i++) {
    let className = "day";
    if (currentYear === new Date().getFullYear() && monthIndex === new Date().getMonth() && i === today) {
      className += " today";
    }
    if (new Date(currentYear, monthIndex, i).getDay() === 0 || new Date(currentYear, monthIndex, i).getDay() === 6) {
      className += " weekend";
    }
    if (isDayMarked(Math.ceil(i / 7), new Date(currentYear, monthIndex, i).getDay())) {
      className += " marked";
    }
    if (collegeClose.includes(new Date(currentYear, monthIndex, i).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }))) {
      className += " closed";
    }
    monthHtml += `<div class="${className}">${i}</div>`;
  }

  monthHtml += `</div>`;
  calendarMonth.innerHTML = monthHtml;
  currentMonthElement.textContent = monthName;
}

displayMonth(currentMonth);

document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  displayMonth(currentMonth);
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
  displayMonth(currentMonth);
});
