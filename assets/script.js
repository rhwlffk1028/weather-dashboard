// Psedo Coding

// (TODO) 1. Make a header with "Weather Dashboard" title. (Bootstrap)
//          (TODO) Background color
//          (TODO) Text color
//          (TODO) Text Font (bold, size)
//          (TODO) Text position
//          (TODO) Margin, Padding

// (TODO) 2. Set up ROWs & COLUMNs in HTML
//          (TODO) Create a container to include all contents (search bar, history, city info, 5-day forecast)
//          (TODO) Create a ROW to contain all contents
//          (TODO) Inside that ROW, create 2 COLUMNS (one for sidebar and the other for information)
//          (TODO) In first COLUMN, create 2 ROWS (one for search and the other for history)
//          (TODO) In second COLUMN, create 2 ROWS (one for city info and the other for 5-day forecast)


// TODO: Search bar
// // TODO: When user types in the city name and CLICK the "Search" button, the information is sent to JS
// // TODO: Then, the button for thaa city is created in history seciton

// TODO: History section
// // TODO: Once the city has been searched, it gets saved into local storage and the button is created
// // TODO: When user clicks the button, the information for that city displays again

// TODO: City weather info
// // TODO: When the city is searched, it displays city name, date, condition of weather emoji
// // TODO: it also displays the information of Temp, Wind Speed, Humidity, UV Index
// // TODO: Depending on the UV Index, the color changes (favorable, moderate, or severe)

// TODO: 5-day fore-cast
// // TODO: When the city is searched, it displays 5 different cards with 5-day-forecast
// // TODO: Card background color and text font color
// // TODO: Each card displays the date, condition of weather emoji, Temp, Wind Speed, Humidity


var searchFormEl = document.querySelector("#search-form");
var cityInput = document.querySelector("#city-input");
var errorMessage = document.querySelector("#error-message");
var cityWeatherInfo = document.querySelector("#city-weather-info");
var forecastInfo = document.querySelector("#city-forecast-container");


// My unique API key from Open Weather website.
var apiKey = "98e57da50f201698b36e4df1c0c48b1e";


// This function collects the City Name, Temp, Wind, Humidity data from the API.
// This function calls getUvi function which 
function getCurrentApi(event) {
    event.preventDefault();
    // // API url for the city name, temp, wind, humidity data
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput.value + "&units=imperial&appid=" + apiKey;

    // Fetching data for the city name, temp, wind, humidity from the API
    fetch(currentUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            
            // Converting unix timestamp into string that has mm/dd/yyyy format
            var currentDate = new Date(data.dt*1000);
            var currentDateString = "(" + currentDate.toLocaleDateString() + ")";

            var createCityName = document.createElement('h3');

            var imgWeather = document.createElement('img');
            imgWeather.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

            var createCityTemp = document.createElement('p');
            var createCityWind = document.createElement('p');
            var createCityHumidity = document.createElement('p');

            createCityName.textContent = data.name + " " + currentDateString;
            createCityName.append(imgWeather);
            createCityTemp.textContent = "Temp: " + Math.floor(data.main.temp) + " °F";
            createCityWind.textContent = "Wind: " + Math.floor(data.wind.speed) + " mph";
            createCityHumidity.textContent = "Humidity: " + Math.floor(data.main.humidity) + " %";
            
            cityWeatherInfo.append(createCityName);
            cityWeatherInfo.append(createCityTemp);
            cityWeatherInfo.append(createCityWind);
            cityWeatherInfo.append(createCityHumidity);

            getUvi(data.coord.lat, data.coord.lon);
            getFiveDayApi(data.coord.lat, data.coord.lon);

        })
}

