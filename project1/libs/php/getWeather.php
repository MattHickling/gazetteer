<?php

$city_name = $_POST['city_name'];

$url = "http://api.openweathermap.org/data/2.5/weather?q=" . $city_name . "&appid=4473ba7b37a2cbeb1a3ab44ef32eb0dd&units=metric";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($ch);

curl_close($ch);

echo $response;

?>





