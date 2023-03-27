<?php
// get iso_code parameter from URL
$iso_code = $_GET['iso_code'];

// send cURL request to REST Countries API to retrieve latitude and longitude of selected country
$restUrl = 'https://restcountries.com/v2/alpha/' . $iso_code ;
$restCurl = curl_init($restUrl);
curl_setopt($restCurl, CURLOPT_RETURNTRANSFER, true);
$restResult = curl_exec($restCurl);
curl_close($restCurl);

// parse JSON response from REST Countries API
$restData = json_decode($restResult, true);

// extract latitude and longitude of selected country
$lat = $restData['latlng'][0];
$lng = $restData['latlng'][1];

// send cURL request to OpenWeather API to retrieve weather information using latitude and longitude
$weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $lat . '&lon=' . $lng . '&units=metric&exclude=minutely,hourly,alerts&appid=8b8b3b8efd5719cc409baad20eeec20a';
$weatherCurl = curl_init($weatherUrl);
curl_setopt($weatherCurl, CURLOPT_RETURNTRANSFER, true);
$weatherResult = curl_exec($weatherCurl);
curl_close($weatherCurl);

// parse JSON response from OpenWeather API
$weatherData = json_decode($weatherResult, true);

// extract necessary weather information
$currentTemp = $weatherData['main']['temp'];
$minTemp = $weatherData['main']['temp_min'];
$maxTemp = $weatherData['main']['temp_max'];
$weatherDesc = $weatherData['weather'][0]['description'];
$weatherIcon = 'https://openweathermap.org/img/wn/' . $weatherData['weather'][0]['icon'] . '.png';


// extract forecast information for next 5 days
$forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' . $lat . '&lon=' . $lng . '&units=metric&exclude=minutely,hourly,alerts&appid=8b8b3b8efd5719cc409baad20eeec20a';
$forecastCurl = curl_init($forecastUrl);
curl_setopt($forecastCurl, CURLOPT_RETURNTRANSFER, true);
$forecastResult = curl_exec($forecastCurl);
curl_close($forecastCurl);

// parse JSON response from OpenWeather API
$forecastData = json_decode($forecastResult, true);

// extract forecast information for next 5 days
$forecast = array();
for ($i = 0; $i < 5; $i++) {
  $date = date('D, M j', $forecastData['list'][$i]['dt']);
  $temp = $forecastData['list'][$i]['main']['temp'];
  $desc = $forecastData['list'][$i]['weather'][0]['description'];
  $forecast[] = array(
    'date' => $date,
    'temp' => $temp,
    'desc' => $desc
  );
}

// create JSON response with extracted weather information
$response = array(
  'currentTemp' => $currentTemp,
  'minTemp' => $minTemp,
  'maxTemp' => $maxTemp,
  'weatherDesc' => $weatherDesc,
  'weatherIcon' => $weatherIcon,
  'forecast' => $forecast,
);

// return JSON response to AJAX request
echo json_encode($response);
 ?>