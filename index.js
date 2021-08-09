// DOM elements
const citySelect = document.querySelector('.weather__city-select')
const city = document.querySelector('.weather__city')
const temperature = document.querySelector('.weather__temperature')
const weatherStatus = document.querySelector('.weather__status')
const feelsLike = document.querySelector('.weather__feelslike')
const windSpeed = document.querySelector('.weather__wind-speed')
const icon = document.querySelector('.weather__icon')

// Array of cities weather of which we can show 
let cities = ['Minsk', 'Brest', 'Grodno', 'Vitebsk', 'Mogilev', 'Gomel']

setCitiesInDrop()
showMeWeather(citySelect.value)

citySelect.addEventListener('change', event => {
    showMeWeather(event.target.value)
})

async function showMeWeather(cityName) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b5a03b378e49085452cb14ec5350c1e9`)
    let weatherDB = await response.json()

    city.innerText = weatherDB.name
    temperature.innerText = convertCalvinToCelsius(weatherDB.main.temp)
    weatherStatus.innerText = weatherDB.weather[0].description
    feelsLike.innerText = `Feels like: ${convertCalvinToCelsius(weatherDB.main.feels_like)}`
    windSpeed.innerText = `Wind speed: ${weatherDB.wind.speed}m/s`
    icon.src = `https://openweathermap.org/img/wn/${weatherDB.weather[0].icon}@2x.png`
}

// Push cities from array 'cities' to dropdown
function setCitiesInDrop() {
    cities.forEach(city => {
        let option = new Option(city, city)
        citySelect.append(option)
    })
}

// The temperature is stored in kelvin, so we need to convert it to celsius
function convertCalvinToCelsius(temp) {
    return `${Math.round(temp - 273.15)}℃`
}