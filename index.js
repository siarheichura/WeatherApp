// DOM Elements
const cityInput = document.querySelector('.city-search__input')
const buttonSubmit = document.querySelector('.city-search__button')
const city = document.querySelector('.card__city')
const temperature = document.querySelector('.current__temperature')
const icon = document.querySelector('.current__icon')
const weatherStatus = document.querySelector('.current__status')
const feelsLike = document.querySelector('.current__feelslike')
const windSpeed = document.querySelector('.current__wind-speed')
const humid = document.querySelector('.current__humidity')
const press = document.querySelector('.current__pressure')
const forecastList = document.querySelector('.forecast-wrap')
const preloader = document.querySelector('.preloader')
const mapWrap = document.querySelector('.map')

// WeekDays For Forecast
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'] 

document.addEventListener("DOMContentLoaded", app)
function app() {
    showWeatherInUserGeo()
    initCitySearchListeners()
}

function showWeatherInUserGeo() {
    navigator.geolocation.getCurrentPosition(position => {
        let { coords: {latitude, longitude} } = position
        // Map
        printMap(longitude, latitude)
        // Current Weather
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b5a03b378e49085452cb14ec5350c1e9`)
            .then(response => response.json())
            .then(result => renderWeather(result))
        // Forecast
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=b5a03b378e49085452cb14ec5350c1e9`)
            .then(response => response.json())
            .then(result => renderForecast(result))
    })
}

function initCitySearchListeners() {
    buttonSubmit.addEventListener('click', () => {
        showWeatherInChosenCity(cityInput.value)
        cityInput.value = ''
    })
    cityInput.addEventListener('keypress', event => {
        if(event.keyCode === 13) {
            showWeatherInChosenCity(cityInput.value)
            cityInput.value = ''
        }
    })
}

async function showWeatherInChosenCity(cityName) {
    try {
        // Current Weather
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b5a03b378e49085452cb14ec5350c1e9`)
        let weatherDB = await response.json()
        renderWeather(weatherDB)
        // Forecast
        const lon = weatherDB.coord.lon
        const lat = weatherDB.coord.lat
        let forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=b5a03b378e49085452cb14ec5350c1e9`)
        let forecastDB = await forecastResponse.json()
        renderForecast(forecastDB)
        printMap(lon, lat)
    } catch {
        cityInput.value = 'Incorrect city name!'
        cityInput.classList.add('wrongCityAnim')        
        setTimeout(() => {
            cityInput.classList.remove('wrongCityAnim')
            cityInput.value = ''
        }, 1500)
    }
}

function getForecastTemplate(day, src, dayTemp, nightTemp) {
    return `<div class="forecast">
                <p class="forecast__day">${day}</p>
                <img src="${src}" alt="" class="forecast__icon">
                <p class="forecast__temperature-day">${dayTemp}</p>
                <p class="forecast__temperature-night">${nightTemp}</p>
            </div>`
}

function renderForecast(DB) {
    let { daily } = DB
    let todayIndex = new Date().getDay();
    forecastList.innerHTML = ''
    for(let i = 1; i <= 3; i++) {
        let day = days[todayIndex + i]
        let icon =  `https://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png`
        let tempDay = convertCalvinToCelsius(daily[i].temp.day)
        let tempNight = convertCalvinToCelsius(daily[i].temp.night)
        forecastList.innerHTML += getForecastTemplate(day, icon, tempDay, tempNight)
    }
}

function renderWeather(DB) {
    let { name, main: {temp, feels_like, humidity, pressure}, weather: [weather], wind: {speed} } = DB
    city.innerText = name
    temperature.innerText = convertCalvinToCelsius(temp)
    weatherStatus.innerText = weather.description
    feelsLike.innerText = `Feels like: ${convertCalvinToCelsius(feels_like)}`
    icon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    windSpeed.innerText = `${speed} m/s`
    humid.innerText = `${humidity} %`
    press.innerText = `${pressure} hPa`
    closePreloader()
}

function convertCalvinToCelsius(temp) {
    return `${Math.round(temp - 273.15)}°`
}

function printMap(longitude, latitude) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyeXZvbGsiLCJhIjoiY2t0N2NhazYzMHFyeTJucnc0ZDBnaTMwMyJ9.-kPnDph_kaWZHDKIC6JKyg';
    let map = new mapboxgl.Map({
        container: mapWrap,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude], // [longitude, latitude]
        zoom: 12
    });
    const marker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);
}

function closePreloader() {
    preloader.style.display = 'none'
}