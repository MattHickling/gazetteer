<?php

$executionStartTime = microtime(true);

$iso_code = $_POST['iso_code'];

$url = 'https://restcountries.com/v2/alpha/' . $iso_code;; 

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$data = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

$lat = $data['latlng'][0];
$lng = $data['latlng'][1];
$flag = $data['flags'][0];
$name = $data['name'];

$output['data'] = [
    "name" => $name,
    "lat" => $lat,
    "lng" => $lng,
    "flag" => $flag
];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);


?>