window.addEventListener('load', function() {
  document.querySelector('.preloader').style.display = 'none';
});

let map = L.map("map", { attributionControl: true });

const tile =  L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 15,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
).addTo(map);

const satelliteTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

map.setView([0, 0], 9);

$(document).ready(function() {
  //select list
  let countries = [];

  $.ajax({
    type: "GET",
    url: "libs/php/getCountryList.php",
    dataType: "json",
    success: function (data) {
      // console.log(data);
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
  console.log(iso_code)
  getNews(iso_code);
  getCurrency(iso_code);
  getWeather(iso_code);
  getTimeZone(iso_code)
  getNearbyCities();
  getAirportMarkers();

  // Remove existing polygon layer
  if (polygonLayer) {
    map.removeLayer(polygonLayer);
  }

  
  map.eachLayer(function (layer) {
    if (layer.options && layer.options.maxZoom !== undefined) {
      return; 
    }
    map.removeLayer(layer);
  })




//------------polygon------------------------------------------------

function addCountryPolygon(iso_code) {
  $.ajax({
    url: "libs/php/getCountryPolygon.php?iso_code=" + iso_code,
    type: "GET",
    dataType: "json",
    success: function (response) {
      // console.log(response);


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
      $("#continent").text(data.continent);
      $("#countryCode").text(data.countryCode);
      $("#area").text(data.area);

      // retrieves the country flag
      $.ajax({
        url: "libs/php/getCountryFlag.php",
        type: "GET",
        data: { iso_code: iso_code },
        dataType: "json",
        success: function (response) {
       
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
        $("#weatherModalLabel").text(response.capitalCity);
  
        // Populate current weather
        $("#todayConditions").text(response.currentWeatherDesc);
        $("#todayIcon").attr("src", response.currentWeatherIcon);
        $("#todayMaxTemp").text(response.currentMaxTemp);
        $("#todayMinTemp").text(response.currentMinTemp);
  
        for (var i = 0; i < response.forecast.length; i++) {
          var forecastItem = response.forecast[i];
          var date = new Date(forecastItem.date);
          var formattedDate = formatDate(date);
  
          $("#day" + (i + 1) + "Date").text(formattedDate);
          $("#day" + (i + 1) + "MaxTemp").text(forecastItem.maxTemp);
          $("#day" + (i + 1) + "MinTemp").text(forecastItem.minTemp);
          $("#day" + (i + 1) + "Icon").attr("src", forecastItem.icon);
        }
  
        $("#lastUpdated").text(response.lastUpdated);
  
        // Show the weather modal
        $("#weatherModal").modal("show");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown + " " + jqXHR + " " + textStatus);
      },
    });
  }
  
  function formatDate(date) {
    var options = { month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  
  $(document).on("click", "#getWeatherClose", function () {
    $("#weatherModal").modal("hide");
  });
  
  

  //--------------------retrieves currency----------------------------------

  function getCurrency(iso_code) {
    $("#inputAmount").val("1");
    $("#convertedAmount").val("");
  
    $.ajax({
      url: "libs/php/getCurrency.php",
      type: "POST",
      data: {
        iso_code: iso_code,
      },
      success: function (data) {
        const obj = JSON.parse(data);
  
        let newAmount = obj.new_amount;
        let newCurrency = obj.new_currency;
        let currencyCode = obj.old_currency;
        let baseRate = "1 " + currencyCode;
        let oldAmount = obj.old_amount;
  
        $("#newCurrency").text(newCurrency);
        $("#newAmount").text(newAmount);
        $("#currencyName").text(currencyCode);
        $("#currencyCode").text(currencyCode);
        $("#baseRate").text(baseRate);
        $("#oldAmount").text(oldAmount);
  
        let exchangeRateText = "1 " + currencyCode + " = " + newAmount + " " + newCurrency;
        $("#exchangeRate").text(exchangeRateText);
  
        let inputAmount = parseFloat($("#inputAmount").val());
  
        if (!isNaN(inputAmount)) {
          let convertedAmount;
          if (inputAmount === 0) {
            convertedAmount = 0;
          } else {
            convertedAmount = (inputAmount * newAmount).toFixed(2);
          }
          let convertedAmountText = convertedAmount + " " + newCurrency;
          $("#convertedAmount").val(convertedAmountText);
        }
  
        $("#inputCurrency").val("USD");
  
        $("#inputAmount").on("input", function () {
          let inputAmount = parseFloat($(this).val());
  
          if (!isNaN(inputAmount)) {
            let convertedAmount;
            if (inputAmount === 0) {
              convertedAmount = 0;
            } else {
              convertedAmount = (inputAmount * newAmount).toFixed(2);
            }
            let convertedAmountText = convertedAmount + " " + newCurrency;
            $("#convertedAmount").val(convertedAmountText);
          }
        });
  
        $("#inputCurrencyLabel").text("USD");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown + " " + jqXHR + " " + textStatus);
      },
    });
  }
  

  
  $(document).on("click", "#getCurrencyClose", function () {
    $("#currencyModal").modal("hide");
  });
  
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
        console.log(data);
        const summary = data.summary;
        const wikipediaLink = data.wikipediaLink;
  
        console.log("Summary: ", summary);
        console.log("Wikipedia Link: ", wikipediaLink);
  
        if (summary) {
          $("#wikiModal .modal-body #wikiSummary").text(summary);
        }
  
        if (wikipediaLink) {
          let absoluteLink = wikipediaLink;
          if (!absoluteLink.startsWith("http") && !absoluteLink.startsWith("www")) {
            absoluteLink = "https://" + absoluteLink;
          }
          $("#wikiModal .modal-body #wikiLink").attr("href", absoluteLink);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error: " + textStatus + " - " + errorThrown);
      },
    });
  }
  
  $(document).ready(function () {
    $("#wikiModal").modal({
      show: false,
    });
  });
  
  $(document).on("click", "#getWikiClose", function () {
    $("#wikiModal").modal("hide");
  });
  

  //------------retrieves the news articles for the news modal----------------------------------
 
  function getNews(iso_code) {
    $.ajax({
      url: 'libs/php/getNews.php',
      method: 'GET',
      dataType: 'json',
      data: {
        iso_code: iso_code 
      },
      success: function(response) {
        var articles = response.articles;
        if (articles.length > 0) {
          $('#articlesContainer').empty();
          for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            var title = article.title;
            var url = article.url;
            var publishedAt = article.publishedAt;
            var imageUrl = article.imageUrl;
            var category = article.category;
  
            var articleElement = $('<div class="row article mb-3"></div>');  
            var imageCol = $('<div class="col-md-5"></div>');
            if (imageUrl) {
              imageCol.append('<a href="' + url + '" target="_blank"><img class="img-fluid rounded bigger-image" src="' + imageUrl + '" alt="Article Image"></a>');
            } else {
              imageCol.append('<img class="img-fluid rounded bigger-image" src="libs/images/news.jpeg" alt="Article Image">');
            }
  
            var contentCol = $('<div class="col-md-7"></div>');
            contentCol.append('<h4 class="titleHeading"><a href="' + url + '" target="_blank">' + title + '</a></h4>');
            var publishedAtMoment = moment(publishedAt, 'YYYY-MM-DD HH:mm:ss');
            var publishedText = publishedAtMoment.fromNow();
            var metadata = $('<div class="metadata"></div>');
            metadata.append('<p class="categoryText">' + category + '</p>');
  
            var metadataRow = $('<div class="row"></div>');
            var categoryCol = $('<div class="col-md-6"></div>').append(metadata.children()[0]);
            var publishedAtCol = $('<div class="col-md-6"></div>').append('<p class="publishedText">' + publishedText + '</p>');
  
            metadataRow.append(categoryCol);
            metadataRow.append(publishedAtCol);
            contentCol.append(metadataRow);
  
            articleElement.append(imageCol);
            articleElement.append(contentCol);
  
            $('#articlesContainer').append(articleElement);
          }
  
        } else {
          $('#newsModal').modal('hide');
          alert('No articles found.');
        }
      },
      error: function() {
        console.log('Error occurred while retrieving articles.');
      }
    });
  }
  
  
  
// ---------- Time zone ----------------------------

function getTimeZone(isoCode) {
  $.ajax({
    url: 'libs/php/getTimeZone.php',
    type: 'GET',
    data: { iso_code: isoCode },
    dataType: 'json',
    success: function(response) {
      $('#modal-timezone').text(response.timezone);
      
      const currentTime = new Date(response.time);
      const currentFormattedTime = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      $('#modal-current-time').text(currentFormattedTime);
      
      const sunsetTime = new Date(response.sunset);
      const sunsetFormattedTime = sunsetTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      $('#modal-sunset-time').text(sunsetFormattedTime);
      
      const sunriseTime = new Date(response.sunrise);
      const sunriseFormattedTime = sunriseTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      $('#modal-sunrise-time').text(sunriseFormattedTime);
    },
    error: function() {
      alert('Failed to retrieve country information.');
    }
  });
}

$(document).on("click", "#getTimeClose", function () {
  $("#country-modal").modal("hide");
});

  
 
});

// --------------------- date ---------------------------------------------
function formatDate(date) {
  return moment(date).format('ddd, MMM Do');
}


  
//----------Markers--------------------------------------------------------------------------
let cityGroup = L.layerGroup();
let airportGroup = L.layerGroup();

var overlays = {
  "Cities": cityGroup,
  "Airports": airportGroup,
};

var baseLayers = {
  "Street Map": tile,
  "Satellite": satelliteTile,
};

var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

function formatPopulation(population) {
  if (population < 1000) {
    return population.toString();
  } else if (population < 1000000) {
    return (population / 1000).toFixed(1) + 'K';
  } else {
    return (population / 1000000).toFixed(1) + 'M';
  }
}

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

      let iconOptions = {
        icon: "fa-building",
        markerColor: "red",
        prefix: "fa",
        shape: "circle",
        iconSize: [40, 40],
      };

      data.geonames.forEach(function (city, index) {

        let icon = L.ExtraMarkers.icon({
          ...iconOptions,
          number: index + 1,
          className: 'marker-icon' 
        });

        let marker = L.marker([city.lat, city.lng], { icon });
        marker.bindPopup(city.name);
        marker.bindTooltip(city.name + '<br>Population: ' + formatPopulation(city.population));
        cityMarkers.addLayer(marker);
      });

      cityGroup.addLayer(cityMarkers);
      map.addLayer(cityGroup);
      $('input:checkbox[value="Cities"]').prop('checked', true);
    },

    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown + " " + jqXHR + " " + textStatus);
    },
  });
}

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
        iconSize: [40, 40],
      };

      data.airports.forEach(function (airport) {

        let icon = L.ExtraMarkers.icon(iconOptions);

        let marker = L.marker([airport.lat, airport.lng], { icon });
        marker.bindPopup(airport.name);
        marker.bindTooltip(airport.name)
        airportMarkers.addLayer(marker);
      });

      airportGroup.addLayer(airportMarkers);
      map.addLayer(airportGroup);
      $('input:checkbox[value="Airports"]').prop('checked', true);
    },

    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown + " " + jqXHR + " " + textStatus);
    },
  });
}


