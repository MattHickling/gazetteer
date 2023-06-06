<?php
include 'config.php';

$iso_code = $_GET['iso_code'];

$restUrl = 'https://restcountries.com/v2/alpha/' . $iso_code;
$restCurl = curl_init($restUrl);
curl_setopt($restCurl, CURLOPT_RETURNTRANSFER, true);
$restResult = curl_exec($restCurl);
curl_close($restCurl);

$restData = json_decode($restResult, true);

$lat = $restData['latlng'][0];
$lng = $restData['latlng'][1];

$geonamesUrl = 'http://api.geonames.org/timezoneJSON?lat=' . $lat . '&lng=' . $lng . '&username=' . $username;
$geonamesCurl = curl_init($geonamesUrl);
curl_setopt($geonamesCurl, CURLOPT_RETURNTRANSFER, true);
$geonamesResult = curl_exec($geonamesCurl);
curl_close($geonamesCurl);

$geonamesData = json_decode($geonamesResult, true);

$timezone = $geonamesData['timezoneId'];
$current_time = date('H:i d-m-Y', strtotime($geonamesData['time']));
$sunset_time = date('H:i d-m-Y', strtotime($geonamesData['sunset']));
$sunrise_time = date('H:i d-m-Y', strtotime($geonamesData['sunrise']));

$response = array(
    'timezone' => $timezone,
    'time' => $current_time,
    'sunset' => $sunset_time,
    'sunrise' => $sunrise_time
);

echo json_encode($response);
?>
