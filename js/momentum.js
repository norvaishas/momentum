const time = document.querySelector('#time'),
  greeting = document.querySelector('#greeting'),
  name = document.querySelector('#name'),
  focus = document.querySelector('#focus'),
  date = document.querySelector('#date'),
  changeBgBtn = document.querySelectorAll('.bg-button');

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const backgroundsUrls = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

let hours = new Date().getHours();
let timeOfDay = '';
let difference = 0;
let greetText = '';
let localHours = new Date().getHours();
let localTimeOfDay = ''
let bgWasChanged = false;

export function appendFromLS(keyName, elem) {
    if (localStorage.getItem(keyName) === null || localStorage.getItem(keyName) === '') {
        elem.textContent = `[Enter ${keyName[0].toUpperCase() + keyName.slice(1)}]`;
    } else {
        elem.textContent = localStorage.getItem(keyName);
    }
}
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

// Переделать по DRY
function getLocalTimeOfDay(time) {
    if (time >= 6 && time < 12) {
        localTimeOfDay = 'morning';
    } else if (time >= 12 && time < 18) {
        localTimeOfDay = 'day';
    } else if (time >= 18 && time <= 23) {
        localTimeOfDay = 'evening';
    } else if (time < 6) {
        localTimeOfDay = 'night';
    }
    return {localTimeOfDay};
}

getTimeOfDay(hours);

// Получение рандомной картинки для текущего времени суток
const mixArray = arr => arr.sort(() => .5 - Math.random());
let bg = mixArray(backgroundsUrls)[hours - difference];

const appendZero = num => num < 10 ? `0${num}` : num;

// Смена фона
function changeBg(period = timeOfDay) {
    document.body.style.backgroundImage = `url(\'assets/${period}/${bg}.jpg\')`;
}

function initTimer() {
    const now = new Date(),
      hours = now.getHours(),
      minutes = now.getMinutes(),
      seconds = now.getSeconds(),
      year = now.getFullYear(),
      month = months[now.getMonth()],
      dayOfMonth = now.getDate(),
      dayOfWeek = days[now.getDay()];

    // Render
    date.innerHTML = `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
    time.innerHTML = `${appendZero(hours)}:${appendZero(minutes)}:${appendZero(seconds)}`;
    greeting.innerHTML = greetText;

    // Когда час меняется автоматически, фон не сменится т.к. функция запускается с локальным временем
    if (bgWasChanged) {
        // console.log('локально')
        changeBg(localTimeOfDay);
    } else {
        // console.log('глобально')
        changeBg();
    }

    setTimeout(initTimer, 1000);
}

changeBgBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Функция меняющая час назад или вперед
        switch (e.target.textContent) {

            case '>>':
                localHours++;
                if (localHours > 23) localHours = 0;
                bg++;
                getLocalTimeOfDay(localHours);
                if (bg > Math.max(...backgroundsUrls)) bg = 0;
                break;

            case '<<':
                localHours--;
                if (localHours < 0) localHours = 23;
                bg--;
                getLocalTimeOfDay(localHours);
                if (bg < Math.min(...backgroundsUrls)) bg = 14;
                break;
        }
        changeBg(localTimeOfDay);
        bgWasChanged = true;
        console.log('ГЛОБПЛЬНОЕ время = ', hours, timeOfDay);
        console.log('ЛОКАЛЬНОЕ время = ', localHours, localTimeOfDay);
    })
});


[name, focus].forEach(btn => btn.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        e.preventDefault();
        localStorage.setItem(e.target.dataset.name, e.target.innerHTML);
        e.target.blur();
    }
}));

// Очитска при фокусе
[name, focus].forEach(btn => btn.addEventListener('focus', e => {
    e.target.style.cssText = "border-bottom: 1px solid white;";
    e.target.innerHTML = '';
}));

// Получение старого значения при расфокусе
[name, focus].forEach(btn => btn.addEventListener('blur', e => {
    appendFromLS(btn.dataset.name, btn);
    e.target.style.cssText = "border: none;";
}));


//Quote-block
let quoteText = document.querySelector('.quote-text'),
  quoteAuthor = document.querySelector('.quote-author');
const nextQuoteBtn = document.querySelector('.next-quote');

async function setQuote() {
    const url = 'https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en'
    let res = await fetch(url);
    return await res.json();
}

setQuote()
  .then(res => {
    console.log(res);
    quoteText.innerHTML = res.quoteText;
    quoteAuthor.innerHTML = res.quoteAuthor;
});

nextQuoteBtn.addEventListener('click', (e) => {
    setQuote()
      .then(res => {
        console.log(res);
        quoteText.innerHTML = res.quoteText;
        quoteAuthor.innerHTML = res.quoteAuthor;
    });
})

// Run
initTimer();
appendFromLS('name', name);
appendFromLS('focus', focus);
changeBg();
