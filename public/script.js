const form = document.getElementById('weatherForm');
const weatherDataDiv = document.getElementById('weatherData');

form.addEventListener('submit', event => {
    event.preventDefault();
    const city = document.getElementById('city').value;
    getWeather(city);
});

async function getWeather(city) {
    try {
        const response = await fetch(`/weather/${city}`);
        const data = await response.json();
        showWeatherData(data);
    } catch (error) {
        console.error(error);
    }
}

function showWeatherData(weatherData) {
    const { city, date, condition, icon, temperature, rainfall, windSpeed, humidity } = weatherData;
    const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;

    weatherDataDiv.innerHTML = `
          <h2>${city}</h2>
          <p class="date">${date}</p>
          <div class="weather">
            <p class="weather-description">${condition}</p>
            <img class="weather-icon" src="${iconUrl}" alt="${condition} icon">
          </div>
          <p class="weather-data">Temperature🌡: ${temperature}</p>
          <p class="weather-data">Rainfall🌧: ${rainfall}</p>
          <p class="weather-data">Wind Speed💨: ${windSpeed}</p>
          <p class="weather-data">Humidity🌤: ${humidity}</p>
        `;
}