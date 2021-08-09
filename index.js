const citySelect = document.querySelector('.weather__city-select')
const city = document.querySelector('.weather__city')
const temperature = document.querySelector('.weather__temperature')
const weatherStatus = document.querySelector('.weather__status')
const feelsLike = document.querySelector('.weather__feelslike')
const windSpeed = document.querySelector('.weather__wind-speed')
const icon = document.querySelector('.weather__icon')

let cities = ['Minsk', 'Brest', 'Grodno', 'Vitebsk', 'Mogilev', 'Gomel']

document.addEventListener("DOMContentLoaded", app)

function app() {
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
    windSpeed.innerText = `Wind speed: ${DB.wind.speed}m/s`
    icon.src = `https://openweathermap.org/img/wn/${DB.weather[0].icon}@2x.png`
}

function setCitiesInDrop() {
    cities.forEach(city => {
        let option = new Option(city, city)
        citySelect.append(option)
    })
}

function convertCalvinToCelsius(temp) {
    return `${Math.round(temp - 273.15)}℃`
}