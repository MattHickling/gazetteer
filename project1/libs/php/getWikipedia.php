<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check if ISO code is set in the AJAX call
// if (isset($_POST['iso_code'])) {
//     $iso_code = $_POST['iso_code'];
//     echo 'ISO code: ' . $iso_code . '<br>'; // Add this line for debugging
// } else {
//     echo 'Error: ISO code not set.';
//     exit;
// }

// Get the ISO code of the country from the AJAX call
$iso_code = $_GET['iso_code'];


// Set up the API request URL with your API key and the ISO code
$request_url = "https://api.opencagedata.com/geocode/v1/json?q=" . $iso_code . "&key=aa2b92718386464a8fb461ba54715c53";

// Set up the cURL request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $request_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request and get the response
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
    exit();
}

curl_close($ch);

// Decode the JSON response into a PHP object
$data = json_decode($response);

// Check for JSON decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    echo 'Error: JSON decoding error: ' . json_last_error_msg();
    exit();
}

// Check if latitude and longitude are set in the response
if (!isset($data->results[0]->geometry->lat) || !isset($data->results[0]->geometry->lng)) {
    echo 'Error: Latitude or longitude not set in API response.';
    exit();
}

// Get the latitude and longitude from the response
$latitude = $data->results[0]->geometry->lat;
$longitude = $data->results[0]->geometry->lng;

// Use the latitude and longitude to find the corresponding Wikipedia page
$geonames_request_url = "http://api.geonames.org/findNearbyWikipediaJSON?lat=" . $latitude . "&lng=" . $longitude . "&username=matt1883";

// Set up the cURL request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $geonames_request_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request and get the response
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
    exit();
}

curl_close($ch);

// Decode the JSON response into a PHP object
$data = json_decode($response);

// Check for JSON decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    echo 'Error: JSON decoding error: ' . json_last_error_msg();
    exit();
}

// Check if Wikipedia page URL is set in the response
if (!isset($data->geonames[0]->wikipediaUrl)) {
    echo 'Error: Wikipedia page URL not set in API response.';
    exit();
}

// Get the Wikipedia page URL from the response
$wikipedia_page_url = $data->geonames[0]->wikipediaUrl;

// Return the Wikipedia page URL as a plain text response
echo $wikipedia_page_url;