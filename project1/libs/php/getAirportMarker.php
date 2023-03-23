<?php

$url = 'http://api.geonames.org/searchJSON';

$username = 'matt1883';

$iso_code = $_POST['iso_code'];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'q' => 'airport',
    'country' => $iso_code,
    'username' => $username,
]));

$response = curl_exec($ch);

curl_close($ch);

$data = json_decode($response, true);

$airports = array_map(function($airport) {
    return [
        'name' => $airport['name'],
        'lat' => $airport['lat'],
        'lng' => $airport['lng'],
    ];
}, $data['geonames']);

header('Content-Type: application/json');
echo json_encode([
    'airports' => $airports,
]);
