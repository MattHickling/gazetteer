<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://live-traffic-images.p.rapidapi.com/get_image?country=%3CREQUIRED%3E&key=655",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"X-RapidAPI-Host: live-traffic-images.p.rapidapi.com",
		"X-RapidAPI-Key: dfd7701634mshca63a76c29dfdafp1578d7jsn0a09a6c71063"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}