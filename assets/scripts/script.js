//Town Inputs
var townInput = document.getElementById('town-input');
var townInputBtn = document.getElementById('townInputBtn');
var curDate = new Date();

var resultsContainer = document.querySelector('.townResultsContainer');

//Form Class
var submitForm = document.querySelector('.submitForm');

//show current weather
var curWeather = document.querySelector('.show-currentWeather');

// List of towns array
var searchHistory = [];
var townList = document.getElementById('townList');

//links for longitude and latitude 
var townLinks = [];

var weatherCard = document.getElementById("weather-card");
weatherCard.style.display = "none";

var mapCard = document.getElementById("city-map");
mapCard.style.display = "none";

var recentSearchCard = document.getElementById("recent-search-card");
recentSearchCard.style.display = "none";


//sweep through dayOfWeek
function sweepDays(i) {
    return (curDate.getDay() + i) % 7;
}

//function that gets Town's Entry and its weather
function acquireTownData(event) {
    event.preventDefault();

    // alert  TODO: REPLACE ALERT with Bootstrap alert or HTML
    if (!townInput.value) {
        alert("Please, Enter a City.")
        return;
    }


    fetchAndDisplayWeather(townInput.value);

}

function fetchAndDisplayWeather(cityName) {
    // Town Geocoding API
    var urlGeoApi = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=e5814fee5eda4d4a8e524afc1139e11e';

    fetch(urlGeoApi)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var town = data[0];
            var lat = town.lat;
            var lon = town.lon;
            //pushing user input to theTownList array

            // Weather Forecast API
            var urlApi = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=e5814fee5eda4d4a8e524afc1139e11e';
            //push Town latitude and longitude


            fetch(urlApi)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    // at this point, fetch is complete
                    //function calls
                    cityName = cityName.toLowerCase();
                    if (searchHistory.indexOf(cityName) === -1) {
                        searchHistory.push(cityName);
                    }

                    displayCurrentForecast(data);
                    storeTownLatLog();

                    displayTownList();
                    //clear input
                    townInput.value = '';
                })
        })

    displayTownList();


}

// function showing current weather
function displayCurrentForecast(data) {
    curWeather.innerHTML = '';

    if (!data) {
        resultsContainer.textContent = 'City not found!';
        return;
    }
    //creating the current weather CARD
    var currentContainer_EL = document.createElement('div');
    currentContainer_EL.classList = 'currentCardContainer';
    curWeather.appendChild(currentContainer_EL);

    //Creating paragraph for current date
    var currentDate_El = document.createElement('p');
    currentDate_El.setAttribute('id', 'currentDateID');
    currentDate_El.textContent = curDate.toDateString();
    currentContainer_EL.appendChild(currentDate_El);

    //creating div for icon that we want access too
    var weatherImage = document.createElement('img');
    weatherImage.classList = 'currentImageIcon';
    weatherImage.setAttribute('src', 'http://openweathermap.org/img/wn/' + data.list[0].weather[0].icon + '.png'); //this is line 96
    currentContainer_EL.appendChild(weatherImage);

    //creating paragraph for temp
    var temperature_El = document.createElement('p');
    temperature_El.setAttribute('id', 'temp');
    temperature_El.textContent = "Temp: " + Number(data.list[0].main.temp - 273.15).toFixed(2) + ' °' + 'C';
    currentContainer_EL.appendChild(temperature_El);

    //creating paragraph for Wind
    var windSpeed_El = document.createElement('p');
    windSpeed_El.setAttribute('id', 'wind');
    windSpeed_El.textContent = "Wind: " + Number(data.list[0].wind.speed * (18 / 5)).toFixed(2) + ' km/h';
    currentContainer_EL.appendChild(windSpeed_El);

    weatherCard.style.display = "block";
    mapCard.style.display = "block";
    recentSearchCard.style.display = "block";

}

//function for the longitude and latitude Town Storage
function storeTownLatLog() {
    localStorage.setItem("theTownList", JSON.stringify(searchHistory));

}

//function that generates list of Towns/cities entered
function displayTownList() {
    townList.innerHTML = '';
    var townListEl = document.getElementById('townList');
    for (var i = 0; i < searchHistory.length; i++) {
        var cityName = searchHistory[i];

        var liEl = document.createElement('li');
        liEl.classList = 'btn btn-outline-secondary mb-2';
        liEl.textContent = cityName;
        liEl.setAttribute('data-index', i);
        liEl.addEventListener('click', function(event) {

            fetchAndDisplayWeather(searchHistory[event.target.dataset.index]);
        });
        townListEl.appendChild(liEl);
    }

}

//Init function
function init() {
    var storedTown = JSON.parse(localStorage.getItem('theTownList'));

    if (storedTown !== null) {
        searchHistory = storedTown;
    }

    var storedLinks = JSON.parse(localStorage.getItem('townLinks'));
    if (storedLinks !== null) {
        townLinks = storedLinks;
    }

    displayTownList();
}

//function acquireTownData's event listener
submitForm.addEventListener('submit', acquireTownData);

init();