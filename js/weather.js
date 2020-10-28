import {WeatherService} from './services/weather-service.js';
import {appendFromLS} from './momentum.js';

// let url = `http://api.openweathermap.org/data/2.5/weather?q=${geo}&lang=ru,uk&APPID=${key}&units=metric`;

// DOM
const city = document.querySelector('.city'),
  icon = document.querySelector('.icon'),
  degrees = document.querySelector('.degrees'),
  humidity = document.querySelector('.humidity');

const forecast = new WeatherService();

function getWeatherFromLS() {
    if (!localStorage.getItem('weather')) {
        return;
    }

    let weatherData = JSON.parse(localStorage.getItem ("weather"));
    degrees.textContent = weatherData.degrees;
    icon.classList.add(weatherData.icon);
    humidity.textContent = weatherData.humidity;
}


city.addEventListener('focus', e => {
    e.target.textContent = '';
    e.target.style.cssText = "border-bottom: 1px solid white; outline: none;";
    // e.target.innerHTML = '';
})

city.addEventListener('blur', e => {
    appendFromLS(e.target.dataset.name, e.target);
    e.target.style.cssText = "border: none;";
})

city.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        e.preventDefault();
        localStorage.setItem(e.target.dataset.name, e.target.innerHTML);

        forecast.getWeather(e.target.textContent)
          .then(res => {

              localStorage.setItem('weather', JSON.stringify(
                {
                    degrees: `${res.main.temp}°C\``,
                    icon: `owf-${res.weather[0].id}`,
                    humidity: res.weather[0].description,
                }));

              getWeatherFromLS();

          })
          .catch(err => {
              degrees.textContent = ``;
              icon.className = 'icon owf';
              humidity.textContent = '';
              e.target.textContent = err;
              console.log(e.target.textContent = err);
              localStorage.removeItem('city');
              localStorage.removeItem('weather');
          });

        e.target.value = '';
        city.blur();
    }
})

appendFromLS('city', city);
getWeatherFromLS();
