<?php

$iso_code = $_POST['iso_code'];

$url = "http://api.geonames.org/searchJSON?country=" . $iso_code . "&maxRows=1&featureCode=PPLC&username=matt1883";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

$capital = $data['geonames'][0]['name'];
$population = $data['geonames'][0]['population'];

echo json_encode(array('capital' => $capital, 'population' => $population));

?>
