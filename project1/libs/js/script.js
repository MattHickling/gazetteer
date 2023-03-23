let map = L.map("map", { attributionControl: false });

const tile = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
  }
).addTo(map);

map.setView([0, 0], 9);

$(document).ready(function() {
  //select list
  let countries = [];

  $.ajax({
    type: "GET",
    url: "libs/php/getCountryList.php",
    dataType: "json",
    success: function (data) {
      console.log(data);
      countries = data.countries.sort((a, b) => a.name.localeCompare(b.name));
      countries.forEach((data) => {
        $("#countries").append(
          `<option value="${data.code}">${data.name}</option>`
        );
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown + " " + jqXHR + " " + textStatus);
    },
  });

  navigator.geolocation.getCurrentPosition(success, error);

  function success(pos) {
    function reverseGeocode(latitude, longitude) {
      $.ajax({
        url: "libs/php/getLatLng.php",
        method: "POST",
        dataType: "json",
        data: {
          latitude: latitude,
          longitude: longitude,
        },
        success: function (data) {
          var geoCountryCode = data.results[0].components["ISO_3166-1_alpha-2"];
          $("#countries").val(geoCountryCode).trigger("change");
          const marker = L.marker([latitude, longitude]).addTo(map);
        },
        error: function (jqXHR, textStatus, errorThrown) {},
      });
    }
  
    const geoLatitude = pos.coords.latitude;
    const geoLongitude = pos.coords.longitude;
  
    reverseGeocode(geoLatitude, geoLongitude);
  }
  

  function error(err) {
    if (err.code === 1) {
      alert("Please allow geolocation access");
    } else {
      alert("Cannot get current location");
    }
  }

  
//-------------Changing countries------------------------------------

let geojsonLayer = L.geoJSON();

let polygonLayer;

$("#countries").on("change", function () {
  let iso_code = $(this).val();
  let countryName = $(this).find("option:selected").text();
  
  // Call addCountryPolygon function to display country polygon
  addCountryPolygon(iso_code);
  
  // Call other functions to get country information
  
  getCountryInfo(iso_code);
  getWiki(iso_code);
  getNews(iso_code);
  getCurrency(iso_code);
  getWeather(iso_code);
  getNearbyCities();
  getAirportMarkers();

  // Remove existing polygon layer
  if (polygonLayer) {
    map.removeLayer(polygonLayer);
  }

  // clear all existing layers from the map except the maxZoom layer
  map.eachLayer(function (layer) {
    if (layer.options && layer.options.maxZoom !== undefined) {
      return; 
    }
    map.removeLayer(layer);
  })
});



//------------polygon------------------------------------------------

function addCountryPolygon(iso_code) {
  $.ajax({
    url: "libs/php/getCountryPolygon.php?iso_code=" + iso_code,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);

      // creates a new L.geoJSON layer with the geometry object
      var polygonLayer = L.geoJSON(
        {
          type: "Feature",
          properties: {},
          geometry: response,
        },
        {
          style: function () {
            return { color: "blue", weight: 5 };
          },
        }
      )
        .bindPopup(function (layer) {
          return layer.feature.properties.response;
        })
        .addTo(map);

      map.fitBounds(polygonLayer.getBounds());
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
}



  
//--------------country info------------------------------------------
function getCountryInfo(iso_code) {
  $.ajax({
    url: "libs/php/getCountryInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      iso_code: iso_code,
    },
    success: function (data) {
      $("#country").text(data.name);
      $("#capitalCity").text(data.capital);
      $("#population").text(data.population);

      // retrieves the country flag
      $.ajax({
        url: "libs/php/getCountryFlag.php",
        type: "GET",
        data: { iso_code: iso_code },
        dataType: "json",
        success: function (response) {
          // Updates the flag image source with the URL from the JSON response
          $("#flag").attr("src", response.flag_url);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("Error: " + textStatus + " - " + errorThrown);
        },
      });

    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown + " " + jqXHR + " " + textStatus);
    },
  });
}




  //------------------retrieves the weatherforecast--------------------------------

function getWeather(iso_code) {
  $.ajax({
    url: "libs/php/getWeather.php",
    type: "GET",
    dataType: "json",
    data: {
      iso_code: iso_code,
    },
    success: function (response) {
      console.log(response);
      $("#currentTemp").text(Math.round(response.currentTemp) + "°C");
      $("#minTemp").text(Math.round(response.minTemp) + "°C");
      $("#maxTemp").text(Math.round(response.maxTemp) + "°C");
      $("#weatherDesc").text(response.weatherDesc);
      $("#weatherIcon").attr("src", response.weatherIcon);
      $("#forecast").empty();
      response.forecast.forEach(function (day) {
        const tempInCelsius = Math.round(day.temp);
        const tempString =
          tempInCelsius >= 10
            ? tempInCelsius.toString()
            : "0" + tempInCelsius.toString();
        $("#forecast").append(
          `<li>${day.date}: ${tempString}°C (${day.desc})</li>`

          
        )
      });
    },

  
    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown + " " + jqXHR + " " + textStatus);
    },
  });
}

