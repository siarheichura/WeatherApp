// DOM elements
const citySelect = document.querySelector('.weather__city-select')
const city = document.querySelector('.weather__city')
const temperature = document.querySelector('.weather__temperature')
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

function setCitiesInDrop() {
    cities.forEach(city => {
        let option = new Option(city, city)
        citySelect.append(option)
    })
}

function showMeWeather(cityName) {
    fetch(`http://api.weatherstack.com/current?access_key=c81a958a4d7a497211fc297e872058f0&query=${cityName}`)
    .then(response => response.json())
    .then(result => {
        city.innerText = result.location.name
        temperature.innerText = `${result.current.temperature}℃`
        feelsLike.innerText = `Feels like: ${result.current.feelslike}℃`
        windSpeed.innerText = `Wind speed: ${result.current.wind_speed}km/h`
        icon.src = result.current.weather_icons[0]
    })
}