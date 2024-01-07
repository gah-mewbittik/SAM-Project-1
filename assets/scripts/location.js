// Global map variable
var map;

function initMap() {
    // Default map location (Ottawa)
    var defaultLocation = {lat: 45.4215, lng: -75.6972};

    // Initialize map
    map = new google.maps.Map(document.getElementById('city-map'), {
        zoom: 12,
        center: defaultLocation
    });
}

function updateMapToCity(lat, lng) {
    var cityLocation = new google.maps.LatLng(lat, lng);
    map.setCenter(cityLocation);

    // Optional: Add a marker for the city
    var marker = new google.maps.Marker({
        position: cityLocation,
        map: map
    });
}


// Function to change the background image of the div
function changeBackgroundImage(cityName) {
    var accessKey = '-rgZ5MBBGmnpl8MiJ6e1lZHxP0l1bZkV5biYj8uxUuc';
    var url = `https://api.unsplash.com/search/photos?page=1&query=${cityName}&client_id=${accessKey}`;
    var defaultImageUrl = 'https://getbootstrap.com/docs/5.3/examples/features/unsplash-photo-2.jpg';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var imageUrl = defaultImageUrl; // Set default image initially
            if (data.results.length > 0) {
                imageUrl = data.results[0].urls.regular; // Update with Unsplash image if available
            }
            document.querySelector('.p-5.mb-4.bg-body-tertiary.rounded-3').style.backgroundImage = `url('${imageUrl}')`;
        })
        .catch(error => {
            console.log(error);
            // Fallback to default image in case of any error
            document.querySelector('.p-5.mb-4.bg-body-tertiary.rounded-3').style.backgroundImage = `url('${defaultImageUrl}')`;
        });
}


$(document).ready(function() {
    var autocomplete;
    var searchInput = "town-input";

    // Setting up the autocomplete feature for the input field
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(searchInput), {
            types: ["geocode"], // restricts the autocomplete to geographical location types
        }
    );

    // Handle click event on the search button
    $('#townInputBtn').click(function(event) {
        event.preventDefault();  // Prevents form submission behavior

        var place = autocomplete.getPlace();
        if (place && place.geometry) {
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();

            updateMapToCity(lat, lng);  // Update map to the new city's coordinates
            fetchAndDisplayWeather(place.name); // Fetch and display weather of the new city
        } else {
            alert("Please select a city from the dropdown list.");
        }
        // Update background image
        changeBackgroundImage(place.name);
    });

    // Initialize map when page loads
    initMap();
});
