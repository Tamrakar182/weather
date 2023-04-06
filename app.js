const express = require('express');
const http = require('http');
require('dotenv/config')

const app = express();

const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY

// Serve the static assets (CSS, JS, images) from the "public" folder
app.use(express.static(__dirname + '/public'));

// Serve the HTML page when a GET request is made to the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Set up the weather API endpoint
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  http.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      try {
        const weatherData = JSON.parse(data);
        const city = `${weatherData.name}, ${weatherData.sys.country}`;
        const date = new Date(weatherData.dt * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const condition = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const temperature = `${Math.round(weatherData.main.temp)} °C`;
        const rainfall = `${weatherData.rain ? weatherData.rain['1h'] || weatherData.rain['3h'] || 0 : 0} mm`;
        const windSpeed = `${weatherData.wind.speed} m/s`;
        const humidity = `${weatherData.main.humidity} %`;

        const weather = {
          city,
          date,
          condition,
          icon,
          temperature,
          rainfall,
          windSpeed,
          humidity
        };

        res.json(weather);
      } catch (error) {
        res.status(500).send('Error retrieving weather data');
      }
    });
  }).on('error', (error) => {
    res.status(500).send('Error retrieving weather data');
  });
});

app.listen(port, () => console.log(`Server Running On PORT ${port}: http://localhost:${port}`));
