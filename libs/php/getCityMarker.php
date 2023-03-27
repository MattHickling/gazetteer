<?php

require_once 'config.php';


$iso_code = $_POST['iso_code'];


$url = "http://api.geonames.org/searchJSON?featureClass=P&country={$iso_code}&maxRows=100&username=" . $geonames_key;


$ch = curl_init();


curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);


$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo 'Error: ' . curl_error($ch);
  exit();
}

$data = json_decode($response, true);


echo json_encode(array('geonames' => $data['geonames']));

curl_close($ch);
?>
