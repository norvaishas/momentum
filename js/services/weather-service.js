export class WeatherService {

    constructor() {
        this._apiBase = 'http://api.openweathermap.org/data/2.5/weather';
        this.key = '9afd8ef178a3471fdc67c6d57e1ae0ce';
    }

    async getWeather(city, lang = 'ru', units = 'metric') {
        // let lang = 'ru'/'en'
        // let units = 'metric' //или что то другое
        const url = `${this._apiBase}?q=${city}&lang=${lang},uk&APPID=${this.key}&units=${units}`;

        const result = await fetch(url);
        if (!result.ok) {
            throw new Error(`Не удается получить данные с сервера. Код ошибки: ${result.status}.`);
        }
        return await result.json();
    }
}
