const express = require('express');
const app = express();
const https = require('https');

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); 

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

// Grab direction conversion function from Utils
const getDirection = require(__dirname + "/utils/dir.js");

// Post request to get zipcode for weather API
app.post('/', (req, res) => {
    const apiKey = "YOUR API KEY";
    const zip = req.body.citybyzip;
    const units = req.body.tempUnits;
    const url = `https://api.openweathermap.org/data/2.5/weather?units=${units}&zip=${zip}&appid=${apiKey}`;
    // Get request to API to get current weather data
    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const location = weatherData.name;
            const temp = Math.round(weatherData.main.temp);
            const feelsLike = Math.round(weatherData.main.feels_like);
            const image = weatherData.weather[0].icon;
            const weatherImage = `http://openweathermap.org/img/wn/${image}@2x.png`;
            const description = weatherData.weather[0].description;
            const maxTemp = Math.round(weatherData.main.temp_max);
            const minTemp = Math.round(weatherData.main.temp_min);
            const pressure = (weatherData.main.pressure * .029530).toFixed(2);
            const humidity = weatherData.main.humidity;
            const windSpeed = Math.round(weatherData.wind.speed);
            const windDir = getDirection.degToCompass(weatherData.wind.deg);
            const windGust = Math.round(weatherData.wind.gust);
            // Render to EJS template
            res.render('result', {
                zipCode: zip, 
                place: location, 
                currentTemp: temp,
                feelsLike: feelsLike,
                weatherDesc: description,
                weatherConditionIMG: weatherImage,
                highTemp: maxTemp,
                lowTemp: minTemp,
                baroPressure: pressure,
                relHumidity: humidity,
                speed: windSpeed,
                dir: windDir,
                gust: windGust
            });
        });
    });
});

app.listen(3000, () => {
    console.log("Server up on port 3000");
});