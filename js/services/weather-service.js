export class WeatherService {

    constructor() {
        this._apiBase = 'https://api.openweathermap.org/data/2.5/weather';
        this.key = '9afd8ef178a3471fdc67c6d57e1ae0ce';
    }

    async getWeather(city, lang = 'ru', units = 'metric') {
        // let lang = 'ru'/'en'
        // let units = 'metric' //или что то другое
        const url = `${this._apiBase}?q=${city}&lang=${lang},uk&APPID=${this.key}&units=${units}`;

        const result = await fetch(url);

        if (!result.ok) {
            switch (true) {
                case result.status === 404:
                    throw new Error(`Кажется вы придумали новый город. Код ошибки: ${result.status}.`);
                    break;
                case result.status > 299:
                    throw new Error(`Не удалось получить данные с сервера. Код ошибки: ${result.status}.`);
            }
        }

        return await result.json();
    }
}
