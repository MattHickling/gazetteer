<?php

require_once 'config.php';

// Set the Geonames API endpoint URL
$url = 'http://api.geonames.org/countryInfoJSON';

// Set the parameters for the API request
$params = array(
    'lang' => 'en',
    'country' => $_POST['iso_code'],
    'username' => $geonames_key, // Replace with your Geonames username
);

// Initialize the cURL session
$ch = curl_init();

// Set the cURL options
curl_setopt($ch, CURLOPT_URL, $url . '?' . http_build_query($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Send the API request and get the response
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    $error_msg = curl_error($ch);
    echo json_encode(array('error' => $error_msg));
} else {
    // Parse the response JSON
    $data = json_decode($response, true);

    // Extract the country name, capital city, and population
    $name = $data['geonames'][0]['countryName'];
    $capital = $data['geonames'][0]['capital'];
    $population = $data['geonames'][0]['population'];

    // Create an array with the country information
    $country_info = array(
        'name' => $name,
        'capital' => $capital,
        'population' => $population,
    );

    // Send the country information back as JSON
    echo json_encode($country_info);
}

// Close the cURL session
curl_close($ch);
?>