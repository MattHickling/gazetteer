let map = L.map('map',{ attributionControl:false } ).setView([0, 0], 9);


const tile = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);

function success(position){
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    // Check if map object is defined
    if (!map) {
        console.error('Map object not defined');
        return;
    }

    // Create marker and add it to the map
    marker = L.marker([lat, lng], {icon: youAreHere}).addTo(map)
        .bindPopup('You are here')
        .openPopup();

    // Check if marker object was successfully created
    if (!marker) {
        console.error('Could not create marker');
        return;
    }
}


// Request location information
navigator.geolocation.getCurrentPosition(success, error);
function error(err){
    if(err.code === 1) {
        alert("Please allow geolocation access");
    } else {
        alert("Cannot get current location");
    }
}




let youAreHere = L.icon({
    iconUrl: 'libs/images/marker-icon.png',

    iconSize: [10, 15],
});


let geojsonLayer; // define the variable outside the event listener to make it accessible later

$('#countries').on('change', function() {
  let isoCode = $(this).val();
  
  // Remove the current polygon layer, if it exists
  if (geojsonLayer) {
    map.removeLayer(geojsonLayer);
  }

  $.ajax({
    url: 'libs/php/getCountryList.php',
    type: 'POST',
    data: { iso_code: isoCode },
    success: function(data) {
      // Parse the data and filter by iso_code
      let geojson = JSON.parse(data);
      let features = geojson.features.filter(feature => feature.properties.iso_a2 === isoCode);
      let countryGeoJSON = {
        type: 'FeatureCollection',
        features: features
      };

      // Create a GeoJSON layer for the country and add it to the map
      geojsonLayer = L.geoJSON(countryGeoJSON, {
        style: {
          color: 'red'
        }
      }).addTo(map);

      // Fit the map to the bounds of the GeoJSON layer
      map.fitBounds(geojsonLayer.getBounds());
    }
  });
});

  




//Drop down list sorted alphabetically
list = [];

$('#countries').click(function() {

        $.ajax({
            type: "GET",
            url: "libs/php/getCountryList.php",
            dataType: "json",
            success: function(data) {
                console.log(data)
                list = data.countries;
                list = data.countries.sort((a, b) => a.name.localeCompare(b.name));
                list.forEach((data) => {
                $('#countries').append(`<option value="${data.code}">${data.name}</option>`);
                 
            })},
            error: function(jqXHR, textStatus, errorThrown) {
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


        
   



 

