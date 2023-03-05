// Define the map and tile layer
let map = L.map('map', { attributionControl: false }).setView([0, 0], 9);
const tile = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);

// Define the marker icon
let youAreHere = L.icon({
  iconUrl: 'libs/images/marker-icon.png',
  iconSize: [10, 15]
});

// Define the countries array and populate it using AJAX
let countries = [];
$.ajax({
  type: 'GET',
  url: 'libs/php/getCountryList.php',
  dataType: 'json',
  success: function (data) {
    // console.log(data); // Log the data variable
    countries = data.countries.sort((a, b) => a.name.localeCompare(b.name));
    countries.forEach((data) => {
      $('#countries').append(`<option value="${data.code}">${data.name}</option>`);
    });
  },
  error: function (jqXHR, textStatus, errorThrown) {
    alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
  }
});

// Define the function for handling geolocation success
function success(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  // Check if map object is defined
  if (!map) {
    console.error('Map object not defined');
    return;
  }

  // Create marker and add it to the map
  marker = L.marker([lat, lng], { icon: youAreHere })
    .addTo(map)
    .bindPopup('You are here')
    .openPopup();

  // Check if marker object was successfully created
  if (!marker) {
    console.error('Could not create marker');
    return;
  }
}

// Define the function for handling geolocation error
function error(err) {
  if (err.code === 1) {
    alert('Please allow geolocation access');
  } else {
    alert('Cannot get current location');
  }
}

// Request location information
navigator.geolocation.getCurrentPosition(success, error);

// Define the event listener for changing the selected country
let geojsonLayer; // Define the variable outside the event listener to make it accessible later
$('#countries').on('change', function () {
  let isoCode = $(this).val();

  // Remove the current polygon layer, if it exists
  if (geojsonLayer) {
    map.removeLayer(geojsonLayer);
  }

  // Send an AJAX request to get the GeoJSON data for the selected country
  $.ajax({
    url: 'libs/php/getRestCountry.php',
    type: 'POST',
    data: {
      iso_code: isoCode
    },
    success: function (data) {
      // Parse the data and add it to the map as a new layer
      let countryGeoJSON = JSON.parse(data);

      geojsonLayer = L.geoJSON(countryGeoJSON, {
        style: function (feature) {
          return {
            color: '#ff0000',
            weight: 2,
            opacity: 0.8,
            fillColor: '#ff0000',
            fillOpacity: 0.1
          };
        }
      }).addTo(map);

      // Fit the map view to the new layer
      map.fitBounds(geojsonLayer.getBounds());
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
    }
  });
});


//     $('#currentCountry').on('click', function() {

// 		$.ajax({
// 			url: "libs/php/getRestCountryInfo.php",
// 			type: 'POST',
// 			dataType: 'json',
// 			data: {
//                 iso_a2: $("#iso_a2")
// 			},

// 			success: function(result) {
//             console.log(result)
// 			console.log(JSON.stringify(result));
		
// 			if (result.status.name == "ok") {
//                 if (result.status.name == "ok") {
                    
//                     $("#flag").html(result['data']['flag']);
//                     $("#languages").html(result['data']['languages']['0']['name']);
//                     $("currencyCode").html(result['data']['currencies']['0']['code']);
//                     $("currencyName").html(result['data']['currencies']['0']['name']);
//                     $("currencySymbol").html(result['data']['currencies']['0']['symbol']);
                 
// 			}
			
// 			}},
// 				error: function(jqXHR, textStatus, errorThrown) {
//                     alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
// 			}
// 		}); 
	
// 		});


// function getExchangeRate(country){
//     $.ajax({
//         url: "libs/php/getExchangeRate.php",
//         type: 'GET',
//         dataType: 'json',
//         data: {},
//         success: function(result) {

//             if (result.status.name == "ok") {
//                 $("exchangeRate").html(result['data']['rates'][country.currencyCode]);
//             }
//         },
//         error: function(jqXHR, textStatus, errorThrown) {
//             alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
//     }
//     }); 
// }

// // let countryCode = $("#countries").val()

// $('#weatherForecast').on('click', function(){
//     $.ajax({
//         url: "libs/php/getWeather.php",
//         type: 'GET',
//         dataType: 'json',
//         data: {
//             lat: $('#lat').val(),
//             lng: $('#lng').val()
//         },
//         success: function(result) {
                        
//             if (result.status.name == "ok") {

//                 $('#temp').html(result['data']['current']['temp']); 
//                 $('#feelsLike').html(result['data']['current']['feelsLike']);
//                 $('#main').html(result['data']['current']['weather']['0']['main']);
//                 $('#icon').html(result['data']['current']['weather']['0']['icon']);
//             }
//         },
//         error: function(jqXHR, textStatus, errorThrown) {
//             alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
//     }
     
//     }); 
// })


