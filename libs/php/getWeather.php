<?php

$iso_code = $_GET['iso_code'];

<<<<<<< HEAD
$restUrl = 'https://restcountries.com/v2/alpha/' . $iso_code;
=======
require_once 'config.php';

$restUrl = 'https://restcountries.com/v2/alpha/' . $iso_code ;
>>>>>>> origin/main
$restCurl = curl_init($restUrl);
curl_setopt($restCurl, CURLOPT_RETURNTRANSFER, true);
$restResult = curl_exec($restCurl);
curl_close($restCurl);

$restData = json_decode($restResult, true);

$lat = $restData['latlng'][0];
$lng = $restData['latlng'][1];

<<<<<<< HEAD
$weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $lat . '&lon=' . $lng . '&units=metric&exclude=minutely,hourly,alerts&appid=8b8b3b8efd5719cc409baad20eeec20a';
=======
$weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $lat . '&lon=' . $lng . '&units=metric&exclude=minutely,hourly,alerts&appid=' . $API_KEY;
>>>>>>> origin/main
$weatherCurl = curl_init($weatherUrl);
curl_setopt($weatherCurl, CURLOPT_RETURNTRANSFER, true);
$weatherResult = curl_exec($weatherCurl);
curl_close($weatherCurl);

$weatherData = json_decode($weatherResult, true);

$currentTemp = $weatherData['main']['temp'];
$minTemp = $weatherData['main']['temp_min'];
$maxTemp = $weatherData['main']['temp_max'];
$weatherDesc = $weatherData['weather'][0]['description'];
$weatherIcon = $weatherData['weather'][0]['icon'];

<<<<<<< HEAD
$forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' . $lat . '&lon=' . $lng . '&units=metric&exclude=minutely,hourly,alerts&appid=8b8b3b8efd5719cc409baad20eeec20a';
=======

$forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' . $lat . '&lon=' . $lng . '&units=metric&exclude=minutely,hourly,alerts&appid=' . $API_KEY;
>>>>>>> origin/main
$forecastCurl = curl_init($forecastUrl);
curl_setopt($forecastCurl, CURLOPT_RETURNTRANSFER, true);
$forecastResult = curl_exec($forecastCurl);
curl_close($forecastCurl);

$forecastData = json_decode($forecastResult, true);

$forecast = array();
$currentDate = date('Y-m-d');
foreach ($forecastData['list'] as $forecastItem) {
    $date = date('Y-m-d', $forecastItem['dt']);
    if ($date > $currentDate) {
        $forecast[] = array(
            'date' => $date,
            'maxTemp' => round($forecastItem['main']['temp_max']),
            'minTemp' => round($forecastItem['main']['temp_min']),
            'icon' => 'https://openweathermap.org/img/wn/' . $forecastItem['weather'][0]['icon'] . '.png',

        );
        $currentDate = $date;
    }
}

$response = array(
    'capitalCity' => $restData['capital'],
    'currentWeatherDesc' => $weatherDesc,
    'currentWeatherIcon' => 'https://openweathermap.org/img/wn/' . $weatherIcon . '.png',
    'currentMaxTemp' => round($maxTemp),
    'currentMinTemp' => round($minTemp),
    'forecast' => $forecast,
    'lastUpdated' => date('Y-m-d H:i:s'),
);

echo json_encode($response);
?>
