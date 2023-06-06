<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url = './countryBorders.geo.json';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result = curl_exec($ch);

curl_close($ch);

header('Content-Type: application/json; charset=UTF-8');

$data = file_get_contents($url);
$decode = json_decode($data, true);
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$countries = [];

foreach ($decode["features"] as $feature) {
    $country = [
        "name" => $feature["properties"]["name"],
        "code" => $feature["properties"]["iso_a2"]
    ];
    $countries[] = $country;
}
$output['countries'] = $countries;

echo json_encode($output);

?>
