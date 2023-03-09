let map = L.map('map', { attributionControl: false }).setView([0, 0], 9);

const tile = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);

let youAreHere = L.icon({
  iconUrl: 'libs/images/marker-icon.png',
  iconSize: [10, 15]
});

let countries = [];
$.ajax({
  type: 'GET',
  url: 'libs/php/getCountryList.php',
  dataType: 'json',
  success: function (data) {
    console.log(data);
    countries = data.countries.sort((a, b) => a.name.localeCompare(b.name));
    countries.forEach((data) => {
      $('#countries').append(`<option value="${data.code}">${data.name}</option>`);
    });
  },
  error: function (jqXHR, textStatus, errorThrown) {
    alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
  }
});

function success(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  marker = L.marker([lat, lng], { icon: youAreHere })
    .addTo(map)
    .bindPopup('You are here')
    .openPopup();

  if (!marker) {
    console.error('Could not create marker');
    return;
  }
}

function error(err) {
  if (err.code === 1) {
    alert('Please allow geolocation access');
  } else {
    alert('Cannot get current location');
  }
}

navigator.geolocation.getCurrentPosition(success, error);
let geojsonLayer = L.geoJSON();


let polygonLayer;

$('#countries').on('change', function () {
  let iso_code = $(this).val();

  // Remove existing polygon layer
  if (polygonLayer) {
    map.removeLayer(polygonLayer);
  }

  $.ajax({
    url: 'libs/php/getRestCountryInfo.php',
    type: 'POST',
    dataType: 'json',
    data: {
      iso_code: iso_code,
    },
    
    success: function (response) {
      let lat = response.data.lat;
      let lng = response.data.lng;
      console.log(response);
    
      map.setView([lat, lng], 6);
      marker.setLatLng([lat, lng]);

    
      $.ajax({
        url: 'libs/php/getCountryPolygon.php?iso_code=' + iso_code,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
          console.log(response);
      
          // create a new L.geoJSON layer with the geometry object
          polygonLayer = L.geoJSON({
            type: "Feature",
            properties: {},
            geometry: response
          }, {
            style: function () {
              return{color: 'blue'};
            }
          }).bindPopup(function (layer) {
            return layer.feature.properties.response;
          }).addTo(map);
      
          map.fitBounds(polygonLayer.getBounds());
      
          // Attach a click event listener to the button
          $('#countryName').on('click', function() {
            // Make the AJAX request to get the country information
            $.ajax({
              url: 'libs/php/getCountryInfo.php',
              type: 'POST',
              dataType: 'json',
              data: {
                iso_code: iso_code,
              },
              success: function (data) {
                // Update the modal with the country name, capital city, and population
                $('#country').text(data.name);
                $('#capitalCity').text(data.capital);
                $('#population').text(data.population);
                // Show the modal
                $('#countryNameModal').modal('show');
              },
              error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
              }
            });
          });
        },
    });
  }});
});