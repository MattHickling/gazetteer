<?php

// Get the ISO code of the selected country from the POST data
$iso_code = $_POST['iso_code'];

// Make a request to the Open Weather API using cURL
$curl = curl_init();
echo $iso_code; 

$api_key = "4473ba7b37a2cbeb1a3ab44ef32eb0dd";


$url = "https://api.openweathermap.org/data/2.5/weather?q=" . $iso_code . "&appid={$api_key}&units=metric";

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_RETURNTRANSFER => 1,
  CURLOPT_URL => $url
]);

$response = curl_exec($curl);

curl_close($curl);

echo $response;

?>