// This function collects the UVI index data from API.
function getUvi(latitude, longitude) {
    // API url for the UV index data
    var currentUviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;

    // Fetching data for the UV index from the API
    fetch(currentUviUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var uviData = data.current.uvi;

            var createCityUvi = document.createElement('p');
            createCityUvi.textContent = "UVI Index: ";
            var uviDisplay = document.createElement('span');
            uviDisplay.textContent = uviData;
            createCityUvi.append(uviDisplay);
            uviDisplay.classList.add("rounded");
            uviDisplay.classList.add("px-2");
            uviDisplay.classList.add("text-white");
            if(uviData < 3) {
                uviDisplay.setAttribute("id", "uv-favorable");
            } else if(uviData < 8) {
                uviDisplay.setAttribute("id", "uv-moderate");
            } else if(uviData < 11) {
                uviDisplay.setAttribute("id", "uv-severe");
            }
            // appending UVI data into City Weather Info
            cityWeatherInfo.append(createCityUvi);
        })
}


function getFiveDayApi(latitude, longitude) {
    // API url for the FORECAST data
    var fiveDayUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;

    // Fetching data for the 5-Day Forecast from the API
    fetch(fiveDayUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Creating empty arrays to store data for each day (so the length of array is 5)
            var forecastDateArr = [];
            var forecastImgWeatherArr = [];
            var forecastTempArr = [];
            var forecastWindArr = [];
            var forecastHumidityArr = [];
            // Empty array where each card data with information will be appended
            var forecastCardArr = [];
            
            // Loop through fetching data for each day and creating 5 cards
            for (let i = 1; i < 6; i++) {
            
            // Creating 5 cards where each day data will be appended
            var forecastCard = document.createElement('div');
            forecastCard.setAttribute("class", "col mx-2 p-2 bg-dark rounded text-front text-white");
            forecastCardArr.push(forecastCard);

            // Converting unix timestamp into string that has mm/dd/yyyy format
            var forecastDateTime = new Date(data.daily[i].dt*1000);
            var forecastDateTimeString = forecastDateTime.toLocaleDateString();
            
            // Creating 'p' element that contains date data
            var forecastDate = document.createElement('p');
            forecastDate.setAttribute("style", "font-weight:bold");
            forecastDate.textContent = forecastDateTimeString;
            
            // Creating 'img' element that contains weather condition icon data
            var forecastImgWeather = document.createElement('img');
            forecastImgWeather.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png")

            // Creating 'p' element that contains temperature data
            var forecastTemp = document.createElement('p');
            forecastTemp.textContent = "Temp: " + Math.floor(data.daily[i].temp.day) + " °F";

            // Creating 'p' element that contains wind speed data
            var forecastWind = document.createElement('p');
            forecastWind.textContent = "Wind: " + Math.floor(data.daily[i].wind_speed) + " mph";

            // Creating 'p' element that contains humidity data
            var forecastHumidity = document.createElement('p');
            forecastHumidity.textContent = "Humidity: " + Math.floor(data.daily[i].humidity) + " %";

            // Storing data into corresponding array
            forecastDateArr.push(forecastDate);
            forecastImgWeatherArr.push(forecastImgWeather);                    forecastTempArr.push(forecastTemp);
            forecastWindArr.push(forecastWind);
            forecastHumidityArr.push(forecastHumidity);

            }

            // Loop through appending each day data into each day card
            for (let i = 0; i < forecastCardArr.length; i++) {
                forecastCardArr[i].append(forecastDateArr[i]);
                forecastCardArr[i].append(forecastImgWeatherArr[i]);
                forecastCardArr[i].append(forecastTempArr[i]);
                forecastCardArr[i].append(forecastWindArr[i]);
                forecastCardArr[i].append(forecastHumidityArr[i]);
            }

            // Loop through appending each day card into 5-Day Forecast section
            for (let i = 0; i < forecastCardArr.length; i++) {
                forecastInfo.append(forecastCardArr[i])
            }
        })
}

// When the 'Search' button is clicked, the API data is fetched and display the weather data
searchFormEl.addEventListener("submit", getCurrentApi);
