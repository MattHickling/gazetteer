<?php

$iso_code = $_GET['iso_code'];

require_once 'config.php';

$restUrl = 'https://restcountries.com/v2/alpha/' . $iso_code ;
$restCurl = curl_init($restUrl);
curl_setopt($restCurl, CURLOPT_RETURNTRANSFER, true);
$restResult = curl_exec($restCurl);
curl_close($restCurl);

$restData = json_decode($restResult, true);

$lat = $restData['latlng'][0];
$lng = $restData['latlng'][1];

$weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $lat . '&lon=' . $lng . '&units=metric&exclude=minutely,hourly,alerts&appid=' . $API_KEY;
$weatherCurl = curl_init($weatherUrl);
curl_setopt($weatherCurl, CURLOPT_RETURNTRANSFER, true);
$weatherResult = curl_exec($weatherCurl);
curl_close($weatherCurl);

$weatherData = json_decode($weatherResult, true);

$currentTemp = $weatherData['main']['temp'];
$minTemp = $weatherData['main']['temp_min'];
$maxTemp = $weatherData['main']['temp_max'];
$weatherDesc = $weatherData['weather'][0]['description'];
$weatherIcon = 'https://openweathermap.org/img/wn/' . $weatherData['weather'][0]['icon'] . '.png';


$forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' . $lat . '&lon=' . $lng . '&units=metric&exclude=minutely,hourly,alerts&appid=' . $API_KEY;
$forecastCurl = curl_init($forecastUrl);
curl_setopt($forecastCurl, CURLOPT_RETURNTRANSFER, true);
$forecastResult = curl_exec($forecastCurl);
curl_close($forecastCurl);

$forecastData = json_decode($forecastResult, true);

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

$response = array(
  'currentTemp' => $currentTemp,
  'minTemp' => $minTemp,
  'maxTemp' => $maxTemp,
  'weatherDesc' => $weatherDesc,
  'weatherIcon' => $weatherIcon,
  'forecast' => $forecast,
);

echo json_encode($response);
?>
