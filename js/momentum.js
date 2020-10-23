const time = document.querySelector('#time'),
  greeting = document.querySelector('#greeting'),
  name = document.querySelector('#name'),
  focus = document.querySelector('#focus'),
  date = document.querySelector('#date');

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

const appendZero = num => num < 10 ? `0${num}` : num;

function startTimer() {
    const now = new Date(),
      hours = now.getHours(),
      minutes = now.getMinutes(),
      seconds = now.getSeconds(),
      year = now.getFullYear(),
      month = months[now.getMonth()],
      dayOfMont = now.getDate(),
      dayOfWeek = days[now.getDay() - 1];

    // Render
    date.innerHTML = `${dayOfWeek}, ${dayOfMont} ${month} ${year}`;
    time.innerHTML = `${appendZero(hours)}:${appendZero(minutes)}:${appendZero(seconds)}`;
    setTimeout(startTimer, 1000);
}

// Переписать на switch/case
function changeBg() {
    const hours = appendZero(new Date().getHours());
    console.log(hours)
    if (hours > 6 && hours < 12) {
        greeting.innerHTML = 'Good Morning'
        document.body.style.backgroundImage = `url(\'assets/morning/${hours}.jpg\')`;
    } else if (hours >= 12 && hours < 18) {
        greeting.innerHTML = 'Good Afternoon'
        document.body.style.backgroundImage = `url(\'assets/day/${hours}.jpg\')`;
    } else if (hours >= 18 && hours <= 23) {
        greeting.innerHTML = 'Good Evening'
        document.body.style.backgroundImage = `url(\'assets/evening/${hours-10}.jpg\')`;
    } else if (hours < 6) {
        console.log('Good Night',hours);
        document.body.style.backgroundImage = `url(\'assets/night/${hours+1}.jpg\')`;
    } else {
        console.log('hm')
    }
}

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
startTimer();
changeBg();
getFromLS('name', name);
getFromLS('focus', focus);
