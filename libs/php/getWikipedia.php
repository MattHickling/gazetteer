<?php

$iso_code = $_GET['iso_code'];


$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://restcountries.com/v3/alpha/" . $iso_code);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);


$country_data = json_decode($response, true);
$country_name = $country_data['name']['common'];


$encoded_country_name = urlencode($country_name);

$wikipedia_url = "https://en.wikipedia.org/wiki/" . $encoded_country_name;

// Return the Wikipedia URL
echo $wikipedia_url;
?>
