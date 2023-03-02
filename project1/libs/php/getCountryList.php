<?php

$url = 'libs/php/json/countryBorders.geo.json';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data = curl_exec($ch);
curl_close($ch);

$decode = json_decode($data, true);

$countries = [];

foreach($decode['features'] as $feature){
    $country = [
        "name" => $feature["properties"]["name"],
        "code" => $feature["properties"]["iso_a2"]
    ];
    $countries[] = $country;
}

$output["countries"] = $countries;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
