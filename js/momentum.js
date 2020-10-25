const time = document.querySelector('#time'),
  greeting = document.querySelector('#greeting'),
  name = document.querySelector('#name'),
  focus = document.querySelector('#focus'),
  date = document.querySelector('#date'),
  changeBgBtn = document.querySelectorAll('.bg-button');

const days = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье'
];
const months = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря'
];
const backgroundsUrls = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

let globalHours = new Date().getHours();
let timeOfDay = '';
let difference = 0;
let greetText = '';

function getTimeOfDay(time) {
    if (time >= 6 && time < 12) {
        timeOfDay = 'morning';
        difference = 6;
        greetText = 'Good Morning'
    } else if (time >= 12 && time < 18) {
        timeOfDay = 'day';
        difference = 12;
        greetText = 'Good Afternoon'
    } else if (time >= 18 && time <= 23) {
        timeOfDay = 'evening';
        difference = 18;
        greetText = 'Good Evening'
    } else if (time < 6) {
        timeOfDay = 'night';
        difference = 0;
        greetText = 'Good Night'
    }
    return {timeOfDay, difference, greetText};
}
getTimeOfDay(globalHours);

// Получение рандомной картинки для текущего времени суток
const mixArray = arr => arr.sort(() => .5 - Math.random());
let bg = mixArray(backgroundsUrls)[globalHours - difference];


const appendZero = num => num < 10 ? `0${num}` : num;

// Смена фона
function changeBg() {
    document.body.style.backgroundImage = `url(\'assets/${timeOfDay}/${bg}.jpg\')`;
}

function initTimer() {
    const now = new Date(),
      hours = now.getHours(),
      minutes = now.getMinutes(),
      seconds = now.getSeconds(),
      year = now.getFullYear(),
      month = months[now.getMonth()],
      dayOfMonth = now.getDate(),
      dayOfWeek = days[now.getDay() - 1];

    // Render
    date.innerHTML = `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
    time.innerHTML = `${appendZero(hours)}:${appendZero(minutes)}:${appendZero(seconds)}`;
    greeting.innerHTML = greetText;
    changeBg();

    setTimeout(initTimer, 1000);
}

changeBgBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Функция меняющая час назад или вперед
        switch (e.target.textContent) {

            case 'Next BG':
                globalHours++;
                if (globalHours > 23) globalHours = 0;
                bg++;
                getTimeOfDay(globalHours);
                if (bg > Math.max(...backgroundsUrls)) bg = 0;
                break;

                case 'Prev BG':
                    globalHours--;
                    if (globalHours < 0) globalHours = 23;
                    bg--;
                    getTimeOfDay(globalHours);
                    if (bg < Math.min(...backgroundsUrls)) bg = 14;
                break;
        }
        changeBg();
        console.log('время = ', globalHours, timeOfDay);
    })
})

function getFromLS(keyName, elem) {
    if (localStorage.getItem(keyName) === null || localStorage.getItem(keyName) === '') {
        elem.textContent = `[Enter ${keyName[0].toUpperCase() + keyName.slice(1)}]`;
    } else {
        elem.textContent = localStorage.getItem(keyName);
    }
}

// ENTER
name.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        e.preventDefault();
        // Записал в ЛС
        localStorage.setItem('name', name.innerHTML);
    }
})

name.addEventListener('focus', e => {
    console.log('focus', e.target);
    // e.target.style.cssText = "color: red; border-bottom: 1px solid black; min-width: 30px;";
    setTimeout(() => {
        e.target.selectionStart = name.selectionEnd = 3;
    });
    e.target.innerHTML = '';
})

name.addEventListener('blur', e => {
    console.log('unfocus');
    getFromLS('name', name);
})


// Run
initTimer();
getFromLS('name', name);
getFromLS('focus', focus);
changeBg();