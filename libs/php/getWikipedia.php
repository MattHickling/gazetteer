<?php
// Get the ISO code from the query string
$iso_code = $_GET['iso_code'];

// Get the name of the country from the ISO code using a REST API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://restcountries.com/v3/alpha/" . $iso_code);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

// Parse the JSON response to get the country name
$country_data = json_decode($response, true);
$country_name = $country_data['name']['common'];

// Encode the country name as a URL-friendly string
$encoded_country_name = urlencode($country_name);

// Construct the Wikipedia URL by searching for the country name
$wikipedia_url = "https://en.wikipedia.org/wiki/" . $encoded_country_name;

// Return the Wikipedia URL
echo $wikipedia_url;
?>
