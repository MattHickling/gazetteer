<?php


$apiKey = 'aa2b92718386464a8fb461ba54715c53'; 

$latitude = $_POST['latitude']; 
$longitude = $_POST['longitude']; 

$url = "https://api.opencagedata.com/geocode/v1/json?q=" . $latitude . "+" . $longitude . "&key=" . $apiKey; 

$ch = curl_init(); curl_setopt($ch, CURLOPT_URL, $url); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
$response = curl_exec($ch); 
if (curl_error($ch)) { echo 'Error: ' . curl_error($ch); 
  
  exit(); 

} curl_close($ch); 

$data = json_decode($response, true); echo json_encode($data);



?>