$(document).on("click", "#getWeatherClose", function () {
  $("#weather").modal("hide");
});

  //--------------------retrieves currency----------------------------------

 function getCurrency(iso_code) {
    $.ajax({
      url: "libs/php/getCurrency.php",
      type: "POST",
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

        // Updates the modal with the new amount and new currency
        $("#newCurrency").text(newCurrency);
        $("#newAmount").text(newAmount);
        $("#currencyName").text(currencyCode);
        $("#currencyCode").text(currencyCode);
        $("#baseRate").text(baseRate);
        $("#oldAmount").text(oldAmount);

        // Update the exchange rate in the modal
        let exchangeRateText =
          "1 " + currencyCode + " = " + newAmount + " " + newCurrency;
        $("#exchangeRate").text(exchangeRateText);

        console.log($("#exchangeRate").text(), $("#currencyName").text());

      },
      

      error: function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown + " " + jqXHR + " " + textStatus);
      },
    });
  }});

    $(document).on("click", "#getCurrencyClose", function () {
      $("#currency").modal("hide");
    });





  //---------------------retrieves the wiki page-----------------------------------------
   
  function getWiki(iso_code) {
    $.ajax({
      url: "libs/php/getWikipedia.php",
      method: "GET",
      data: {
        iso_code: iso_code,
      },
      success: function (data) {
    const countryName = $("#countries option:selected").text();

    // Constructs the Wikipedia URL for the selected country
    let wikiUrl = data.replace("<br>", "/") + encodeURIComponent(countryName);

    // console.log(iso_code);

    // console.log(data);
    $("#wikiModal #wikiFrame").attr("src", wikiUrl);
    $("#wikiModal .modal-title").text(countryName + " - Wikipedia");

  },

  error: function (jqXHR, textStatus, errorThrown) {
    console.log("Error: " + textStatus + " - " + errorThrown);
  },
    });
  };
  $(document).on("click", "#getWikiClose", function () {
    $("#wikiModal").modal("hide");
  });



  //------------retrieves the news articles for the news modal----------------------------------
   function getNews(iso_code) {
    
      $.ajax({
          url: "libs/php/getNews.php",
          type: "POST",
          dataType: "json",
          data: {
              iso_code: iso_code,
          },
          success: function (response) {
            // Use the response data directly as an array of objects
            const data = response;
        
            // Clear the existing news
            $("#newsModalBody").empty();

            if (data.length === 0) {
              $("#newsModalBody").text("Apologies, there is news feed availible for this country");
              return;
          }
        
          data.forEach(function (article) {
            const title = article.title;
            const author = article.author;
            const publishedAt = article.publishedAt;
            const link = $("<a>")
                .attr("href", article.url)
                .attr("target", "_blank")
                .text(title); 
        
            
            const articleInfo = $("<div>")
                .addClass("article-info")
                .append(link)
                .append($("<p>").html(`By ${author} | ${publishedAt}`));
        
          
            articleInfo.find("a").on("click", function () {
                window.open(article.url, "_blank");
            });
        
            // Append the articleInfo div to the news modal body
            $("#newsModalBody").append(articleInfo);
        });
        
        },
        
          error: function (jqXHR, textStatus, errorThrown) {
              alert(errorThrown + " " + jqXHR + " " + textStatus);
          },
      });
  };

   

    
