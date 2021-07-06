// My unique API key from Open Weather website
var apiKey = "98e57da50f201698b36e4df1c0c48b1e";

// Empty array for the searched cities (user's searched data will be appended)
var searchedCitiesArr = [];

// search form
var searchFormEl = document.querySelector("#search-form");
// search input
var cityInput = document.querySelector("#city-input");
// searched city button
var searchedCitiesBtn = document.querySelector("#searched-cities-btn");
// current weather container
var cityWeatherInfo = document.querySelector("#city-weather-info");
// 5 day forecast container
var forecastInfo = document.querySelector("#city-forecast-container");

// When user types the city and click 'search' button, this function get the city weather information.
function searchCity(event) {
    // preventing page to refresh when user click the 'search' button
    event.preventDefault();
    // declaring 'city' variable as user's input
    var city = cityInput.value;
    // based on user's city input, this calls the function that collects data for current weather
    getCurrentWeather(city);
    // based on user's city input, this calls the function that collecst data for forecast weather
    getForecastWeather(city);
    // user's city input gets appended/accumulated into the empty array
    searchedCitiesArr.unshift(city);
    // Once, user types a city, the input becomes blank
    cityInput.value = "";
    // saves user's input data into local storage
    saveLocalStorageData();
    // creates a button with the city name under "Previous searched cities" section
    addSearchedCity(city);
}

// saves the user's input data into local storage
function saveLocalStorageData() {
    localStorage.setItem("searched-cities", searchedCitiesArr);
}

// creates a button with the city name under "Previous searched cities"
function addSearchedCity(cityName) {
    var btnEl = document.createElement('button');
    btnEl.setAttribute("class", "list-group-item list-group-item-action");
    btnEl.setAttribute("id", cityName);
    // Creating a button with corresponding city name
    btnEl.textContent = cityName;
    searchedCitiesBtn.prepend(btnEl);
}

// This function collects the current weather data of user's input city from the API
function getCurrentWeather(city) {
    // // API url for the city name, temp, wind, humidity data
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    // Fetching data for the city name, temp, wind, humidity from the API
    fetch(currentUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data)

            // reseting the existing displayed weather information
            cityWeatherInfo.textContent = "";

            // converting unix timestamp into string that has mm/dd/yyyy format
            var currentDate = new Date(data.dt*1000);
            var currentDateString = "(" + currentDate.toLocaleDateString() + ")";

            // creating 'h3' element for city name
            var createCityName = document.createElement('h3');

            // creating 'img' element for weather condition icon
            var imgWeather = document.createElement('img');
            imgWeather.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

            // creating 'p' elemetns for temp, wind, humidity data
            var createCityTemp = document.createElement('p');
            var createCityWind = document.createElement('p');
            var createCityHumidity = document.createElement('p');

            // data content
            createCityName.textContent = data.name + " " + currentDateString;
            createCityName.append(imgWeather);
            createCityTemp.textContent = "Temp: " + Math.floor(data.main.temp) + " °F";
            createCityWind.textContent = "Wind: " + data.wind.speed + " mph";
            createCityHumidity.textContent = "Humidity: " + Math.floor(data.main.humidity) + " %";

            cityWeatherInfo.append(createCityName);
            cityWeatherInfo.append(createCityTemp);
            cityWeatherInfo.append(createCityWind);
            cityWeatherInfo.append(createCityHumidity);

            // recalls UV index data from getUvi function
            getUvi(data.coord.lat, data.coord.lon);
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
            // console.log(data);

            // creating 'p' element for UV index data
            var createCityUvi = document.createElement('p');
            createCityUvi.textContent = "UV Index: ";
            var uviDisplay = document.createElement('span');
            uviDisplay.textContent = uviData;
            createCityUvi.append(uviDisplay);
            uviDisplay.classList.add("rounded");
            uviDisplay.classList.add("px-2");
            uviDisplay.classList.add("text-white");
            // if/else statement to control the color indicator for UV index condition.
            if(uviData < 3) {
                uviDisplay.setAttribute("id", "uv-favorable");
            } else if(uviData < 8) {
                uviDisplay.setAttribute("id", "uv-moderate");
            } else if(uviData < 11) {
                uviDisplay.setAttribute("id", "uv-severe");
            } else if(uviData >= 11) {
                uviDisplay.setAttribute("id", "uv-dangerous");
            }
            // appending UVI data into City Weather Info
            cityWeatherInfo.append(createCityUvi);
        })
}

// This function collects the 5-Day Forecast data from API.
function getForecastWeather(city) {
    // API url for the FORECAST data
    var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    // Fetching data for the 5-Day Forecast from the API
    fetch(fiveDayUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data)
            // console.log(typeof(data))
            
            // reseting the existing displayed weather information
            forecastInfo.textContent = "";
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
            forecastCard.setAttribute("class", "col mx-2 p-2 bg-info rounded text-front text-white");
            forecastCardArr.push(forecastCard);

            // Converting unix timestamp into string that has mm/dd/yyyy format
            var forecastDateTime = new Date(data.list[i].dt*1000);
            var forecastDateTimeString = forecastDateTime.toLocaleDateString();
            
            // Creating 'p' element that contains date data
            var forecastDate = document.createElement('p');
            forecastDate.setAttribute("style", "font-weight:bold");
            forecastDate.textContent = forecastDateTimeString;
            
            // Creating 'img' element that contains weather condition icon data
            var forecastImgWeather = document.createElement('img');
            forecastImgWeather.setAttribute("src", "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png")

            // Creating 'p' element that contains temperature data
            var forecastTemp = document.createElement('p');
            forecastTemp.textContent = "Temp: " + Math.floor(data.list[i].main.temp) + " °F";

            // Creating 'p' element that contains wind speed data
            var forecastWind = document.createElement('p');
            forecastWind.textContent = "Wind: " + data.list[i].wind.speed + " mph";

            // Creating 'p' element that contains humidity data
            var forecastHumidity = document.createElement('p');
            forecastHumidity.textContent = "Humidity: " + Math.floor(data.list[i].main.humidity) + " %";

            // Storing data into corresponding array
            forecastDateArr.push(forecastDate);
            forecastImgWeatherArr.push(forecastImgWeather);                    
            forecastTempArr.push(forecastTemp);
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
                $("#city-forecast-container").append(forecastCardArr[i]);
            }
        })
}

// When the button from searched cities section, it displays its city weather information
function displayPreviousCities(event) {
    var element = event.target;
    // recalls the local storage data 
    var previousCity = localStorage.getItem("searched-cities");
    // data is saved in string so it's converting to array
    var previousCityArr = previousCity.split(",");
    // this is an 'if' statement where it evaluates if the target city name is included in the data array. If it is true, then it displays the target city weather information
    if(previousCityArr.includes(element.getAttribute("id"))) {
        var city = element.getAttribute("id");
        getCurrentWeather(city);
        getForecastWeather(city);
    };
}

// When 'search' button is clicked, searchCity function is executed
searchFormEl.addEventListener("submit", searchCity);
// When the button from searched cities section, it displays its city weather information
searchedCitiesBtn.addEventListener("click", displayPreviousCities);