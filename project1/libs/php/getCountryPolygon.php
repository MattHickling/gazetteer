<?php

$iso_code = $_GET['iso_code'];

$url = "./countryBorders.geo.json";

// Read the contents of the file
$json = file_get_contents($url);

// Parse the JSON response
$data = json_decode($json, true);

// Check for JSON parsing errors
if (json_last_error() !== JSON_ERROR_NONE) {
    echo 'JSON error: ' . json_last_error_msg();
    exit;
}

// Loop through the features
foreach ($data["features"] as $feature) {
    // Get the ISO code of the country
    $code = $feature["properties"]["iso_a2"];

    // Check if it is the country you want
    if ($code == $iso_code) {
        // Get the coordinates of the polygon
        $coordinates = $feature["geometry"]["coordinates"][0];

        header('Content-Type: application/json; charset=UTF-8');

        // Print the coordinates
        echo json_encode($coordinates);
        break;
    }
}
?>