//----------Markers--------------------------------------------------------------------------
  function getNearbyCities() {
    let iso_code = $("#countries").val();

    $.ajax({
        url: "libs/php/getCityMarker.php",
        type: "POST",
        dataType: "json",
        data: {
            iso_code: iso_code,
        },
        success: function (data) {
          let cityMarkers = L.markerClusterGroup();
      
          // Define the custom icon options
          let iconOptions = {
              icon: "fa-building",
              markerColor: "red",
              prefix: "fa",
              shape: "circle",
              iconSize: [30, 30],
          };
      
          data.geonames.forEach(function (city, index) {
  
              let icon = L.ExtraMarkers.icon({
                  ...iconOptions,
                  number: index + 1,
              });
      
              let marker = L.marker([city.lat, city.lng], { icon });
              marker.bindPopup(city.name);
              cityMarkers.addLayer(marker);
          });
      
          cityGroup.addLayer(cityMarkers); 
          cityMarkers.addTo(map);
         
      },
      
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown + " " + jqXHR + " " + textStatus);
        },
       } )  } ;


    function getAirportMarkers() {
    let iso_code = $("#countries").val();

  

    $.ajax({
        url: "libs/php/getAirportMarker.php",
        type: "POST",
        dataType: "json",
        data: {
            iso_code: iso_code,
        },
        success: function (data) {
          let airportMarkers = L.markerClusterGroup();
      
          let iconOptions = {
              icon: "fa-plane",
              markerColor: "blue",
              prefix: "fas",
              shape: "circle",
              iconSize: [30, 30],
          };
      
          data.airports.forEach(function (airport) {
          
              let icon = L.ExtraMarkers.icon(iconOptions);
      
              let marker = L.marker([airport.lat, airport.lng], { icon });
              marker.bindPopup(airport.name);
              airportMarkers.addLayer(marker);
          });
          
          airportGroup.addLayer(airportMarkers);
          airportMarkers.addTo(map);
   
      },
      
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown + " " + jqXHR + " " + textStatus);
        },
    });
}

let cityGroup = L.layerGroup();
let airportGroup = L.layerGroup();

var overlays = {
  "Cities": cityGroup,
  "Airports": airportGroup,
};

var layerControl = L.control.layers(null, overlays).addTo(map);

cityGroup.addTo(map);
airportGroup.addTo(map);

// // Set the "Cities" and "Airports" layers to be checked by default
// layerControl.addOverlay(cityGroup, "Cities");
// layerControl.addOverlay(airportGroup, "Airports");

// layerControl.on("baselayerchange", function (event) {
//   if (event.name === "Cities") {
//     cityGroup.addTo(map);
//     airportGroup.removeFrom(map);
//   } else if (event.name === "Airports") {
//     airportGroup.addTo(map);
//     cityGroup.removeFrom(map);
//   }
// });

// layerControl.on("overlayadd", function (event) {
//   var layer = event.layer;
//   if (layer === cityGroup || layer === airportGroup) {
//     layer.eachLayer(function (marker) {
//       marker.setStyle({ opacity: 1 });
//     });
//   }
// });

// layerControl.on("overlayremove", function (event) {
//   var layer = event.layer;
//   if (layer === cityGroup || layer === airportGroup) {
//     layer.eachLayer(function (marker) {
//       marker.setStyle({ opacity: 0 });
//     });
//   }
// });

// $.when(getNearbyCities(), getAirportMarkers()).done(function () {
//   // Set the "Cities" and "Airports" layers to be checked by default
//   layerControl.addOverlay(cityGroup, "Cities");
//   layerControl.addOverlay(airportGroup, "Airports");


  // Set the default selected layers
  // layerControl.setSelectedLayers([cityGroup, airportGroup]);
// });


// Object.keys(layerControl._layers).forEach(function (key) {
//   var layer = layerControl._layers[key].layer;
//   if (layer === cityGroup || layer === airportGroup) {
//     layerControl._map.addLayer(layer);
//   }
// });

// layerControl.on("add", function (event) {
//   var layer = event.layer;
//   if (layer === cityGroup || layer === airportGroup) {
//     layer.eachLayer(function (marker) {
//       marker.setStyle({ opacity: 1 });
//     });
//   }
// });

// layerControl.on("remove", function (event) {
//   var layer = event.layer;
//   if (layer === cityGroup || layer === airportGroup) {
//     layer.eachLayer(function (marker) {
//       marker.setStyle({ opacity: 0 });
//     });
//   }
// });
