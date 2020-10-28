import {WeatherService} from './services/weather-service.js';
import {appendFromLS} from './momentum.js';

// let url = `http://api.openweathermap.org/data/2.5/weather?q=${geo}&lang=ru,uk&APPID=${key}&units=metric`;

// DOM
const city = document.querySelector('.city'),
  icon = document.querySelector('.icon'),
  degrees = document.querySelector('.degrees'),
  humidity = document.querySelector('.humidity'),
  refresh = document.querySelector('.refresh-icon');
console.log(refresh)

const forecast = new WeatherService();

function getWeatherFromLS() {
    if (!localStorage.getItem('weather')) {
        return;
    } else {
        let weatherData = JSON.parse(localStorage.getItem ("weather"));
        degrees.textContent = weatherData.degrees;
        icon.classList.add(weatherData.icon);
        humidity.textContent = weatherData.humidity;
    }
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
              addWeatherToLS(res)
              getWeatherFromLS();
              toggleRefreshIcon();

          })
          .catch(err => {
              ifPromiseReject(err, e.target)
              toggleRefreshIcon();
          });

        e.target.value = '';
        city.blur();
    }
})

function toggleRefreshIcon() {
    if (localStorage.getItem('city') !== null) {
        refresh.classList.remove('hide');
    } else {
        refresh.classList.add('hide');
    }
}

function addWeatherToLS(promiseResponse) {
    localStorage.setItem('weather', JSON.stringify(
      {
          degrees: `${Math.round(promiseResponse.main.temp)}°C\``,
          icon: `owf-${promiseResponse.weather[0].id}`,
          humidity: promiseResponse.weather[0].description,
      }));
}

function ifPromiseReject(promiseError, domElem = city) {
    degrees.textContent = ``;
    icon.className = 'icon owf';
    humidity.textContent = '';
    console.log('domElem');
    console.log(domElem);
    console.log('domElem');
    domElem.textContent = promiseError;
    localStorage.removeItem('city');
    localStorage.removeItem('weather');
}

refresh.addEventListener('click', e => {

    forecast.getWeather(localStorage.getItem('city'))
      .then(res => {
          addWeatherToLS(res)
          getWeatherFromLS();
          toggleRefreshIcon();
      })
      .catch(err => {
          ifPromiseReject(err)
          toggleRefreshIcon();
      });
})

appendFromLS('city', city);
getWeatherFromLS();
toggleRefreshIcon();
