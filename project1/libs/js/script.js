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
  let countryName = $(this).find('option:selected').text();
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
              return{color: 'blue', weight: 5};
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

          
                $.ajax({
                  url: 'libs/php/getCountryFlag.php',
                  type: 'GET',
                  data: { iso_code: iso_code },
                  dataType: 'json',
                  success: function(response) {
                      // Update the flag image source with the URL from the JSON response
                      $('#flag').attr('src', response.flag_url);
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                      console.log('Error: ' + textStatus + ' - ' + errorThrown);
                  }
                });
          
                // Show the modal
                $('#countryNameModal').modal('show');
              },
              error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
              }
            });
          });
          
          $(document).on('click', '#countryNameClose', function() {
            $('#countryNameModal').modal('hide');
          });

          console.log("Button with id='weatherForecast' selected successfully");
          $('#weatherForecast').on('click', function () {
            // Get the selected country name
            const countryName = $('#countries option:selected').text();
           
          
            // Make an AJAX call to get the weather information
            $.ajax({
              url: 'libs/php/getWeather.php',
              type: 'GET',
              dataType: 'json',
              data: {
                country: countryName
              },
              
              
              success: function (response) {
                console.log(response);
          
                $('#currentTemp').text(Math.round(response.currentTemp) + "°C");
                $('#minTemp').text(Math.round(response.minTemp) + "°C");
                $('#maxTemp').text(Math.round(response.maxTemp) + "°C");         
                $('#weatherDesc').text(response.weatherDesc);
                $('#weatherIcon').attr('src', response.weatherIcon);
                $('#forecast').empty();
                response.forecast.forEach(function (day) {
                  const tempInCelsius = Math.round(day.temp);
                  const tempString = tempInCelsius >= 10 ? tempInCelsius.toString() : "0" + tempInCelsius.toString();
                  $('#forecast').append(`<li>${day.date}: ${tempString}°C (${day.desc})</li>`);
                });
                
                console.log(response.weatherIcon); 
                $('#weather').modal('show');
              },
              error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
              }
            });
          });
          $(document).on('click', '#getWeatherClose', function() {
            $('#weather').modal('hide');
          });
        }})

        $('#currency').on('click', function () {
       
        
          // Make an AJAX call to get the currency information
          $.ajax({
            url: 'libs/php/getCurrency.php',
            type: 'POST',
            data: {
              iso_code: iso_code,
            },
            success: function (data) {
              console.log(data);
            
              const obj = JSON.parse(data);
            
              console.log(obj.new_amount); // Output: 0.95
              console.log(obj.new_currency); // Output: "EUR"
              console.log(obj.old_currency); // Output: "USD"
              console.log(obj.old_amount);
            
              // Extract new_amount and new_currency from the data object
              let newAmount = obj.new_amount;
              let newCurrency = obj.new_currency;
              let currencyCode = obj.old_currency;
              let baseRate = "1 " + currencyCode;
              let oldAmount = obj.old_amount;
            
              // Update the modal with the new amount and new currency
              $('#newCurrency').text(newCurrency);
              $('#newAmount').text(newAmount);
              $('#currencyName').text(currencyCode);
              $('#currencyCode').text(currencyCode);
              $('#baseRate').text(baseRate);
              $('#oldAmount').text(oldAmount);
            
              // Update the exchange rate in the modal
              let exchangeRateText = "1 " + currencyCode + " = " + newAmount + " " + newCurrency;
              $('#exchangeRate').text(exchangeRateText);
            
              console.log($('#exchangeRate').text(), $('#currencyName').text());
            
              // Show the modal
              $('#currencyModal').modal('show');
          },
            
            error: function (jqXHR, textStatus, errorThrown) {
              alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
            }
          });
        });
        
        $(document).on('click', '#getCurrencyClose', function() {
          $('#currency').modal('hide');

        });
        $('#wiki').on('click', function() {
          // Get the selected country name
          const countryName = $('#countries option:selected').text();
          const iso_code = $('#countries').val();
          
          // Make an AJAX call to retrieve the Wikipedia page
          $.ajax({
            url: 'libs/php/getWikipedia.php',
            method: 'GET',
            data: {
              iso_code: iso_code
            },
            success: function(data) {
              var wikiUrl = data.replace("<br>", "/");
              // Display the Wikipedia page in a new window
              console.log(iso_code);
              // Show the modal
              console.log(data);
              $('#wikiModal #wikiFrame').attr('src', wikiUrl);

              $('#wikiModal').modal('show');
            },
            
            error: function(jqXHR, textStatus, errorThrown) {
              console.log('Error: ' + textStatus + ' - ' + errorThrown);
            }
          });
          
        });
        $(document).on('click', '#getWikiClose', function() {
          $('#wikiModal').modal('hide');

        });
      }})
    })