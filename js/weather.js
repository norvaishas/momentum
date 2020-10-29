import {WeatherService} from './services/weather-service.js';
import {appendFromLS} from './momentum.js';

// let url = `http://api.openweathermap.org/data/2.5/weather?q=${geo}&lang=ru,uk&APPID=${key}&units=metric`;

// DOM
const city = document.querySelector('.city'),
  icon = document.querySelector('.icon'),
  degrees = document.querySelector('.degrees'),
  description = document.querySelector('.description'),
  humidity = document.querySelector('.humidity'),
  wind = document.querySelector('.wind'),
  refresh = document.querySelector('.refresh-icon');

const forecast = new WeatherService();

function getWeatherFromLS() {
    if (!localStorage.getItem('weather')) {
        return;
    } else {
        let weatherData = JSON.parse(localStorage.getItem ("weather"));
        degrees.textContent = weatherData.degrees;
        icon.classList.add(weatherData.icon);
        description.textContent = weatherData.description;
        humidity.textContent = weatherData.humidity;
        wind.textContent = weatherData.wind;
    }
}


city.addEventListener('focus', e => {
    e.target.textContent = '';
    e.target.style.cssText = "min-width: 50px; border-bottom: 1px solid white; outline: none;";
    // document.querySelector('.wrap')
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
    // console.trace('Включение иконки')
    if (localStorage.getItem('city') !== null) {
        // console.log('город ЕСТЬ, ПОКАЗЫВАЕМ иконку');
        refresh.classList.remove('hide');
    } else {
        // console.log('города НЕТ, ПРЯЧЕМ иконку')
        refresh.classList.add('hide');
    }
}

function addWeatherToLS(promiseResponse) {
    localStorage.setItem('weather', JSON.stringify(
      {
          degrees: `${Math.round(promiseResponse.main.temp)}°C\``,
          icon: `owf-${promiseResponse.weather[0].id}`,
          description: promiseResponse.weather[0].description,
          humidity: `${promiseResponse.main.humidity} %`,
          wind: `${promiseResponse.wind.speed} m/s`,
      }));
}

function ifPromiseReject(promiseError, domElem = city) {
    degrees.textContent = ``;
    icon.className = 'icon owf';
    description.textContent = '';
    humidity.textContent = '';
    wind.textContent = '';
    /*console.log('domElem');
    console.log(domElem);
    console.log('domElem');*/
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
