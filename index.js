
const citySelect = document.querySelector('.card__city-select')
const city = document.querySelector('.card__city')
const temperature = document.querySelector('.current__temperature')
const icon = document.querySelector('.current__icon')
const weatherStatus = document.querySelector('.current__status')
const feelsLike = document.querySelector('.current__feelslike')
const windSpeed = document.querySelector('.current__wind-speed')
const humidity = document.querySelector('.current__humidity')
const pressure = document.querySelector('.current__pressure')

let cities = ['Minsk', 'Brest', 'Grodno', 'Vitebsk', 'Mogilev', 'Gomel']

document.addEventListener("DOMContentLoaded", app)

function app() {
    new Clock().start()
    setCitiesInDrop()
    showWeatherInUserGeo()
    initDropdownListener()
}

function initDropdownListener() {
    citySelect.addEventListener('change', event => {
        showWeatherInChosenCity(event.target.value)
    })
}

function showWeatherInUserGeo() {
        navigator.geolocation.getCurrentPosition(position => {
        let latitude = position.coords.latitude.toFixed(4)
        let longitude = position.coords.longitude.toFixed(4)
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b5a03b378e49085452cb14ec5350c1e9`)
        .then(response => response.json())
        .then(result => {
            renderWeather(result)
        })
    })
}

async function showWeatherInChosenCity(cityName) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b5a03b378e49085452cb14ec5350c1e9`)
    let weatherDB = await response.json()
    renderWeather(weatherDB)
}

function renderWeather(DB) {
    city.innerText = DB.name
    temperature.innerText = convertCalvinToCelsius(DB.main.temp)
    weatherStatus.innerText = DB.weather[0].description
    feelsLike.innerText = `Feels like: ${convertCalvinToCelsius(DB.main.feels_like)}`
    icon.src = `https://openweathermap.org/img/wn/${DB.weather[0].icon}@2x.png`
    windSpeed.innerText = `${DB.wind.speed} m/s`
    humidity.innerText = `${DB.main.humidity} %`
    pressure.innerText = `${DB.main.pressure} hPa`
}

function setCitiesInDrop() {
    cities.forEach(city => {
        let option = new Option(city, city)
        citySelect.append(option)
    })
}

function convertCalvinToCelsius(temp) {
    return `${Math.round(temp - 273.15)}°`
}


// Clock

class Clock {
    #getDate() {
        const time = new Date()
        const date = {
            hours: time.getHours(),
            minutes: time.getMinutes(),
        }
        return date
    }

    #update() {
        let hours = document.querySelector('.clock__hours')
        let minutes = document.querySelector('.clock__minutes')
        let date = this.#getDate()

        hours.innerText = date.hours.toString().padStart(2, '0')
        minutes.innerText = date.minutes.toString().padStart(2, '0')
    }

    start() {
        this.#update()
        let separator = document.querySelector('.clock__separator')

        setInterval(() => {
            this.#update()
            separator.classList.toggle('opacity')
        }, 1000);
    }    
}