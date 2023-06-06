<?php

$iso_code = $_GET['iso_code'];

$url = "./countryBorders.geo.json";


$json = file_get_contents($url);


$data = json_decode($json, true);


if (json_last_error() !== JSON_ERROR_NONE) {
    echo 'JSON error: ' . json_last_error_msg();
    exit;
}


foreach ($data["features"] as $feature) {

    $code = $feature["properties"]["iso_a2"];
    if ($code == $iso_code) {

        $geometry = $feature["geometry"];

        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode($geometry);
        break;
    }
}
?>