// buttons   

var countryButton = L.easyButton({
  states: [{
    stateName: 'default',
    icon: 'fa fa-globe fa-2x btn-lg easybutton-icon',
    onClick: function() {
      $('#countryNameModal').modal('show');
    }
  }]
}).addTo(map);
countryButton.button.id = 'countryButton';

var currencyButton = L.easyButton({
  states: [{
    stateName: 'default',
    icon: 'fa fa-coins fa-2x easybutton-icon',
    onClick: function() {
      $('#currencyModal').modal('show');
    }
  }]
}).addTo(map);
currencyButton.button.id = 'currencyButton';

var wikiButton = L.easyButton({
  states: [{
    stateName: 'default',
    icon: 'fa fa-brands fa-wikipedia-w fa-2x easybutton-icon',
    onClick: function() {
      $('#wikiModal').modal('show');
    }
  }]
}).addTo(map);
wikiButton.button.id = 'wikiButton';

var newsButton = L.easyButton({
  states: [{
    stateName: 'default',
    icon: 'fa fa-newspaper fa-2x easybutton-icon',
    onClick: function() {
      $('#newsModal').modal('show');
    }
  }]
}).addTo(map);
newsButton.button.id = 'newsButton';

var weatherButton = L.easyButton({
  states: [{
    stateName: 'default',
    icon: 'fa fa-cloud-sun-rain fa-2x easybutton-icon',
    onClick: function() {
      $('#weather').modal('show');
    }
  }]
}).addTo(map);
weatherButton.button.id = 'weatherButton';

var countryButton = L.easyButton({
  states: [{
    stateName: 'default',
    icon: 'fa fa-clock fa-2x easybutton-icon',
    onClick: function() {
      $('#country-modal').modal('show');
    }
  }]
}).addTo(map);
countryButton.button.id = 'countryButton';

