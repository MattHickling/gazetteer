<?php
// GeoNames API endpoint
$url = 'http://api.geonames.org/searchJSON';

// GeoNames API username
$username = 'matt1883';

// Get the ISO country code from the POST request
$iso_code = $_POST['iso_code'];

// Create a cURL handle
$ch = curl_init();

// Set the cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'q' => 'airport',
    'country' => $iso_code,
    'username' => $username,
]));

// Execute the cURL request and get the response
$response = curl_exec($ch);

// Close the cURL handle
curl_close($ch);

// Parse the JSON response
$data = json_decode($response, true);

// Extract the airport data from the response
$airports = array_map(function($airport) {
    return [
        'name' => $airport['name'],
        'lat' => $airport['lat'],
        'lng' => $airport['lng'],
    ];
}, $data['geonames']);

// Return the airport data as JSON
header('Content-Type: application/json');
echo json_encode([
    'airports' => $airports,
]);
