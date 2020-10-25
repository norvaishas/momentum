// DOM
const input = document.querySelector('.city');


const key = '9afd8ef178a3471fdc67c6d57e1ae0ce';
let city = 'Москва';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru,uk&APPID=${key}&units=metric`;
// const url = 'https://api.openweathermap.org/data/2.5/weather?q=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&lang=ru&appid=08f2a575dda978b9c539199e54df03b0&units=metric';


input.addEventListener('blur', (e) => {
    city = e.target.value;
    console.log(city);
    fetch(url).then(res => res.json()).then(res => console.log(res.main.temp));
})